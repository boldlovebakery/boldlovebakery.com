# boldlovebakery.com

This repository is the canonical source for the shared Bold Love website content used for both `boldloveBAKERY.com` and `boldloveFARM.com`.

The working assumption is:

- This repo is where the site content is edited first.
- `boldloveBAKERY.com` is deployed from the `boldloveBAKERY.com-production` remote.
- `boldloveFARM.com` is deployed from the `boldloveFARM.com-production` remote.

## Canonical Content

The HTML, images, favicon, and other shared site assets are maintained here and may be pushed to either production repository when the two sites should show the same content.

## Important: Preserve Each Repo's `CNAME`

GitHub Pages uses the `CNAME` file in each repository to decide which custom domain that repository serves.

In this repository, the checked-in `CNAME` is:

    boldlovebakery.com

That is correct for the bakery repository, but it must not be blindly copied into the farm repository if the farm repository has its own domain-specific `CNAME`.

When pushing this shared site to `boldloveFARM.com`, preserve the farm repository's own `CNAME` file so GitHub Pages continues serving the farm domain correctly. Likewise, when pushing to `boldloveBAKERY.com`, preserve the bakery repository's `CNAME`.

In practice, this means:

- Do not assume the two repositories should have identical `CNAME` contents.
- Do not force-push one repository over the other without checking the destination repository's `CNAME`.
- If you sync content between the two repositories, handle `CNAME` as a repository-specific file rather than shared content.

## Remotes

This repository currently uses:

- `boldloveBAKERY.com-production` -> `https://github.com/boldlovebakery/boldlovebakery.com.git`
- `boldloveFARM.com-production` -> `https://github.com/boldlovebakery/boldlovefarm.com.git`

## Deployment Notes

For bakery deployment, push the shared site content to `boldloveBAKERY.com-production`.

For farm deployment, push the same shared site content to `boldloveFARM.com-production`, but do so in a way that preserves the farm repository's unique `CNAME` file.

If you are doing a manual cross-repo sync or force-push, verify the destination repository's `CNAME` before pushing.
