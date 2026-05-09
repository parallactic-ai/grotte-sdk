<p align="center">
  <img width="100" src="https://raw.githubusercontent.com/parallactic-ai/grotte-sdk/refs/heads/main/readme-assets/logo-circle.png" alt="grotte logo">
</p>

# GROTTE CLI

This CLI tool allows you to build manager your running GROTTE sandbox and sandbox templates. Learn more in [our documentation](https://grotte.parallactic.fr/docs).

### 1. Install the CLI

**Using Homebrew (on macOS)**

```bash
brew install grotte
```

**Using NPM**

```bash
npm install -g @grotte/cli
```

### 2. Authenticate

```bash
grotte auth login
```

> [!NOTE]
> To authenticate without the ability to open the browser, provide
> `GROTTE_ACCESS_TOKEN` as an environment variable. You can find your token
> in Account Settings under the Team selector at [grotte.parallactic.fr/dashboard](https://grotte.parallactic.fr/dashboard). Then use the CLI like this:
> `GROTTE_ACCESS_TOKEN=sk_grt_... grotte template build`.

> [!IMPORTANT]  
> Note the distinction between `GROTTE_ACCESS_TOKEN` and `GROTTE_API_KEY`.

### 3. Check out docs

Visit our [CLI documentation](https://grotte.parallactic.fr/docs) to learn more.
