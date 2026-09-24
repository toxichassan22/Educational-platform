import { ENode, PageDoc, cssString, isContainer, num, str, styleRecord } from "./model";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function styleAttr(n: ENode) {
  const css = cssString(styleRecord(n));
  return css ? ` style="${css}"` : "";
}

function childrenHtml(n: ENode): string {
  return (n.children ?? []).map(nodeToHtml).join("\n");
}

export function nodeToHtml(n: ENode): string {
  switch (n.type) {
    case "page":
      return childrenHtml(n);
    case "section":
      return `<section${styleAttr(n)}>\n${childrenHtml(n)}\n</section>`;
    case "container":
    case "card":
      return `<div${styleAttr(n)}>\n${childrenHtml(n)}\n</div>`;
    case "ctaBanner":
      return `<div${styleAttr(n)}>\n${childrenHtml(n)}\n</div>`;
    case "nav": {
      const links = str(n.props.links)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map(
          (l, i) =>
            `<a href="#" style="color:${i === 0 ? "#fff" : "#c8d0e0"};text-decoration:none;font-weight:${i === 0 ? 800 : 600};font-size:15px">${esc(l)}</a>`,
        )
        .join("");
      return `<nav${styleAttr(n)}>
  <div style="display:flex;align-items:center;gap:10px">
    <span style="font-weight:900;letter-spacing:5px;font-size:22px;color:${esc(str(n.props.color, "#fff"))}">${esc(str(n.props.brand, "UULA"))}</span>
    <span style="color:#3b82f6;font-weight:900">◆</span>
  </div>
  <div style="display:flex;align-items:center;gap:32px">${links}</div>
  <a href="#" style="border:2px solid #2563eb;color:#93c5fd;background:rgba(37,99,235,.08);border-radius:999px;padding:10px 28px;font-weight:800;text-decoration:none;font-size:15px">${esc(str(n.props.cta, "ادخل"))}</a>
</nav>`;
    }
    case "footer": {
      const links = str(n.props.links)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((l) => `<a href="#" style="color:${esc(str(n.props.color, "#6b7589"))};text-decoration:none;font-size:14px">${esc(l)}</a>`)
        .join("");
      return `<footer${styleAttr(n)}>
  <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:20px">${links}</div>
  <p style="margin:0;text-align:center;color:${esc(str(n.props.color, "#6b7589"))};font-size:${num(n.props.fontSize, 13)}px">${esc(str(n.props.text))}</p>
  <div style="display:flex;gap:16px;justify-content:center;margin-top:18px;opacity:.55;font-size:12px"><span>Apple Pay</span><span>KNET</span></div>
</footer>`;
    }
    case "heading": {
      const t = str(n.props.tag, "h2");
      const tag = ["h1", "h2", "h3", "h4", "p", "span"].includes(t) ? t : "h2";
      return `<${tag}${styleAttr(n)}>${esc(str(n.props.text))}</${tag}>`;
    }
    case "text":
      return `<p${styleAttr(n)}>${esc(str(n.props.text)).replace(/\n/g, "<br/>")}</p>`;
    case "button":
      return `<a href="${esc(str(n.props.href, "#"))}" style="${cssString({
        ...styleRecord(n),
        display: "inline-block",
        textDecoration: "none",
        padding: `${num(n.props.p, 14)}px ${num(n.props.pxBtn, 28)}px`,
        fontWeight: "800",
        whiteSpace: "nowrap",
      })}">${esc(str(n.props.text))}</a>`;
    case "badge":
      return `<span style="${cssString({
        ...styleRecord(n),
        display: "inline-block",
        padding: `${num(n.props.p, 8)}px ${num(n.props.px, 16)}px`,
      })}">${esc(str(n.props.text))}</span>`;
    case "image":
      return `<img src="${esc(str(n.props.src))}" alt="${esc(str(n.props.alt, ""))}"${styleAttr(n)} />`;
    case "spacer":
      return `<div style="height:${num(n.props.h, 32)}px;width:${esc(str(n.props.w, "auto"))}"></div>`;
    case "decor":
      return `<span style="${cssString({
        ...styleRecord(n),
        position: str(n.props.position, "absolute"),
        pointerEvents: "none",
        lineHeight: "1",
      })}">${esc(str(nodeContent(n)))}</span>`;
    case "statCircle":
      return `<div${styleAttr(n)}>
  <div style="font-size:${num(n.props.fontSize, 72)}px;font-weight:900;color:${esc(str(n.props.color, "#fff"))};line-height:1.1;text-shadow:0 8px 30px rgba(0,0,0,.5)">${esc(str(n.props.value, "100%"))}</div>
  <div style="font-size:13px;color:#94a3b8;margin-top:10px;max-width:200px;line-height:1.5">${esc(str(n.props.label))}</div>
</div>`;
    case "gradeCard": {
      const radius = num(n.props.radius, 28);
      const bg = str(n.props.bg, "linear-gradient(160deg,#141c33,#0e1528)");
      const c1 = str(n.props.color2, "#60a5fa");
      const c2 = str(n.props.color, "#2563eb");
      return `<a href="#" style="${cssString({
        ...styleRecord(n),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        position: "relative",
        fontWeight: "900",
        fontSize: `${num(n.props.fontSize, 88)}px`,
        background: bg,
        color: "transparent",
      })}">
  <span style="position:absolute;inset:0;border-radius:${radius}px;background:${esc(bg)};border:${esc(str(n.props.border, "1px solid rgba(255,255,255,.05)"))};z-index:0"></span>
  <span style="position:relative;z-index:1;background:linear-gradient(180deg,${esc(c1)} 0%,${esc(c2)} 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">${esc(str(n.props.num))}</span>
</a>`;
    }
    case "studentCard": {
      const img = str(n.props.img);
      const r = num(n.props.radius, 20);
      const media = img
        ? `<img src="${esc(img)}" alt="${esc(str(n.props.name))}" style="width:100%;aspect-ratio:5/6;object-fit:cover;display:block;border-radius:${r}px ${r}px 0 0" />`
        : `<div style="width:100%;aspect-ratio:5/6;background:linear-gradient(160deg,#1e293b,#0f172a);display:flex;align-items:center;justify-content:center;font-size:64px;font-weight:900;color:${esc(str(n.props.accent, "#34d399"))};border-radius:${r}px ${r}px 0 0">${esc(str(n.props.name, "?").slice(0, 1))}</div>`;
      return `<article${styleAttr(n)}>
  <div style="position:relative">
    ${media}
    <div style="position:absolute;top:10px;right:12px;font-size:36px;font-weight:900;color:${esc(str(n.props.accent, "#34d399"))};text-shadow:0 4px 20px rgba(0,0,0,.6)">%${esc(str(n.props.score))}</div>
  </div>
  <div style="padding:12px ${num(n.props.p, 14)}px ${num(n.props.p, 14)}px">
    <div style="font-weight:900;font-size:15px;color:${esc(str(n.props.color, "#fff"))}">${esc(str(n.props.name))}</div>
    <div style="font-size:13px;color:#8b95a9;margin-top:4px">${esc(str(n.props.meta))}</div>
  </div>
</article>`;
    }
    case "feature":
      return `<div${styleAttr(n)}>
  <h3 style="margin:0 0 10px;font-size:${num(n.props.fontSize, 34)}px;font-weight:900;color:${esc(str(n.props.titleColor, "#fff"))};text-align:${esc(str(n.props.align, "right"))}">${esc(str(n.props.title))}</h3>
  <p style="margin:0;font-size:${num(n.props.descSize, 17)}px;line-height:1.85;color:${esc(str(n.props.descColor, "#8b95a9"))};text-align:${esc(str(n.props.align, "right"))}">${esc(str(n.props.desc))}</p>
</div>`;
    case "award":
      return `<div style="${cssString({
        ...styleRecord(n),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        minWidth: "140px",
      })}">
  <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(160deg,#1a2340,#121a30);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:24px">${esc(str(n.props.icon, "🏆"))}</div>
  <div style="font-size:14px;font-weight:800;color:${esc(str(n.props.color, "#e2e8f0"))};text-align:center">${esc(str(n.props.title))}</div>
  <div style="font-size:12px;color:#6b7589;text-align:center">${esc(str(n.props.desc))}</div>
</div>`;
    case "teacherCard":
      return `<article${styleAttr(n)}>
  <img src="${esc(str(n.props.img))}" alt="${esc(str(n.props.name))}" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block" />
  <div style="padding:18px 20px 22px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span style="font-weight:900;font-size:18px;color:${esc(str(n.props.color, "#fff"))}">${esc(str(n.props.name))}</span>
      <span style="background:rgba(139,92,246,.18);color:#a78bfa;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px">${esc(str(n.props.subject))}</span>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <span style="background:rgba(59,130,246,.12);color:#60a5fa;font-size:12px;font-weight:700;padding:5px 10px;border-radius:999px">${esc(str(n.props.years))}</span>
      <span style="background:rgba(59,130,246,.12);color:#60a5fa;font-size:12px;font-weight:700;padding:5px 10px;border-radius:999px">${esc(str(n.props.students))}</span>
    </div>
  </div>
</article>`;
    case "testimonial":
      return `<blockquote${styleAttr(n)} style="${cssString({ ...styleRecord(n), margin: "0" })}">
  <p style="margin:0;font-size:15px;line-height:1.9;color:${esc(str(n.props.color, "#cbd5e1"))}">${esc(str(n.props.quote))}</p>
  <footer style="margin-top:16px;display:flex;align-items:center;gap:10px">
    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#7c3aed);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff">${esc(str(n.props.name, "?").slice(0, 1))}</div>
    <div>
      <div style="font-weight:800;font-size:14px;color:#fff">${esc(str(n.props.name))}</div>
      <div style="font-size:12px;color:#6b7589">${esc(str(n.props.meta))}</div>
    </div>
  </footer>
</blockquote>`;
    case "yearTabs": {
      const years = str(n.props.years)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const active = str(n.props.active, years[0] ?? "");
      const btns = years
        .map((y) => {
          const on = y === active;
          return `<button type="button" style="background:${on ? "#2563eb" : "rgba(255,255,255,.06)"};color:${on ? "#fff" : "#94a3b8"};border:1px solid ${on ? "#3b82f6" : "rgba(255,255,255,.1)"};border-radius:999px;padding:8px 20px;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit">${esc(y)}</button>`;
        })
        .join("");
      return `<div${styleAttr(n)}>${btns}</div>`;
    }
    case "logoStrip": {
      const items = str(n.props.items)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const spans = items
        .map(
          (it) =>
            `<span style="border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:8px 16px;font-size:13px;font-weight:700;color:${esc(str(n.props.color, "#6b7589"))};background:rgba(255,255,255,.03)">${esc(it)}</span>`,
        )
        .join("");
      return `<div${styleAttr(n)}>${spans}</div>`;
    }
    default:
      return isContainer(n.type) ? `<div${styleAttr(n)}>\n${childrenHtml(n)}\n</div>` : "";
  }
}

function nodeContent(n: ENode) {
  return str(n.props.content, "✦");
}

export function exportHtml(page: PageDoc): string {
  const body = nodeToHtml(page.root);
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(page.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: "Tajawal", "Segoe UI", Tahoma, Arial, sans-serif; background: #070b16; color: #fff; }
  img { max-width: 100%; }
  a { font-family: inherit; }
  button { font-family: inherit; }
  h1,h2,h3,h4,p { margin: 0; }
</style>
</head>
<body>
${body}
</body>
</html>
`;
}
