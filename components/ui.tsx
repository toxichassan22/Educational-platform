import React from "react";

// ===================== أيقونات SVG =====================
const PATHS: Record<string, React.ReactNode> = {
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  calc: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8" /><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" /></>,
  flask: <><path d="M10 2v7L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  star: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></>,
  map: <><path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z" /><path d="M9 7v13M15 4v13" /></>,
  atom: <><circle cx="12" cy="12" r="1" /><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /></>,
  leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>,
  play: <polygon points="6 3 20 12 6 21 6 3" />,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
  x: <><path d="M18 6L6 18M6 6l12 12" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M18 17V9M13 17V5M8 17v-3" /></>,
  card: <><rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /></>,
  home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
  doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></>,
  video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>,
  award: <><circle cx="12" cy="8" r="7" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" /></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
  back: <><path d="M9 18l6-6-6-6" /></>,
  chevron: <><path d="M9 18l6-6-6-6" /></>,
  down: <><path d="M6 9l6 6 6-6" /></>,
  spark: <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></>,
  wallet: <><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5M12 15V3" /></>,
  refresh: <><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>,
  flame: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></>,
  bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></>,
  gem: <><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3L8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></>,
  gamepad: <><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01" /><path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.59C2.6 9.42 2 14.46 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.54-.6-6.58-.68-7.41A4 4 0 0 0 17.32 5z" /></>,
  rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
  send: <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>,
};

export function Icon({ name, size = 20, className = "", filled }: { name: string; size?: number; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {PATHS[name] ?? PATHS.book}
    </svg>
  );
}

// ===================== مكونات =====================
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl shadow-[0_1px_4px_rgba(15,40,60,.07)] ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "green" | "red" | "blue" | "amber" | "gray" }) {
  const tones = {
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-primary-100 text-primary-700",
    amber: "bg-amber-100 text-amber-700",
    gray: "bg-slate-100 text-slate-600",
  };
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

export function Progress({ value, color = "#0891b2", h = 8 }: { value: number; color?: string; h?: number }) {
  return (
    <div className="w-full bg-slate-100 rounded-full overflow-hidden" style={{ height: h }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", className = "", disabled, type = "button" }: {
  children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean;
  variant?: "primary" | "ghost" | "gold" | "danger" | "outline"; type?: "button" | "submit";
}) {
  const v = {
    primary: "text-white bg-primary-600 hover:bg-primary-700",
    gold: "text-night-950 bg-gold-500 hover:bg-gold-600",
    ghost: "bg-transparent text-primary-700 hover:bg-primary-50",
    outline: "border-2 border-primary-500 text-primary-700 hover:bg-primary-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none ${v[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Modal({ open, onClose, title, children, wide }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className={`relative bg-white w-full rounded-t-3xl sm:rounded-2xl p-6 animate-fade-up max-h-[90vh] overflow-y-auto ${wide ? "sm:max-w-2xl" : "sm:max-w-md"}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Icon name="x" size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Stat({ icon, label, value, sub, color = "#0891b2" }: { icon: string; label: string; value: React.ReactNode; sub?: string; color?: string }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18`, color }}>
        <Icon name={icon} size={22} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-primary-900 leading-tight">{value}</div>
        <div className="text-xs text-slate-500">{label}{sub ? ` · ${sub}` : ""}</div>
      </div>
    </Card>
  );
}

export function Logo({ size = 36, light }: { size?: number; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center font-black text-white shadow-lg shadow-primary-500/30"
        style={{ width: size, height: size, borderRadius: size * 0.32, background: "#0e7490", fontSize: size * 0.5 }}>
        ت
        <div className="absolute -top-1 -left-1 rounded-full bg-gold-400" style={{ width: size * 0.28, height: size * 0.28, opacity: .9 }} />
      </div>
      <div className={`font-black ${light ? "text-white" : "text-primary-950"}`} style={{ fontSize: size * 0.55, lineHeight: 1 }}>
        تفوّق
        <div className={`font-medium ${light ? "text-white/60" : "text-slate-400"}`} style={{ fontSize: size * 0.24, letterSpacing: ".02em", marginTop: size * 0.12 }}>ادرس بذكاء</div>
      </div>
    </div>
  );
}
