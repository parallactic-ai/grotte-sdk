<!-- <p align="center">
  <img width="100" src="/readme-assets/logo-circle.png" alt="grotte logo">
</p> -->

![GROTTE SDK Preview](/readme-assets/grotte-sdk-light.png#gh-light-mode-only)
![GROTTE SDK Preview](/readme-assets/grotte-sdk-dark.png#gh-dark-mode-only)

<h4 align="center">
  <a href="https://pypi.org/project/grotte/">
    <img alt="Last 1 month downloads for the Python SDK" loading="lazy" decoding="async" style="color:transparent;width:170px;height:18px" src="https://static.pepy.tech/personalized-badge/grotte?period=monthly&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=GREEN&left_text=PyPi%20Monthly%20Downloads">
  </a>
  <a href="https://www.npmjs.com/package/grotte">
    <img alt="Last 1 month downloads for the JavaScript SDK" loading="lazy" width="200" height="30" decoding="async" data-nimg="1"
    style="color:transparent;width:auto;height:100%" src="https://img.shields.io/npm/dm/grotte?label=NPM%20Monthly%20Downloads">
  </a>
</h4>

<!---
<img width="100%" src="/readme-assets/preview.png" alt="Cover image">
--->
## What is GROTTE?
[GROTTE](https://www.grotte.parallactic.fr/) is an open-source infrastructure that allows you to run AI-generated code in secure isolated sandboxes in the cloud. To start and control sandboxes, use our [JavaScript SDK](https://www.npmjs.com/package/grotte) or [Python SDK](https://pypi.org/project/grotte).

## Run your first Sandbox

### 1. Install SDK

JavaScript / TypeScript
```
npm i grotte
```

Python
```
pip install grotte
```

### 2. Get your GROTTE API key
1. Sign up to GROTTE [here](https://grotte.parallactic.fr).
2. Get your API key [here](https://grotte.parallactic.fr/dashboard?tab=keys).
3. Set environment variable with your API key
```
GROTTE_API_KEY=grt_***
```

### 3. Start a sandbox and run commands

JavaScript / TypeScript
```ts
import Sandbox from 'grotte'

const sandbox = await Sandbox.create()
const result = await sandbox.commands.run('echo "Hello from GROTTE!"')
console.log(result.stdout) // Hello from GROTTE!
```

Python
```py
from grotte import Sandbox

with Sandbox.create() as sandbox:
    result = sandbox.commands.run('echo "Hello from GROTTE!"')
    print(result.stdout)  # Hello from GROTTE!
```

### Lifecycle, snapshots, and network isolation

```py
sbx = Sandbox.create("base")
sbx.set_timeout(600)         # extend timeout
sbx.refresh_ttl(60)          # add 60s to current TTL
sbx.set_network(internet_access=False)  # cut egress for untrusted code
sbx.pause()                  # filesystem-preserving pause
snap = sbx.create_snapshot() # snapshot to a reusable template
```

Equivalents in the CLI:

```bash
grotte sandbox pause <id>
grotte sandbox resume <id>
grotte snapshot create <sandbox-id>
grotte snapshot list
```

### 4. Code execution with Code Interpreter

If you need to execute code with [`runCode()`](https://grotte.parallactic.fr/docs/code-interpreting)/[`run_code()`](https://grotte.parallactic.fr/docs/code-interpreting), install the [Code Interpreter SDK](https://github.com/parallactic-ai/code-interpreter):

```
npm i @grotte/code-interpreter  # JavaScript/TypeScript
pip install grotte-code-interpreter  # Python
```

```ts
import { Sandbox } from '@grotte/code-interpreter'

const sandbox = await Sandbox.create()
const execution = await sandbox.runCode('x = 1; x += 1; x')
console.log(execution.text)  // outputs 2
```

### 5. Check docs
Visit [GROTTE documentation](https://grotte.parallactic.fr/docs).

### 6. GROTTE cookbook
Visit our [Cookbook](https://github.com/parallactic-ai/grotte-sdk-cookbook/tree/main) to get inspired by examples with different LLMs and AI frameworks.

## Self-hosting

Read the [self-hosting guide](https://github.com/parallactic-ai/infra/blob/main/self-host.md) to learn how to set up the [GROTTE infrastructure](https://github.com/parallactic-ai/infra) on your own. The infrastructure is deployed using Terraform. 

Supported cloud providers:
- 🟢 AWS
- 🟢 Google Cloud (GCP)
- [ ] Azure
- [ ] General Linux machine
