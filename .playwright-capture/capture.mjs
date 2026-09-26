import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("shots");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function dump(name) {
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  console.log("shot", name);
}

try {
  await page.goto("https://uula.com", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4000);
  await dump("home");

  // Extract design tokens from computed styles
  const tokens = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const samples = [];
    const els = Array.from(document.querySelectorAll("body *")).slice(0, 400);
    const colors = new Map();
    const fonts = new Map();
    const radii = new Map();
    for (const el of els) {
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      const color = cs.color;
      if (bg && bg !== "rgba(0, 0, 0, 0)") colors.set(bg, (colors.get(bg) || 0) + 1);
      if (color) colors.set(color, (colors.get(color) || 0) + 1);
      const font = `${cs.fontFamily} | ${cs.fontSize} | ${cs.fontWeight}`;
      fonts.set(font, (fonts.get(font) || 0) + 1);
      const br = cs.borderRadius;
      if (br && br !== "0px") radii.set(br, (radii.get(br) || 0) + 1);
    }
    const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
    return {
      title: document.title,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      bodyBg: body.backgroundColor,
      bodyColor: body.color,
      bodyFont: body.fontFamily,
      textSample: document.body.innerText.slice(0, 1500),
      colors: top(colors, 25),
      fonts: top(fonts, 15),
      radii: top(radii, 10),
      links: Array.from(document.querySelectorAll("a[href]")).slice(0, 40).map((a) => ({
        text: a.innerText.trim().slice(0, 80),
        href: a.href,
      })),
      buttons: Array.from(document.querySelectorAll("button, [role=button]")).slice(0, 30).map((b) =>
        b.innerText.trim().slice(0, 80)
      ),
    };
  });
  console.log(JSON.stringify(tokens, null, 2));

  // Try common student/dashboard paths
  const candidates = [
    "https://uula.com/login",
    "https://uula.com/courses",
    "https://uula.com/subjects",
    "https://uula.com/dashboard",
    "https://uula.com/student",
    "https://www.uula.com",
    "https://uula.com/ar",
    "https://uula.com/en",
  ];
  for (const url of candidates) {
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
      if (!res || res.status() >= 400) {
        console.log("skip", url, res && res.status());
        continue;
      }
      await page.waitForTimeout(2500);
      const name = url.replace(/https?:\/\//, "").replace(/[^\w]+/g, "_");
      await dump(name);
      console.log("ok", url, page.url(), document.title);
    } catch (e) {
      console.log("fail", url, e.message);
    }
  }
} finally {
  await browser.close();
}
