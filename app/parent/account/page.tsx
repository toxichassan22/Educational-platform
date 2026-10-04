"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import QShell, { QPageHead, QCard, QBtn, QModal } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { QC } from "@/lib/theme-q";

/** حساب ولي الأمر — نفس نمط «عام» */
export default function ParentAccount() {
  const { me, db, logout } = useStore();
  const router = useRouter();
  const [logoutAsk, setLogoutAsk] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [childAlerts, setChildAlerts] = useState(true);

  if (!me) return <QShell role="parent">{null}</QShell>;
  const children = (me.childrenIds ?? []).map((id) => db.users.find((u) => u.id === id)).filter(Boolean);

  return (
    <QShell role="parent" title="حسابي">
      <div className="max-w-2xl">
        <QPageHead sub="إعدادات حساب ولي الأمر">عام</QPageHead>

        <QCard className="!p-6 sm:!p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img src="/theq/ui/avatar.png" alt={me.name} className="w-20 h-20 rounded-xl object-cover border" style={{ borderColor: QC.line }} />
              <button className="absolute -bottom-1.5 -left-1.5 w-6 h-6 rounded-full grid place-items-center text-white" style={{ background: QC.brand }}>
                <Icon name="edit" size={11} />
              </button>
            </div>
            <div>
              <div className="text-[18px] font-extrabold" style={{ color: QC.ink }}>{me.name}</div>
              <div className="text-[12.5px] font-semibold mt-0.5" style={{ color: QC.muted }} dir="ltr">+965 {me.phone}</div>
            </div>
          </div>

          <div className="rounded-xl px-4 py-3 mb-5" style={{ background: QC.brandSoft }}>
            <span className="text-[12.5px] font-bold flex items-center gap-2" style={{ color: QC.brandText }}>
              <Icon name="users" size={15} /> {children.length} {children.length === 1 ? "طالب مرتبط" : "طلاب مرتبطون"} بحسابك
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "إشعارات البريد والرسائل", value: emailNotif, set: setEmailNotif },
              { label: "تنبيهات أداء الأبناء", value: childAlerts, set: setChildAlerts },
            ].map((row) => (
              <button key={row.label} onClick={() => row.set(!row.value)}
                className="w-full flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-slate-50"
                style={{ background: QC.bgSoft }}>
                <span className="text-[13px] font-bold" style={{ color: QC.body }}>{row.label}</span>
                <span className="w-11 h-6 rounded-full relative transition-colors" style={{ background: row.value ? QC.brand : QC.lineSoft }}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${row.value ? "right-0.5" : "right-[22px]"}`} />
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: QC.line }}>
            <button onClick={() => setLogoutAsk(true)}
              className="px-4 py-2.5 rounded-xl border font-bold text-[12.5px] transition-colors hover:bg-rose-50"
              style={{ borderColor: "#fecaca", color: QC.danger }}>
              <Icon name="logout" size={14} className="inline ml-1" /> تسجيل الخروج
            </button>
            <button className="px-4 py-2.5 rounded-xl border font-bold text-[12.5px] transition-colors hover:bg-slate-50"
              style={{ borderColor: QC.line, color: QC.body }}>
              <Icon name="lock" size={14} className="inline ml-1" /> تغيير كلمة المرور
            </button>
          </div>
        </QCard>

        <p className="text-center text-[12px] mt-8" style={{ color: QC.faint }}>تفوّق © 2026 · الإصدار 1.0</p>
      </div>

      <QModal open={logoutAsk} onClose={() => setLogoutAsk(false)} title="تسجيل الخروج">
        <p className="text-[13.5px] mb-5" style={{ color: QC.body }}>متأكد إنك تبي تسجل خروج من حسابك؟</p>
        <div className="flex gap-3">
          <QBtn variant="danger" className="flex-1" onClick={() => { logout(); router.push("/"); }}>نعم، سجل خروج</QBtn>
          <QBtn variant="ghost" className="flex-1" onClick={() => setLogoutAsk(false)}>تراجع</QBtn>
        </div>
      </QModal>
    </QShell>
  );
}
