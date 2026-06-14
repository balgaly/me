# balgaly/me - Agent Protocol

This repo powers `balgaly.com` / `me.balgaly.com`. It is a static site: no build step, no framework. GitHub Pages serves `index.html` directly from `master`.

## Architecture

```
index.html       -> presentation and interaction layer
data/state.json  -> single source of truth for public-safe site content
AGENT.md         -> this file
tests/           -> static contract tests
```

`index.html` fetches `data/state.json` at load time and renders the operating profile. For content-only updates, edit `data/state.json`. For presentation or interaction changes, edit `index.html` and run tests.

## How to update content

### 1. Clone / pull latest

```bash
cd C:/DEV/local/me
git pull origin master
```

### 2. Edit data/state.json

Fields you'll update most:

| Field | When to update |
|-------|---------------|
| `signals[]` | When current focus changes |
| `proofStories[]` | When a stronger public-safe proof story exists |
| `systems[]` | When a system ships, stalls, or changes role |
| `writing[]` | When a new post publishes at words.balgaly.com |
| `meta.updated` + `meta.updatedBy` | Every update — set to today's date and your machine slug |

Validate before pushing:

```bash
npm test
```

### 3. Commit and push

```bash
git add data/state.json
git commit -m "chore: update site state - <what changed>"
git push origin master
```

GitHub Pages deploys automatically. Live in ~60 seconds.

## Machine slugs

| Machine | updatedBy value |
|---------|----------------|
| Work PC (CyberArk) | `whetstone@work-pc` |
| Personal PC | `whetstone@home-pc` |

## Adding a proof story

Add an object to `data/state.json` -> `proofStories[]`:

```json
{
  "kind": "agent ops",
  "title": "The repo that survives the chat",
  "angle": "One sentence. What changed and why it matters.",
  "evidence": [
    "Concrete proof item one.",
    "Concrete proof item two."
  ]
}
```

## Rules

- Never commit secrets, keys, or internal URLs (CyberArk GHE links are OK in `url` fields — they just won't be clickable externally)
- Keep `index.html` untouched unless changing the presentation or interaction layer itself
- `data/state.json` must always be valid JSON — validate before pushing
- Both agents can push to `master` directly for content-only updates; use a worktree for presentation changes
