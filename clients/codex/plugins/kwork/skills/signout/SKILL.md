---
name: signout
description: Sign Kwork out of Codex on this machine.
---

`<plugin-root>` in the commands below is this plugin's installed root: the
absolute path of the directory two levels above this `SKILL.md`. Substitute it
yourself; `$PLUGIN_ROOT` is not set in the shell that runs skill commands.

Run the sign-out script when the user wants to sign Kwork out of Codex:

```sh
node "<plugin-root>/scripts/signout.js"
```

This ends Codex's Kwork session, deletes event batches that were recorded
but not sent, and revokes the session at the sign-in service. The device
identity and consent choices remain. Other Kwork clients on the machine
stay signed in. To pause Codex uploads without signing out, use
`$kwork:telemetry disable-global`.

Report the result. Recording and uploads resume after `$kwork:signin`.
