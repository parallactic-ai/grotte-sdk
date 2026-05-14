# grotte SDK changelog

## CLI 0.1.5 — 2026-05-15

### Changed
- **CLI**: `grotte template build` (v1) is now a hard-deprecated
  short-circuit. The v1 flow pushed Docker images to
  `docker.${connectionConfig.domain}`, which is not provisioned on the
  GROTTE Scaleway deployment — invocations previously died with an
  unhelpful `dial tcp: lookup docker.grotte.parallactic.fr: no such
  host` DNS error after running through docker login + build. The CLI
  now emits a boxed migration message pointing at
  `grotte template create`, `grotte template migrate`, and the
  dashboard, then exits with code 2 (usage error, distinct from build
  failure) before any DNS lookup. `GROTTE_IMAGE_URI_MASK` remains the
  escape hatch for self-hosted GROTTE deployments that wire up their
  own Docker registry.
- **CLI**: top-level `--help` description and README now point users at
  `grotte template create` for the supported v2 flow.

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
