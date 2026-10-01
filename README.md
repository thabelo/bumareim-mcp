# bumareim-mcp

Connect Claude (and any other MCP client) to your [BuMaReim](https://bumareim.com) business: menu, orders, floor, guests' requests, car wash visits and the day's figures.

## Set up from the dashboard (easiest)

The dashboard writes the setup for you, with your key already in it.

1. Sign in at [bumareim.com](https://bumareim.com) as the business owner and open **Settings → AI assistants**.
2. Click **Create token**, give it a name you will recognise later (for example "Claude on Thabo's laptop"), and click **Create**. You will be asked for your password.
3. The next screen shows your token **once only**, with two ready-made setups beside it. Copy the one for your assistant:
   - **Claude Desktop**: open Claude Desktop, go to **Settings → Developer → Edit Config**, paste it into `claude_desktop_config.json` (inside `mcpServers` if the file already has other servers), save, then quit Claude completely (Cmd+Q on a Mac) and open it again.
   - **Claude Code**: run the command in a terminal once.
4. Click **Done**. Ask Claude something like "what is on the floor right now?" to check it works.

Make one token for each computer Claude runs on. The list under **AI assistants** shows when each was last used; click **Revoke** on any you no longer need, and it stops working at once.

Each token opens one business. If you run more than one, make a token in each business's settings.

## Set up by hand

If you already have a `pbz_` key:

**Claude Desktop**: add this to `claude_desktop_config.json`, then quit and reopen Claude:

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

Keep the key private: anyone holding it can work on your business.

## Options

| Setting | Meaning |
|---|---|
| `BUMAREIM_TOKEN` | Your `pbz_` key (required). |
| `--dev` | Use the BuMaReim development server instead of live. |
| `BUMAREIM_URL` | Any other MCP endpoint, overriding both. |

Removing or hiding things, passwords and access, payments and SMS stay in the dashboard: no key can do them.

Needs Node.js 18 or newer.
