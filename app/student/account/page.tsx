"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon, DCard } from "@/components/ui";
import { gradeOf, activeSub, packageById } from "@/lib/data";

export default function AccountPage() {
  const { me, db, logout } = useStore();
  const router = useRouter();
  if (!me) return <AppShell role="student" dark>{null}</AppShell>;

  const grade = gradeOf(db, me.gradeId);
  const sub = activeSub(db, me.id);
  const pkg = sub ? packageById(db, sub.packageId) : null;

  const items: { label: string; icon: string; href?: string }[] = [
    { label: "الاشتراكات والمدفوعات", icon: "card", href: "/student/subscription" },
    { label: "نتائجي وتقاريري", icon: "chart", href: "/student/reports" },
    { label: "أولياء الأمور", icon: "users" },
    { label: "الإشعارات", icon: "bell" },
    { label: "الإعدادات", icon: "settings" },
  ];

  return (
    <AppShell role="student" dark>
      <div className="max-w-[560px] mx-auto space-y-6 animate-fade-up pt-4">

        {/* كارت البروفايل */}
        <DCard className="rounded-[22px] py-8 px-6 flex flex-col items-center text-center gap-3">
          <div className="w-24 h-24 rounded-full bg-[#d99e66] flex items-center justify-center text-4xl font-black text-white">
            {me.name[0]}
          </div>
          <div className="text-2xl font-black">{me.name}</div>
          <div className="text-sm font-bold text-[#9297a6]" dir="ltr">+965 {me.phone}</div>
          <div className="bg-[#1a3454] border border-[#2072e0] rounded-2xl px-4 py-2 text-[13px] font-bold text-[#4a9bf5]">
            {grade?.name}{pkg ? ` · ${pkg.name}` : " · بدون اشتراك"}
          </div>
        </DCard>

        {/* المنيو */}
        <div className="space-y-2.5">
          {items.map((it) => {
            const inner = (
              <>
                <span className="w-8 h-8 rounded-lg bg-[#212936] flex items-center justify-center shrink-0 text-[#9297a6]">
                  <Icon name={it.icon} size={16} />
                </span>
                <span className="flex-1 font-bold">{it.label}</span>
                <Icon name="back" size={14} className="text-[#9297a6] rotate-180" />
              </>
            );
            const cls = "w-full flex items-center gap-3.5 bg-[#161c29] border border-[#2b3547] rounded-2xl px-5 h-[62px] hover:border-[#2072e0]/60 transition-colors";
            return it.href
              ? <Link key={it.label} href={it.href} className={cls}>{inner}</Link>
              : <button key={it.label} className={cls}>{inner}</button>;
          })}
        </div>

        {/* تسجيل الخروج */}
        <button onClick={() => { logout(); router.push("/"); }}
          className="w-full flex items-center justify-center gap-2.5 bg-[#38191a] border border-[#e04d4d] rounded-2xl h-[58px] font-black text-[#e04d4d] hover:bg-[#e04d4d]/15 transition-colors">
          <Icon name="logout" size={18} /> تسجيل الخروج
        </button>

        <p className="text-center text-[13px] text-[#9297a6]/50">تفوّق © 2026 · الإصدار 1.0</p>
      </div>
    </AppShell>
  );
}
