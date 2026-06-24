# add-page skill

Adds a new page to balgaly.com in the standard way. Every page shares the same design language, nav, and footer as the homepage.

## When to use

When the user asks to add a new page, section, or sub-site to `balgaly.com`. Examples: `/projects`, `/uses`, `/now` as standalone, a blog index, a work detail page.

## Steps

### 1. Confirm slug and purpose
Ask (or infer from context):
- **slug** — e.g. `uses`, `projects`, `now` — becomes the URL path `/slug/`
- **purpose** — one sentence: what does this page do?
- **data-driven?** — does it need a `data/<slug>.json` file, or is content static/inline?

### 2. Create the page file
Copy `assets/_page-template.html` to `<slug>/index.html`. Fill in:
- `<title>` → `<Page Name> — Snir Balgaly`
- `<meta name="description">` → one sentence
- `<link rel="canonical">` → `https://balgaly.com/<slug>/`
- `og:title`, `og:description`, `og:url`
- The `<main>` content block

All token references must use CSS variables — no hex or literal font names.

### 3. If data-driven
Create `data/<slug>.json` with the page's content. Fetch it in the page's `<script>` block at runtime (same pattern as `index.html`).

### 4. Wire into the site
- Add `<a href="/<slug>/">Page Name</a>` to the `<nav>` in `index.html` (and in `404.html` if relevant)
- Add to `sitemap.xml`:
  ```xml
  <url>
    <loc>https://balgaly.com/<slug>/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ```

### 5. Validate
- Open at `http://localhost:<port>/<slug>/` — confirm nav, footer, fonts load
- Check 768px breakpoint (mobile)
- Zero console errors
- All colors come from `var(--*)` tokens, confirmed in DevTools

### 6. Design language checklist
Before committing, verify:
- [ ] No hardcoded hex colors in `<style>`
- [ ] No font-family literals (only `var(--font-display)` / `var(--font-mono)`)
- [ ] No pills/chips on tags — use stack-line format
- [ ] No purple gradients, glassmorphism, numbered section markers
- [ ] Dark mode works (toggle `data-theme="dark"` on `<html>` in DevTools)
- [ ] `prefers-reduced-motion` respected for any animations

## File locations
- Page template: `assets/_page-template.html`
- Design tokens: `assets/tokens.css` (read-only — source of truth)
- Shared components: `assets/components.css`
- Design language rules: `AGENT.md` → Design language section
