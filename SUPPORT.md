# Kwork Support

## Usage and installation help

For non-sensitive defects and feature requests, open an issue at:

<https://github.com/SkillBench-AI/kwork2-plugins/issues>

Include the command that failed, its exit status, and sanitized error output,
plus:

- `claude --version`;
- the Kwork version shown by `claude plugin list --json`;
- installation scope (`user`, `project`, or `local`).

Before filing an installation issue, run:

```bash
claude plugin marketplace update skillbench
claude plugin update kwork@skillbench
```

Restart Claude Code or run `/reload-plugins` after an update.

## Privacy and data requests

Contact `privacy@skillbench.com`. If your organization provides Kwork, it
may be the data controller and may need to handle the request.

## Security reports

Follow [SECURITY.md](SECURITY.md). Never post tokens, raw transcripts, source
code, customer identifiers, or telemetry payloads in a public issue.

## Documentation

- [Claude Code plugin guide](clients/claude-code/kwork/README.md)
- [Privacy](PRIVACY.md)
- [SkillBench Privacy Policy](https://skillbench.com/privacy/)
- [SkillBench subprocessors](https://skillbench.com/subprocessors/)

## Credential store is busy

A brief `credential-store-busy` error means another Kwork process may be
writing sign-in state, or another SkillBench client that shares the device
identity in `~/.skillbench/credentials.json`. Retry after that operation
finishes. Kwork does not evict a live writer because its lock is old.

If the error persists, quit all Claude Code sessions and their background
plugin workers; an old process can retain its previous behavior after an
update. Restart and retry.

Malformed or unknown lock records, PID reuse, and repeated interrupted cleanup
can require support-assisted recovery. Preserve the credential and lock files
for local diagnosis; do not delete or edit them while any writer can run. Never
attach `credentials.json`, tokens or raw state to a public issue.
