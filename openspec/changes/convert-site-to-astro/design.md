## Context

See `proposal.md` for motivation. The repository currently serves a single root `index.html` directly through GitHub Pages, with CSS embedded in that file and a small set of root-level assets. The same content is published to bakery and farm production repositories, but each destination must keep its own `CNAME`. The current experience is intentionally static and has no application backend. Its one required browser-side integration is Mailchimp's connected-site loader, which controls a remotely configured signup popup.

The new `astro-static-site` specification requires the generated result to retain the current page, links, metadata, accessibility basics, and custom-domain behavior. The migration also needs a low-complexity workflow appropriate for a one-page site.

## Goals / Non-Goals

**Goals:**

- Produce static files that GitHub Pages can serve without an Astro server adapter.
- Separate page shell, page content, and global styling enough to make future changes clearer while keeping the structure proportionate to a one-page site.
- Copy public brand assets and the active repository `CNAME` into every production build without transforming their contents.
- Make build output and high-value homepage invariants reproducibly verifiable.
- Provide a deployment path that works in each production repository without hard-coding the bakery domain into shared automation.
- Preserve the existing Mailchimp popup through its small account-specific loader without adding locally maintained popup behavior.

**Non-Goals:**

- Redesigning the homepage, rewriting approved marketing copy, or adding routes, content collections, a CMS, locally implemented forms, analytics, or client-side interactivity beyond the existing Mailchimp popup.
- Downloading or replacing the externally hosted USDA Organic seal as part of this migration.
- Combining the two production repositories or automating cross-repository synchronization.
- Introducing a general component library or design system for a single-page site.

## Decisions

### Use Astro's static output with no deployment adapter

The project will use Astro's default static generation and emit `dist/`. GitHub Pages only needs the resulting files, so an adapter or server runtime would add operational complexity without improving the current site.

Alternative considered: keep the root HTML file and use Astro only as a pass-through build tool. That would technically add a build but retain the monolithic authoring problem and provide little value.

### Preserve the Mailchimp connected-site loader in the base layout

Keep the existing inline bootstrap snippet, including its account-specific `chimpstatic.com` URL, in the document head. Astro emits it unchanged, and the remotely loaded Mailchimp script continues to own popup timing, targeting, dismissal, and display. No local popup component or additional package is introduced.

Alternative considered: omit the loader because the visible page itself is static. That breaks an existing visitor interaction. Reimplementing the popup locally was also rejected because it would duplicate remotely configured Mailchimp behavior and require more JavaScript maintenance.

### Keep a small, explicit source structure

Use `src/pages/index.astro` for the root page, a small base layout for shared document metadata, focused hero/footer components where they clarify distinct regions, and a global stylesheet for the existing responsive visual system. Content that is unique to the homepage remains close to the page instead of being abstracted into data models.

Alternative considered: migrate all markup into one `.astro` file. It is the shortest conversion, but it leaves document structure, page content, and several hundred lines of styling coupled in one place. A larger component system was also rejected because the repository has only one route and no established reuse pressure.

### Serve stable files from `public/`

Move or copy the favicon, logo, farm background, and `CNAME` into `public/` so Astro copies them verbatim to the production root. Use clean URL-safe filenames for image references while retaining the original image content. Keep the USDA seal as an external image because the current site intentionally uses the official USDA-hosted asset and the migration is not an asset-provenance change.

Alternative considered: import every image through Astro's asset pipeline. That can optimize images, but it would generate transformed filenames and dimensions that complicate a behavior-preserving migration and the focused output checks.

### Verify the built artifact with lightweight automated checks

Add a focused test using the Node.js test runner after `astro build`. It will inspect `dist/index.html`, assert critical content, metadata, links, and security attributes, and verify that referenced public files plus `dist/CNAME` exist. This validates what GitHub Pages actually receives without bringing in a browser-test framework for a static one-page migration.

Visual verification will complement the automated checks at representative desktop and mobile viewport widths to catch layout regressions and horizontal overflow.

Alternative considered: test only Astro source files. Source assertions can pass while asset copying or generated markup is broken, so built-output verification offers better coverage. A full end-to-end framework is unnecessary for the page's current behavior.

### Deploy generated output while treating `CNAME` as destination-owned

Document `npm ci`, development, build, test, and publishing commands. Any GitHub Pages workflow added during implementation will build and publish `dist/`; it will read the `CNAME` present in that repository rather than generate a domain in configuration. Cross-repository sync instructions will continue to treat `public/CNAME` as destination-specific and exclude it when applying shared content to the other production repository.

Alternative considered: configure Astro with a single canonical `site` domain. Because the same content serves two domains, a shared hard-coded value risks publishing incorrect canonical/domain output. No current feature requires a canonical site URL, so the domain remains an output file concern.

### Use the repository lockfile as the dependency contract

Commit Astro and the minimal supporting packages through the repository's package manifest and npm lockfile. Automation and documentation will use `npm ci` so local and deployment installs resolve the same dependency graph.

Alternative considered: leave dependency versions unlocked. That makes a clean checkout less reproducible and can produce deployment-only failures after upstream releases.

## Risks / Trade-offs

- [GitHub Pages continues serving the repository root instead of `dist/`] → Update and document the Pages publishing workflow before removing the legacy root entrypoint, and verify the deployed artifact configuration.
- [Shared pushes overwrite the farm domain with the bakery `CNAME`] → Keep `public/CNAME` destination-owned, document its exclusion from cross-repository sync, and assert the active value in each build.
- [The Astro rewrite introduces subtle visual drift] → Port markup and CSS with minimal intentional changes, then compare desktop and mobile renders against the existing page.
- [A URL-safe asset rename leaves stale references] → Verify every generated local asset reference resolves within `dist/`.
- [The external USDA seal is unavailable] → Retain meaningful certification text so the information remains present; vendoring the seal can be evaluated separately if reliability becomes a requirement.
- [Mailchimp is blocked, unavailable, or suppresses the popup for a returning visitor] → Keep the integration isolated to its original loader, verify that the configured script is requested, and use Mailchimp's audience/display settings when diagnosing visitor-specific display behavior.
- [A build step increases maintenance overhead] → Keep dependencies and scripts minimal, commit the lockfile, and document the four core commands.

## Migration Plan

1. Capture the current homepage's critical content, URLs, metadata, asset paths, and representative desktop/mobile appearance as the migration baseline.
2. Scaffold the minimal Astro project, locked dependencies, source directories, public assets, and ignore rules.
3. Port the document shell, homepage regions, and CSS without intentional content or visual redesign.
4. Add built-output checks and run the production build, automated verification, and representative visual review.
5. Update repository documentation and configure the publishing process to deploy `dist/`, preserving the active repository's `public/CNAME`.
6. Remove the legacy root `index.html` only after the Astro build is the verified source of the equivalent generated page.
7. Apply shared changes to each production repository while preserving that destination's `public/CNAME`, then smoke-test both custom domains.

Rollback: restore the previous root static files and previous GitHub Pages source configuration. Because the migration does not change external data or APIs, rollback requires only reverting repository and deployment configuration changes.
