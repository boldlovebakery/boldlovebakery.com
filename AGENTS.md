## Maintainer constraints

The site owner is an experienced Ruby/Rails developer but has limited
JavaScript and TypeScript experience.

Write code for human maintainability, not maximal abstraction.

- Prefer HTML, Astro templates, Markdown, and CSS.
- Use the smallest amount of JavaScript necessary.
- Avoid advanced TypeScript features.
- Do not introduce generics, decorators, complex mapped types, or elaborate
  type-level abstractions.
- Prefer explicit code over clever reusable abstractions.
- Do not add frontend frameworks such as React, Vue, or Svelte.
- Do not add a dependency when a small local implementation is reasonable.
- Explain non-obvious JavaScript or TypeScript in comments.
- Keep build and deployment commands simple.
