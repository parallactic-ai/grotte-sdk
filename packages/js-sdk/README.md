# GROTTE JavaScript SDK

EU-sovereign code execution sandboxes for AI agents and developer
workflows. Built by Parallactic AI SAS.

## Install

```bash
npm install grotte
```

## Quick start

```typescript
import { Sandbox } from 'grotte'

const sbx = await Sandbox.create('base')
const result = await sbx.commands.run('echo Hello GROTTE')
console.log(result.stdout) // Hello GROTTE
await sbx.kill()
```

## Authentication

Set your API key as an environment variable:

```bash
export GROTTE_API_KEY=grt_your_key_here
```

Get your API key at [app.grotte.parallactic.fr](https://app.grotte.parallactic.fr).

## API

### Sandbox

```typescript
// Create a sandbox
const sbx = await Sandbox.create(template?: string, opts?: SandboxOpts)

// Run a command
const result = await sbx.commands.run(cmd: string)
// → result.stdout, result.stderr, result.exitCode

// File operations
await sbx.files.write(path: string, content: string)
const content = await sbx.files.read(path: string)
const files = await sbx.files.list(path: string)

// Kill the sandbox
await sbx.kill()
```

### Lifecycle control

```typescript
// Extend the sandbox before it expires
await sbx.setTimeout(600_000)      // absolute timeout, ms
await sbx.updateTimeout(600_000)   // alias of setTimeout
await sbx.refreshTtl(60)           // add 60s to the current TTL

// Pause + resume (paused sandboxes keep filesystem state)
await sbx.pause()
const restored = await Sandbox.connect(sbx.sandboxId)

// Snapshot the running filesystem to a reusable template
const snap = await sbx.createSnapshot()
const fresh = await Sandbox.create(snap.snapshotId)
```

Pass `lifecycle: { onTimeout: 'pause', autoResume: true }` to
`Sandbox.create()` to auto-pause on timeout and auto-resume on the
next request.

### Network isolation

Cut egress at runtime — useful for executing untrusted or AI-generated
code without giving it internet access.

```typescript
const sbx = await Sandbox.create('base')
await sbx.setNetwork(false)
await sbx.commands.run('curl --max-time 3 https://example.com')  // fails
await sbx.setNetwork(true)                                       // restore
```

To start a sandbox with no network from creation, pass
`allowInternetAccess: false` to `Sandbox.create()`.

### Templates

Available sandbox environments:

| Template     | Description                |
| ------------ | -------------------------- |
| `base`       | Ubuntu 22.04 + bash        |
| `python-3.12`| Python 3.12 environment    |
| `node-22`    | Node.js 22 environment     |

## Configuration

```typescript
const sbx = await Sandbox.create('base', {
  timeoutMs: 60_000,    // max sandbox lifetime
  apiKey: 'grt_...',    // override env var
})
```

## Links

- Dashboard: [app.grotte.parallactic.fr](https://app.grotte.parallactic.fr)
- API:       [api.grotte.parallactic.fr](https://api.grotte.parallactic.fr)
- Docs:      [parallactic.fr/docs](https://parallactic.fr/docs)
- Contact:   [jesiel@parallactic.fr](mailto:jesiel@parallactic.fr)

## License

MIT · Based on [E2B SDK](https://github.com/e2b-dev/E2B) by FoundryLabs, Inc.
See `NOTICE` for full attribution and a summary of significant changes.
