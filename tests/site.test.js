import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const shopUrl = "https://grownby.com/farms/bold-love-farm-bakery/shop";
const outputDirectory = new URL("../dist/", import.meta.url);
const homepage = await readFile(new URL("index.html", outputDirectory), "utf8");

test("the generated homepage has the required document metadata", () => {
  assert.match(homepage, /<!DOCTYPE html>/i);
  assert.match(homepage, /<html lang="en">/);
  assert.match(homepage, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(homepage, /<title>Bold Love Farm &amp; Bakery<\/title>/);
  assert.equal((homepage.match(/<h1\b/g) || []).length, 1);
});

test("the generated homepage includes the existing Mailchimp popup loader", () => {
  assert.equal((homepage.match(/<script\b/g) || []).length, 1);
  assert.match(homepage, /<script id="mcjs">/);
  assert.match(
    homepage,
    /https:\/\/chimpstatic\.com\/mcjs-connected\/js\/users\/c1e0805d9318df47dc11e74a1\/121b62670c533dbcbe2fbe33f\.js/,
  );
});

test("the generated homepage preserves its critical content", () => {
  const requiredContent = [
    "Fresh Local Food, Every Week",
    "Seasonal produce, breads, pastries, and prepared foods",
    "USDA-certified organic",
    "The weekly shop brings together what we grow",
    "USDA Certified Organic",
    "Mount Airy, Maryland community",
  ];

  for (const content of requiredContent) {
    assert.ok(homepage.includes(content), `Expected generated homepage to include: ${content}`);
  }
});

test("both shop links use the correct destination and new-tab protections", () => {
  const shopLinks = homepage.match(new RegExp(`<a[^>]+href="${shopUrl}"[^>]*>`, "g")) || [];

  assert.equal(shopLinks.length, 2);
  for (const link of shopLinks) {
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="noopener noreferrer"/);
  }
});

test("all required local assets are included in the generated site", async () => {
  const assetPaths = ["favicon.ico", "bold-love-logo.png", "farm-background.png"];

  for (const assetPath of assetPaths) {
    assert.ok(homepage.includes(`/${assetPath}`) || assetPath === "farm-background.png");
    assert.ok((await stat(new URL(assetPath, outputDirectory))).isFile());
  }

  const stylesheetPath = homepage.match(/href="(\/_astro\/[^\"]+\.css)"/)?.[1];
  assert.ok(stylesheetPath, "Expected the generated homepage to reference its stylesheet");

  const stylesheet = await readFile(new URL(stylesheetPath.slice(1), outputDirectory), "utf8");
  assert.ok(stylesheet.includes("/farm-background.png"));
});

test("the custom domain is copied exactly", async () => {
  const sourceDomain = await readFile(new URL("../public/CNAME", import.meta.url), "utf8");
  const customDomain = await readFile(new URL("CNAME", outputDirectory), "utf8");
  assert.equal(customDomain, sourceDomain);
});
