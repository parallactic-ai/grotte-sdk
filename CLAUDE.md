# CLAUDE.md — `grotte-sdk`

The GROTTE Python + JavaScript SDK + CLI monorepo. Forked from
`e2b-dev/E2B` (MIT) and rebranded; published as `grotte` (npm + PyPI),
`@grotte/cli` (npm) with the `grotte` binary, and `@grotte/python-sdk`
(internal workspace name; PyPI is just `grotte`).

Live: `npmjs.com/package/grotte`, `npmjs.com/package/@grotte/cli`,
`pypi.org/project/grotte` (PyPI not yet published as of 2026-05-09).

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
