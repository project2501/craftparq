# Craftparq.com — Project Decisions & Design Record

> Living document. Update as decisions are made or revised.
> All decisions recorded with context, options considered, and rationale.

---

## 1. Business & Brand

### 1.1 Services offered

| Service | Description |
|---|---|
| Training | Software Architecture & Development, full-team upskilling, custom SDLC optimization |
| Product & Solution Development | Cloud, Mobile, Desktop, Distributed, Industrial, Gaming — contract or freelance |
| Architecture Consultancy | System design reviews, technology selection, roadmaps, legacy modernization |

**Target personas:**
- CTO / Engineering Lead hiring an expert for end-to-end product delivery
- Team Lead seeking specialist training (Microsoft stack, architecture, SDLC)
- Startup / SME needing a SaaS product built from scratch
- Enterprise seeking an architecture review or advisory

### 1.2 Brand tone

Precision engineering meets trusted partner. Not startup hype. Language should feel confident, direct, and craft-oriented. Avoid superlatives. Let competence show through clarity.

**Example phrasing:** *"We don't just deliver code, we transfer capability."*

### 1.3 Visual identity

- **Aesthetic:** Dark, refined, editorial — deep navy base with warm gold accents
- **Fonts:** DM Serif Display (headings/logo) + DM Sans (body/UI)
- **Primary colors:**
  - Navy `#0f1c2e` — base background
  - Slate `#1e2d42` — card surfaces
  - Gold `#c9954a` — primary accent
  - Gold light `#e8b870` — italic hero emphasis
  - Muted `#8a96a3` — secondary text / descriptions
- **Icons:** Tabler Icons (outline webfont)
- **Border style:** 0.5px `rgba(255,255,255,0.08)` — consistent throughout

---

## 2. Tech Stack

### 2.1 Core stack

| Layer | Choice | Rationale |
|---|---|---|
| Static site generator | **Hugo** | Familiar to owner; native i18n; fast build; no runtime |
| Hosting | **AWS S3 + CloudFront** | Static files in S3; CloudFront for HTTPS, custom domain & CDN; ACM cert; deploy via CI (see §2.4, §7.3) |
| CMS (news posts) | **None** — author markdown directly in git | Single technical author; no need for browser editing, so no CMS (see §2.3). Posts are `.md` files committed to the repo |
| Search | **Pagefind** (future) | Static, multilingual-aware, zero backend |
| Forms | **Formspree / Web3Forms** (or AWS API Gateway + Lambda + SES) | No server of ours; Netlify Forms is unavailable on S3, so the form posts to a third-party endpoint or an AWS-native one |
| Styles | **SCSS** (Hugo asset pipeline) | Variables, nesting, mixins — compiled by Hugo extended |
| JS | Vanilla ES6 | No framework needed at this scale |

### 2.2 Decision: Hugo over Next.js / Astro

- **Options considered:** Next.js, Astro, Hugo
- **Decision:** Hugo
- **Rationale:** Owner already familiar; Hugo's i18n is first-class and requires no plugins; build times are near-instant; no Node.js runtime to manage; SCSS compiles natively in Hugo extended

### 2.3 Decision: No CMS — author markdown directly

- **Options considered:** Forestry (discontinued), TinaCMS, Decap CMS, raw git/markdown
- **Decision:** No browser CMS *(revised 2026-06-05 — previously Decap CMS)*
- **Rationale:** News posts are written by a single technical author, so browser-based editing adds no value. A CMS only earns its place when non-technical people must publish without touching git.
- **What this avoids:** Decap's `git-gateway` is Netlify-only and doesn't work on S3; the alternative (`backend: github`) would have required registering a GitHub OAuth App and standing up an OAuth-proxy server (Lambda/Worker) just to complete the login handshake. Dropping the CMS removes all of that.
- **Consequence:** the `static/admin/` Decap files were removed. Posts are authored as `.md` files in `content/en/news/` or `content/tr/news/` and committed to git (see §6.2).

### 2.4 Decision: AWS S3 + CloudFront for hosting

- **Options considered:** Cloudflare Pages, Netlify, AWS S3 + CloudFront
- **Decision:** AWS S3 + CloudFront *(supersedes the earlier Cloudflare Pages / Netlify choice — 2026-06-05)*
- **Rationale:** Owner prefers to keep infrastructure on AWS; full control over the CDN, cache, and TLS; S3 static hosting is cheap and durable.
- **What it requires:**
  - **S3** bucket holding the built `public/` output
  - **CloudFront** distribution in front for HTTPS + custom domain + caching (S3 website endpoints are HTTP-only)
  - **ACM** TLS certificate (must be in `us-east-1` for CloudFront)
  - **DNS** (Route 53 or external) pointing `craftparq.com` at the CloudFront distribution
  - A **CloudFront Function / `index.html` rewrite** to serve Hugo's pretty URLs (`/news/` → `/news/index.html`) for sub-directory requests
  - **CI** (e.g. GitHub Actions) to build and sync on push — there is no built-in git deploy like Cloudflare/Netlify
- **Consequences:** loses Netlify Forms and Netlify Identity/git-gateway → forms and CMS auth move to the alternatives noted in §2.1 and §2.3.

---

## 3. Multilingual Architecture

