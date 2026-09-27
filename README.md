# Bold Love Farm & Bakery website

This repository is the canonical source for the website published at both [boldlovebakery.com](https://boldlovebakery.com/) and [boldlovefarm.com](https://boldlovefarm.com/). Both production repositories use the same commits; each repository's GitHub Pages settings assign its own custom domain.

The site is built with Astro and published as static files through GitHub Pages.

The site itself uses Astro templates and CSS. It does not use a frontend framework. Its only client-side JavaScript is Plausible's privacy-friendly analytics loader and Mailchimp's connected-site loader, which provides the existing signup popup.

## Requirements

- Node.js 22.12 or newer
- npm, included with Node.js

## Local development

Install the exact dependencies recorded in `package-lock.json`:

```sh
npm ci
```

Start the local development server:

```sh
npm run dev
```

Astro prints the local address to open in a browser. Changes under `src/` and `public/` are reflected while the server is running.

## Build and verification

Create the production site in `dist/`:

```sh
npm run build
```

Build the site and run the focused checks against the generated files:

```sh
npm test
```

The checks cover metadata and content across all five main pages, internal navigation, shop-link behavior, the Contact FAQ, the Products ordering guide, local assets, and the Plausible and Mailchimp loaders. Isolated blog fixture builds also check published articles, optimized images, RSS ordering, draft exclusion, and invalid frontmatter errors.

To inspect the production build locally:

```sh
npm run build
npm run preview
```

Astro prints the preview address to open in a browser.

### Check the Mailchimp popup

For the most reliable popup check, open the deployed site in a private browser window and wait for the delay configured in Mailchimp. A private window avoids a previous dismissal suppressing the popup. Temporarily disable content-blocking extensions if the popup still does not appear.

Mailchimp may apply connected-domain and audience rules that prevent the popup from appearing on `localhost`, even when the loader is working. The generated page must contain a script with `id="mcjs"`; `npm test` checks that the account-specific loader is present.

## Plausible analytics

The account-generated Plausible script is installed once in `src/layouts/BaseLayout.astro`, so every page includes it. Its Plausible site identifier is `boldlovefarm.com`. The script is configured through Plausible for automatic pageviews, outbound-link clicks, file downloads, and form submissions.

The production build is served from both `boldlovefarm.com` and `boldlovebakery.com`. Configure `boldlovebakery.com` as an allowed hostname for the same site in Plausible so both domains report to one dashboard and can be separated with Plausible's hostname filter.

Plausible ignores `localhost` by default. Leave that behavior enabled so local development and automated checks do not affect production traffic figures.

After deploying, visit each production domain and confirm the visit appears in Plausible's real-time dashboard. Click a **Shop Bold Love Online** button and confirm that GrownBy appears under outbound-link clicks. Content-blocking browser extensions may prevent analytics from loading, so use a private window without extensions when diagnosing the integration.

## Project structure

- `src/pages/index.astro` — homepage content and structure
- `src/pages/about.astro` — About page and its three story sections
- `src/pages/contact.astro` — contact details and frequently asked questions
- `src/pages/products.astro` — product overview and ordering guide
- `src/pages/blog/` — blog index and static article routes
- `src/pages/rss.xml.js` — published-post RSS feed
- `src/content/blog/` — Markdown posts and a local draft template
- `src/content.config.ts` — blog frontmatter validation
- `src/lib/blog.js` — draft filtering, ordering, and date formatting
- `src/layouts/BlogLayout.astro` — article presentation
- `src/layouts/BaseLayout.astro` — document shell and metadata
- `src/components/SiteHeader.astro` — shared primary navigation
- `src/components/SiteFooter.astro` — footer content
- `src/styles/global.css` — visual design and responsive rules
- `public/` — files copied unchanged into the generated site
- `public/downloads/` — downloadable files served at `/downloads/<filename>`
- `tests/site.test.js` — checks for the generated site
- `tests/blog.test.js` — blog output and isolated publishing/validation checks
- `openspec/specs/` — current behavioral specifications
- `openspec/changes/archive/` — completed OpenSpec changes and their implementation records
- `.github/workflows/deploy.yml` — GitHub Pages build and deployment

`dist/` is generated and is not committed.

## Content status

The About page includes the current farm, bakery, and partner stories, with each section linking visitors to the online store.

The blog has a local draft template, not a published article. Production shows an intentional empty state at `/blog/`, but the shared navigation hides the Blog link while there are no published posts. Publishing the first post makes the link appear automatically; drafts do not count.

## Writing and publishing blog posts

Copy `src/content/blog/draft-template.md` to a new Markdown file in the same directory, such as `summer-at-the-farm.md`. Its filename becomes `/blog/summer-at-the-farm/`; keep that filename stable after publishing so existing links keep working.

Each post begins with YAML frontmatter:

```yaml
---
title: "Summer at the farm"
description: "A short introduction for the blog listing, search results, and RSS."
publishDate: 2026-09-18
draft: true
# updatedDate: 2026-09-19
# featureImage: ../../assets/blog/summer-at-the-farm.jpg
# featureImageAlt: Describe the photograph for someone who cannot see it.
---
```

`title`, `description`, `publishDate`, and `draft` are required. Dates use `YYYY-MM-DD`. `updatedDate` is optional. A `featureImage` is optional, but requires meaningful `featureImageAlt` text. Create `src/assets/blog/` when adding your first photograph, and use a relative path from the Markdown file. Astro optimizes these local feature images. As a practical starting point, resize photographs to roughly 1600–2000 pixels wide and compress them before adding them to Git; avoid committing camera originals.

Write ordinary Markdown below the frontmatter. The layout supplies the title as the only first-level heading, so start body headings with `##`. Use short paragraphs, lists, descriptive links, and `![meaningful alternative text](path-to-image)` for body images.

Run `npm run dev` and visit `/blog/` or `/blog/draft-template/` to preview drafts. Drafts have a visible label and a `noindex` directive. They are completely excluded from production article routes, listings, and RSS; the feed excludes drafts even during development. A local preview is not an access-controlled publishing system, so do not put confidential material in the repository.

To publish, replace the template content, choose the publication date, and change `draft: true` to `draft: false`. Posts sort newest first. Dates do not schedule publication: even a future-dated non-draft post will appear in the next deployment.

The Blog navigation link is temporarily guarded in `src/components/SiteHeader.astro`. Once the second blog post has been published, remove the `showBlog` guard and render the Blog navigation item unconditionally. Update the corresponding navigation expectations in `tests/blog.test.js` and `tests/site.test.js` at the same time.

Run `npm test`, then `npm run preview` to inspect the production output (without drafts). Missing required metadata or an image without alternative text fails the build. Publishing still requires the normal GitHub Pages deployment described below; editing a file or previewing locally does not deploy it.

The feed is `/rss.xml`, with subscription links on the blog and automatic discovery metadata on every page. Canonical page URLs, social URLs, and RSS links use `https://boldlovefarm.com`, configured in `astro.config.mjs`. Both domains may still serve the site; the future HTTP 301 redirect from `boldlovebakery.com` requires separate hosting/domain configuration and is not implemented here.

## GitHub Pages deployment

The deployment workflow runs independently in both production repositories whenever `main` is pushed. It can also be started manually from the repository's Actions tab. The workflow installs the locked dependencies, builds the Astro site, uploads `dist/`, and deploys that artifact to GitHub Pages.

The source code does not contain a `CNAME` file. With the custom GitHub Actions workflow, each custom domain is repository configuration rather than shared source code.

Configure the repositories under **Settings → Pages** as follows:

- `boldlovebakery/boldlovebakery.com`
  - Source: **GitHub Actions**
  - Custom domain: `boldlovebakery.com`
- `boldlovebakery/boldlovefarm.com`
  - Source: **GitHub Actions**
  - Custom domain: `boldlovefarm.com`

Do not add a domain-specific `CNAME` file or make domain-specific commits. The two repositories should remain on the same Git history.

## Production remotes

The local repository has individual remotes for inspection and a combined remote for deployment:

- `boldloveBAKERY.com-production` → `https://github.com/boldlovebakery/boldlovebakery.com.git`
- `boldloveFARM.com-production` → `https://github.com/boldlovebakery/boldlovefarm.com.git`
- `both-production` → pushes to both repositories

This working copy is already configured with `both-production`. When setting up another clone, create the combined remote with:

```sh
git remote add both-production https://github.com/boldlovebakery/boldlovebakery.com.git
git remote set-url --add --push both-production https://github.com/boldlovebakery/boldlovebakery.com.git
git remote set-url --add --push both-production https://github.com/boldlovebakery/boldlovefarm.com.git
```

Confirm the fetch and push URLs with:

```sh
git remote -v
```

## Deploying both sites

### Finish and archive planned work

If the release has an active OpenSpec change, complete every task and validate it before archiving:

```sh
openspec list
openspec validate your-change-name --type change --strict
openspec archive your-change-name
openspec validate --specs
```

Replace `your-change-name` with the active change name. Archiving should sync its delta specifications into `openspec/specs/`; review and commit those changes with the implementation before merging. `openspec list` should report no active changes when every planned change in the release is complete.

### Compare production before merging

Fetch both production repositories and confirm their `main` branches contain the same commits:

```sh
git fetch boldloveBAKERY.com-production main
git fetch boldloveFARM.com-production main
git log --left-right --graph --oneline \
  boldloveBAKERY.com-production/main...boldloveFARM.com-production/main
```

No log output means the production branches match. If commits appear on either side, reconcile that divergence before merging or deploying; do not force-push either repository.

With a clean working tree, switch to `main`, update it from production, and fast-forward it to the reviewed feature branch:

```sh
git status --short
git switch main
git merge --ff-only boldloveBAKERY.com-production/main
git merge --ff-only your-feature-branch
```

Replace `your-feature-branch` with the branch being released. An empty `git status --short` output confirms the working tree is clean. If either fast-forward fails, inspect the differing commits and resolve them with a normal reviewed merge or rebase rather than forcing the operation.

### Verify and deploy

Install from the lockfile and test the exact merged `main` commit:

```sh
npm ci
npm test
```

Confirm the working tree remains clean, then push that same `main` commit to both production repositories:

```sh
git status --short
git log -1 --oneline
git push both-production main
```

That single command triggers the same Pages workflow in both repositories. Check the Actions tab in each repository and confirm both **Deploy to GitHub Pages** runs succeed.

After both workflows finish, open each production domain and check the homepage, primary navigation, store link, and any pages changed by the release. Confirm that canonical URLs still use `https://boldlovefarm.com`; then check Plausible's real-time dashboard and outbound-link activity.

If one push fails, fetch both repositories again and inspect the commits present on only one side. For example:

```sh
git fetch boldloveBAKERY.com-production main
git fetch boldloveFARM.com-production main
git log --left-right --graph --oneline \
  boldloveBAKERY.com-production/main...boldloveFARM.com-production/main
```

After resolving the divergence with a normal merge or rebase, push `main` through `both-production` again.
