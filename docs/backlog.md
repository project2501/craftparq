# Craftparq.com — Backlog & Open Issues

> Running list of backlog items and known issues. Add new items here as they come up.
> For design decisions and rationale, see [decisions.md](decisions.md).

---

## Open Issues

_None currently open._

---

## Backlog

### Link news posts across languages with `translationKey`
The language switcher falls back to the target language's home page whenever the
current page has no counterpart in that language. Because news posts can have
independent slugs per language, an EN post without a linked TR translation sends
the user to the TR home instead of a TR version of that post.

**Fix:** add a shared `translationKey` to the front matter of post pairs so Hugo
maps them to each other and the switcher links post ↔ post.

_Added: 2026-06-05_

### Add a taxonomy template
Hugo warns on build: `found no layout file for "html" for kind "taxonomy"`.
Add `layouts/_default/taxonomy.html` (and `term.html` if needed) to support
category/tag listing pages and clear the warning.

_Added: 2026-06-05_

### Responsive news images via page bundles (Option B)
Featured-image support (Option A) is implemented: posts take an optional `image`
front-matter field, served at original size. To get auto-generated thumbnails,
WebP, and responsive `srcset`, convert news posts to page bundles
(`news/my-post/index.md` + co-located image) and use Hugo's `.Resources` image
processing in `news-card.html` / `single.html`. Also requires updating the Decap
`path`/`media_folder` config. Worth doing once posts become image-heavy.

_Added: 2026-06-05_

### Future work (migrated from decisions.md §8)
- [ ] Detail pages for each service (Training, Development, Consultancy)
- [x] Standalone Contact page — done 2026-06-05 (`/contact/`, EN + TR)
- [ ] About / Who is behind Craftparq page
- [ ] Case studies / project highlights section
- [ ] Testimonials component
- [ ] Pagefind search integration
- [ ] OG/social meta tags for news posts
- [ ] Sitemap and robots.txt tuning
- [ ] Analytics (privacy-friendly: Plausible or Cloudflare Web Analytics)
- [ ] Calendly or equivalent booking link in contact section (set `calendarUrl` in `params.toml` → "Schedule a call" method appears automatically)
- [ ] Wire the contact form to a backend (Formspree / Web3Forms, or AWS API Gateway + Lambda + SES) — Netlify Forms no longer applies on S3

_Migrated: 2026-06-05_

---

## AWS hosting migration (decided 2026-06-05, see decisions.md §2.4)

### Provision S3 + CloudFront infrastructure
- [ ] S3 bucket for the built `public/` output
- [ ] CloudFront distribution in front (HTTPS, custom domain, caching)
- [ ] ACM certificate in `us-east-1` for `craftparq.com`
- [ ] DNS pointing the domain at CloudFront (Route 53 or external)
- [ ] CloudFront Function / rewrite to map Hugo pretty URLs to `index.html` for sub-directory requests (`/news/` → `/news/index.html`)

_Added: 2026-06-05_

### CI/CD pipeline (GitHub Actions)
Build Hugo and deploy on push to `main` (no built-in git deploy on S3):
checkout → install pinned Hugo extended → `hugo --minify` →
`aws s3 sync ./public s3://<bucket> --delete` →
`aws cloudfront create-invalidation`. Auth via IAM user or OIDC role.

_Added: 2026-06-05_

### Switch Decap CMS auth off git-gateway
`static/admin/config.yml` still uses `backend: git-gateway` (Netlify-only).
On S3 there is no git-gateway, so switch to `backend: github` and stand up a
small OAuth proxy (Lambda / Worker / hosted) to complete the GitHub OAuth
handshake. Until then, `/admin` browser editing won't authenticate.

_Added: 2026-06-05_
