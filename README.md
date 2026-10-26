# Kwork plugins

Kwork for Claude Code. The plugin lives in
[`clients/claude-code/kwork`](clients/claude-code/kwork) (see its
[README](clients/claude-code/README.md)); the marketplace at
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) points at it.

## Install

```sh
claude plugin marketplace add SkillBench-AI/kwork2-plugins
claude plugin install kwork@skillbench
```

## Documentation

- [Architectural decisions](docs/adr/README.md).
- [Releasing](RELEASING.md), [Privacy](PRIVACY.md), [Security](SECURITY.md) and
  [Support](SUPPORT.md).

## Shared code

[`shared/lib`](shared/lib) holds what leaves the machine (the sanitizer),
sign-in and license renewal, endpoint trust, the device identity and store I/O
for `~/.skillbench`, repository scope, and the status card. See
[shared/README.md](shared/README.md). Claude Code installs only the plugin
directory, so the plugin carries a generated copy at the same path in its
`scripts/lib`. Edit `shared/lib`, then run:

```sh
node scripts/sync-shared.mjs
```

CI fails when a copy differs from its source. Test corpora live in
[`shared/fixtures`](shared/fixtures).

## Branches and channels

- `next`: development; pull requests target it.
- `main`: what customers install. A release merges `next` into `main`.
- `internal`: rebuilt from each green `next` push by
  [`make-internal-channel.mjs`](.github/scripts/make-internal-channel.mjs).

Release tags are `v*`. Pushing one runs `release-claude-code.yml`, which
validates the tag against the plugin version, runs the checks and publishes the
GitHub Release.

## Development

```sh
(cd shared && node --test)
(cd clients/claude-code && node --test)
```
