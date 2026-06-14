# Deployment Status

Target domain: `me.balgaly.com`

Current evidence:

- `gh api repos/balgaly/me --jq .has_pages` returns `false`.
- `gh api --method POST repos/balgaly/me/pages` returns `422`: current plan does not support GitHub Pages for this private repository.
- `me.balgaly.com` did not resolve reliably from this machine during setup.

Do not make the repository public without explicit approval.

Viable next deployment paths:

1. Enable hosting through an external provider that supports private GitHub repos, then point `me.balgaly.com` at it.
2. Move only the built static artifact to a public Pages repository and keep source/private state in this repo.
3. Upgrade/change GitHub Pages support for the private repo, then serve `master` with `CNAME`.

Local verification:

```bash
python -m http.server 8787
npm test
npx impeccable detect index.html
```
