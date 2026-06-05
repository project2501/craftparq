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
processing in `news-card.html` / `single.html`. Worth doing once posts become
image-heavy.

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
- [ ] IAM permissions for the deploy identity: `s3:PutObject`/`DeleteObject`/`ListBucket` on the bucket (+ `/*`) and `cloudfront:CreateInvalidation`

_Added: 2026-06-05_

### CI/CD pipeline (GitHub Actions)
- [x] Deploy workflow written — `.github/workflows/deploy.yml` (build Hugo extended `0.156.0` → `aws s3 sync --delete` → optional CloudFront invalidation; long-lived AWS keys, OIDC noted as alternative). _done 2026-06-05_
- [ ] Set repo Actions secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME` (new bucket), and optionally `CLOUDFRONT_DISTRIBUTION_ID`
- [ ] First successful deploy run verified (push to `main` or manual `workflow_dispatch`)

_Added: 2026-06-05_

### ~~Switch Decap CMS auth off git-gateway~~ — dropped
Resolved by removing the browser CMS entirely (decisions.md §2.3): a single
technical author writes posts as markdown in git, so no CMS, OAuth proxy, or
GitHub backend is needed. `static/admin/` deleted 2026-06-05.
