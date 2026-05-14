# CLAUDE.md — `grotte-sdk`

The GROTTE Python + JavaScript SDK + CLI monorepo. Forked from
`e2b-dev/E2B` (MIT) and rebranded; published as `grotte` (npm + PyPI),
`@grotte/cli` (npm) with the `grotte` binary, and `@grotte/python-sdk`
(internal workspace name; PyPI is just `grotte`).

## Live (verified 2026-05-15 against api.grotte.parallactic.fr)

| Registry | Package | Version | Notes |
|---|---|---|---|
| npm | `grotte` (JS SDK) | **0.1.5** | `get_url(port)` helper (0.1.4) + bundler-traceable `undici` require (0.1.5) |
| npm | `@grotte/cli` | **0.1.5** | hard-deprecates the v1 `grotte template build` flow — short-circuits with a migration message + exit 2 before the broken DNS lookup against `docker.grotte.parallactic.fr` |
| PyPI | `grotte` (Python SDK, both sync + async) | **0.1.5** | `get_url(port)` helper (0.1.4); 0.1.5 is a lockstep bump with the JS SDK (no Python code change) |

### Known stale strings (next SDK release)

The JS SDK + Python SDK still emit "run `grotte template build`" inside
filesystem / sandboxApi error messages when they detect a sandbox that
needs a template rebuild. The CLI command those messages reference is
deprecated as of CLI 0.1.5 — update them to `grotte template create`
on the next SDK bump (call sites: `packages/{js-sdk,python-sdk}/**/sandbox*` and
`**/filesystem*`).

Sandbox-create lifecycle (create → run command → kill) verified clean
across all three surfaces using the team's live API key. The `base`
template is currently env `t8wm6m5fj6a7clourg73` — Ubuntu 22.04.5 with
Python 3.10.12 + Node 20.20.2 + pandas/numpy/sklearn/flask/fastapi
preinstalled (rebuilt 2026-05-10 to fix EIO rootfs corruption on the
prior env `pxqastjs4dgsw731gabm`; details in
`~/grotte/e2b-infra/iac/provider-scaleway/CLAUDE.md`).

## Daily commands

```bash
pnpm install                              # workspace install (pnpm only — npm doesn't grok workspace:)
pnpm run format && pnpm run lint && pnpm run typecheck   # before committing
pnpm run test                             # affected paths
make codegen                              # regen API client (proto/openapi)
```

Default credentials: `.env.local` at the repo root OR `~/.grotte/config.json`.

## Publishing — read this every time

**Always `pnpm publish`. Never bare `npm publish`.**

`packages/cli` depends on `grotte` (the JS SDK) via `"grotte": "^0.1.0"`.
For dev convenience we used `"grotte": "workspace:*"` briefly — pnpm
rewrites that to the real version range *at publish time*. **`npm
publish` does NOT rewrite it** — it ships the literal `workspace:*`
string, and consumers see:

```
npm error code EUNSUPPORTEDPROTOCOL
npm error Unsupported URL Type "workspace:": workspace:*
```

That bug shipped as `@grotte/cli@0.1.0` (now deprecated) and forced a
0.1.1 republish. The fix in commit `6f982b1e2` is to keep the dep as a
real version range (`^0.1.0`) so `npm publish` and `pnpm publish` both
work. If you ever revert it to `workspace:*` for dev convenience, you
**must** publish via `pnpm publish` thereafter.

### Publish flow (CLI)

```bash
# 1. Bump version (npm refuses to republish the same version)
#    Edit packages/cli/package.json "version" field.
# 2. Refresh lockfile + rebuild
pnpm install --filter '@grotte/cli...'
pnpm --filter '@grotte/cli' run build

# 3. ALWAYS dry-run + tarball-inspect first
cd packages/cli
npm pack                                              # produces grotte-cli-X.Y.Z.tgz
tar -xzOf grotte-cli-*.tgz package/package.json | grep '"grotte"'
# Must show:  "grotte": "^X.Y.Z"   (NOT  "workspace:*")

# 4. Publish (pnpm OR npm — both work because dep is versioned)
npm publish --access public
# 2FA prompt: re-run with --otp=123456 from your authenticator
```

### Publish flow (JS SDK)

