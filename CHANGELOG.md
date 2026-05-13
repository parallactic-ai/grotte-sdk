# grotte SDK changelog

## 0.1.5 — 2026-05-13

### Fixed
- **JS SDK**: `Cannot find module 'undici'` at runtime in Next.js
  standalone builds (Docker / serverless). The previous `dynamicRequire`
  wrapper took the module name as a parameter, which hid the
  `'undici'` literal from bundler tracers — they couldn't see what to
  copy into the standalone bundle and silently omitted the dep. The
  envd HTTP/2 path now uses a literal `require('undici')` inside a
  Node-runtime-gated function, so static tracers walk it correctly
  while edge runtimes still bypass the require. Same treatment for
  `require('node:url')` in `template/utils.ts`.

### Internal
- Python SDK bumped in lockstep — no Python-side code change in 0.1.5.

## 0.1.4 — 2026-05-13

### Added
- `sandbox.getUrl(port)` (JS) / `sandbox.get_url(port)` (Python sync +
  async): returns a *full* `https://…` URL for a sandbox port. Wraps
  the existing `getHost`/`get_host`, which return host-only strings.
  Browsers and HTTP clients treat host-only output as relative paths,
  so this helper avoids the most common preview-link footgun (404 on
  `Open external`, blank iframes, "fetch failed"). `getHost`/`get_host`
  keep their existing host-only return value — `get_url` is purely
  additive.

### Internal
- Dashboard playground (`grotte-dashboard`) consumes `get_url` via a
  server-side `withScheme()` helper + readiness probe so long-running
  templates (Gradio 7860, FastAPI 8000, Express 3000, …) only surface
  their preview URL once the upstream port stops returning 502.

## 0.1.3 — 2026-05-12
See git history.
