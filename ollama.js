/**
 * Ollama Client — all agent handles route here.
 *
 * Supported handles (case-insensitive):
 *   @ollama, @copilot, @lucidia, @blackboxprogramming
 *
 * No external AI provider is used. Every request goes directly to the
 * local Ollama HTTP API (default: http://localhost:11434).
 */

const OLLAMA_HANDLES = ['ollama', 'copilot', 'lucidia', 'blackboxprogramming'];

/**
 * Strip leading @handle from the user message and return the clean prompt.
 * If no recognised handle is found the original text is returned unchanged.
 *
 * @param {string} text
 * @returns {{ handle: string|null, prompt: string }}
 */
function parseHandle(text) {
  const trimmed = text.trim();
  const match = trimmed.match(/^@([\w.]+)\s*/i);
  if (match) {
    const handle = match[1].replace(/\.$/, '').toLowerCase();
    if (OLLAMA_HANDLES.includes(handle)) {
      return { handle, prompt: trimmed.slice(match[0].length) };
    }
  }
  return { handle: null, prompt: trimmed };
}

/**
 * Send a chat message to the local Ollama instance and stream the response.
 *
 * @param {object}   options
 * @param {string}   options.baseUrl   - Ollama base URL (default: http://localhost:11434)
 * @param {string}   options.model     - Model name (default: "llama3")
 * @param {Array}    options.messages  - OpenAI-style message array
 * @param {Function} options.onChunk   - Called with each streamed text chunk
 * @param {Function} options.onDone    - Called when the stream is complete
 * @param {Function} options.onError   - Called with Error on failure
 * @returns {Promise<void>}
 */
async function ollamaChat({ baseUrl = 'http://localhost:11434', model = 'llama3', messages, onChunk, onDone, onError }) {
  const url = `${baseUrl}/api/chat`;
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true }),
    });
  } catch (err) {
    onError(new Error(`Cannot reach Ollama at ${baseUrl}. Is it running? (${err.message})`));
    return;
  }

  if (!response.ok) {
    onError(new Error(`Ollama returned HTTP ${response.status}: ${await response.text()}`));
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line
      for (const line of lines) {
        if (!line.trim()) continue;
        let parsed;
        try { parsed = JSON.parse(line); } catch (parseErr) {
          console.debug('ollama: skipping non-JSON line:', parseErr.message, line);
          continue;
        }
        if (parsed.message?.content) onChunk(parsed.message.content);
        if (parsed.done) { onDone(); return; }
      }
    }
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer);
        if (parsed.message?.content) onChunk(parsed.message.content);
      } catch { /* ignore */ }
    }
    onDone();
  } catch (err) {
    onError(new Error(`Stream error: ${err.message}`));
  }
}

export { OLLAMA_HANDLES, parseHandle, ollamaChat };
