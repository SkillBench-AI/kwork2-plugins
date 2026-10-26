# Shared code

`lib/` holds modules whose contract reaches beyond the plugin: what leaves the
machine (the sanitizer) and how `~/.skillbench` is shared with other SkillBench
clients (`credential-lock.js`). `fixtures/` holds test corpora.

A plugin cannot load files outside its own directory once installed, so
`node scripts/sync-shared.mjs` copies each `lib/` file to the same name in
`clients/claude-code/kwork/scripts/lib`. JavaScript copies start with a
`// GENERATED` line. CI runs the script with `--check` and fails on any
difference, missing copy, or copy whose source was removed.

A module belongs here when it implements a contract shared with other
SkillBench surfaces: a file shared on disk, a server API, or a policy. Code
that follows Claude Code's contract stays in the client: hooks, the consent
store (ADR 006), backfill, and `plugin-data-root.js`. `card.js` draws the
status card; the client's `banner.js` decides what the card says.

## Tests

`test/` tests `lib/` against the source the plugin copies:
`(cd shared && node --test)`; CI runs it as "Shared tests". The client's own
tests cover only its code and how it wires the shared modules in (its config,
its adapters, its hooks), never a shared module's behaviour again.
`test/shared-identity.test.mjs` runs the client against a state directory.
