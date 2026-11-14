# site-blog Specification

## Purpose

Define a repository-authored, statically generated blog that shares Bold Love's site experience, publishes discoverable stories, and preserves a simple GitHub Pages workflow.

## Requirements

### Requirement: Publish a static blog
The system SHALL generate a blog index at `/blog/` and a stable page at `/blog/<slug>/` for every published Markdown post, and SHALL render the index and article content without an application server or client-side rendering.

#### Scenario: Build the blog index
- **WHEN** the production site build completes successfully
- **THEN** the output contains an HTML document for `/blog/`
- **AND** the document contains the available published-post summaries as static content

#### Scenario: Build a published article
- **WHEN** the blog collection contains a published post with a valid slug
- **THEN** the production output contains an HTML document at `/blog/<slug>/`
- **AND** the document contains that post's article body as static content

### Requirement: Validate repository-authored posts
Each blog post MUST declare a title, description, publication date, and explicit draft state. A post MAY declare an updated date and feature image, but a declared feature image MUST include meaningful alternative text. The production build SHALL fail with an actionable validation error when required post metadata is absent or invalid.

#### Scenario: Build a valid post
- **WHEN** a Markdown post supplies all required metadata in valid formats
- **THEN** the post is accepted into the blog collection
- **AND** its metadata is available to the generated index, article, and feed

#### Scenario: Reject invalid metadata
- **WHEN** a Markdown post omits required metadata or supplies an invalid value
- **THEN** the production build fails
- **AND** the validation output identifies the affected entry and invalid field

#### Scenario: Require accessible feature-image text
- **WHEN** a post declares a feature image without corresponding alternative text
- **THEN** the production build rejects the post metadata

### Requirement: Keep draft posts private
Posts marked as drafts MUST be excluded from production-facing discovery and publication surfaces while remaining previewable during local development with an explicit draft indication.

#### Scenario: Build with a draft post
- **WHEN** the blog collection contains a post whose draft state is true
- **THEN** the post does not appear on the blog index
- **AND** no public article route is generated for it
- **AND** it does not appear in the RSS feed

#### Scenario: Preview a draft locally
- **WHEN** a maintainer runs the local development server with a valid draft post
- **THEN** the draft article can be opened for review
- **AND** its draft state is clearly visible in the local presentation

### Requirement: Present the blog index and articles
The blog index SHALL order published posts from newest to oldest and present each post's title, description, publication date, and optional feature image as a link to the article. Each article SHALL present one primary heading, its publication date, an updated date when supplied, the complete post body, a way back to the blog index, and the shared site header and footer. Articles SHALL show a prominent online-store action and the footer shop link by default, but a post MAY set `showShopLink: false` in its frontmatter to omit both links on that article. When there are no published posts, the index SHALL present an intentional empty state instead of a blank or broken listing.

#### Scenario: Browse published posts
- **WHEN** a visitor opens `/blog/` with multiple published posts available
- **THEN** the newest post is presented first
- **AND** every summary links to its corresponding article

#### Scenario: Read an article
- **WHEN** a visitor opens a generated blog article without `showShopLink: false`
- **THEN** the article title, date, body, shared navigation, footer, blog-index link, and online-store action are visible and usable

#### Scenario: Omit shop links from an individual article
- **WHEN** a visitor opens a generated blog article whose frontmatter sets `showShopLink: false`
- **THEN** the article's online-store action and footer shop link are omitted
- **AND** the article body, shared navigation, footer, and blog-index links remain available
- **AND** shop links on other pages are unaffected

#### Scenario: View the empty blog
- **WHEN** a visitor opens `/blog/` before any posts are published
- **THEN** the page explains that no stories are currently published
- **AND** the rest of the shared page experience remains complete

### Requirement: Integrate blog navigation
The shared primary navigation SHALL omit the Blog link while no posts are published and SHALL provide a clearly labeled Blog link to `/blog/` once at least one post is published. When the link is present, blog index and article pages SHALL identify Blog as the current section without relying on color alone. Draft posts MUST NOT make the navigation link visible.

