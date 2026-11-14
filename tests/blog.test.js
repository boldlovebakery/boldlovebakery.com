import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url).pathname;

test("all public pages advertise canonical farm URLs and RSS", async () => {
  for (const route of ["", "about/", "contact/", "products/", "blog/"]) {
    const html = await readFile(path.join(root, "dist", route, "index.html"), "utf8");
    assert.ok(html.includes(`rel="canonical" href="https://boldlovefarm.com/${route}"`));
    assert.match(html, /type="application\/rss\+xml"[^>]+href="https:\/\/boldlovefarm.com\/rss.xml"/);
    assert.doesNotMatch(html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] || "", /href="\/blog\/"/);
  }
  const blog = await readFile(path.join(root, "dist/blog/index.html"), "utf8");
  assert.ok(!blog.includes("Your next story"));
  assert.ok(!(await readdir(path.join(root, "dist/blog"))).includes("draft-template"));
  const feed = await readFile(path.join(root, "dist/rss.xml"), "utf8");
  assert.match(feed, /<rss version="2.0"/);
  assert.ok(!feed.includes("draft-template"));
});

test("published articles, images, ordering, and invalid metadata survive real builds", async () => {
  // Build an isolated copy so test posts never enter the real site's output or source.
  const directory = await mkdtemp(path.join(tmpdir(), "boldlove-blog-test-"));
  const build = () => execFileSync(process.execPath, [path.join(root, "node_modules/astro/bin/astro.mjs"), "build"], {
    cwd: directory, encoding: "utf8", env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" }, stdio: "pipe",
  });
  try {
    for (const file of ["src", "public", "package.json", "astro.config.mjs"]) {
      await cp(path.join(root, file), path.join(directory, file), { recursive: true });
    }
    await symlink(path.join(root, "node_modules"), path.join(directory, "node_modules"), "dir");
    await mkdir(path.join(directory, "src/assets/blog"), { recursive: true });
    await cp(path.join(root, "public/bold-love-logo.png"), path.join(directory, "src/assets/blog/test.png"));
    const posts = path.join(directory, "src/content/blog");
    const frontmatter = (title, date) => `---\ntitle: "${title}"\ndescription: "A test story & details"\npublishDate: ${date}\ndraft: false\n`;
    const imageFields = "featureImage: ../../assets/blog/test.png\nfeatureImageAlt: Bold Love logo\n";
    await writeFile(path.join(posts, "test-new.md"), frontmatter("New story", "2026-09-18") + imageFields + "updatedDate: 2026-09-19\n---\n\n## Test heading\n\nA complete article body.\n");
    build();
    // The first published post enables Blog everywhere; drafts alone do not.
    for (const route of ["", "about/", "contact/", "products/", "blog/", "blog/test-new/"]) {
      const page = await readFile(path.join(directory, "dist", route, "index.html"), "utf8");
      const navigation = page.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] || "";
      assert.match(navigation, /href="\/blog\/"/);
      if (route.startsWith("blog/")) assert.match(navigation, /href="\/blog\/" aria-current="page"/);
    }
    await writeFile(path.join(posts, "test-old.md"), frontmatter("Older story", "2026-09-17") + "showShopLink: false\n---\n\nEarlier article.\n");
    build();
    const html = await readFile(path.join(directory, "dist/blog/test-new/index.html"), "utf8");
    assert.match(html, /A complete article body/);
    assert.match(html, /September 18, 2026/);
    assert.match(html, /September 19, 2026/);
    assert.match(html, /property="og:type" content="article"/);
    assert.match(html, /property="og:image" content="https:\/\/boldlovefarm.com\/_astro\//);
    assert.match(html, /alt="Bold Love logo"/);
    assert.match(html, /href="https:\/\/grownby.com\/farms\/bold-love-farm-bakery\/shop" target="_blank" rel="noopener noreferrer"/);
    assert.equal((html.match(/Shop Bold Love Online/g) || []).length, 2);
    const withoutShop = await readFile(path.join(directory, "dist/blog/test-old/index.html"), "utf8");
    assert.doesNotMatch(withoutShop, /Shop Bold Love Online|https:\/\/grownby.com\/farms\/bold-love-farm-bakery\/shop/);
    assert.match(withoutShop, /More from the blog/);
    assert.match(withoutShop, /aria-label="Site footer"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    for (const file of ["blog/index.html", "rss.xml"]) {
      const result = await readFile(path.join(directory, "dist", file), "utf8");
      assert.ok(result.indexOf("New story") < result.indexOf("Older story"));
      assert.ok(!result.includes("draft-template"));
    }
    const feed = await readFile(path.join(directory, "dist/rss.xml"), "utf8");
    assert.match(feed, /https:\/\/boldlovefarm.com\/blog\/test-new\//);
    assert.match(feed, /A test story &amp; details/);

    await writeFile(path.join(posts, "invalid.md"), frontmatter("Missing alt", "2026-09-18") + "featureImage: ../../assets/blog/test.png\n---\nInvalid image.\n");
    assert.throws(build, (error) => /featureImageAlt/.test(error.stdout + error.stderr));
    await writeFile(path.join(posts, "invalid.md"), "---\ntitle: Missing fields\ndraft: true\n---\nInvalid metadata.\n");
    assert.throws(build, (error) => /description/.test(error.stdout + error.stderr));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
