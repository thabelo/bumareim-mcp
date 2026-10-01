# bumareim-mcp

Connect Claude (and any other MCP client) to your [BuMaReim](https://bumareim.com) business: menu, orders, floor, guests' requests, car wash visits and the day's figures.

## 1. Get a key

In the BuMaReim dashboard go to **Settings → AI assistants** and make a key. It starts with `pbz_`. Keep it private: it opens your business.

## 2. Add it to your assistant

**Claude Desktop** — add this to `claude_desktop_config.json`, then quit and reopen Claude:

```json
{
  "mcpServers": {
    "bumareim": {
      "command": "npx",
      "args": ["-y", "bumareim-mcp"],
      "env": { "BUMAREIM_TOKEN": "pbz_..." }
    }
  }
}
```

**Claude Code**

```bash
claude mcp add bumareim --env BUMAREIM_TOKEN=pbz_... -- npx -y bumareim-mcp
```

## Options

| Setting | Meaning |
|---|---|
| `BUMAREIM_TOKEN` | Your `pbz_` key (required). |
| `--dev` | Use the BuMaReim development server instead of live. |
| `BUMAREIM_URL` | Any other MCP endpoint, overriding both. |

Removing or hiding things, passwords and access, payments and SMS stay in the dashboard: no key can do them.

Needs Node.js 18 or newer.
