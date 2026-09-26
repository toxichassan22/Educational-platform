import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("shots-local");
await mkdir(outDir, { recursive: true });

const base = "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

async function shot(name, url, session) {
  if (session !== undefined) {
    await page.goto(base + "/login", { waitUntil: "domcontentloaded" });
    if (session === null) await page.evaluate(() => localStorage.removeItem("tafawwug-session-v1"));
    else await page.evaluate((u) => localStorage.setItem("tafawwug-session-v1", u), session);
  }
  await page.goto(base + url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  console.log("shot", name, page.url());
}

try {
  await shot("landing", "/", null);
  await shot("login", "/login", null);
  await shot("grades", "/grades", null);
  await shot("student", "/student", "s1");
  await shot("student-browse", "/student/browse", undefined);
  await shot("parent", "/parent", "p1");
  await shot("admin", "/admin", "a1");
} finally {
  await browser.close();
}
