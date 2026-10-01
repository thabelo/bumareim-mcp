#!/usr/bin/env node
/**
 * A stdio bridge to the BuMaReim MCP endpoint. Every message from the
 * assistant goes up to the API unchanged and every reply comes back the same
 * way, so the tools are whatever the token's business has switched on.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ENDPOINTS = {
  live: 'https://api.bumareim.com/mcp',
  dev: 'https://api-dev.bumareim.com/mcp',
};

const args = process.argv.slice(2);
const token = (process.env.BUMAREIM_TOKEN ?? '')
  .trim()
  .replace(/^(Authorization:\s*)?(Bearer\s+)?/i, '');
const url =
  process.env.BUMAREIM_URL ??
  (args.includes('--dev') ? ENDPOINTS.dev : ENDPOINTS.live);

// stdout carries the protocol, so everything said to a person goes to stderr.
const say = (message) => process.stderr.write(`bumareim-mcp: ${message}\n`);

if (!token.startsWith('pbz_')) {
  say(
    'set BUMAREIM_TOKEN to a BuMaReim key (it starts with pbz_). ' +
      'Make one in the dashboard under Settings, AI assistants.',
  );
  process.exit(1);
}

const remote = new StreamableHTTPClientTransport(new URL(url), {
  requestInit: { headers: { Authorization: `Bearer ${token}` } },
});
const local = new StdioServerTransport();

local.onmessage = (message) =>
  remote.send(message).catch((error) => {
    say(`could not reach ${url}: ${error.message}`);
    if ('id' in message && message.id !== undefined) {
      local.send({
        jsonrpc: '2.0',
        id: message.id,
        error: { code: -32000, message: `BuMaReim refused the call or could not be reached: ${error.message}` },
      });
    }
  });
remote.onmessage = (message) => local.send(message);
remote.onerror = (error) => say(error.message);

const close = () => Promise.allSettled([remote.close(), local.close()]).then(() => process.exit(0));
local.onclose = close;
process.on('SIGINT', close);
process.on('SIGTERM', close);

await remote.start();
await local.start();
