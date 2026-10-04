"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { QC, QFONT } from "@/lib/theme-q";
import type { QBadgeTone } from "@/lib/theme-q";
import { Icon } from "../ui";

const HOME: Record<string, string> = { student: "/student", parent: "/parent", admin: "/admin" };
const NOTIF: Record<string, string> = { student: "/student/notifications", parent: "/parent/notifications" };
const ACCOUNT: Record<string, string> = { student: "/student/account", parent: "/parent/account" };

/**
 * شريط TheQ العلوي: كحلي #082770.
 * يمين (بداية RTL): لوجو TheQ ثم عنوان الصفحة «الرئيسية».
 * يسار (نهاية RTL): جرس الإشعارات، علم الكويت دائري، أفاتار بنقطة خضراء.
 */
export function QTopBar({ title }: { title?: string }) {
  const { me } = useStore();
  const role = me?.role ?? "student";
  const pathname = usePathname();
  const isHome = pathname === HOME[role];

  return (
    <header className="sticky top-0 z-40 text-white" style={{ background: QC.navy, fontFamily: QFONT }}>
      <div className="max-w-350 mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* يمين: العنوان ثم اللوجو عند الطرف */}
        <div className="flex items-center gap-3 min-w-0">
          <h1
            className={`font-bold text-[15px] truncate px-3 py-1.5 rounded-lg ${isHome ? "bg-white/[0.09]" : ""}`}
          >
            {title ?? "الرئيسية"}
          </h1>
          <Link href={HOME[role]} className="flex items-center shrink-0" aria-label="The Q App">
            {/* لوجو المنصة الرسمي — public/theq/ui/logo.png */}
            <img src="/theq/ui/logo.png" alt="The Q App" className="h-[34px] w-auto" />
          </Link>
        </div>

        {/* يسار: جرس ثم علم ثم أفاتار */}
        <div className="flex items-center gap-2.5">
          {me && (
            <Link
              href={ACCOUNT[role] ?? HOME[role]}
              title={me.name}
              className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/25 hover:border-white/60 transition-colors shrink-0"
            >
              <img src="/theq/ui/avatar.png" alt={me.name} className="w-full h-full object-cover" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#082770]" style={{ background: QC.success }} />
            </Link>
          )}
          <span
            className="w-8 h-8 rounded-full overflow-hidden grid place-items-center border border-white/20 shrink-0"
            title="الكويت"
          >
            <img src="/theq/ui/kuwait.svg" alt="الكويت" className="w-full h-full object-cover" />
          </span>
          <Link
            href={NOTIF[role] ?? HOME[role]}
            title="الإشعارات"
            className="p-1.5 text-white/80 hover:text-white transition-colors"
          >
            <Icon name="bell" size={21} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function QMark({ size = 30 }: { size?: number }) {
  return <img src="/theq/ui/app-icon.png" alt="The Q" width={size} height={size} className="rounded-xl" />;
}

/** زر الدعم العائم على الطرف الأيسر — نفس موضعه في TheQ */
function QSupportFab() {
  return (
    <button
      title="تواصل معنا"
      className="fixed left-0 top-[62%] z-40 w-11 h-11 rounded-full grid place-items-center text-white shadow-lg shadow-[#006fff]/30 hover:scale-105 transition-transform -translate-x-1"
      style={{ background: QC.brand }}
    >
      <Icon name="headset" size={19} />
    </button>
  );
}

/**
 * هيكل صفحة TheQ: شريط كحلي + خلفية فاتحة.
 * صفحات الدخول والـ landing تستخدم تصميمها — هذه للطالب وولي الأمر فقط.
 */
export default function QShell({
  children,
  role,
  title,
  fab = true,
}: {
  children: React.ReactNode;
  role: string;
  title?: string;
  fab?: boolean;
}) {
  const { me, ready, logout } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && !me) router.replace("/login");
    else if (ready && me && me.role !== role) router.replace(HOME[me.role] ?? "/login");
  }, [ready, me, role, router]);

  if (!ready || !me || me.role !== role) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: QC.bg }}>
        <img src="/theq/ui/logo.png" alt="The Q App" className="h-16 w-auto animate-pop" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: QC.bgSoft, fontFamily: QFONT, color: QC.body }}>
      <QTopBar title={title} />
      <main className="flex-1 w-full max-w-350 mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
      {fab && <QSupportFab />}
      <QTabBar role={role} onLogout={logout} />
    </div>
  );
}

