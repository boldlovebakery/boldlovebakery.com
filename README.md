# Bold Love Farm & Bakery website

This repository is the canonical source for the shared website content used by `boldloveBAKERY.com` and `boldloveFARM.com`. The site is built with Astro and published as static files through GitHub Pages.

The page itself uses Astro templates and CSS. It does not use a frontend framework. The only client-side JavaScript is Mailchimp's connected-site loader, which provides the existing signup popup.

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

Astro prints the local address to open in a browser. Changes under `src/` are reflected while the server is running.

## Build and verification

Create the production site in `dist/`:

```sh
npm run build
```

Build the site and run the focused checks against the generated files:

```sh
npm test
```

The checks cover the homepage metadata and content, shop links, local assets, the Mailchimp popup loader, and the generated custom-domain file.

To inspect the exact generated files locally, build the site and serve `dist/`:

```sh
python3 -m http.server 8000 --directory dist
```

Then open `http://localhost:8000/`.

### Check the Mailchimp popup

For the most reliable popup check, open the deployed site in a private browser window and wait for the delay configured in Mailchimp. A private window avoids a previous dismissal suppressing the popup. Temporarily disable content-blocking extensions if the popup still does not appear.

Mailchimp may apply connected-domain and audience rules that prevent the popup from appearing on `localhost`, even when the loader is working. The generated page must contain a script with `id="mcjs"`; `npm test` checks that the account-specific loader is present.

## Project structure

- `src/pages/index.astro` — homepage content and structure
- `src/layouts/BaseLayout.astro` — document shell and metadata
- `src/components/SiteFooter.astro` — footer content
- `src/styles/global.css` — visual design and responsive rules
- `public/` — files copied unchanged into the generated site
- `tests/site.test.js` — checks for the generated site
- `.github/workflows/deploy.yml` — GitHub Pages build and deployment

`dist/` is generated and is not committed.

## GitHub Pages deployment

The deployment workflow runs when `main` is pushed and can also be started manually from GitHub Actions. It installs from the lockfile, builds the Astro site, uploads `dist/`, and deploys that artifact to GitHub Pages.

In each production repository, configure GitHub Pages to use **GitHub Actions** as its source. The workflow does not hard-code a domain; Astro copies that repository's `public/CNAME` into `dist/CNAME` during the build.

## Preserve each repository's `CNAME`

The two production repositories share site source but own different custom-domain files:

- Bakery: `public/CNAME` must contain `boldlovebakery.com`
- Farm: `public/CNAME` must contain the farm repository's own domain

Treat `public/CNAME` as destination-owned when synchronizing source between repositories. Before applying shared changes to the farm repository, record its existing `public/CNAME`, exclude that file from the source sync, and confirm it is unchanged before committing or pushing. Apply the same rule in reverse for the bakery repository.

Do not copy the bakery `public/CNAME` over the farm value, and do not force-push shared content without first verifying the destination file.

After syncing either repository, run:

```sh
npm ci
npm test
```

The custom-domain test confirms that the generated value exactly matches the `public/CNAME` belonging to the repository being built.

## Production remotes

- `boldloveBAKERY.com-production` → `https://github.com/boldlovebakery/boldlovebakery.com.git`
- `boldloveFARM.com-production` → `https://github.com/boldlovebakery/boldlovefarm.com.git`