```bash
# Bump packages/js-sdk/package.json "version"
pnpm --filter grotte run build
cd packages/js-sdk
npm publish --access public
```

### Publish flow (Python SDK)

```bash
cd packages/python-sdk
poetry version <new-version>      # edits pyproject.toml
poetry build                      # → dist/grotte-X.Y.Z-py3-none-any.whl
poetry publish --skip-existing    # uses configured pypi-token
```

## Versioning policy

Inherited E2B versions (cli 2.10.x, sdks 2.19.x/2.21.x) were reset to
`0.1.0` at fork — squatting upstream version space would have been bad
form. SemVer from here:

- **0.1.x** — bug fixes, no public API change
- **0.2.x** — additive API change (new methods, new flags)
- **1.0.0** — first stable release; commit to backward compat

Generate changesets via `pnpm changeset` after touching any of
`packages/{cli,js-sdk,python-sdk}` so the next bump+publish has a
ready CHANGELOG entry.

## Brand + legal

- npm + PyPI packages are **MIT** (per-package `LICENSE` files; root
  `LICENSE` is Apache-2.0 but doesn't apply to the published units).
- Each package ships `LICENSE` (original FoundryLabs copyright preserved
  + Parallactic AI © 2026 alongside) and `NOTICE` (attribution + summary
  of significant changes from upstream). Both are in the `files`
  allowlist of each `package.json` — if you remove them we ship MIT-
  non-compliant.
- Brand strings are mint `#2deba0` (GROTTE), never cyan `#00dcff` (that's
  the parallactic.fr landing site).

## CI/CD

Two paths exist:

1. **`manual_release.yml`** (Actions → "Manual Release" → Run workflow)
   — the one to use day-to-day. Pick the package (js-sdk / cli / python-sdk / all)
   and the bump (patch / minor / major); it runs the same flow you'd run by hand:
   bump version → build → tarball-inspect (rejects `workspace:*` for CLI) →
   `npm publish --provenance` or `poetry publish` → tag → commit + push.
   `dry-run: true` skips the publish and the push.

2. **`release.yml` + `publish_packages.yml`** — inherited from upstream e2b,
   requires changesets entries (`.changeset/*.md`) and a Slack webhook. Kept
   for reference; switch to it only if you adopt changesets.

`typecheck.yml` and `lint.yml` run on every PR and every push to `main`.

### Required GitHub Secrets

Set these in **Settings → Secrets and variables → Actions → New repository secret**.
As of 2026-05-12 the `parallactic-ai/grotte-sdk` repo has none configured.

| Secret | Used by | How to get it |
|---|---|---|
| `NPM_TOKEN` | manual_release | npmjs.com → Profile → Access Tokens → Generate (Automation type, scoped read+write to `grotte` and `@grotte/cli`) |
| `PYPI_TOKEN` | manual_release, publish_packages | pypi.org/manage/account/token/ → Add API token (scoped to `grotte` project) |
| `GROTTE_API_KEY` | (only if you wire live smoke tests into CI) | app.grotte.parallactic.fr → Keys tab |
| `SLACK_WEBHOOK` | release.yml failure notifications (optional) | api.slack.com/apps → Incoming Webhooks |
| `VERSION_BUMPER_APPID` + `VERSION_BUMPER_SECRET` | publish_packages.yml only (changesets path) | GitHub App with contents:write — only needed if you adopt the changesets workflow |

`manual_release.yml` only needs the first two (`NPM_TOKEN`, `PYPI_TOKEN`).

## Remotes

- `origin` → `https://github.com/parallactic-ai/grotte-sdk`
- `upstream` → `https://github.com/e2b-dev/E2B`

Pull from `upstream/main` periodically to track upstream e2b changes,
then run the rebrand script (commit `2adeaa165` is the canonical
substitute pattern) over the diff before merging.

## Pointers

- Dashboard repo (consumes the SDK): `~/grotte-dashboard` →
  `Jesiel-dev-creator/grotte-app`
- Server repo (api/orchestrator behind `api.grotte.parallactic.fr`):
  `~/grotte/e2b-infra` (rebrand on branch `rebrand/strings-pass`)

## Agent skills

### Issue tracker

Issues tracked in GitHub at `parallactic-ai/grotte-sdk` via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical label names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.
