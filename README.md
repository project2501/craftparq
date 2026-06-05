# Craftparq.com

Marketing and news site for Craftparq — software development, training, and architecture consultancy. Built with [Hugo](https://gohugo.io/) (extended), bilingual (EN/TR).

> Placeholder README — to be expanded later.

## Local development

```bash
# Requires Hugo extended (see HUGO_VERSION / config for the pinned version)
hugo server --buildDrafts --disableFastRender
# → http://localhost:1313
```

## Build

```bash
hugo --minify   # output in /public
```

## Documentation

- [`docs/decisions.md`](docs/decisions.md) — design & architecture decision record
- [`docs/backlog.md`](docs/backlog.md) — backlog and open issues

## Hosting

AWS S3 + CloudFront (see `docs/decisions.md` §2.4). Deploys via GitHub Actions on push to `main`.
