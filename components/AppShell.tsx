"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Icon, Logo } from "./ui";
import NotifBell from "./NotifBell";

const NAV: Record<string, { href: string; label: string; icon: string }[]> = {
  student: [
    { href: "/student", label: "الرئيسية", icon: "home" },
    { href: "/student/browse", label: "المواد", icon: "gamepad" },
    { href: "/student/reports", label: "تقاريري", icon: "chart" },
    { href: "/student/subscription", label: "اشتراكي", icon: "gem" },
  ],
  parent: [
    { href: "/parent", label: "أبنائي", icon: "users" },
  ],
  admin: [
    { href: "/admin", label: "لوحة التحكم", icon: "settings" },
  ],
};

const HOME: Record<string, string> = { student: "/student", parent: "/parent", admin: "/admin" };

export default function AppShell({ children, role }: { children: React.ReactNode; role: string }) {
  const { me, ready, logout } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !me) router.replace("/login");
    else if (ready && me && me.role !== role) router.replace(HOME[me.role] ?? "/login");
  }, [ready, me, role, router]);

  if (!ready || !me || me.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-mesh">
        <div className="animate-pop"><Logo size={52} light /></div>
      </div>
    );
  }

  const items = NAV[role] ?? [];

  return (
    <div className="min-h-screen pb-24 md:pb-0 bg-[#f4f6f9]">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white shadow-[0_1px_0_rgba(8,51,68,.05),0_4px_20px_-8px_rgba(8,51,68,.12)]">
        <div className="max-w-6xl mx-auto px-4 h-[68px] flex items-center justify-between">
          <Link href={HOME[role]}><Logo size={38} /></Link>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 rounded-2xl p-1.5">
            {items.map((i) => {
              const active = pathname === i.href;
              return (
                <Link key={i.href} href={i.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    active ? "bg-white text-primary-700 shadow-md shadow-primary-900/8" : "text-slate-500 hover:text-primary-600"}`}>
                  <Icon name={i.icon} size={17} /> {i.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <NotifBell />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-extrabold text-primary-950 leading-tight">{me.name}</div>
              <div className="text-[11px] text-slate-400 font-medium">{role === "student" ? "طالب" : role === "parent" ? "ولي أمر" : "مدير المنصة"}</div>
            </div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-sm bg-primary-600">
              {me.name[0]}
            </div>
            <button onClick={() => { logout(); router.push("/"); }} title="تسجيل الخروج"
              className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
              <Icon name="logout" size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>

      {/* شريط سفلي للموبايل — عائم */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-40 bg-night-900/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-night-900/40 flex px-2 py-2">
        {items.map((i) => {
          const active = pathname === i.href;
          return (
            <Link key={i.href} href={i.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl text-[11px] font-bold transition-all ${active ? "text-primary-300" : "text-white/40"}`}>
              <span className={`p-1.5 rounded-xl transition-all ${active ? "bg-primary-500/20" : ""}`}>
                <Icon name={i.icon} size={20} />
              </span>
              {i.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
