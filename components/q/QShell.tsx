"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { QC, QFONT } from "@/lib/theme-q";
import type { QBadgeTone } from "@/lib/theme-q";
import { Icon } from "../ui";

const HOME: Record<string, string> = { student: "/student", parent: "/parent", admin: "/admin" };

const ROLE_TITLE: Record<string, string> = {
  student: "الرئيسية",
  parent: "حساب ولي الأمر",
};

/** شريط TheQ: كحلي #082770 + عنوان الصفحة + أيقونات يسار + لوجو يمين */
export function QTopBar({ title, children }: { title?: string; children?: React.ReactNode }) {
  const { me } = useStore();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className="sticky top-0 z-40 text-white"
      style={{ background: QC.navy, fontFamily: QFONT }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between gap-4">
        {/* يمين (بداية RTL): اللوجو ثم عنوان الصفحة */}
        <div className="flex items-center gap-4 min-w-0">
          <Link href={HOME[me?.role ?? "student"]} className="flex items-center gap-2 shrink-0">
            <QMark />
            <span className="hidden sm:block font-extrabold text-[15px] tracking-tight">
              The<span className="text-[#4da3ff]">Q</span>
            </span>
          </Link>
          <span className="w-px h-6 bg-white/20 hidden sm:block" />
          <h1 className="font-semibold text-[15px] truncate">{title ?? ROLE_TITLE[me?.role ?? "student"]}</h1>
        </div>

        {/* يسار: children ثم الأدوات */}
        <div className="flex items-center gap-1.5">
          {children}
          <Link
            href={HOME[me?.role ?? "student"]}
            title="الرئيسية"
            className={`p-2 rounded-lg transition-colors hover:bg-white/10 ${isActive("/student") || isActive("/parent") ? "bg-white/15" : ""}`}
          >
            <Icon name="home" size={19} />
          </Link>
          <button
            title="اللغة"
            className="w-9 h-9 rounded-full grid place-items-center text-[11px] font-extrabold hover:bg-white/10 transition-colors"
          >
            ع
          </button>
          {me && (
            <Link
              href={me.role === "student" ? "/student/account" : HOME[me.role]}
              title={me.name}
              className="w-9 h-9 rounded-full grid place-items-center font-extrabold text-[13px] text-[#082770] hover:ring-2 hover:ring-white/40 transition"
              style={{ background: "#cfe0ff" }}
            >
              {me.name[0]}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function QMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="11" fill="#ffffff" fillOpacity="0.14" />
      {/* حرف Q مبسّط: دائرة + ذيل */}
      <circle cx="19" cy="19" r="10" fill="none" stroke="#fff" strokeWidth="3.2" />
      <path d="M25.5 25.5 L32 32" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="19" cy="19" r="3.4" fill="#4da3ff" />
    </svg>
  );
}

/**
 * هيكل صفحة TheQ: شريط كحلي + خلفية فاتحة.
 * صفحات الدخول والـ landing تستخدم AppShell/تصميمها هي — هذه للطالب وولي الأمر فقط.
 */
export default function QShell({
  children,
  role,
  title,
}: {
  children: React.ReactNode;
  role: string;
  title?: string;
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
        <div className="animate-pop flex items-center gap-2" style={{ fontFamily: QFONT }}>
          <QMark size={44} />
          <span className="font-extrabold text-xl" style={{ color: QC.navy }}>
            TheQ
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: QC.bg, fontFamily: QFONT, color: QC.body }}>
      <QTopBar title={title} />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
      <QTabBar role={role} onLogout={logout} />
    </div>
  );
}

/** شريط سفلي (موبايل) — نفس نمط TheQ */
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
    <nav
      className="md:hidden sticky bottom-0 z-40 border-t"
      style={{ background: QC.surface, borderColor: QC.line }}
    >
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

export function QPageTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-extrabold" style={{ color: QC.ink }}>
        {children}
      </h2>
      {sub && (
        <p className="text-[13px] mt-0.5" style={{ color: QC.muted }}>
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
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "soft" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
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
  const st = { background: v[variant].bg, color: v[variant].fg, border: `1px solid ${v[variant].bd}` };

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
