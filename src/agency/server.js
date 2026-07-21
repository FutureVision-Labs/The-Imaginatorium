/**
 * HTTP API for the Cursy + Canyon Creative Agency prototype
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

loadEnvFile(path.join(__dirname, '../../.env'));

const AgencyOrchestrator = require('./AgencyOrchestrator');

const PORT = Number(process.env.AGENCY_PORT || 3847);
const AGENCY_DIR = path.join(__dirname, '../../agency');
const orchestrator = new AgencyOrchestrator();

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
  };
  return map[ext] || 'application/octet-stream';
}

function serveStatic(req, res) {
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(AGENCY_DIR, urlPath);

  if (!filePath.startsWith(AGENCY_DIR)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  res.writeHead(200, { 'Content-Type': contentType(filePath) });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  try {
    if (req.url === '/api/agency/health' && req.method === 'GET') {
      sendJson(res, 200, { ok: true, ...orchestrator.getStatus() });
      return;
    }

    if (req.url === '/api/agency/run' && req.method === 'POST') {
      const body = await readBody(req);
      const result = await orchestrator.runEngagement(body.brief || '');
      sendJson(res, 200, result);
      return;
    }

    if (req.url.startsWith('/api/')) {
      sendJson(res, 404, { error: 'Unknown API route' });
      return;
    }

    if (req.url === '/docs' || req.url === '/docs/') {
      const docsPath = path.join(__dirname, '../../website/CREATIVE_AGENCY.html');
      if (fs.existsSync(docsPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(docsPath).pipe(res);
        return;
      }
    }

    serveStatic(req, res);
  } catch (error) {
    console.error('Agency server error:', error);
    sendJson(res, 500, { error: error.message || 'Internal server error' });
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    const status = orchestrator.getStatus();
    console.log('🎨 Cursy + Canyon Creative Agency prototype');
    console.log(`   UI:    http://localhost:${PORT}`);
    console.log(`   Mode:  ${status.mode}${status.mode === 'mock' ? ' (set GEMINI_API_KEY for live Gemini agents)' : ''}`);
    console.log(`   Motto: "${status.motto}"`);
  });
}

module.exports = { server, orchestrator };
