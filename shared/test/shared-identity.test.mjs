import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

// The device identity in ~/.skillbench/credentials.json
// (shared/lib/device-identity.js), run in child processes so the client
// resolves its own configuration from a clean environment.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const scripts = join(repoRoot, "clients/claude-code/kwork/scripts");

function run(stateDir, script) {
  const home = mkdtempSync(join(tmpdir(), "identity-home-"));
  try {
    return execFileSync(process.execPath, ["-e", script], {
      cwd: scripts,
      encoding: "utf8",
      env: { PATH: process.env.PATH, HOME: home, SKILLMETER_STATE_DIR: stateDir, CLAUDE_PLUGIN_DATA: join(home, "data"), PLUGIN_DATA: join(home, "data") },
    }).trim();
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
}
const deviceId = (stateDir) => run(stateDir, "process.stdout.write(require('./credstore').getDeviceId())");

function stateDir(t) {
  const dir = mkdtempSync(join(tmpdir(), "identity-state-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test("the device identity is written once and read back", (t) => {
  const dir = stateDir(t);
  const id = deviceId(dir);
  assert.match(id, /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/);
  assert.equal(deviceId(dir), id);
  assert.equal(JSON.parse(readFileSync(join(dir, "credentials.json"), "utf8")).device_id, id);
});

test("a corrupt credentials.json is kept aside before it is reset", (t) => {
  const dir = stateDir(t);
  writeFileSync(join(dir, "credentials.json"), "{ not json");
  const id = deviceId(dir);
  assert.ok(id);
  const aside = readdirSync(dir).filter((name) => name.startsWith("credentials.json.corrupt-"));
  assert.equal(aside.length, 1, "the original bytes are preserved");
  assert.equal(readFileSync(join(dir, aside[0]), "utf8"), "{ not json");
});

test("an unreadable credentials.json is never overwritten", { skip: process.getuid?.() === 0 && "root reads any file" }, (t) => {
  const dir = stateDir(t);
  const file = join(dir, "credentials.json");
  writeFileSync(file, JSON.stringify({ other_client_field: "kept" }));
  chmodSync(file, 0o000);
  t.after(() => { try { chmodSync(file, 0o600); } catch {} });
  assert.throws(() => deviceId(dir), "refuses to write over what it cannot read");
  chmodSync(file, 0o600);
  assert.deepEqual(JSON.parse(readFileSync(file, "utf8")), { other_client_field: "kept" });
  assert.equal(existsSync(`${file}.lock`), false, "no lock left behind");
});
