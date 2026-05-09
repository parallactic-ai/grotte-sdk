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
grotte sandbox logs <id>             # stream logs in real time
grotte sandbox kill <id>             # kill a sandbox immediately
```

### Templates

```bash
grotte templates list                # list available environments
```

### Keys

```bash
grotte keys list                     # list your API keys
grotte keys rotate                   # rotate your active key
```

### Account

```bash
grotte whoami                        # show active account
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
