const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000
const OLLAMA_NODES = [
  { name: 'lucidia', url: 'http://192.168.4.38:11434' },
  { name: 'cecilia', url: 'http://192.168.4.96:11434' },
  { name: 'octavia', url: 'http://192.168.4.100:11434' },
  { name: 'alice', url: 'http://192.168.4.49:11434' },
]

async function probeNode(node) {
  try {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 3000)
    const res = await fetch(`${node.url}/api/tags`, { signal: ctrl.signal })
    clearTimeout(timeout)
    const data = await res.json()
    return { ...node, online: true, models: data.models?.map(m => m.name) || [] }
  } catch {
    return { ...node, online: false, models: [] }
  }
}

async function findAliveNode() {
  const results = await Promise.all(OLLAMA_NODES.map(probeNode))
  return results.find(n => n.online)
}

const server = http.createServer(async (req, res) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); res.end(); return }

  if (req.url === '/api/health') {
    const nodes = await Promise.all(OLLAMA_NODES.map(probeNode))
    res.writeHead(200, { 'Content-Type': 'application/json', ...cors })
    res.end(JSON.stringify({ status: 'ok', nodes, online: nodes.filter(n => n.online).length }))
    return
  }

  if (req.url === '/api/models') {
    const nodes = await Promise.all(OLLAMA_NODES.map(probeNode))
    const models = [...new Set(nodes.flatMap(n => n.models))]
    res.writeHead(200, { 'Content-Type': 'application/json', ...cors })
    res.end(JSON.stringify({ models, nodes: nodes.filter(n => n.online).map(n => n.name) }))
    return
  }

  if (req.url === '/api/generate' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body)
        const node = await findAliveNode()
        if (!node) { res.writeHead(503, { 'Content-Type': 'application/json', ...cors }); res.end(JSON.stringify({ error: 'All nodes offline' })); return }
        const result = await fetch(`${node.url}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...parsed, stream: false }) })
        const data = await result.json()
        res.writeHead(200, { 'Content-Type': 'application/json', ...cors })
        res.end(JSON.stringify({ ...data, node: node.name }))
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json', ...cors })
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url
  filePath = path.join(__dirname, filePath)
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' }
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'text/plain', ...cors })
    res.end(content)
  } catch {
    res.writeHead(404, cors); res.end('Not found')
  }
})

server.listen(PORT, () => console.log(`Codex Agent Runner on :${PORT}`))