#### Scenario: Keep an unpublished blog out of shared navigation
- **WHEN** no blog posts are published
- **THEN** shared primary navigation does not show a Blog link
- **AND** a local draft does not change that navigation state

#### Scenario: Discover the blog after publication
- **WHEN** at least one blog post is published
- **THEN** shared primary navigation provides a visible Blog link to `/blog/`

#### Scenario: Identify the blog section
- **WHEN** a visitor is on the blog index or a blog article while the Blog navigation item is available
- **THEN** the Blog navigation item is visibly distinguished
- **AND** the current-section state is exposed semantically

### Requirement: Publish blog discovery metadata and RSS
The blog index and each article SHALL include descriptive document metadata suitable for search and social sharing. The system SHALL publish an RSS feed at `/rss.xml` containing published posts ordered from newest to oldest and SHALL advertise that feed through document metadata.

#### Scenario: Inspect article metadata
- **WHEN** a generated article document is inspected
- **THEN** it contains a page-specific title and description
- **AND** it identifies itself as an article for social-sharing metadata
- **AND** it includes the optional feature image in social metadata when one is supplied

#### Scenario: Subscribe to the RSS feed
- **WHEN** a feed reader requests `/rss.xml`
- **THEN** it receives valid RSS containing each published post's title, description, publication date, and canonical article URL
- **AND** no draft post is included

#### Scenario: Discover the RSS feed
- **WHEN** a generated HTML page is inspected
- **THEN** its document metadata advertises `/rss.xml` as the site's RSS feed

### Requirement: Use the farm domain as the canonical origin
Every generated HTML page SHALL declare an absolute canonical URL on `https://boldlovefarm.com` using that page's public path, and generated feed URLs SHALL use the same origin. Pages temporarily served from `boldlovebakery.com` SHALL still identify the matching `boldlovefarm.com` URL as canonical; this change SHALL NOT require an HTTP redirect between the domains.

#### Scenario: Inspect a page on the farm domain
- **WHEN** a generated page at a public path is inspected
- **THEN** its canonical URL is `https://boldlovefarm.com` followed by that path

#### Scenario: Inspect identical content on the bakery domain
- **WHEN** the shared build is served from `boldlovebakery.com`
- **THEN** the page still declares the corresponding `https://boldlovefarm.com` URL as canonical

#### Scenario: Inspect a feed item
- **WHEN** an RSS item references a blog article
- **THEN** its absolute article URL uses `https://boldlovefarm.com`

### Requirement: Preserve branded and accessible presentation
The blog index and articles SHALL extend the established Bold Love black-and-gold visual identity, use logical heading hierarchy, keep content and controls readable without horizontal overflow on narrow viewports, expose visible keyboard focus for interactive elements, and provide meaningful alternative text for informative images.

#### Scenario: View the blog on a desktop viewport
- **WHEN** a visitor opens the blog index or an article on a desktop-sized viewport
- **THEN** the page presents its content, navigation, actions, and footer in a coherent Bold Love design

#### Scenario: View the blog on a narrow viewport
- **WHEN** a visitor opens the blog index or an article on a narrow mobile viewport
- **THEN** navigation, headings, metadata, images, article text, and actions remain readable and usable without horizontal overflow

#### Scenario: Navigate the blog with a keyboard
- **WHEN** a keyboard user moves through blog links and actions
- **THEN** each focused interactive element has a visible focus indicator

### Requirement: Document the publishing workflow
The repository documentation SHALL explain how a maintainer creates a post, supplies required metadata and images, keeps work in draft, previews the blog locally, verifies the production build, and publishes through the existing GitHub Pages workflow.

#### Scenario: Prepare a new post
- **WHEN** a maintainer follows the documented authoring instructions
- **THEN** they can create a valid Markdown draft and preview it locally without a separate CMS

#### Scenario: Publish a completed post
- **WHEN** a maintainer marks a valid post as published and follows the documented verification and deployment commands
- **THEN** the next production build includes the post on the index, at its article route, and in the RSS feed

