import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// UnderLimit's pages moved to https://www.scotthazlitt.ai/apps/underlimit on 2 October 2026.
// Each old page must forward there, so App Store links and bookmarks keep working.
const pages = {
  "index.html": "https://www.scotthazlitt.ai/apps/underlimit",
  "privacy.html": "https://www.scotthazlitt.ai/apps/underlimit/privacy",
  "support.html": "https://www.scotthazlitt.ai/apps/underlimit/support",
};

for (const [file, target] of Object.entries(pages)) {
  test(`${file} forwards to ${target}`, async () => {
    const html = await readFile(new URL(`../docs/${file}`, import.meta.url), "utf8");
    assert.match(html, new RegExp(`<link rel="canonical" href="${target}">`));
    assert.match(html, new RegExp(`<meta http-equiv="refresh" content="0; url=${target}">`));
    assert.match(html, new RegExp(`location\\.replace\\("${target}" \\+ location\\.hash\\)`));
    assert.match(html, new RegExp(`<a href="${target}">`));
  });
}
