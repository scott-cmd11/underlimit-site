import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readPage = (name) => readFile(new URL(`../docs/${name}`, import.meta.url), "utf8");

const staleVersion = /UnderLimit 1\.[0-5]\b|version 1\.[0-5]\b/i;

test("support page describes the UnderLimit 1.6 image and PDF limits", async () => {
  const html = await readPage("support.html");

  assert.match(html, /UnderLimit 1\.6/);
  assert.match(html, /decimal maximum from 10 KB through 100 MB/);
  assert.match(html, /batch compression accepts 2–10 images/i);
  assert.match(html, /limits applied separately to each image/i);
  assert.match(html, /verified batch results remain available if another image fails/i);
  assert.match(html, /new sRGB JPEG/i);
  assert.match(html, /transparent backgrounds become white/i);
  assert.match(html, /metadata, including GPS, is not retained/i);
  assert.match(html, /one supported, unencrypted, unsigned PDF up to 100 pages and 100 MB/i);
  assert.match(html, /flattened visual PDF/);
  assert.match(html, /removes searchable text, links, forms, annotations and other interactive behaviour/i);
  assert.match(html, /may not work with VoiceOver/);
  assert.match(html, /image-heavy PDFs may be rejected/i);
  assert.match(html, /chosen output size is a maximum, not a guarantee/i);
  assert.match(html, /combines 2–10 supported PDFs/);
  assert.match(html, /50 total pages and 100 MB of source data/);
  assert.match(html, /asks for your confirmation before visual conversion/);
  assert.match(html, /only verified results within that limit are offered for sharing/i);
  assert.doesNotMatch(html, staleVersion);
  assert.doesNotMatch(html, /no target-size guarantee|Animated images and video are not supported/i);
});

test("support page covers every 1.6 tool with the listing's limits", async () => {
  const html = await readPage("support.html");

  assert.match(html, /seven tools/i);
  assert.match(html, /scan up to 30 document pages/i);
  assert.match(html, /camera is used only when you choose to scan/i);
  assert.match(html, /MOV, MP4 or M4V files up to 2 GB and 8,192 pixels per edge/);
  assert.match(html, /standard-colour MP4 at up to 1080p and 30 fps/);
  assert.match(html, /HDR and higher frame rates are converted/);
  assert.match(html, /M4A copies/);
  assert.match(html, /embedded JPEG and PNG images in DOCX and PPTX/);
  assert.match(html, /signed, encrypted and macro-enabled documents are not supported/i);
  assert.match(html, /one combined size budget/i);
  assert.match(html, /up to 20 files totalling 2 GB/);
  assert.match(html, /share them separately or as one ZIP/i);
  assert.match(html, /without changing their contents/);
  assert.match(html, /does not promise a smaller file/);
  assert.match(html, /may be slightly larger/);
  assert.match(html, /cloud-provider files may need downloading through iOS first/i);
});

test("support gives separate export instructions for images and other results", async () => {
  const html = await readPage("support.html");

  assert.match(html, /For an image result, choose Save to Photos or share the JPEG/);
  assert.match(html, /For PDF, scan, video, audio, Office and ZIP results, use the system share sheet/);
  // 1.6 saves only photos to the library (PhotoLibrarySaver adds .photo resources).
  assert.doesNotMatch(html, /Save to Photos[^.<]*\bvideo/i);
});

test("privacy page discloses camera use and 1.6 file-type processing", async () => {
  const html = await readPage("privacy.html");

  assert.match(html, /UnderLimit 1\.6/);
  assert.match(html, /<h2>Camera<\/h2>/);
  assert.match(html, /camera is used only when you choose to scan document pages/i);
  assert.match(html, /scans are processed on this device/i);
  for (const kind of [/images/, /PDFs/, /videos/, /audio recordings/, /DOCX/, /PPTX/, /ZIP archives/]) {
    assert.match(html, kind);
  }
  assert.match(html, /private temporary storage on your device/);
  assert.match(html, /add-only access and cannot read your photo library/);
  assert.match(html, /ZIPFoundation handles archives locally/);
  assert.match(html, /keep any metadata they already contain, such as location/);
  assert.match(html, /third-party tracking SDK/);
  assert.doesNotMatch(html, /third-party software development kit/);
  assert.doesNotMatch(html, staleVersion);
});

test("landing page names all seven tools and keeps the video section", async () => {
  const html = await readPage("index.html");
  const summary = html.match(/<p id="summary">([^<]*)<\/p>/)?.[1] ?? "";

  assert.match(summary, /seven tools/i);
  for (const tool of [/images/, /shrink, combine or scan PDFs/, /videos/, /audio/, /Word and PowerPoint/, /several files/, /ZIPs/]) {
    assert.match(summary, tool);
  }
  assert.match(summary, /core processing happens on your iPhone/i);
  assert.doesNotMatch(html, /entirely on your iPhone/i);
  assert.match(html, /<source src="media\/underlimit-ad\.mp4"/);
  assert.match(html, /id="video-text"/);
});

test("support and privacy pages retain the current domain support address", async () => {
  for (const page of ["support.html", "privacy.html"]) {
    const html = await readPage(page);
    assert.match(html, /mailto:scott@scotthazlitt\.ai/);
    assert.doesNotMatch(html, /Scott\.hazlitt@gmail\.com/i);
  }
});
