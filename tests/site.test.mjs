import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile("index.html", "utf8");
const state = JSON.parse(await readFile("data/state.json", "utf8"));
const cname = await readFile("CNAME", "utf8");
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const deployment = await readFile("DEPLOYMENT.md", "utf8");

test("site remains a static custom-domain site with no framework bundle", () => {
  assert.doesNotMatch(html, /https:\/\/fonts\.googleapis\.com/);
  assert.doesNotMatch(html, /react-dom|next\/|astro|vite\/|tailwindcss/i);
  assert.match(html, /fetch\('data\/state\.json/);
});

test("homepage presents an operating profile, not a generic portfolio", () => {
  for (const id of ["hero", "signal", "proof", "systems", "writing", "contact"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /AI continuity systems/);
  assert.match(html, /Proof, not adjectives/);
  assert.match(html, /No template voice/);
  assert.doesNotMatch(html, /dark purple|--purple|glow|watch loops/i);
});

test("state carries proof stories and current signals", () => {
  assert.ok(Array.isArray(state.proofStories));
  assert.ok(state.proofStories.length >= 4);
  assert.ok(Array.isArray(state.signals));
  assert.ok(state.signals.length >= 4);
  assert.ok(Array.isArray(state.systems));
  assert.ok(state.systems.length >= 5);
  assert.ok(Array.isArray(state.liveFeeds));
  assert.ok(state.liveFeeds.length >= 4);
  assert.ok(Array.isArray(state.operatingModes));
  assert.ok(state.operatingModes.length >= 3);
});

test("every proof story has evidence and a public-safe angle", () => {
  for (const story of state.proofStories) {
    assert.equal(typeof story.title, "string");
    assert.equal(typeof story.angle, "string");
    assert.ok(Array.isArray(story.evidence));
    assert.ok(story.evidence.length >= 2);
    assert.doesNotMatch(JSON.stringify(story), /github\.cyberng\.com/i);
  }
});

test("site declares the intended custom domain", () => {
  assert.equal(cname.trim(), "me.balgaly.com");
});

test("deployment path uses a public artifact repo without exposing source", () => {
  assert.equal(pkg.scripts["deploy:artifact"], "powershell -ExecutionPolicy Bypass -File scripts/publish-public.ps1");
  assert.match(deployment, /me-site-public/);
  assert.match(deployment, /balgaly\.github\.io/);
  assert.match(deployment, /Host:\s*me/);
  assert.match(deployment, /Type:\s*CNAME/);
});

test("homepage behaves like a living product cockpit", () => {
  for (const id of ["mode-strip", "feed-rail", "signal-lens", "proof-ledger", "build-log"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /data-mode-button/);
  assert.match(html, /data-feed-filter/);
  assert.match(html, /IntersectionObserver/);
  assert.match(html, /requestAnimationFrame/);
  assert.match(html, /prefers-reduced-motion/);
});

test("site carries the public three-day JARVIS build log", () => {
  assert.ok(Array.isArray(state.buildLog));
  assert.ok(state.buildLog.length >= 3);
  assert.match(html, /short-memory-long-repo/);
  assert.match(html, /3-day build log/i);
  for (const entry of state.buildLog) {
    assert.equal(typeof entry.day, "string");
    assert.equal(typeof entry.title, "string");
    assert.ok(entry.proof.length > 10);
  }
});

test("site avoids common AI-slop decoration patterns", () => {
  assert.doesNotMatch(html, /orb|blob|bokeh|glassmorphism|neon|cyberpunk/i);
  assert.doesNotMatch(html, /linear-gradient\([^)]*purple/i);
  assert.doesNotMatch(html, /Lorem ipsum/i);
});

test("live feeds carry useful context and actions", () => {
  const validKinds = new Set(["repo", "writing", "system", "public"]);
  for (const item of state.liveFeeds) {
    assert.ok(validKinds.has(item.kind), `unexpected live feed kind ${item.kind}`);
    assert.equal(typeof item.title, "string");
    assert.ok(item.title.length > 4);
    assert.equal(typeof item.context, "string");
    assert.ok(item.context.length > 20);
    assert.equal(typeof item.action, "string");
    assert.ok(item.action.length > 10);
  }
});
