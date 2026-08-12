## Context

See `proposal.md` for motivation. The current homepage uses a compact two-column hero: short eyebrow and copy on the left, logo and a partner note on the right, followed by the footer. The requested replacement copy is substantially longer and contains three separate selling points. Keeping it inside the current left column without changing the hierarchy would make the page dense, while styling the full product summary as the existing uppercase pill would make it difficult to scan.

The implementation must stay within the existing Astro template and CSS approach, preserve the current integrations and calls to action, and avoid new dependencies or client-side behavior.

## Goals / Non-Goals

**Goals:**

- Give the product summary immediate prominence without competing visually with the business name.
- Make the three supporting ideas individually skimmable through semantic paragraphs, spacing, and restrained emphasis.
- Keep the store action high in the reading order and preserve the existing desktop/mobile brand composition.
- Remove content repetition introduced by the expanded local-partner paragraph.

**Non-Goals:**

- Redesigning the brand system, changing the logo or background, or introducing new imagery.
- Rewriting the user-provided message beyond punctuation or markup required to render it faithfully.
- Changing the footer, shop URL, Mailchimp behavior, deployment, or project architecture.
- Adding cards, animation, JavaScript, or a generalized content/component system.

## Decisions

### Treat the longer product line as an offer summary, not an eyebrow

Keep the product line near the top of the hero but render it in sentence case with restrained emphasis and enough line height to wrap naturally. The business name remains the sole `h1`; the offer summary is supporting text rather than a second heading.

Alternative considered: replace the text inside the existing uppercase pill without changing its styling. A sentence this long would create a large capsule and excessive letter spacing, weakening rather than improving skim value.

### Give the three-part story its own full-width content region

Keep the title, offer summary, CTA, and logo in the top composition. Place the three requested paragraphs in a separate story block below that composition and above the footer, using whitespace and modest typographic emphasis on the opening questions. This gives the longer copy adequate measure on desktop and a straightforward single-column flow on mobile.

Alternative considered: leave all three paragraphs in the existing left hero column. That would create an imbalanced tall text column beside the logo and bury the store action in a dense block.

### Remove the existing partner note from the logo column

The current note says that the weekly shop includes goods shared from local partners. The new third paragraph provides a more specific and compelling version of the same message, including the nine-partner count and community benefit, so retaining both would be repetitive. The logo remains the sole right-column element.

Alternative considered: retain or rewrite both partner messages. That adds clutter and forces visitors to reconcile two versions of the same idea.

### Preserve exact approved messaging in semantic markup

Represent the story as three actual paragraphs, not line breaks inside one paragraph. Preserve the supplied wording, including the numeral `9`, while allowing `<strong>` or an equivalent inline element around the two opening questions if visual review confirms that it improves skimming.

Alternative considered: shorten or paraphrase the supplied copy. The user has already provided final message content, so implementation should solve layout rather than edit their voice.

## Risks / Trade-offs

- [The longer copy pushes key content too far down the page] → Keep the CTA in the top composition, use a readable but compact measure, and avoid decorative containers that add unnecessary height.
- [The offer summary competes with the `h1`] → Use a smaller sans-serif size and restrained weight rather than headline-scale typography.
- [The story becomes a wall of text on mobile] → Preserve three paragraphs, comfortable spacing, and concise emphasis while checking a representative narrow viewport.
- [Removing the partner note leaves the logo column visually sparse] → Center the logo within its column and evaluate the balance at the current desktop breakpoint rather than adding replacement decoration.

## Migration Plan

1. Capture the current desktop and mobile homepage as a visual baseline.
2. Update the Astro homepage markup with the approved summary and three semantic story paragraphs, removing the old lede and redundant partner note.
3. Refine only the relevant hero and story CSS for readable measure, hierarchy, spacing, and responsive flow.
4. Update generated-output checks for the new text and absence of superseded copy.
5. Run the production build and automated tests, then compare desktop and mobile renders for hierarchy, overflow, and CTA visibility.

Rollback: restore the previous homepage markup, CSS rules, and text assertions. No data, integration, or deployment migration is involved.
