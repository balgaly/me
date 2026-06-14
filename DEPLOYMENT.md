# Deployment Status

Target domain: `me.balgaly.com`

Current evidence:

- `gh api repos/balgaly/me --jq .has_pages` returns `false`.
- `gh api --method POST repos/balgaly/me/pages` returns `422`: current plan does not support GitHub Pages for this private repository.
- Public artifact repo created: `https://github.com/balgaly/me-site-public`.
- Public artifact commit `f0c2ac8` contains `index.html`, `data/state.json`, `CNAME`, and `.nojekyll`.
- `gh api repos/balgaly/me-site-public/pages` reports `status: building/built`, `source.branch: main`, and `cname: me.balgaly.com`.
- `gh api repos/balgaly/me-site-public/pages/builds/latest` reached `status: built` for commit `f0c2ac8ec58422286799598d57fce7d09bd6df72`.
- `nslookup me.balgaly.com` currently returns `NXDOMAIN`.

Do not make the repository public without explicit approval.

Chosen deployment path:

1. Keep `balgaly/me` private as the source of truth.
2. Publish only the static artifact to `balgaly/me-site-public`.
3. Serve the artifact with GitHub Pages on the public repo.
4. Point `me.balgaly.com` at `balgaly.github.io` with a registrar `CNAME` record.

Required external DNS step:

```text
Host: me
Type: CNAME
Value/Target: balgaly.github.io
TTL: automatic/default
```

GitHub's custom-domain docs require subdomains to point at `<user>.github.io`, excluding the repository name.

Artifact publish commands:

```bash
cd C:/DEV/.wt/me/T-0014
npm test
npm run deploy:artifact
gh api repos/balgaly/me-site-public/pages/builds/latest
```

One-time GitHub Pages setup commands already executed:

```bash
gh repo create balgaly/me-site-public --public --description "Public artifact for me.balgaly.com" --disable-wiki --clone --add-readme
gh api -X POST repos/balgaly/me-site-public/pages -F source[branch]=main -F source[path]=/
```

Local verification:

```bash
python -m http.server 8787
npm test
npm run deploy:artifact
gh api repos/balgaly/me-site-public/pages
nslookup me.balgaly.com
```
