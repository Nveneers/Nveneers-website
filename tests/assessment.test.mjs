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
const json = path => JSON.parse(read(path));

// Render real React state/effects with synthetic files and an API stub. No DOM,
// network, patient data, or application backend is used by these smoke tests.
function fixture(locale = "en", validation = 200, deniedStorage = false) {
  const calls = [];
  const values = new Map();
  const localStorage = {
    getItem(key) { if (deniedStorage) throw new Error("SecurityError"); return values.get(key) ?? null; },
    setItem(key, value) { if (deniedStorage) throw new Error("SecurityError"); values.set(key, value); }
  };
  const globals = {
    window: { localStorage },
    FileReader: class {
      readAsDataURL() { this.onload({ target: { result: "data:image/png;base64,VUlURVNU" } }); }
    },
    fetch: async (url, options) => {
      calls.push({ url, options });
      if (url === "/api/challenge-token") return { ok: true, json: async () => ({ token: "test" }) };
      if (url === "/api/validate-smile") return { ok: validation === 200, status: validation, json: async () => ({ valid: true }) };
      if (url === "/api/submit-smile") return { ok: true, status: 200, json: async () => ({ ok: true }) };
      throw new Error(`Unexpected API request: ${url}`);
    }
  };
  function compile(path, imports = {}) {
    const exports = {};
    const output = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(output, { exports, ...globals, require: name => {
      if (name in imports) return imports[name];
      if (name === "react" || name === "react/jsx-runtime") return require(name);
      throw new Error(`Unexpected component dependency: ${name}`);
    } });
    return exports;
  }
  const storage = compile("../src/lib/browserStorage.ts");
  const brandWave = compile("../src/components/BrandWave.tsx");
  const Component = compile("../src/components/sections/SmileAssessmentSection.tsx", {
    "@/lib/browserStorage": storage,
    "@/components/BrandWave": brandWave,
    "@/components/ui/RevealOnScroll": { default: ({ children }) => children }
  }).default;
  const labels = json(`../src/content/home/${locale}/ui.json`).assessment;
  const content = json(`../src/content/home/${locale}/assessment.json`);
  let renderer;
  act(() => { renderer = create(React.createElement(Component, { content, labels })); });
  const click = async label => act(async () => { await renderer.root.findAllByType("button").find(b => b.props.children === label).props.onClick(); });
  const upload = (type = "image/png", size = 100) => act(() => renderer.root.findByProps({ role: "button" }).props.onDrop({ preventDefault() {}, dataTransfer: { files: [{ type, size }] } }));
  return { renderer, labels, calls, values, upload, click, text: () => JSON.stringify(renderer.toJSON()), close: () => act(() => renderer.unmount()) };
}

for (const locale of ["en", "ar"]) {
  test(`${locale}: assessment preview, contact form, and success with blocked storage`, async () => {
    const ui = fixture(locale, 200, true);
    try {
      ui.upload();
      assert.ok(ui.text().includes(ui.labels.checkLabel));
      await ui.click(ui.labels.checkLabel);
      assert.ok(ui.text().includes(ui.labels.nameLabel));
      act(() => ui.renderer.root.findByProps({ id: "assessment-name" }).props.onChange({ target: { value: "UI Test" } }));
      act(() => ui.renderer.root.findByProps({ id: "assessment-phone" }).props.onChange({ target: { value: "0000000000" } }));
      await act(async () => { await ui.renderer.root.findByType("form").props.onSubmit({ preventDefault() {} }); });
      assert.ok(ui.text().includes(ui.labels.doneTitle));
      assert.deepEqual(ui.calls.map(c => c.url), ["/api/challenge-token", "/api/validate-smile", "/api/challenge-token", "/api/submit-smile"]);
      assert.equal(JSON.parse(ui.calls[3].options.body).name, "UI Test");
    } finally { ui.close(); }
  });
}

test("assessment rejects unsupported/oversized files before making API requests", () => {
  const ui = fixture();
  try {
    ui.upload("text/plain");
    assert.ok(ui.text().includes(ui.labels.fileTypeError));
    ui.upload("image/png", 6 * 1024 * 1024);
    assert.ok(ui.text().includes(ui.labels.fileSizeError));
    assert.equal(ui.calls.length, 0);
  } finally { ui.close(); }
});

for (const status of [429, 503]) {
  test(`assessment ${status} error offers retry without submission`, async () => {
    const ui = fixture("en", status);
    try {
      ui.upload();
      await ui.click(ui.labels.checkLabel);
      assert.ok(ui.text().includes(ui.labels.tryAgainLabel));
      assert.equal(ui.calls.some(c => c.url === "/api/submit-smile"), false);
      await ui.click(ui.labels.tryAgainLabel);
      assert.ok(ui.text().includes(ui.labels.uploadLabel));
    } finally { ui.close(); }
  });
}
