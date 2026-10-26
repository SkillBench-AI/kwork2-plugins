---
description: Sign this plugin out of Kwork and stop its telemetry; other Kwork clients stay signed in
disable-model-invocation: true
allowed-tools: Bash(node *)
---

Run the Kwork sign-out script:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/signout.js"
```

Report the result to the user.
