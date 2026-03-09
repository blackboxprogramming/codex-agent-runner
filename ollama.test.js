/**
 * Tests for ollama.js – parseHandle()
 * Run with: node --experimental-vm-modules ollama.test.js
 * (No test framework needed – uses Node's built-in assert)
 */
import assert from 'node:assert/strict';
import { OLLAMA_HANDLES, parseHandle } from './ollama.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌  ${name}\n     ${err.message}`);
    failed++;
  }
}

// ── OLLAMA_HANDLES ────────────────────────────────────────────────────────────
test('OLLAMA_HANDLES contains ollama', () => assert.ok(OLLAMA_HANDLES.includes('ollama')));
test('OLLAMA_HANDLES contains copilot', () => assert.ok(OLLAMA_HANDLES.includes('copilot')));
test('OLLAMA_HANDLES contains lucidia', () => assert.ok(OLLAMA_HANDLES.includes('lucidia')));
test('OLLAMA_HANDLES contains blackboxprogramming', () => assert.ok(OLLAMA_HANDLES.includes('blackboxprogramming')));

// ── parseHandle – recognised handles ─────────────────────────────────────────
test('@ollama strips handle', () => {
  const r = parseHandle('@ollama tell me a joke');
  assert.equal(r.handle, 'ollama');
  assert.equal(r.prompt, 'tell me a joke');
});

test('@copilot strips handle', () => {
  const r = parseHandle('@copilot write a function');
  assert.equal(r.handle, 'copilot');
  assert.equal(r.prompt, 'write a function');
});

test('@lucidia strips handle', () => {
  const r = parseHandle('@lucidia summarise this');
  assert.equal(r.handle, 'lucidia');
  assert.equal(r.prompt, 'summarise this');
});

test('@blackboxprogramming strips handle', () => {
  const r = parseHandle('@blackboxprogramming list algorithms');
  assert.equal(r.handle, 'blackboxprogramming');
  assert.equal(r.prompt, 'list algorithms');
});

// ── Trailing dot variants (@copilot. / @blackboxprogramming.) ────────────────
test('@copilot. trailing dot is stripped', () => {
  const r = parseHandle('@copilot. hello');
  assert.equal(r.handle, 'copilot');
  assert.equal(r.prompt, 'hello');
});

test('@blackboxprogramming. trailing dot is stripped', () => {
  const r = parseHandle('@blackboxprogramming. sort this list');
  assert.equal(r.handle, 'blackboxprogramming');
  assert.equal(r.prompt, 'sort this list');
});

// ── Case-insensitive ──────────────────────────────────────────────────────────
test('@OLLAMA is case-insensitive', () => {
  const r = parseHandle('@OLLAMA hello');
  assert.equal(r.handle, 'ollama');
});

test('@Copilot is case-insensitive', () => {
  const r = parseHandle('@Copilot hello');
  assert.equal(r.handle, 'copilot');
});

// ── Unknown / no handle ───────────────────────────────────────────────────────
test('unknown handle returns null handle', () => {
  const r = parseHandle('@gpt4 hello');
  assert.equal(r.handle, null);
  assert.equal(r.prompt, '@gpt4 hello');
});

test('no handle returns null handle', () => {
  const r = parseHandle('plain message');
  assert.equal(r.handle, null);
  assert.equal(r.prompt, 'plain message');
});

test('empty string returns null handle', () => {
  const r = parseHandle('');
  assert.equal(r.handle, null);
  assert.equal(r.prompt, '');
});

test('@ollama with no prompt returns empty string', () => {
  const r = parseHandle('@ollama');
  assert.equal(r.handle, 'ollama');
  assert.equal(r.prompt, '');
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
