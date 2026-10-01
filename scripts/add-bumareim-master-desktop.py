"""Adds the BuMaReim MASTER key (dev server) to Claude Desktop, using the key on the clipboard.

The key is read from the clipboard and written straight into the config; it is
never printed. The live "bumareim" entry is left exactly as it is.
"""
import json, os, re, shutil, subprocess, sys, time

CONFIG = os.path.expanduser('~/Library/Application Support/Claude/claude_desktop_config.json')
key = subprocess.run(['pbpaste'], capture_output=True, text=True).stdout.strip()
key = re.sub(r'^(Authorization:\s*)?(Bearer\s+)?', '', key)
if not re.fullmatch(r'pbz_[A-Za-z0-9_\-]{20,}', key):
    sys.exit('The clipboard does not hold a BuMaReim key (it should start with pbz_). Copy the master key from dashboard-dev (Settings, AI master key) and run this again.')

backup = f"{CONFIG}.backup-{time.strftime('%Y%m%d%H%M%S')}"
shutil.copy2(CONFIG, backup)
with open(CONFIG) as f:
    config = json.load(f)

config.setdefault('mcpServers', {})['bumareim-master'] = {
    'command': 'npx',
    'args': ['-y', 'bumareim-mcp', '--dev'],
    'env': {'BUMAREIM_TOKEN': key},
}
tmp = CONFIG + '.tmp'
with open(tmp, 'w') as f:
    json.dump(config, f, indent=2)
    f.write('\n')
os.replace(tmp, CONFIG)
subprocess.run(['pbcopy'], input='', text=True)  # clear the key off the clipboard
print('Added "bumareim-master" to Claude Desktop ("bumareim" and "bumareim-dev" untouched).')
print('Backup:', backup)
print('Now quit Claude Desktop completely (Cmd+Q) and open it again.')
