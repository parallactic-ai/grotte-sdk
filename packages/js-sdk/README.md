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
