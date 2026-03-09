# Codex Agent Runner

Ollama chat client with handle-based routing. Routes `@ollama`, `@copilot`, `@lucidia`, and `@blackboxprogramming` mentions to a local Ollama instance with streaming responses.

## Usage

```js
import { ollamaChat, parseHandle } from './ollama.js';

// Parse @handle from user input
const { handle, prompt } = parseHandle('@lucidia explain quantum entanglement');

// Stream response from local Ollama
await ollamaChat({
  model: 'llama3',
  messages: [{ role: 'user', content: prompt }],
  onChunk: (text) => process.stdout.write(text),
  onDone: () => console.log('\n'),
  onError: (err) => console.error(err.message),
});
```

## API

### `parseHandle(text)`

Strips a recognized `@handle` prefix and returns `{ handle, prompt }`.

### `ollamaChat(options)`

Streams a chat completion from the local Ollama API.

| Option | Default | Description |
|--------|---------|-------------|
| `baseUrl` | `http://localhost:11434` | Ollama server URL |
| `model` | `llama3` | Model name |
| `messages` | — | OpenAI-style message array |
| `onChunk` | — | Called with each text chunk |
| `onDone` | — | Called when stream completes |
| `onError` | — | Called on failure |

## Requirements

- [Ollama](https://ollama.ai) running locally

## Project Structure

```
ollama.js       # Chat client with handle parsing and streaming
ollama.test.js  # Tests
index.html      # Web interface
```

## License

Copyright 2026 BlackRoad OS, Inc. All rights reserved.
