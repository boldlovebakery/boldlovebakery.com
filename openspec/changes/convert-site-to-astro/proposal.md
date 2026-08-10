## Why

The site is currently maintained as one large root-level HTML file with no reusable structure or build-time validation. Moving it to Astro will preserve the lightweight static experience while making the page easier to maintain, extend, and deploy consistently.

## What Changes

- Add an Astro project and production build that emits a fully static site suitable for GitHub Pages.
- Recreate the existing homepage as Astro source while preserving its content, responsive black-and-gold design, accessibility semantics, store links, favicon, and image assets.
- Organize shared page structure and styles so future content changes do not require editing one monolithic HTML document.
- Keep the canonical site at the root URL with no client-side JavaScript required for the current experience.
- Add focused checks for the generated homepage, critical links, metadata, asset references, and domain file handling.
- Document local development and the build/deployment workflow for both production repositories.
- **BREAKING**: deployment must publish Astro's generated `dist/` output rather than serving the repository root directly, and homepage edits move from root `index.html` into Astro source files.

## Capabilities

### New Capabilities

- `astro-static-site`: Defines the Astro-authored, statically generated homepage, its preserved visitor experience, required assets and links, and GitHub Pages-ready output.

### Modified Capabilities

None. The repository has no existing OpenSpec capabilities.

## Impact

- Replaces the root-only static authoring model with Astro source, configuration, package scripts, and generated output.
- Affects `index.html`, local image and favicon placement, CSS organization, README deployment instructions, and any GitHub Pages publishing process.
- Introduces Node.js/Astro development dependencies and a lockfile.
- Preserves the external GrownBy shop destination and USDA seal dependency.
- Requires each production repository to retain its own custom-domain `CNAME` value when building or synchronizing deployable output.
