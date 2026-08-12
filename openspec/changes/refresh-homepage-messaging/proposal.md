## Why

The homepage copy understates the breadth of Bold Love's offering and repeats similar product language without giving skimmers a strong reason to keep reading. Refreshing the message will better communicate organic produce, prepared and baked foods, and the value of supporting nine local partner businesses while keeping the page clean and approachable.

## What Changes

- Replace the short “Fresh Local Food, Every Week” eyebrow with a fuller product summary covering organic fruits and vegetables, prepared foods, sourdough breads, baked goods, and products from local partners.
- Remove the redundant seasonal-produce introductory sentence beneath the page title.
- Replace the current organic/local support paragraph with three short sections that address freshness and taste, explain the farm's baking and cooking, and highlight products from nine other local farms and producers.
- Remove or consolidate the existing local-partner note where the new partner section makes it repetitive.
- Refine spacing, typography, or content grouping as needed so the longer message remains clean, uncluttered, responsive, and easy for skimmers to understand.
- Preserve the existing brand identity, logo, primary shop action, footer, USDA certification content, Mailchimp popup integration, and external destinations.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `astro-static-site`: Update the branded homepage experience requirement to define the new product and local-partner messaging and its skimmable presentation.

## Impact

- Affects the homepage template in `src/pages/index.astro` and likely the associated rules in `src/styles/global.css`.
- Requires generated-output assertions to reflect the new text and verify removal of the superseded copy.
- Does not add routes, dependencies, application JavaScript, integrations, or deployment changes.
