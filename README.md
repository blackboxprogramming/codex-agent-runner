# ⚡ Codex Agent Runner

[![CI](https://github.com/blackboxprogramming/codex-agent-runner/actions/workflows/ci.yml/badge.svg)](https://github.com/blackboxprogramming/codex-agent-runner/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-20%2B-339933.svg)](https://nodejs.org)
[![Ollama](https://img.shields.io/badge/Ollama-fleet_proxy-FF6B2B.svg)](https://ollama.ai)
[![Edge AI](https://img.shields.io/badge/edge-4_nodes-00D4FF.svg)](https://blackroad.io)



> **Chat with AI. No accounts. No cloud. Your data stays on your device.**

<div align="center">

### 🚀 [Try It Now — Open the Chat →](https://codex-agent-runner.pages.dev)

*Works in your browser. One click. That's it.*

</div>

---

## ✨ What is this?

**Codex Agent Runner** is a beautiful chat interface that lets you talk to AI — completely privately, right on your own computer. No API keys, no subscriptions, no data sent to the cloud.

Just you and your AI, having a conversation.

---

## 🎯 Get Started in 3 Steps

### Step 1 — Install Ollama (free, takes 1 minute)

👉 **[Download Ollama at ollama.ai](https://ollama.ai)**

Ollama is a free tool that runs AI models on your computer. It works on Mac, Windows, and Linux.

### Step 2 — Pull a model

After installing Ollama, open your Terminal (Mac/Linux) or Command Prompt (Windows) and run:

```
ollama pull llama3
```

That's the only command you'll ever need.

### Step 3 — Open the chat

👉 **[Open Codex Agent Runner](https://codex-agent-runner.pages.dev)**

The page will automatically detect your local Ollama and you're ready to chat!

---

## 💬 How to Chat

Just type naturally! You can also address specific AI personas:

| Type this… | What happens |
|---|---|
| `Hello, how are you?` | Chat directly with the AI |
| `@ollama explain black holes` | Talk to Ollama |
| `@copilot write me a Python function` | Talk to Copilot persona |
| `@lucidia tell me a story` | Talk to Lucidia persona |
| `@blackboxprogramming` | Talk to the BlackRoad AI |

All of these talk to your **local** Ollama — nothing is sent to any external server.

---

## 🔒 Your Privacy, Guaranteed

- ✅ **Fully offline** — your conversations never leave your machine
- ✅ **No account needed** — zero sign-up, zero tracking
- ✅ **Free forever** — no subscriptions or API costs
- ✅ **Open source** — see exactly what runs on your machine

---

## 🛠 For Developers

Want to use the API in your own project?

```js
import { ollamaChat, parseHandle } from './ollama.js';

const { handle, prompt } = parseHandle('@lucidia explain quantum entanglement');

await ollamaChat({
  model: 'llama3',
  messages: [{ role: 'user', content: prompt }],
  onChunk: (text) => process.stdout.write(text),
  onDone: () => console.log('\n'),
  onError: (err) => console.error(err.message),
});
```

See [ollama.js](./ollama.js) for the full API.

---

## 🆘 Need Help?

- **Ollama shows "offline"?** Make sure Ollama is running — open the Ollama app or run `ollama serve` in your terminal
- **No models available?** Run `ollama pull llama3` in your terminal
- **Still stuck?** [Open an issue](https://github.com/blackboxprogramming/codex-agent-runner/issues) and we'll help!

---

<div align="center">
Made with ❤️ by <a href="https://github.com/blackboxprogramming">BlackRoad OS</a>
</div>
