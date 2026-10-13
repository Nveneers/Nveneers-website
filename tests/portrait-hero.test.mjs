import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import React from "react";
import { act, create } from "react-test-renderer";
import ts from "typescript";

const require = createRequire(import.meta.url);
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

async function fixture({ desktop = true, reduced = false, rejectPlayback = false, locale = "en" } = {}) {
  const mediaQueries = new Map();
  const events = new Map();
  let intersection, renderer, playCalls = 0, pauseCalls = 0;
  const document = { hidden: false, addEventListener: (name, cb) => events.set(name, cb), removeEventListener: name => events.delete(name) };
  const window = { matchMedia: query => {
    if (!mediaQueries.has(query)) mediaQueries.set(query, {
      matches: query.includes("min-width") ? desktop : reduced,
      addEventListener(name, cb) { this.listener = cb; },
      removeEventListener() { this.listener = null; }
    });
    return mediaQueries.get(query);
  } };
  const exports = {};
  const output = ts.transpileModule(read("../src/components/sections/PortraitHeroSection.tsx"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX }
  }).outputText;
  vm.runInNewContext(output, { exports, require, window, document, IntersectionObserver: class {
    constructor(cb) { intersection = cb; }
    observe() { intersection([{ isIntersecting: true }]); }
    disconnect() {}
  } });
  const content = JSON.parse(read(`../src/content/home/${locale}/hero.json`));
  const labels = JSON.parse(read(`../src/content/home/${locale}/ui.json`)).hero;
  await act(async () => {
    renderer = create(React.createElement(exports.default, { content, labels }), { createNodeMock: element => {
      if (element.type !== "video") return {};
      return {
        play() {
          playCalls++;
          if (rejectPlayback) return Promise.reject(new Error("Autoplay blocked"));
          renderer.root.findByType("video").props.onPlaying();
          return Promise.resolve();
        },
        pause() { pauseCalls++; renderer.root.findByType("video").props.onPause(); },
        load() {}
      };
    } });
  });
  return {
    renderer, labels,
    videos: () => renderer.root.findAllByType("video"),
    calls: () => ({ playCalls, pauseCalls }),
    click: () => act(async () => renderer.root.findByType("button").props.onClick()),
    intersect: visible => act(async () => intersection([{ isIntersecting: visible }])),
    hide: hidden => act(async () => { document.hidden = hidden; events.get("visibilitychange")(); }),
    resize: desktop => act(async () => { const mq = mediaQueries.get("(min-width: 1024px)"); mq.matches = desktop; mq.listener(); }),
    allowPlayback: () => { rejectPlayback = false; },
    close: () => act(() => renderer.unmount())
  };
}

for (const locale of ["en", "ar"]) {
  test(`${locale}: only one responsive portrait source is mounted; legacy slides never load`, async () => {
    const ui = await fixture({ locale });
    try {
      assert.equal(ui.videos().length, 1);
      assert.equal(ui.videos()[0].props.src, "/videos/portrait-hero-desktop.mp4");
      await ui.resize(false);
      assert.equal(ui.videos().length, 1);
      assert.equal(ui.videos()[0].props.src, "/videos/portrait-hero-mobile.mp4");
      assert.ok(!JSON.stringify(ui.renderer.toJSON()).includes("hero-1-"));
    } finally { ui.close(); }
  });
}

test("reduced motion loads only the poster until the user explicitly plays", async () => {
  const ui = await fixture({ reduced: true, desktop: false });
  try {
    assert.equal(ui.videos().length, 0);
    assert.equal(ui.calls().playCalls, 0);
    await ui.click();
    assert.equal(ui.videos().length, 1);
    assert.equal(ui.renderer.root.findByType("button").props["aria-label"], ui.labels.pauseLabel);
  } finally { ui.close(); }
});

test("visibility pauses playback, but returning never overrides a user's pause", async () => {
  const ui = await fixture();
  try {
    await ui.intersect(false);
    assert.ok(ui.calls().pauseCalls > 0);
    await ui.intersect(true);
    await ui.hide(true);
    const beforeReturn = ui.calls().playCalls;
    await ui.hide(false);
    assert.equal(ui.calls().playCalls, beforeReturn + 1);
    await ui.click();
    const beforeUserPause = ui.calls().playCalls;
    await ui.intersect(false);
    await ui.intersect(true);
    assert.equal(ui.calls().playCalls, beforeUserPause);
  } finally { ui.close(); }
});

test("blocked autoplay leaves the poster visible and supports a manual retry", async () => {
  const ui = await fixture({ rejectPlayback: true });
  try {
    assert.ok(!ui.videos()[0].props.className.includes("has-frame"));
    assert.equal(ui.renderer.root.findByType("button").props["aria-label"], ui.labels.playLabel);
    ui.allowPlayback();
    await ui.click();
    assert.ok(ui.videos()[0].props.className.includes("has-frame"));
    assert.equal(ui.renderer.root.findByType("button").props["aria-label"], ui.labels.pauseLabel);
  } finally { ui.close(); }
});
