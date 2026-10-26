# Repository conventions

This repository holds Kwork for Claude Code. Follow the conventions in
[clients/claude-code/AGENTS.md](clients/claude-code/AGENTS.md).

- Run client commands from `clients/claude-code`. Tests of `shared/lib` live in
  `shared/test` (`cd shared && node --test`); the client's tests cover only its
  own code and wiring.
- Never edit a file that starts with `// GENERATED from shared/lib/`, or any
  `scripts/lib` file that also exists in `shared/lib`. Edit `shared/lib` and
  run `node scripts/sync-shared.mjs`.
