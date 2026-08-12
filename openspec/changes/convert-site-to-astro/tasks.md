## 1. Establish the Astro Project

- [x] 1.1 Capture the current homepage's critical copy, links, metadata, external resources, and representative desktop/mobile appearance as the migration baseline.
- [x] 1.2 Add the minimal Astro package manifest, npm lockfile, static-output configuration, and TypeScript configuration needed for reproducible local and CI builds.
- [x] 1.3 Add ignore rules for dependencies, generated `dist/` output, and other local Astro artifacts without disturbing existing repository files.

## 2. Port the Homepage

- [x] 2.1 Place the favicon, logo, farm background, and bakery `CNAME` in `public/` with stable URL-safe asset paths, and verify their contents are preserved.
- [x] 2.2 Create a base Astro layout that emits the current language, title, viewport, favicon, and required head resources without introducing a server runtime.
- [x] 2.3 Port the branded hero, approved copy, logo treatment, primary GrownBy shop action, and supporting farm-and-bakery content into focused Astro page/component source.
- [x] 2.4 Port the footer, secondary shop action, Mount Airy community statement, and USDA Organic certification content while preserving secure external-link behavior.
- [x] 2.5 Move the black-and-gold visual system and responsive rules into maintainable global styling, retaining keyboard focus states and narrow-viewport behavior.
- [x] 2.6 Compose `src/pages/index.astro` as the root route and remove the legacy root `index.html` only after an equivalent generated homepage is confirmed.

## 3. Verify Generated Behavior

- [x] 3.1 Add a focused Node.js built-output test for `dist/index.html`, critical content and metadata, the GrownBy destination, new-tab protections, local asset existence, and exact `CNAME` copying.
- [x] 3.2 Install from the committed lockfile and run the production build plus automated verification from a clean dependency state.
- [x] 3.3 Serve the generated `dist/` directory and verify that the homepage and all local asset requests return successfully.
- [x] 3.4 Compare generated desktop and mobile renders with the migration baseline, confirm there is no horizontal overflow, and correct any unintended visual or accessibility regressions.

## 4. Document and Prepare Deployment

- [x] 4.1 Update the README with prerequisites and the locked install, development, production build, verification, and generated-output serving commands.
- [x] 4.2 Add or update the GitHub Pages workflow so it builds the project and publishes `dist/` as the Pages artifact without hard-coding either custom domain.
- [x] 4.3 Document the two-production-repository publishing process, including how shared content is synchronized while each destination's `public/CNAME` remains unchanged.
- [x] 4.4 Review the final repository for stale root-static instructions or asset references and run the full documented verification workflow once more.

## 5. Restore Popup Integration

- [x] 5.1 Restore the existing Mailchimp connected-site loader in the Astro document layout without adding a local JavaScript dependency.
- [x] 5.2 Update the generated-output checks and project documentation to preserve the popup integration.
- [x] 5.3 Build the site, verify the configured Mailchimp endpoint serves JavaScript, and document the browser check for visitor-specific popup display rules.
