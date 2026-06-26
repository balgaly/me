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

## Design language

**All pages on this site must use the shared design tokens.** No hardcoded colors, spacing, or font names anywhere in page CSS. The single source of truth is `assets/tokens.css` (copied from `C:\DEV\local\design-language-balgaly\src\tokens.css`).

Key invariants:
- Colors: use `var(--bg-base)`, `var(--accent)`, `var(--text-primary)`, etc. — never hex values in page CSS
- Fonts: `var(--font-display)` (Space Grotesk) and `var(--font-mono)` (Space Mono) — never `font-family` literals
- Spacing/radius: use `var(--pad-x)`, `var(--maxw)`, `var(--r-lg)`, etc.
- When the design language repo updates, copy `src/tokens.css` → `assets/tokens.css` and `src/components.css` → `assets/components.css` to pick up changes

**Anti-patterns blocked by design:**
- Pills/badge chips on tech tags (use plain stack-line `built/ python / aws lambda` format)
- Purple gradients, glassmorphism, numbered section markers (01/02/03)
- Any font other than Space Grotesk + Space Mono

When importing UI from another repo, restyle it to these tokens before merging. The design language is the contract; new pages are guests.

## Adding a new page

Use the skill at `.claude/skills/add-page/SKILL.md`, or follow this checklist manually:

1. Create `/<page>/index.html` using `assets/_page-template.html` as the base
2. Link both stylesheets with root-relative paths: `<link href="/assets/tokens.css">` + `<link href="/assets/components.css">`
3. Copy the no-flash theme init script from `index.html` into `<head>`
4. Keep nav and footer identical to `index.html` (same links, same brand mark)
5. Add page content — fetch from a local JSON data file (`data/<page>.json`) if data-driven, or inline if static
6. Add a `<url>` entry to `sitemap.xml`
7. Add a nav link in `index.html`'s `<nav>` if the page should be globally reachable
8. Validate HTML parses, tokens render (check at 768px + desktop), no console errors

Page URL convention: `balgaly.com/<slug>/` — slug is lowercase, hyphenated.

## Rules

- Never commit secrets, keys, or internal/self-hosted URLs. This includes any `github.cyberng.com` or other self-hosted GHE links — even in `url` fields. Set `url: null` for work projects without a public URL.
- Never name specific work projects in any field. A generic at-work card is fine; project names are not.
- Keep `index.html` untouched unless you're changing the presentation layer itself
- `data/state.json` must always be valid JSON — validate before pushing
- Both agents can push to `main` directly; no PR needed for state updates
- Every page must pass design language invariants above before merge
