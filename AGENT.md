# balgaly/me — Agent Protocol

This repo powers `balgaly.com` / `me.balgaly.com`. It is a **static site** — no build step, no framework. GitHub Pages serves `index.html` directly.

## Architecture

```
index.html       ← presentation layer, never edit for content changes
data/state.json  ← single source of truth for all site content
AGENT.md         ← this file
```

`index.html` fetches `data/state.json` at load time and renders everything. To update the site, **only edit `data/state.json`** and push.

## How to update content

### 1. Clone / pull latest

```bash
cd C:/DEV/local/me          # work PC
# or
cd ~/DEV/me                 # personal PC
git pull origin main
```

### 2. Edit data/state.json

Fields you'll update most:

| Field | When to update |
|-------|---------------|
| `now.*` | Start of each work week or when focus shifts |
| `projects[*].status` | When a project ships, stalls, or changes phase |
| `projects[*].desc` | When the one-liner goes stale |
| `writing[]` | When a new post publishes at words.balgaly.com |
| `meta.updated` + `meta.updatedBy` | Every update — set to today's date and your machine slug |

### 3. Commit and push

```bash
git add data/state.json
git commit -m "chore: update site state — <what changed>"
git push origin main
```

GitHub Pages deploys automatically. Live in ~60 seconds.

## Machine slugs

| Machine | updatedBy value |
|---------|----------------|
| Work PC (CyberArk) | `whetstone@work-pc` |
| Personal PC | `whetstone@home-pc` |

## Adding a new project

Add an object to `data/state.json` → `projects[]`:

```json
{
  "slug": "my-project",
  "name": "my-project",
  "desc": "One sentence. What it does + why it matters.",
  "tags": ["typescript", "cli"],
  "status": "building",
  "url": "https://github.com/balgaly/my-project"
}
```

Valid `status` values: `prod` · `building` · `v1` · `phase1` · `running`

## Rules

- Never commit secrets, keys, or internal URLs (CyberArk GHE links are OK in `url` fields — they just won't be clickable externally)
- Keep `index.html` untouched unless you're changing the presentation layer itself
- `data/state.json` must always be valid JSON — validate before pushing
- Both agents can push to `main` directly; no PR needed for state updates
