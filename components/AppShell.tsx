"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Icon, Logo, KuwaitFlag } from "./ui";
import NotifBell from "./NotifBell";

const NAV: Record<string, { href: string; label: string; icon: string }[]> = {
  student: [
    { href: "/student", label: "الرئيسية", icon: "home" },
    { href: "/student/browse", label: "المواد", icon: "gamepad" },
    { href: "/student/reports", label: "تقاريري", icon: "chart" },
    { href: "/student/subscription", label: "الباقات", icon: "gem" },
    { href: "/student/account", label: "حسابي", icon: "user" },
  ],
  parent: [
    { href: "/parent", label: "أبنائي", icon: "users" },
  ],
  admin: [
    { href: "/admin", label: "لوحة التحكم", icon: "settings" },
  ],
};

const HOME: Record<string, string> = { student: "/student", parent: "/parent", admin: "/admin" };

export default function AppShell({ children, role, dark }: { children: React.ReactNode; role: string; dark?: boolean }) {
  const { me, ready, logout } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !me) router.replace("/login");
    else if (ready && me && me.role !== role) router.replace(HOME[me.role] ?? "/login");
  }, [ready, me, role, router]);

  if (!ready || !me || me.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1217]">
        <div className="animate-pop"><Logo size={52} light /></div>
      </div>
    );
  }

  const items = NAV[role] ?? [];

  return (
    <div className="min-h-screen pb-24 md:pb-0 bg-[#0f1217] text-white">
        {/* الشريط العلوي — ثيم فيجما الداكن */}
        <header className="sticky top-0 z-40 bg-[#0f1217]/90 backdrop-blur-xl border-b border-[#2b3547]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between gap-4">
            <div className="flex items-center gap-7">
              <Link href={HOME[role]}><Logo size={38} light /></Link>
              <nav className="hidden md:flex items-center gap-1">
                {items.map((i) => {
                  const active = pathname === i.href;
                  return (
                    <Link key={i.href} href={i.href}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                        active ? "bg-[#1a2130] text-white border border-[#2b3547]" : "text-[#9297a6] hover:text-white"}`}>
                      <Icon name={i.icon} size={16} /> {i.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="hidden sm:flex items-center gap-2 bg-[#161c29] border border-[#2b3547] rounded-full px-3.5 py-2">
                <KuwaitFlag w={22} />
                <Icon name="down" size={10} className="text-[#9297a6]" />
              </span>
              <NotifBell dark />
              <Link href={role === "student" ? "/student/account" : HOME[role]} className="flex items-center gap-2.5 bg-[#161c29] border border-[#2b3547] rounded-full ps-1.5 pe-4 py-1.5 hover:border-[#2072e0]/60 transition-colors">
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm bg-[#d99e66]">
                  {me.name[0]}
                </span>
                <span className="hidden sm:block text-sm font-bold text-white leading-tight">{me.name}</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8">{children}</main>

        {/* شريط سفلي للموبايل — عائم */}
        <nav className="md:hidden fixed bottom-4 inset-x-4 z-40 bg-[#161c29]/95 backdrop-blur-xl border border-[#2b3547] rounded-3xl shadow-2xl shadow-black/50 flex px-2 py-2">
          {items.map((i) => {
            const active = pathname === i.href;
            return (
              <Link key={i.href} href={i.href}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl text-[11px] font-bold transition-all ${active ? "text-[#4a9bf5]" : "text-[#9297a6]/60"}`}>
                <span className={`p-1.5 rounded-xl transition-all ${active ? "bg-[#2072e0]/20" : ""}`}>
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
