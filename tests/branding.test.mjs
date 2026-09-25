import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadModule(path, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exports = {};
  vm.runInNewContext(outputText, { exports, ...globals });
  return exports;
}
const { themeInitScript } = loadModule("../src/lib/theme.ts");

for (const [stored, expected] of [[null, "light"], ["dark", "dark"], ["light", "light"], ["invalid", "light"]]) {
  test(`pre-paint theme: ${stored} resolves to ${expected}`, () => {
    const document = { documentElement: { dataset: {} } };
    vm.runInNewContext(themeInitScript, { document, localStorage: { getItem: () => stored } });
    assert.equal(document.documentElement.dataset.theme, expected);
  });
}
test("theme and assessment storage tolerate a browser denying storage", () => {
  const denied = { getItem() { throw new Error("SecurityError"); }, setItem() { throw new Error("QuotaExceededError"); } };
  const document = { documentElement: { dataset: {} } };
  vm.runInNewContext(themeInitScript, { document, localStorage: denied });
  assert.equal(document.documentElement.dataset.theme, "light");
  const { readStorage, writeStorage } = loadModule("../src/lib/browserStorage.ts", { window: { localStorage: denied } });
  assert.equal(readStorage("smile_submit_count"), null);
  assert.doesNotThrow(() => writeStorage("smile_submit_count", "1"));
});

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const palette = block => Object.fromEntries([...block.matchAll(/--color-([\w-]+):\s*(\d+) (\d+) (\d+)/g)].map(([,name,r,g,b]) => [name,[+r,+g,+b]]));
const light = palette(css.match(/:root \{([^}]+)\}/s)[1]);
const dark = { ...light, ...palette(css.match(/:root\[data-theme="dark"\] \{([^}]+)\}/s)[1]) };
function luminance(rgb) {
  return rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum,v,i) => sum + v * [.2126,.7152,.0722][i], 0);
}
function contrast(a,b) {
  const l = [luminance(a),luminance(b)].sort((a,b) => b-a);
  return (l[0]+.05)/(l[1]+.05);
}
for (const [name, colors] of [["light",light],["dark",dark]]) {
  test(`${name} theme: normal text, accents, and status messages meet 4.5:1`, () => {
    for (const foreground of ["heading","text","muted","accent"]) {
      for (const background of ["canvas","surface","soft"]) {
        assert.ok(contrast(colors[foreground],colors[background]) >= 4.5, `${foreground} on ${background}`);
      }
    }
    for (const status of ["success","warning","danger"]) {
      assert.ok(contrast(colors[status],colors[`${status}-soft`]) >= 4.5, status);
    }
  });
}
test("primary button white text meets normal-text contrast", () => {
  assert.ok(contrast([255,255,255],[44,81,244]) >= 4.5);
});

test("components only use defined brand color utilities", () => {
  const allowed = new Set([...Object.keys(light), "cyan", "blue", "green"]);
  const root = new URL("../src/", import.meta.url);
  for (const file of readdirSync(root, { recursive: true }).filter(file => file.endsWith(".tsx"))) {
    const source = readFileSync(new URL(file.replaceAll("\\", "/"), root), "utf8");
    for (const [,color] of source.matchAll(/(?:bg|text|border|ring|divide|from|to)-brand-([\w-]+)/g)) {
      assert.ok(allowed.has(color), `${file}: undefined brand color ${color}`);
    }
  }
});
