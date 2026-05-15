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

Get your API key at [app.grotte.dev](https://app.grotte.dev).

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

### Lifecycle control

```python
# Extend the sandbox before it expires
sbx.set_timeout(600)        # set absolute timeout, seconds
sbx.refresh_ttl(60)         # add 60s to the current TTL

# Pause + resume (paused sandboxes keep filesystem state)
sbx.pause()
restored = Sandbox.connect(sbx.sandbox_id)

# Snapshot the running filesystem to a reusable template
snap = sbx.create_snapshot()
fresh = Sandbox.create(snap.snapshot_id)
```

Pass `lifecycle={"on_timeout": "pause", "auto_resume": True}` to
`Sandbox.create()` to make the sandbox auto-pause on timeout and
auto-resume on the next request.

### Network isolation

Cut egress at runtime — useful for executing untrusted or AI-generated
code without giving it internet access.

```python
sbx = Sandbox.create("base")
sbx.set_network(internet_access=False)
sbx.commands.run("curl --max-time 3 https://example.com")  # times out
sbx.set_network(internet_access=True)                      # restore
```

To start a sandbox with no network from creation, pass
`allow_internet_access=False` to `Sandbox.create()` (works the same
as `network={"deny_out": ["0.0.0.0/0"]}`).

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

- Dashboard: [app.grotte.dev](https://app.grotte.dev)
- API:       [api.grotte.dev](https://api.grotte.dev)
- Docs:      [parallactic.fr/docs](https://parallactic.fr/docs)
- Contact:   [jesiel@parallactic.fr](mailto:jesiel@parallactic.fr)

## License

MIT · Based on [E2B SDK](https://github.com/e2b-dev/E2B) by FoundryLabs, Inc.
See `NOTICE` for full attribution and a summary of significant changes.
