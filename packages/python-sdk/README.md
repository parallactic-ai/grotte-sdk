# GROTTE Python SDK

EU-sovereign code execution sandboxes for AI agents and developer
workflows. Built by Parallactic AI SAS.

## Install

```bash
pip install grotte
```

## Quick start

```python
from grotte import Sandbox

sbx = Sandbox.create("base")
result = sbx.commands.run("echo Hello GROTTE")
print(result.stdout)        # Hello GROTTE
sbx.kill()
```

Async variant:

```python
from grotte import AsyncSandbox

sbx = await AsyncSandbox.create("base")
result = await sbx.commands.run("echo Hello GROTTE")
print(result.stdout)
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

```python
sbx = Sandbox.create(template="base", timeout=60)

# Run a command
result = sbx.commands.run("ls -la")
result.stdout    # str
result.stderr    # str
result.exit_code # int

# File operations
sbx.files.write("/tmp/hello.txt", "hi")
content = sbx.files.read("/tmp/hello.txt")
files = sbx.files.list("/tmp")

sbx.kill()
```

### Templates

Available sandbox environments:

| Template     | Description                |
| ------------ | -------------------------- |
| `base`       | Ubuntu 22.04 + bash        |
| `python-3.12`| Python 3.12 environment    |
| `node-22`    | Node.js 22 environment     |

## Configuration

```python
sbx = Sandbox.create(
    template="base",
    timeout=60,                # max sandbox lifetime, seconds
    api_key="grt_…",           # override env var
)
```

## Links

- Dashboard: [app.grotte.parallactic.fr](https://app.grotte.parallactic.fr)
- API:       [api.grotte.parallactic.fr](https://api.grotte.parallactic.fr)
- Docs:      [parallactic.fr/docs](https://parallactic.fr/docs)
- Contact:   [jesiel@parallactic.fr](mailto:jesiel@parallactic.fr)

## License

MIT · Based on [E2B SDK](https://github.com/e2b-dev/E2B) by FoundryLabs, Inc.
See `NOTICE` for full attribution and a summary of significant changes.
