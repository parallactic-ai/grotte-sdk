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
[GROTTE](https://parallactic.fr/) is EU-sovereign infrastructure for running AI-generated code in secure isolated sandboxes in the cloud. To start and control sandboxes, use our [JavaScript SDK](https://www.npmjs.com/package/grotte) or [Python SDK](https://pypi.org/project/grotte).

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
1. Sign up to GROTTE [here](https://app.grotte.dev/).
2. Get your API key [here](https://app.grotte.dev/?tab=keys).
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

_Coming soon._ A dedicated `@grotte/code-interpreter` / `grotte-code-interpreter` package with a `runCode()` / `run_code()` helper for stateful Python + JS execution. In the meantime, run code from the regular SDK with `sandbox.commands.run("python -c '…'")`.

### 5. Check docs
Visit [GROTTE documentation](https://parallactic.fr/docs).

### 6. GROTTE cookbook
_Coming soon._ A cookbook of end-to-end examples across LLMs and AI agent frameworks (LangChain, LangGraph, OpenAI Agents SDK, CrewAI, etc.) will live at `parallactic-ai/grotte-sdk-cookbook`. Until then, the [docs](https://parallactic.fr/docs) cover the SDK and CLI surface area.

## Self-hosting

_Coming soon._ A self-hostable infrastructure stack (Terraform-deployed across AWS / GCP / SCW) is on the roadmap at `parallactic-ai/infra`. Until then, GROTTE is available as a managed service on `api.grotte.dev` — see step 2 above to get an API key.
