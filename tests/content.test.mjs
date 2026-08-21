import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readPage = (name) => readFile(new URL(`../docs/${name}`, import.meta.url), "utf8");

test("support page describes the public UnderLimit 1.3 workflows and separate limits", async () => {
  const html = await readPage("support.html");

  assert.match(html, /UnderLimit 1\.3/);
  assert.match(html, /batch compression accepts 2–10 images/i);
  assert.match(html, /limits applied separately to each image/i);
  assert.match(html, /verified batch results remain available if another image fails/i);
  assert.match(html, /new sRGB JPEG/i);
  assert.match(html, /transparent backgrounds become white/i);
  assert.match(html, /metadata, including GPS, is not retained/i);
  assert.match(html, /one supported, unencrypted, unsigned PDF up to 100 pages and 100 MB/i);
  assert.match(html, /combines 2–10 supported PDFs/);
  assert.match(html, /50 total pages and 100 MB of source data/);
  assert.match(html, /supported page content and HTTP or HTTPS links are preserved/i);
  assert.match(html, /flattened visual PDF/);
  assert.match(html, /removes searchable text, links, forms, annotations and other interactive behaviour/i);
  assert.match(html, /image-heavy PDFs may be rejected/i);
  assert.match(html, /some inline-image PDF formats are not accepted/i);
  assert.match(html, /chosen output size is a maximum, not a guarantee/i);
  assert.doesNotMatch(html, /PDF support becomes available|version 1\.[012]|no more than 50 pages/i);
});

test("privacy page describes current PDF processing without stale version language", async () => {
  const html = await readPage("privacy.html");

  assert.match(html, /UnderLimit 1\.3/);
  assert.match(html, /combined PDF batches/i);
  assert.doesNotMatch(html, /version 1\.[012]/i);
});

test("support landing page names image, PDF, and combining workflows", async () => {
  const html = await readPage("index.html");

  assert.match(html, /JPEG, HEIC or PNG image/i);
  assert.match(html, /supported PDF/i);
  assert.match(html, /compress 2–10 images/i);
  assert.match(html, /combine 2–10 PDFs/i);
});

test("support and privacy pages retain the current domain support address", async () => {
  for (const page of ["support.html", "privacy.html"]) {
    const html = await readFile(new URL(`../docs/${page}`, import.meta.url), "utf8");
    assert.match(html, /mailto:scott@scotthazlitt\.ai/);
    assert.doesNotMatch(html, /Scott\.hazlitt@gmail\.com/i);
  }
});
