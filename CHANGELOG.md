# grotte SDK changelog

## SDK 0.2.0 — 2026-05-16

### Changed (default-flip — backward-compatible)
- **JS SDK + Python SDK**: default API host migrated from
  `api.grotte.parallactic.fr` → `api.grotte.dev`. The orchestrator
  emits sandbox URLs as `<port>-<id>.sandbox.grotte.dev` on
  migrated clusters. **Legacy clusters still work** — point the
  SDK at one via the `GROTTE_API_URL` env var (or the `apiUrl:` /
  `api_url=` constructor option). The SDK does NOT hardcode a TLD
  anywhere in the URL-construction path; `getHost` / `get_host`
  honour the orchestrator's `CreateResponse.domain` field, so a
  0.2.0 client emitting parallactic.fr URLs against a legacy
  cluster works without code changes.
- **All packages**: dashboard / docs / homepage URL references
  migrated to `app.grotte.dev`. Legacy `app.grotte.parallactic.fr`
  continues to work; the dashboard container accepts both as custom
  domains.

### Why major
The default API host change is the only behavior shift visible to
existing users — a 0.1.x client with no env override now talks to a
different host. The new host is BC-safe with old templates and
sandboxes, but the host name is part of the SDK's effective
contract, so the bump reflects that. Override is one env var.

### Migration
| Before | After |
|---|---|
| `Sandbox.create("base")` → talks to `api.grotte.parallactic.fr` | `Sandbox.create("base")` → talks to `api.grotte.dev` |
| `sandbox.get_url(8000)` → `https://8000-<id>.sandbox.grotte.parallactic.fr` | `https://8000-<id>.sandbox.grotte.dev` (if your cluster is migrated) |

To pin to the legacy host:
```bash
export GROTTE_API_URL=https://api.grotte.parallactic.fr
```

Or in code:
```py
Sandbox.create("base", api_url="https://api.grotte.parallactic.fr")
```
```ts
await Sandbox.create("base", { apiUrl: "https://api.grotte.parallactic.fr" })
```

### Internal
- SDK URL helpers (`getHost` / `get_host`) were already TLD-agnostic —
  they take `sandboxDomain` / `sandbox_domain` from the orchestrator's
  `CreateResponse`. 0.2.0 only flips the FALLBACK default used when no
  domain is returned (which is rare in practice).
- Test assertions that hardcoded `https://api.grotte.parallactic.fr`
  as the expected default URL flipped to `https://api.grotte.dev`
  (`js-sdk/tests/connectionConfig.test.ts`,
  `python-sdk/tests/test_connection_config.py`,
  `python-sdk/tests/test_volume_connection_config.py`).

## CLI 0.1.7 — 2026-05-16

### Changed (default-flip — backward-compatible)
- **CLI**: dashboard host default migrated from
  `app.grotte.parallactic.fr` → `app.grotte.dev`. Legacy host still
  works. Override via `GROTTE_DASHBOARD_BASE` or `GROTTE_DOMAIN`.
- **CLI**: `app.grotte.parallactic.fr/dashboard?tab=*` URLs in auth
  error messages and template option help flipped to `app.grotte.dev`.

### Fixed
- **CLI**: `grotte auth login` opened
  `https://grotte.parallactic.fr/docs/api/cli` (HTTP 404) because the
  login flow built its URL from `DOCS_BASE` instead of `DASHBOARD_BASE`.
  Now builds `https://app.grotte.dev/dashboard/api/cli` (HTTP 307 →
  login). This was broken before the domain migration — fixing here
  since both touch the same code path.

## 0.1.6 — 2026-05-15

### Fixed
- **All packages**: every error-message and runtime URL referencing
  `https://grotte.parallactic.fr/*` now points at
  `https://app.grotte.parallactic.fr/*`. The apex `grotte.parallactic.fr`
  is not provisioned (NXDOMAIN) — the canonical, DNS-verified host is
  the dashboard at `app.grotte.parallactic.fr`. Affected: CLI's auth
  prompts, deprecation message (`template build`), templates option
  hints, troubleshooting links; JS SDK + Python SDK API-key /
  access-token error messages; CLI scaffolded README template; all
  three packages' `homepage` metadata.
- This unblocks the `/docs/*` deploy that landed in
  `parallactic-ai/grotte-app#26` — the docs are live at
  `app.grotte.parallactic.fr/docs/*` and now the SDK error messages
  link to a real URL instead of NXDOMAIN.

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