### 3.1 Language support

- **Languages:** English (`en`) and Turkish (`tr`)
- **Default language:** English (served at root `/`, no `/en/` prefix)
- **Turkish:** served at `/tr/`

### 3.2 Content model

```
content/
  en/
    _index.md          ← EN homepage
    news/
      _index.md        ← EN news list
      post-slug.md     ← EN news post
    services/
      training.md
      development.md
      consultancy.md
  tr/
    _index.md          ← TR homepage
    news/
      _index.md        ← TR news list
      post-slug.md     ← TR news post (independent slug OK)
    services/
      ...
```

### 3.3 Translation strings

All UI labels live in `i18n/en.yaml` and `i18n/tr.yaml`. Used via `{{ i18n "key" }}` in templates. This means zero hardcoded English in layouts.

### 3.4 Language switcher

- Compact toggle in the nav bar (EN | TR)
- Styled with gold highlight for active language
- Links to translated page if it exists, otherwise root of that language

### 3.5 News language binding

- Each news post belongs to one language by virtue of its `contentDir` folder (`content/en/news/` vs `content/tr/news/`)
- Posts carry a language badge (gold for EN, blue for TR) on news cards
- Filter bar on news list/homepage allows showing All / English only / Türkçe

---

## 4. Site Structure

### 4.1 Pages

| Page | Path | Notes |
|---|---|---|
| Homepage | `/` | Hero, services, process, news preview, contact |
| News list | `/news/` | All posts with language filter |
| News post | `/news/post-slug/` | Single post with back link |
| Service: Training | `/services/training/` | Detail page (to be built) |
| Service: Development | `/services/development/` | Detail page (to be built) |
| Service: Consultancy | `/services/consultancy/` | Detail page (to be built) |
| Contact | `/contact/` | Standalone contact page |

### 4.2 Navigation (EN)

Training · Development · Consultancy · News + [Contact Us] button + [EN | TR] switcher

### 4.3 Navigation (TR)

Eğitim · Geliştirme · Danışmanlık · Haberler + [İletişim] button + [EN | TR] switcher

---

## 5. Homepage Sections (in order)

1. **Hero** — tagline, sub-headline, two CTAs, three value-prop cards (right column)
2. **Services** — three cards: Training, Development, Consultancy
3. **Process** — four-step strip: Discovery → Proposal → Execution → Handoff
4. **News** — latest 3 posts with language filter bar
5. **Contact** — split layout: contact details (left) + lead form (right)
6. **Footer** — logo, copyright, social links

---

## 6. News / Blog

### 6.1 Post front matter

```yaml
---
title: "Post title"
date: 2026-05-28
category: "Architecture"   # shown as tag on card
icon: "ti-architecture"    # Tabler icon for card image placeholder
summary: "One or two sentences shown on the news card."
draft: false
---
```

### 6.2 Writing workflow

- Create a file in `content/en/news/` or `content/tr/news/`, fill in the front matter, write the markdown body, set `draft: false`, then commit and push. The deploy workflow (§7.4) rebuilds and publishes automatically.

### 6.3 Creating a new post via CLI

```bash
# English post
hugo new content en/news/my-post-title.md

# Turkish post
hugo new content tr/news/baslik.md
```

---

## 7. Development Workflow

### 7.1 Local development

```bash
# Prerequisites: Hugo extended v0.123+
cd C:\dev\repos\craftparq
hugo server --buildDrafts --disableFastRender
# → http://localhost:1313
```

### 7.2 Build for production

```bash
hugo --minify
# Output in /public — deploy this folder
```

### 7.3 Deployment (AWS S3 + CloudFront)

Build locally or in CI, then sync to S3 and invalidate the CDN cache:

```bash
hugo --minify
aws s3 sync ./public s3://craftparq-site --delete
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
```

- `--delete` removes files from the bucket that no longer exist in `public/`.
- The CloudFront invalidation forces edge nodes to fetch the new files immediately.

### 7.4 Continuous deployment (GitHub Actions)

Unlike Cloudflare/Netlify there is no built-in git deploy, so a workflow runs on push to `main`:

1. Checkout + install Hugo extended (`HUGO_VERSION` pinned)
2. `hugo --minify`
3. `aws s3 sync ./public s3://craftparq-site --delete`
4. `aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"`

Auth via an IAM user / OIDC role scoped to the bucket and the distribution. *(Workflow not yet created — see backlog.)*

---

## 8. Open Items / Future Work

Moved to [backlog.md](backlog.md) — all backlog items and open issues are tracked there.

---

## 9. Visual Mockups

Mockups were produced interactively during planning sessions. Key screens:

### 9.1 Homepage (v1)
Dark navy background, DM Serif Display headlines, gold accent color. Sections: Hero (2-col grid with stat cards) → Services (3-col cards) → Process (4-step strip) → News → Contact form.

### 9.2 Multilingual nav + News section (v2)
Added EN|TR language toggle to nav (compact pill switcher, gold active state). News section added with language badge on cards (gold=EN, blue=TR) and a filter bar (All / English only / Türkçe). Featured post in wider left column, two compact cards on right.

---

*Last updated: 2026-06-05 — hosting changed to AWS S3 + CloudFront (§2.4); dropped browser CMS (§2.3)*
