"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon, DCard } from "@/components/ui";
import { gradeOf, activeSub, packageById, userById } from "@/lib/data";
import { buildNotifs, whenLabel } from "@/components/NotifBell";

type Panel = null | "parents" | "notifications" | "settings";

export default function AccountPage() {
  const { me, db, logout } = useStore();
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [emailNotif, setEmailNotif] = useState(true);
  const [examAlerts, setExamAlerts] = useState(true);

  if (!me) return <AppShell role="student" dark>{null}</AppShell>;

  const grade = gradeOf(db, me.gradeId);
  const sub = activeSub(db, me.id);
  const pkg = sub ? packageById(db, sub.packageId) : null;
  const notifs = buildNotifs(db, me);
  const parent = db.users.find((u) => u.role === "parent" && (u.childrenIds ?? []).includes(me.id));

  const items: { label: string; icon: string; href?: string; panel?: Panel }[] = [
    { label: "الاشتراكات والمدفوعات", icon: "card", href: "/student/subscription" },
    { label: "نتائجي وتقاريري", icon: "chart", href: "/student/reports" },
    { label: "أولياء الأمور", icon: "users", panel: "parents" },
    { label: "الإشعارات", icon: "bell", panel: "notifications" },
    { label: "الإعدادات", icon: "settings", panel: "settings" },
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

        {/* لوحة جانبية حسب الاختيار */}
        {panel === "parents" && (
          <DCard className="rounded-[22px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg">أولياء الأمور</h2>
              <button onClick={() => setPanel(null)} className="text-[#9297a6] hover:text-white"><Icon name="x" size={18} /></button>
            </div>
            {parent ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#1a2130] rounded-2xl p-4">
                  <div className="w-11 h-11 rounded-full bg-[#33bf6b] flex items-center justify-center font-black text-white">{parent.name[0]}</div>
                  <div>
                    <div className="font-bold">{parent.name}</div>
                    <div className="text-xs text-[#9297a6]" dir="ltr">+965 {parent.phone}</div>
                  </div>
                </div>
                <p className="text-sm text-[#9297a6] leading-relaxed">
                  ولي الأمر يتابع تقدمك ودرجاتك ويجدّد الاشتراك من لوحته. يمكنك التواصل معه مباشرة للاستفسارات.
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#9297a6]">لا يوجد ولي أمر مرتبط بحسابك بعد.</p>
            )}
          </DCard>
        )}

        {panel === "notifications" && (
          <DCard className="rounded-[22px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg">الإشعارات</h2>
              <button onClick={() => setPanel(null)} className="text-[#9297a6] hover:text-white"><Icon name="x" size={18} /></button>
            </div>
            <div className="space-y-2.5">
              {notifs.length === 0 && (
                <p className="text-sm text-[#9297a6] text-center py-4">لا توجد إشعارات جديدة.</p>
              )}
              {notifs.map((n) => (
                <div key={n.id} className="flex items-start gap-3 bg-[#1a2130] rounded-2xl p-3.5">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: n.color + "33", color: n.color }}>
                    <Icon name={n.icon} size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold leading-relaxed">{n.text}</div>
                    <div className="text-[11px] text-[#9297a6] mt-1">{whenLabel(n.ts)}</div>
                  </div>
                </div>
              ))}
            </div>
          </DCard>
        )}

        {panel === "settings" && (
          <DCard className="rounded-[22px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg">الإعدادات</h2>
              <button onClick={() => setPanel(null)} className="text-[#9297a6] hover:text-white"><Icon name="x" size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "إشعارات البريد والرسائل", value: emailNotif, set: setEmailNotif },
                { label: "تنبيهات الاختبارات والمراجعات", value: examAlerts, set: setExamAlerts },
              ].map((row) => (
                <button key={row.label}
                  onClick={() => row.set(!row.value)}
                  className="w-full flex items-center justify-between bg-[#1a2130] rounded-2xl px-4 py-3.5 hover:bg-[#1f2837] transition-colors">
                  <span className="text-sm font-bold">{row.label}</span>
                  <span className={`w-11 h-6 rounded-full transition-colors relative ${row.value ? "bg-[#2072e0]" : "bg-[#2b3547]"}`}>
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${row.value ? "right-0.5" : "right-5.5"}`}
                    />
                  </span>
                </button>
              ))}
              <Link href="/privacy" className="block text-center text-sm font-bold text-[#4a9bf5] hover:text-white py-2">
                سياسة الخصوصية والشروط
              </Link>
            </div>
          </DCard>
        )}

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
            if (it.href) return <Link key={it.label} href={it.href} className={cls}>{inner}</Link>;
            return (
              <button key={it.label} onClick={() => setPanel(panel === it.panel ? null : (it.panel ?? null))} className={cls}>
                {inner}
              </button>
            );
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
