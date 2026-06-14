import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile("index.html", "utf8");
const state = JSON.parse(await readFile("data/state.json", "utf8"));
const cname = await readFile("CNAME", "utf8");

test("site remains a static GitHub Pages site with no framework bundle", () => {
  assert.doesNotMatch(html, /https:\/\/fonts\.googleapis\.com/);
  assert.doesNotMatch(html, /React|Next\.js|Astro|vite|tailwind/i);
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
