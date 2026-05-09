<p align="center">
  <img width="100" src="https://raw.githubusercontent.com/parallactic-ai/grotte-sdk/refs/heads/main/readme-assets/logo-circle.png" alt="grotte logo">
</p>

<h4 align="center">  
  <a href="https://www.npmjs.com/package/grotte">
    <img alt="Last 1 month downloads for the JavaScript SDK" loading="lazy" width="200" height="20" decoding="async" data-nimg="1"
    style="color:transparent;width:auto;height:100%" src="https://img.shields.io/npm/dm/grotte?label=NPM%20Downloads">
  </a>
</h4>

<!---
<img width="100%" src="/readme-assets/preview.png" alt="Cover image">
--->
## What is GROTTE?
[GROTTE](https://www.grotte.parallactic.fr/) is an open-source infrastructure that allows you to run AI-generated code in secure isolated sandboxes in the cloud. To start and control sandboxes, use our [JavaScript SDK](https://www.npmjs.com/package/grotte) or [Python SDK](https://pypi.org/project/grotte).

## Run your first Sandbox

### 1. Install SDK

```bash
npm i grotte
```

### 2. Get your GROTTE API key
1. Sign up to GROTTE [here](https://grotte.parallactic.fr).
2. Get your API key [here](https://grotte.parallactic.fr/dashboard?tab=keys).
3. Set environment variable with your API key
```
GROTTE_API_KEY=grt_***
```

### 3. Start a sandbox and run commands

```ts
import Sandbox from 'grotte'

const sandbox = await Sandbox.create()
const result = await sandbox.commands.run('echo "Hello from GROTTE!"')
console.log(result.stdout) // Hello from GROTTE!
```

### 4. Code execution with Code Interpreter

If you need [`runCode()`](https://grotte.parallactic.fr/docs/code-interpreting), install the [Code Interpreter SDK](https://github.com/parallactic-ai/code-interpreter):

```bash
npm i @grotte/code-interpreter
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