/** شريط سفلي (موبايل) */
function QTabBar({ role, onLogout }: { role: string; onLogout: () => void }) {
  const pathname = usePathname();
  const items =
    role === "student"
      ? [
          { href: "/student", label: "الرئيسية", icon: "home" },
          { href: "/student/browse", label: "المواد", icon: "book" },
          { href: "/student/history", label: "سجل المشاهدة", icon: "clock" },
          { href: "/student/reports", label: "تقاريري", icon: "chart" },
          { href: "/student/account", label: "حسابي", icon: "user" },
        ]
      : [
          { href: "/parent", label: "أبنائي", icon: "users" },
          { href: "/parent/notifications", label: "الإشعارات", icon: "bell" },
          { href: "/parent/account", label: "حسابي", icon: "user" },
        ];

  return (
    <nav className="md:hidden sticky bottom-0 z-40 border-t" style={{ background: QC.surface, borderColor: QC.line }}>
      <div className="flex">
        {items.map((i) => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors"
              style={{ color: active ? QC.brand : QC.faint }}
            >
              <Icon name={i.icon} size={19} />
              {i.label}
            </Link>
          );
        })}
        <button
          onClick={onLogout}
          className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold"
          style={{ color: QC.faint }}
        >
          <Icon name="logout" size={19} />
          خروج
        </button>
      </div>
    </nav>
  );
}

// ===================== عناصر مشتركة =====================

/** عنوان صفحة + سهم رجوع على يساره (نمط TheQ: العنوان يمين والسهم يساره) */
export function QPageHead({ children, href, sub }: { children: React.ReactNode; href?: string; sub?: string }) {
  const arrow = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={QC.faint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        <h2 className="text-[22px] font-extrabold" style={{ color: QC.ink }}>
          {children}
        </h2>
        {href ? <Link href={href} aria-label="رجوع">{arrow}</Link> : arrow}
      </div>
      {sub && (
        <p className="text-[12.5px] mt-1 font-semibold" style={{ color: QC.muted }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function QBackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 font-semibold text-[13px] hover:underline" style={{ color: QC.muted }}>
      {/* في RTL سهم الرجوع يشير لليمين */}
      <Icon name="chevron" size={16} className="rotate-180" />
      {children}
    </Link>
  );
}

export function QPill({ children, tone = "locked" }: { children: React.ReactNode; tone?: QBadgeTone }) {
  const tones = {
    trial: { bg: "#ecfdf5", fg: "#047857" },
    locked: { bg: "#fff7ed", fg: "#c2410c" },
    premium: { bg: "#fff7ed", fg: "#f59200" },
    live: { bg: "#fff1f2", fg: "#e11d48" },
    ok: { bg: "#ecfdf5", fg: "#047857" },
    warn: { bg: "#fff7ed", fg: "#c2410c" },
  } as const;
  const t = tones[tone];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold" style={{ background: t.bg, color: t.fg }}>
      {children}
    </span>
  );
}

export function QBtn({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  type = "button",
  className = "",
  style,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "soft" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  style?: React.CSSProperties;
}) {
  const v = {
    primary: { bg: QC.brand, fg: "#fff", bd: "transparent" },
    soft: { bg: QC.brandSoft, fg: QC.brandText, bd: "transparent" },
    outline: { bg: "transparent", fg: QC.brand, bd: QC.brandBorder },
    ghost: { bg: QC.surfaceSoft, fg: QC.body, bd: "transparent" },
    danger: { bg: QC.dangerSoft, fg: QC.danger, bd: "transparent" },
  } as const;
  const s = size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-4 py-2.5 text-[13px]";
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-colors active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none ${s} ${className}`;
  const st = { background: v[variant].bg, color: v[variant].fg, border: `1px solid ${v[variant].bd}`, ...style };

  if (href)
    return (
      <Link href={href} className={cls} style={st}>
        {children}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={st}>
      {children}
    </button>
  );
}

export function QCard({ children, className = "", pad = true }: { children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <div
      className={`rounded-xl border ${pad ? "p-5" : ""} ${className}`}
      style={{ background: QC.surface, borderColor: QC.line }}
    >
      {children}
    </div>
  );
}

export function QEmpty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-14">
      <div className="text-[15px] font-bold" style={{ color: QC.ink }}>
        {title}
      </div>
      {hint && (
        <div className="text-[13px] mt-1" style={{ color: QC.muted }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/** مودال فاتح بنمط TheQ (أبيض، X عند اليسار) */
export function QModal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0f172a]/50" />
      <div
        className={`relative w-full rounded-t-3xl sm:rounded-2xl p-6 animate-fade-up max-h-[90vh] overflow-y-auto bg-white ${wide ? "sm:max-w-2xl" : "sm:max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-extrabold" style={{ color: QC.ink }}>
            {title}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100" style={{ color: QC.faint }}>
            <Icon name="x" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
