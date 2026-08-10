## Purpose

Define the observable homepage experience and deployable static output that must remain reliable while the site is authored and built with Astro.

## ADDED Requirements

### Requirement: Static root homepage
The system SHALL generate a complete homepage at `/` that can be served from static hosting without an application server or browser-side JavaScript.

#### Scenario: Generate the production homepage
- **WHEN** the production site build completes successfully
- **THEN** the output contains an `index.html` document for the root URL
- **AND** the document does not require a server runtime or client-side JavaScript to render its current content

### Requirement: Preserve the branded visitor experience
The generated homepage SHALL preserve the Bold Love Farm & Bakery page title, introductory farm-and-bakery content, black-and-gold visual identity, responsive layout, logo, local community statement, and USDA Organic certification information.

#### Scenario: View the homepage on a desktop viewport
- **WHEN** a visitor opens the generated root homepage on a desktop-sized viewport
- **THEN** the page presents the brand introduction, logo, primary shop call to action, supporting content, and footer in the established black-and-gold design

#### Scenario: View the homepage on a narrow viewport
- **WHEN** a visitor opens the generated root homepage on a narrow mobile viewport
- **THEN** the content remains readable without horizontal overflow
- **AND** the primary shop action and footer information remain visible and usable

### Requirement: Preserve shopping navigation
The homepage SHALL provide prominent shopping links to `https://grownby.com/farms/bold-love-farm-bakery/shop`, and external links opened in a new browsing context SHALL prevent the opened page from accessing the originating page.

#### Scenario: Follow the primary shop action
- **WHEN** a visitor activates the primary shop call to action
- **THEN** the browser navigates to the Bold Love GrownBy shop URL

#### Scenario: Inspect an external new-tab shop link
- **WHEN** a generated shop link is configured to open in a new browsing context
- **THEN** the link includes protections equivalent to `noopener noreferrer`

### Requirement: Publish required assets and metadata
The production output SHALL include the local logo, farm background, favicon, document language, responsive viewport metadata, descriptive page title, and meaningful alternative text required by the homepage.

#### Scenario: Serve generated local assets
- **WHEN** the generated homepage requests its logo, farm background, or favicon
- **THEN** each referenced local asset exists at the corresponding path in the production output

#### Scenario: Inspect document metadata and semantics
- **WHEN** the generated homepage document is inspected
- **THEN** it declares English as the document language
- **AND** it includes responsive viewport metadata and the Bold Love Farm & Bakery title
- **AND** informative images have meaningful alternative text
- **AND** the page has a single primary heading

### Requirement: Preserve custom-domain identity
The production output SHALL contain the repository's current `CNAME` value unchanged, and the documented cross-repository publishing workflow MUST preserve the destination production repository's domain-specific value.

#### Scenario: Build the bakery repository
- **WHEN** a production build runs with `CNAME` set to `boldlovebakery.com`
- **THEN** the generated output contains a `CNAME` file whose content is exactly `boldlovebakery.com`

#### Scenario: Publish shared content to the farm repository
- **WHEN** shared site changes are published to the farm production repository
- **THEN** the farm repository's domain-specific `CNAME` is retained instead of being replaced by the bakery domain

### Requirement: Reproducible project workflow
The repository SHALL provide documented commands that install locked dependencies, run a local development server, create a production build, and execute focused verification of the generated site.

#### Scenario: Build from a clean checkout
- **WHEN** a maintainer installs dependencies from the committed lockfile and runs the documented production build command
- **THEN** the command completes successfully and creates the static production output

#### Scenario: Verify critical generated behavior
- **WHEN** a maintainer runs the documented verification command
- **THEN** it checks the generated homepage, critical metadata and content, shopping destination, required local assets, and `CNAME` output

