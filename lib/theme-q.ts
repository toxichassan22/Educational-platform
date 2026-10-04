// ============================================================
// ثيم واجهة TheQ — مصدر واحد لتوكنز صفحات الطالب وولي الأمر
// ============================================================
// القيم مستخرجة من حزمة CSS الرسمية للمنصة:
//   https://app.theq-app.com/assets/index-DJnGRN-O.css
// الموثّقة [theq] بجوارها، والملف المحفوظ محليًا في
// `.playwright-capture/theq/css-index-DJnGRN-O.css`.
// لا تُدخل رمادي جديد: gray-* هناك مُربوط إلى slate-* بنفس القيم.

export const QC = {
  // الشريط العلوي
  navy: "#082770", // [theq] --color-header-primary
  navyDeep: "#06194f", // [theq] تدرّج أغمق للهيرو

  // الخلفية والأسطح
  bg: "#ffffff", // [theq] body في الوضع الفاتح
  bgSoft: "#f8fafc", // [theq] gray-50
  surface: "#ffffff", // [theq] bg-white
  surfaceSoft: "#f1f5f9", // [theq] gray-100
  line: "#e2e8f0", // [theq] gray-200
  lineSoft: "#cbd5e1", // [theq] gray-300

  // النص
  ink: "#0f172a", // [theq] gray-900
  body: "#334155", // [theq] body color (gray-700)
  muted: "#64748b", // [theq] gray-500
  faint: "#94a3b8", // [theq] gray-400

  // الأزرق الأساسي
  brand: "#006fff", // [theq] blue-500 (المخصص الوحيد في الـ palette)
  brandDark: "#0052cc", // [theq] hover
  brandSoft: "#eff6ff", // [theq] blue-50
  brandBorder: "#bfdbfe", // [theq] blue-200
  brandText: "#0052cc",

  // الدلالية
  success: "#059669", // [theq] success = emerald-600
  successSoft: "#ecfdf5",
  warning: "#f59200", // [theq] warning
  warningSoft: "#fff7ed",
  danger: "#ff4f1a", // [theq] error
  dangerSoft: "#fff1f2",
  gold: "#ffba42", // [theq] warning-lighter
} as const;

// أنصاف الأقطار — [theq] --radius-*
export const QR = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  "4xl": "2rem",
} as const;

// خط الواجهة — [theq] --font-ar / --font-en = "Noto Kufi Arabic"
export const QFONT = 'var(--font-q), "Noto Kufi Arabic", system-ui, sans-serif';

// أنماط جاهزة (بديل عن تكرار الـ Tailwind classes)
export const Q = {
  card: "bg-white border border-[#e2e8f0] rounded-xl",
  cardSoft: "bg-[#f8fafc] border border-[#e2e8f0] rounded-xl",
  btn: "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none",
} as const;

// ===================== بادجات TheQ =====================
export type QBadgeTone = "trial" | "locked" | "premium" | "live" | "ok" | "warn";

export const QBadge: Record<QBadgeTone, string> = {
  trial: "bg-[#ecfdf5] text-[#047857]",
  locked: "bg-[#fff7ed] text-[#c2410c]",
  premium: "bg-[#fff7ed] text-[#f59200]",
  live: "bg-[#fff1f2] text-[#e11d48]",
  ok: "bg-[#ecfdf5] text-[#047857]",
  warn: "bg-[#fff7ed] text-[#c2410c]",
};

// صور المواد المنزّلة من المنصة (public/theq/subjects) — المصدر في
// .playwright-capture/theq/subject-images.json (نزّلت بـ q-26/q-27).
const ART_BY_ICON: Record<string, string> = {
  book: "/theq/subjects/arabic.png",
  globe: "/theq/subjects/english.png",
  calc: "/theq/subjects/math.png",
  atom: "/theq/subjects/science.png",
  flask: "/theq/subjects/science.png",
  leaf: "/theq/subjects/science.png",
  map: "/theq/subjects/social.png",
  star: "/theq/subjects/social.png",
};

const ART_BY_NAME: Record<string, string> = {
  "اللغة العربية": "/theq/subjects/arabic.png",
  "لغتي العربية": "/theq/subjects/arabic.png",
  "اللغة الإنجليزية": "/theq/subjects/english.png",
  "الرياضيات": "/theq/subjects/math.png",
  "الرياضة": "/theq/subjects/math.png",
  "العلوم": "/theq/subjects/science.png",
  "الفيزياء": "/theq/subjects/science.png",
  "الكيمياء": "/theq/subjects/science.png",
  "الأحياء": "/theq/subjects/science.png",
  "الدراسات الاجتماعية": "/theq/subjects/social.png",
  "الدراسات الإجتماعية": "/theq/subjects/social.png",
  "التربية الإسلامية": "/theq/subjects/social.png",
};

export function qSubjectArt(s: { name: string; icon?: string }): string {
  return ART_BY_NAME[s.name] ?? (s.icon ? (ART_BY_ICON[s.icon] ?? "") : "") ?? "";
}

// أيقونات الأدوات داخل صفحة المادة (public/theq/features)
export const Q_FEATURE_ART = {
  lectures: "/theq/features/lectures.png",
  exams: "/theq/features/exams.png",
  notes: "/theq/features/notes.png",
  statistics: "/theq/features/statistics.png",
  ask: "/theq/features/ask.png",
  flashcards: "/theq/features/exams.png",
  live: "/theq/features/lectures.png",
} as const;
