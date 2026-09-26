export type NodeType =
  | "page"
  | "section"
  | "container"
  | "heading"
  | "text"
  | "button"
  | "image"
  | "card"
  | "badge"
  | "spacer"
  | "nav"
  | "footer"
  | "gradeCard"
  | "studentCard"
  | "feature"
  | "award"
  | "decor"
  | "teacherCard"
  | "testimonial"
  | "ctaBanner"
  | "yearTabs"
  | "logoStrip"
  | "statCircle";

export type PropValue = string | number | boolean;

export interface ENode {
  id: string;
  type: NodeType;
  props: Record<string, PropValue>;
  children?: ENode[];
}

export interface PageDoc {
  id: string;
  name: string;
  root: ENode;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export const CONTAINER_TYPES: NodeType[] = [
  "page",
  "section",
  "container",
  "card",
  "nav",
  "footer",
  "ctaBanner",
];

export function isContainer(type: NodeType) {
  return CONTAINER_TYPES.includes(type);
}

export function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function remountIds(node: ENode): ENode {
  node.id = uid();
  node.children?.forEach(remountIds);
  return node;
}

export function findNode(root: ENode, id: string): ENode | null {
  if (root.id === id) return root;
  for (const c of root.children ?? []) {
    const hit = findNode(c, id);
    if (hit) return hit;
  }
  return null;
}

export function findParent(root: ENode, id: string): ENode | null {
  for (const c of root.children ?? []) {
    if (c.id === id) return root;
    const hit = findParent(c, id);
    if (hit) return hit;
  }
  return null;
}

export function removeNode(root: ENode, id: string): ENode | null {
  const parent = findParent(root, id);
  if (!parent?.children) return null;
  const i = parent.children.findIndex((c) => c.id === id);
  if (i < 0) return null;
  const [removed] = parent.children.splice(i, 1);
  return removed;
}

export function insertNode(
  root: ENode,
  targetId: string,
  node: ENode,
  pos: "before" | "after" | "inside",
): boolean {
  if (pos === "inside") {
    const target = findNode(root, targetId);
    if (target && isContainer(target.type)) {
      target.children = target.children ?? [];
      target.children.push(node);
      return true;
    }
    return false;
  }
  const parent = findParent(root, targetId);
  if (!parent?.children) return false;
  const i = parent.children.findIndex((c) => c.id === targetId);
  if (i < 0) return false;
  const at = pos === "before" ? i : i + 1;
  parent.children.splice(at, 0, node);
  return true;
}

export const str = (v: PropValue | undefined, d = "") =>
  v === undefined || v === false ? d : String(v);
export const num = (v: PropValue | undefined, d = 0) =>
  typeof v === "number" ? v : Number(v) || d;

export function styleRecord(n: ENode): Record<string, string> {
  const p = n.props;
  const s: Record<string, string> = {};
  if (p.bg) s.background = str(p.bg);
  if (p.color) s.color = str(p.color);
  if (p.radius !== undefined) s.borderRadius = `${num(p.radius)}px`;
  if (p.pt !== undefined) s.paddingTop = `${num(p.pt)}px`;
  if (p.pb !== undefined) s.paddingBottom = `${num(p.pb)}px`;
  if (p.px !== undefined) {
    s.paddingLeft = `${num(p.px)}px`;
    s.paddingRight = `${num(p.px)}px`;
  }
  if (p.p !== undefined) s.padding = `${num(p.p)}px`;
  if (p.mt !== undefined) s.marginTop = `${num(p.mt)}px`;
  if (p.mb !== undefined) s.marginBottom = `${num(p.mb)}px`;
  if (p.ml !== undefined) s.marginLeft = `${num(p.ml)}px`;
  if (p.mr !== undefined) s.marginRight = `${num(p.mr)}px`;
  if (p.maxW) s.maxWidth = str(p.maxW);
  if (p.minW) s.minWidth = str(p.minW);
  if (p.w) s.width = str(p.w);
  if (p.h) s.height = str(p.h);
  if (p.minH) s.minHeight = str(p.minH);
  if (p.align) s.textAlign = str(p.align);
  if (p.justify) s.justifyContent = str(p.justify);
  if (p.items) s.alignItems = str(p.items);
  if (p.gap !== undefined) s.gap = `${num(p.gap)}px`;
  if (p.display) s.display = str(p.display);
  if (p.flexDir) s.flexDirection = str(p.flexDir);
  if (p.wrap) s.flexWrap = "wrap";
  if (p.flex) s.flex = str(p.flex);
  if (p.border) s.border = str(p.border);
  if (p.boxShadow) s.boxShadow = str(p.boxShadow);
  if (p.fontSize !== undefined) s.fontSize = `${num(p.fontSize)}px`;
  if (p.fontWeight !== undefined) s.fontWeight = String(num(p.fontWeight));
  if (p.lineHeight) s.lineHeight = str(p.lineHeight);
  if (p.letterSpacing) s.letterSpacing = str(p.letterSpacing);
  if (p.opacity !== undefined) s.opacity = String(num(p.opacity, 1));
  if (p.objectFit) s.objectFit = str(p.objectFit);
  if (p.textShadow) s.textShadow = str(p.textShadow);
  if (p.transform) s.transform = str(p.transform);
  if (p.position) s.position = str(p.position);
  if (p.top !== undefined) s.top = `${num(p.top)}px`;
  if (p.left !== undefined) s.left = `${num(p.left)}px`;
  if (p.right !== undefined) s.right = `${num(p.right)}px`;
  if (p.bottom !== undefined) s.bottom = `${num(p.bottom)}px`;
  if (p.z !== undefined) s.zIndex = String(num(p.z));
  if (p.overflow) s.overflow = str(p.overflow);
  if (p.aspect) s.aspectRatio = str(p.aspect);
  if (p.filter) s.filter = str(p.filter);
  if (p.backgroundClip) s.backgroundClip = str(p.backgroundClip);
  if (p.webkitTextFillColor) {
    s["-webkit-text-fill-color"] = str(p.webkitTextFillColor);
  }
  if (p.gridCols) {
    s.display = s.display || "grid";
    s.gridTemplateColumns = `repeat(${num(p.gridCols, 1)}, minmax(0, 1fr))`;
  }
  if (p.gridColsResponsive) {
    s.display = "grid";
    s.gridTemplateColumns = str(p.gridColsResponsive);
  }
  return s;
}

export function cssString(rec: Record<string, string>) {
  return Object.entries(rec)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`)
    .join(";");
}

export const TYPE_LABEL: Record<NodeType, string> = {
  page: "صفحة",
  section: "قسم",
  container: "حاوية",
  heading: "عنوان",
  text: "نص",
  button: "زر",
  image: "صورة",
  card: "بطاقة",
  badge: "شارة",
  spacer: "مسافة",
  nav: "شريط علوي",
  footer: "فوتر",
  gradeCard: "كارت صف",
  studentCard: "كارت متفوق",
  feature: "ميزة",
  award: "جائزة",
  decor: "زخرفة",
  teacherCard: "معلّم",
  testimonial: "شهادة",
  ctaBanner: "بانر دعوة",
  yearTabs: "تبويب سنوات",
  logoStrip: "شريط شعارات",
  statCircle: "دائرة نسبة",
};

export function defaultProps(type: NodeType): Record<string, PropValue> {
  switch (type) {
    case "section":
      return {
        bg: "#070b16",
        pt: 64,
        pb: 64,
        px: 24,
        gap: 24,
        display: "flex",
        flexDir: "column",
        items: "center",
      };
    case "container":
      return {
        maxW: "1200px",
        w: "100%",
        gap: 16,
        display: "flex",
        flexDir: "column",
        items: "stretch",
      };
    case "heading":
      return {
        text: "عنوان جديد",
        tag: "h2",
        fontSize: 36,
        fontWeight: 900,
        color: "#ffffff",
        lineHeight: 1.3,
      };
    case "text":
      return {
        text: "اكتب النص هنا…",
        fontSize: 16,
        color: "#8b95a9",
        lineHeight: 1.8,
        align: "center",
      };
    case "button":
      return {
        text: "استكشف الآن",
        href: "#",
        bg: "linear-gradient(135deg,#2563eb,#3b82f6)",
        color: "#fff",
        radius: 999,
        p: 14,
        pxBtn: 32,
        fontSize: 15,
        fontWeight: 800,
        boxShadow: "0 8px 24px rgba(37,99,235,.35)",
      };
    case "image":
      return {
        src: "https://placehold.co/640x360/0f172a/3b82f6?text=UULA",
        alt: "صورة",
        w: "100%",
        radius: 20,
        objectFit: "cover",
      };
    case "card":
      return {
        bg: "linear-gradient(160deg,#121a30 0%,#0d1428 100%)",
        radius: 24,
        p: 24,
        gap: 12,
        display: "flex",
        flexDir: "column",
        border: "1px solid rgba(255,255,255,.06)",
      };
    case "badge":
      return {
        text: "جديد",
        bg: "rgba(37,99,235,.15)",
        color: "#60a5fa",
        radius: 999,
        p: 8,
        px: 16,
        fontSize: 13,
        fontWeight: 700,
      };
    case "spacer":
      return { h: 32 };
    case "nav":
      return {
        bg: "rgba(7,11,22,.92)",
        px: 40,
        pt: 18,
        pb: 18,
        display: "flex",
        items: "center",
        justify: "space-between",
        gap: 16,
        brand: "UULA",
        links: "الرئيسية,العروض,الطلبة الأوائل,أولياء الأمور",
        cta: "ادخل",
        border: "0",
      };
    case "footer":
      return {
        bg: "#05080f",
        pt: 48,
        pb: 32,
        px: 40,
        text: "© 2026 علا — جميع الحقوق محفوظة",
        links: "الشروط,الخصوصية,العروض,أولياء الأمور,الطلبة الأوائل",
        color: "#5f6370",
        align: "center",
        fontSize: 13,
      };
    case "gradeCard":
      return {
        num: "10",
        bg: "linear-gradient(160deg,#141c33 0%,#0e1528 100%)",
        color: "#3b82f6",
        color2: "#60a5fa",
        radius: 28,
        p: 0,
        w: "100%",
        h: "170px",
        fontSize: 88,
        fontWeight: 900,
        border: "1px solid rgba(255,255,255,.05)",
        textShadow: "0 18px 40px rgba(37,99,235,.45)",
      };
    case "studentCard":
      return {
        name: "اسم الطالب",
        meta: "الصف العاشر — علمي",
        score: "100",
        bg: "linear-gradient(165deg,#0f3d28 0%,#0a2a1c 55%,#071f15 100%)",
        color: "#fff",
        radius: 20,
        p: 14,
        img: "",
        accent: "#34d399",
        border: "1px solid rgba(52,211,153,.15)",
      };
    case "feature":
      return {
        title: "ميزة مميزة",
        desc: "وصف مختصر للميزة يشرح الفائدة للطالب.",
        bg: "transparent",
        align: "right",
        titleColor: "#ffffff",
        descColor: "#8b95a9",
        fontSize: 34,
        descSize: 17,
      };
    case "award":
      return {
        title: "جائزة أفضل منصة",
        desc: "وصف الجائزة",
        color: "#e2e8f0",
        icon: "🏆",
      };
    case "decor":
      return {
        content: "✦",
        fontSize: 48,
        color: "rgba(59,130,246,.5)",
        position: "absolute",
        top: 24,
        right: 24,
        z: 0,
        opacity: 1,
        transform: "none",
        pointer: "none",
      };
    case "teacherCard":
      return {
        name: "أ. اسم المعلّم",
        subject: "التاريخ",
        years: "خبرة 10+ سنوات",
        students: "+98% رضا الطلاب",
        bg: "linear-gradient(160deg,#152038 0%,#0e162c 100%)",
        color: "#fff",
        radius: 22,
        p: 0,
        img: "https://placehold.co/480x360/1e293b/94a3b8?text=Teacher",
        border: "1px solid rgba(255,255,255,.06)",
      };
    case "testimonial":
      return {
        quote: "«علا غيّرت طريقتي في المذاكرة بالكامل — المذكرات والفيديو سوا يغطون المنهج كله.»",
        name: "خالد الكندري",
        meta: "العاشرة — علمي",
        bg: "linear-gradient(160deg,#101b36 0%,#0b1224 100%)",
        color: "#cbd5e1",
        radius: 20,
        p: 24,
        border: "1px solid rgba(255,255,255,.06)",
      };
    case "ctaBanner":
      return {
        bg: "linear-gradient(120deg,#0f1c3f 0%,#132a5c 50%,#0f1c3f 100%)",
        radius: 28,
        p: 40,
        gap: 24,
        display: "flex",
        items: "center",
        justify: "space-between",
        wrap: true,
        border: "1px solid rgba(59,130,246,.2)",
        boxShadow: "0 24px 60px rgba(0,0,0,.35)",
      };
    case "yearTabs":
      return {
        years: "2026,2025,2024,2023,2022,2021",
        active: "2026",
        bg: "transparent",
        gap: 10,
        display: "flex",
        wrap: true,
        justify: "center",
      };
    case "logoStrip":
      return {
        items: "Apple Pay,KNET,App Store,Google Play",
        bg: "transparent",
        gap: 20,
        display: "flex",
        wrap: true,
        justify: "center",
        color: "#5f6370",
      };
    case "statCircle":
      return {
        value: "100%",
        label: "هيا عبدالله — الأول على الكويت",
        bg: "radial-gradient(circle at 35% 30%, #1e40af 0%, #0f172a 70%)",
        color: "#fff",
        w: "340px",
        h: "340px",
        radius: 999,
        fontSize: 72,
        fontWeight: 900,
      };
    default:
      return {};
  }
}

export function createNode(type: NodeType): ENode {
  return {
    id: uid(),
    type,
    props: defaultProps(type),
    children: isContainer(type) ? [] : undefined,
  };
}
