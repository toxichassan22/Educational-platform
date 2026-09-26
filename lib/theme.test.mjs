// حارس التوكنز: يمنع انزلاق الهوية البصرية بعيدًا عن lib/theme.ts
// (المشكلة اللي كانت: 4 درجات رمادية لنفس الغرض + تصادم اسم خط next/font)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import { C, R, T, STAGE_THEMES } from "./theme.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (rel) => readFileSync(join(root, rel), "utf8");

const css = read(join("app", "globals.css"));
/** تعليقات CSS فيها شواهد تاريخية مشروعة (مثل لون السكرولبار القديم) */
const cssCode = css.replace(/\/\*[\s\S]*?\*\//g, "");

/** يمشي على ملفات المصدر دون node_modules/.next */
function sources(dir) {
  const out = [];
  for (const entry of readdirSync(join(root, dir))) {
    const p = join(root, dir, entry);
    if (statSync(p).isDirectory()) out.push(...sources(join(dir, entry)));
    else if (/\.(tsx|ts|css)$/.test(entry)) out.push(p);
  }
  return out;
}
const srcFiles = ["app", "components"].flatMap(sources);

// ---------------------------------------------------------------- التوكنز الدلالية
const SEMANTIC = {
  "--color-ink": "ink",
  "--color-muted": "muted",
  "--color-muted-2": "muted2",
  "--color-brand": "brand",
  "--color-bg": "bg",
  "--color-surface": "surface",
  "--color-surface-2": "surface2",
  "--color-line": "line",
  "--color-primary-400": "brandSoft",
  "--color-primary-500": "brand",
  "--color-primary-600": "brandHover",
  "--color-night-800": "surface",
  "--color-night-900": "bg",
  "--color-gold-500": "goldDeep",
  "--color-purple-uula": "violet",
};

test("globals.css @theme يطابق lib/theme.ts (C) — لا انزلاق في القيم", () => {
  for (const [name, key] of Object.entries(SEMANTIC)) {
    const found = cssCode.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
    assert.ok(found, `المتغير ${name} مفقود من @theme في globals.css`);
    assert.equal(
      found[1].toLowerCase(),
      C[key].toLowerCase(),
      `${name} = ${found[1]} لكن C.${key} = ${C[key]} — وحّد المصدرين`,
    );
  }
});

test("T مشتق من C حرفيًا (Tailwind يرى النصوص الثابتة فقط)", () => {
  assert.equal(T.text, `text-[${C.ink}]`);
  assert.equal(T.muted, `text-[${C.muted}]`);
  assert.equal(T.muted2, `text-[${C.muted2}]`);
  assert.equal(T.link, `text-[${C.brandSoft}]`);
  assert.equal(T.surface, `bg-[${C.surface}]`);
  assert.equal(T.surface2, `bg-[${C.surface2}]`);
  assert.equal(T.line, `border-[${C.line}]`);
});

// ------------------------------------------------------------------------ الخط
test("الخط: next/font تحت --font-body و --font-sans تشير إليها", () => {
  const layout = read(join("app", "layout.tsx"));
  assert.match(layout, /variable:\s*"--font-body"/, "لازم Tajawal يتسجّل تحت --font-body");
  assert.doesNotMatch(layout, /variable:\s*"--font-sans"/, "التصادم مع Tailwind يُسقط الواجهة على خط النظام");
  assert.match(cssCode, /--font-sans:\s*var\(--font-body\)/, "--font-sans لازم تُعرّف من --font-body");
  assert.doesNotMatch(cssCode, /Alexandria/, "خط غير محمّل كان يسبب السقوط لخط النظام");
});

// ------------------------------------------------------- الدرجات المعتزَل عنها
const RETIRED = {
  "99a8bd": "نص ثانوي ← #9297a6 [uula]",
  "8e99ab": "نص ثانوي ← #9297a6 [uula]",
  "5b6478": "نص هامشي ← #5f6370 [uula]",
  "6b7589": "نص هامشي ← #5f6370 [uula]",
  "c6cfdd": "نغمة نص رابعة ← #fafbff أو #9297a6",
  "94a3b8": "slate-400 ← #9297a6",
  "cbd5e1": "slate-300 ← #fafbff (نص) / #2b3547 (سكرولبار)",
  "73a7f2": "نغمة زرقاء ثانية ← #4a9bf5",
  "b592f7": "نغمة بنفسجية ثانية ← #b79bf7 (C.smartSoft)",
  "22c55e": "أخضر مزدوج ← #33bf6b (C.ok)",
  "16a34a": "هوفر أخضر مزدوج ← #2a9d58 (C.okDeep)",
};

test("لا درجات خارج اللوحة في أي ملف مصدر", () => {
  for (const file of srcFiles) {
    const text = read(relative(root, file)).toLowerCase();
    const code = file.endsWith(".css") ? text.replace(/\/\*[\s\S]*?\*\//g, "") : text;
    for (const [hex, note] of Object.entries(RETIRED)) {
      assert.ok(!code.includes(hex), `${hex} موجود في ${relative(root, file)} — ${note}`);
    }
  }
});

// ------------------------------------------------- نغمات النص مقيّدة باللوحة
const ALLOWED_TEXT = new Set(
  [C.ink, C.muted, C.muted2, C.brand, C.brandSoft, C.gold, C.goldDeep, C.ok, C.bad, C.bg, C.line, C.smartSoft]
    .map((v) => v.toLowerCase()),
);

test("كل text-[#hex] ينتمي للوحة (لا نغمات نص جديدة)", () => {
  for (const file of srcFiles.filter((f) => f.endsWith(".tsx"))) {
    const text = read(relative(root, file));
    for (const m of text.matchAll(/text-\[(#[0-9a-fA-F]{6})\]/g)) {
      assert.ok(
        ALLOWED_TEXT.has(m[1].toLowerCase()),
        `${m[1]} في ${relative(root, file)} خارج اللوحة — استخدم قيمة من C أو أضفها صراحةً في theme.ts`,
      );
    }
  }
});

// --------------------------------------------------------------- هوية المراحل
test("هوية المرحلة لون مسطح واحد — بلا تدرجات", () => {
  for (const [id, theme] of Object.entries(STAGE_THEMES)) {
    assert.match(theme.color, /^#[0-9a-fA-F]{6}$/, `${id}.color لازم hex مسطح`);
    assert.match(theme.accent, /^#[0-9a-fA-F]{6}$/, `${id}.accent لازم hex مسطح`);
    assert.match(theme.radius, /^rounded-/, `${id}.radius لازم كلاس حواف Tailwind`);
  }
  assert.equal(R.pill, "rounded-full", "الأزرار الأساسية كبسولية — مؤكَّد من صفحة ادخل في uula");
});
