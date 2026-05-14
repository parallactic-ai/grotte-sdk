# GROTTE CLI

Control your GROTTE sandboxes from the terminal.

## Install

```bash
npm install -g @grotte/cli
```

Or without installing globally:

```bash
npx @grotte/cli --help
```

## Authentication

```bash
# Via browser (recommended)
grotte auth login

# Via API key directly (non-interactive)
grotte auth login --key grt_your_key_here
```

Get your API key at [app.grotte.parallactic.fr](https://app.grotte.parallactic.fr).

## Commands

### Sandboxes

```bash
grotte sandbox list                  # list active sandboxes
grotte sandbox create [template]     # create a new sandbox
grotte sandbox connect <id>          # attach a terminal to a running sandbox
grotte sandbox exec <id> <cmd>       # run a one-off command
grotte sandbox logs <id>             # stream logs in real time
grotte sandbox metrics <id>          # show CPU/RAM/disk metrics
grotte sandbox info <id>             # show sandbox metadata
grotte sandbox pause <id>            # pause (filesystem state retained)
grotte sandbox resume <id>           # resume a paused sandbox
grotte sandbox kill <id>             # kill a sandbox immediately
```

### Snapshots

```bash
grotte snapshot create <sandbox-id>  # snapshot a sandbox to a reusable template
grotte snapshot list                 # list all snapshots
grotte snapshot list --sandbox <id>  # filter by source sandbox
```

Use a snapshot as a template:

```bash
grotte sandbox create <snapshot-id>
```

### Templates

```bash
grotte template list                 # list available environments
grotte template init                 # scaffold a new template directory
grotte template create <name>        # build a Dockerfile into a template (v2)
grotte template migrate              # migrate a v1 grotte.toml + Dockerfile to v2
```

> The legacy `grotte template build` (v1) is deprecated — it pushed to a
> Docker registry that is not provisioned on the GROTTE Scaleway
> deployment. Use `grotte template create` or build from the
> [dashboard](https://app.grotte.parallactic.fr/dashboard/templates)
> instead. See the
> [migration guide](https://grotte.parallactic.fr/docs/template/migration-v2).

### Account

```bash
grotte auth info                     # show active account
grotte auth login                    # log in via browser
grotte auth logout                   # revoke local session
```

## Quick demo

```text
$ grotte sandbox list

  ID          TEMPLATE     STATUS      DURATION
  i716tr2o    base         RUNNING     2m 14s

$ grotte sandbox logs i716tr2o
Streaming logs for i716tr2o... (Ctrl+C to stop)

stdout  Hello from GROTTE sandbox            14:23:07
```

## Configuration

The CLI stores credentials at `~/.grotte/config.json`. The API key is
also read from the `GROTTE_API_KEY` environment variable; the env var
takes precedence when both are set.

## Links

- Dashboard: [app.grotte.parallactic.fr](https://app.grotte.parallactic.fr)
- SDK:       [npmjs.com/package/grotte](https://npmjs.com/package/grotte)
- Contact:   [jesiel@parallactic.fr](mailto:jesiel@parallactic.fr)

## License

MIT · Based on [E2B CLI](https://github.com/e2b-dev/E2B) by FoundryLabs, Inc.
See `NOTICE` for full attribution and a summary of significant changes.
