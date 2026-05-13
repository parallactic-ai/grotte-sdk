import { runtime } from '../utils'

type Undici = typeof import('undici')
type UndiciDispatcher = InstanceType<Undici['Agent']>
type UndiciRequestInit = RequestInit & {
  dispatcher: UndiciDispatcher
  duplex?: 'half'
}

/**
 * Load `undici` from the host's node_modules at runtime.
 *
 * Why this is a top-level helper with a *literal* `require('undici')`
 * rather than the older `dynamicRequire('undici')`:
 *
 * The previous wrapper took the module name as a parameter
 * (`require(module)`), which made the `'undici'` string invisible to
 * static bundler tracers (Next.js webpack, Vercel ncc, esbuild's
 * metafile, etc.). Those tracers walk literal `require('…')` /
 * `import '…'` strings to decide what to copy into the output, so the
 * parameter form caused `undici` to be silently dropped from
 * `.next/standalone/node_modules` and crash at runtime with
 * `Cannot find module 'undici'`. Embedding the literal at the call
 * site fixes the trace, while keeping the call *inside* a function
 * preserves edge-runtime compatibility (the function only fires when
 * `runtime === 'node'`).
 */
function loadUndici(): Undici {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('undici') as Undici
}
type EnvdFetchOptions = {
  connectionLimit?: number
}

let envdFetch: typeof fetch | undefined
let envdRpcFetch: typeof fetch | undefined

export function createEnvdFetchForRuntime(
  currentRuntime = runtime,
  options: EnvdFetchOptions = { connectionLimit: 1 }
): typeof fetch {
  if (currentRuntime !== 'node') {
    return fetch
  }

  const { Agent, fetch: undiciFetch } = loadUndici()
  const dispatcherOptions: { allowH2: true; connections?: number } = {
    allowH2: true,
  }
  if (options.connectionLimit !== undefined) {
    dispatcherOptions.connections = options.connectionLimit
  }
  const dispatcher = new Agent(dispatcherOptions)
  const fetchWithDispatcher = undiciFetch as unknown as (
    input: RequestInfo | URL,
    init?: UndiciRequestInit
  ) => Promise<Response>

  return ((input, init) => {
    const request = toRequestInput(input, init)

    return fetchWithDispatcher(request.input, {
      ...request.init,
      dispatcher,
    })
  }) as typeof fetch
}

export function createEnvdFetch(): typeof fetch {
  if (envdFetch) {
    return envdFetch
  }

  // Keep one origin connection for short envd REST calls. If ALPN falls back
  // to h1, this favors connection pressure over per-sandbox throughput.
  envdFetch = createEnvdFetchForRuntime(runtime)

  return envdFetch
}

export function createEnvdRpcFetch(): typeof fetch {
  if (envdRpcFetch) {
    return envdRpcFetch
  }

  // RPC streams can stay open while follow-up RPCs run against the same
  // sandbox, so they cannot share the REST client's single-connection cap.
  envdRpcFetch = createEnvdFetchForRuntime(runtime, {})

  return envdRpcFetch
}

function toRequestInput(
  input: RequestInfo | URL,
  init?: RequestInit
): { input: RequestInfo | URL; init?: RequestInit & { duplex?: 'half' } } {
  if (!(input instanceof Request)) {
    return { input, init }
  }

  const requestInit: RequestInit & { duplex?: 'half' } = {
    body: input.body,
    cache: input.cache,
    credentials: input.credentials,
    headers: input.headers,
    integrity: input.integrity,
    keepalive: input.keepalive,
    method: input.method,
    mode: input.mode,
    redirect: input.redirect,
    referrer: input.referrer,
    referrerPolicy: input.referrerPolicy,
    signal: input.signal,
    ...init,
  }

  if (requestInit.body) {
    requestInit.duplex = 'half'
  }

  return {
    input: input.url,
    init: requestInit,
  }
}
