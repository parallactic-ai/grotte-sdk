<p align="center">
  <img width="100" src="https://raw.githubusercontent.com/parallactic-ai/grotte-sdk/refs/heads/main/readme-assets/logo-circle.png" alt="grotte logo">
</p>

<h4 align="center">
  <a href="https://pypi.org/project/grotte/">
    <img alt="Last 1 month downloads for the Python SDK" loading="lazy" decoding="async" style="color:transparent;width:170px;height:18px" src="https://static.pepy.tech/personalized-badge/grotte?period=monthly&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=GREEN&left_text=PyPi%20Monthly%20Downloads">
  </a>  
</h4>


## What is GROTTE?
[GROTTE](https://www.grotte.parallactic.fr/) is an open-source infrastructure that allows you to run AI-generated code in secure isolated sandboxes in the cloud. To start and control sandboxes, use our [JavaScript SDK](https://www.npmjs.com/package/grotte) or [Python SDK](https://pypi.org/project/grotte).

## Run your first Sandbox

### 1. Install SDK

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

```py
from grotte import Sandbox

with Sandbox.create() as sandbox:
    result = sandbox.commands.run('echo "Hello from GROTTE!"')
    print(result.stdout)  # Hello from GROTTE!
```

### 4. Code execution with Code Interpreter

If you need [`run_code()`](https://grotte.parallactic.fr/docs/code-interpreting), install the [Code Interpreter SDK](https://github.com/parallactic-ai/code-interpreter):

```
pip install grotte-code-interpreter
```

```py
from grt_code_interpreter import Sandbox

with Sandbox.create() as sandbox:
    execution = sandbox.run_code("x = 1; x += 1; x")
    print(execution.text)  # outputs 2
```

### 5. Check docs
Visit [GROTTE documentation](https://grotte.parallactic.fr/docs).

### 6. GROTTE cookbook
Visit our [Cookbook](https://github.com/parallactic-ai/grotte-sdk-cookbook/tree/main) to get inspired by examples with different LLMs and AI frameworks.
