"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QShell, { QPageHead, QCard, QBtn, QModal } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { gradeOf, activeSub, packageById } from "@/lib/data";
import { QC } from "@/lib/theme-q";

/** حساب الطالب — نمط «عام» في TheQ: فورم إعدادات + روابط الحساب */
export default function AccountPage() {
  const { me, db, logout, updateStudent } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [editing, setEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [logoutAsk, setLogoutAsk] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [examAlerts, setExamAlerts] = useState(true);

  if (!me) return <QShell role="student">{null}</QShell>;

  const grade = gradeOf(db, me.gradeId);
  const sub = activeSub(db, me.id);
  const pkg = sub ? packageById(db, sub.packageId) : null;
  const parent = db.users.find((u) => u.role === "parent" && (u.childrenIds ?? []).includes(me.id));

  const startEdit = () => {
    setName(me.name);
    setPhone(me.phone ?? "");
    setGradeId(me.gradeId ?? "");
    setEditing(true);
  };
  const save = () => {
    updateStudent(me.id, { name: name.trim() || me.name, phone, gradeId: gradeId || me.gradeId });
    setEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1800);
  };

  const menu: { label: string; icon: string; href: string }[] = [
    { label: "الاشتراكات والمدفوعات", icon: "card", href: "/student/subscription" },
    { label: "نتائجي وتقاريري", icon: "chart", href: "/student/reports" },
    { label: "الدروس المحفوظة", icon: "bookmark", href: "/student/saved" },
    { label: "سجل المشاهدة", icon: "clock", href: "/student/history" },
    { label: "الإشعارات", icon: "bell", href: "/student/notifications" },
  ];

  const inputCls = "w-full border rounded-xl px-4 py-3 text-[13.5px] outline-none focus:border-[#006fff] bg-white disabled:bg-slate-50 disabled:text-slate-500";

  return (
    <QShell role="student" title="حسابي">
      <div className="max-w-2xl">
        <QPageHead sub="حدّث إعدادات حسابك.">عام</QPageHead>

        <QCard className="!p-6 sm:!p-8">
          {/* الصورة الشخصية */}
          <div className="mb-7">
            <div className="text-[13px] font-bold mb-2.5" style={{ color: QC.ink }}>الصورة الشخصية</div>
            <div className="relative w-fit">
              <img src="/theq/ui/avatar.png" alt={me.name} className="w-20 h-20 rounded-xl object-cover border" style={{ borderColor: QC.line }} />
              <button className="absolute -bottom-1.5 -left-1.5 w-6 h-6 rounded-full grid place-items-center text-white" style={{ background: QC.brand }}>
                <Icon name="edit" size={11} />
              </button>
            </div>
          </div>

          {/* رقم الهاتف + الاسم */}
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <label className="text-[12.5px] font-bold block mb-1.5" style={{ color: QC.ink }}>رقم الهاتف</label>
              <div className="flex gap-2" dir="ltr">
                <span className="w-11 h-11 rounded-xl border overflow-hidden grid place-items-center shrink-0" style={{ borderColor: QC.line }}>
                  <img src="/theq/ui/kuwait.svg" alt="KW" className="w-full h-full object-cover" />
                </span>
                <input value={editing ? phone : `+965 ${me.phone ?? ""}`} onChange={(e) => setPhone(e.target.value)} disabled={!editing}
                  className={inputCls} style={{ borderColor: QC.line }} dir="ltr" />
              </div>
            </div>
            <div>
              <label className="text-[12.5px] font-bold block mb-1.5" style={{ color: QC.ink }}>الاسم الكامل</label>
              <input value={editing ? name : me.name} onChange={(e) => setName(e.target.value)} disabled={!editing}
                className={inputCls} style={{ borderColor: QC.line }} />
            </div>
            <div>
              <label className="text-[12.5px] font-bold block mb-1.5" style={{ color: QC.ink }}>الصف</label>
              <select value={editing ? gradeId : me.gradeId ?? ""} onChange={(e) => setGradeId(e.target.value)} disabled={!editing}
                className={inputCls} style={{ borderColor: QC.line }}>
                {db.grades.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12.5px] font-bold block mb-1.5" style={{ color: QC.ink }}>المنهج</label>
              <select disabled className={inputCls} style={{ borderColor: QC.line }}>
                <option>المنهج الحكومي العام</option>
              </select>
            </div>
          </div>

          {/* حالة الاشتراك */}
          <div className="mt-6 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3" style={{ background: pkg ? QC.successSoft : QC.bgSoft }}>
            <span className="text-[12.5px] font-bold flex items-center gap-2" style={{ color: QC.body }}>
              <Icon name="gem" size={15} style={{ color: pkg ? QC.success : QC.faint }} />
              {pkg ? `مشترك في ${pkg.name} · ينتهي ${sub?.endDate}` : "بدون اشتراك نشط"}
            </span>
            {!pkg && <QBtn href="/student/subscription" size="sm">اشترك الآن</QBtn>}
          </div>

          {/* ولي الأمر */}
          {parent && (
            <div className="mt-3 flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: QC.bgSoft }}>
              <img src="/theq/ui/avatar.png" alt="" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <div className="text-[12.5px] font-bold" style={{ color: QC.ink }}>ولي الأمر: {parent.name}</div>
                <div className="text-[11px]" style={{ color: QC.muted }} dir="ltr">+965 {parent.phone}</div>
              </div>
            </div>
          )}

          {/* مفاتيح الإشعارات */}
          <div className="mt-6 space-y-2.5">
            {[
              { label: "إشعارات البريد والرسائل", value: emailNotif, set: setEmailNotif },
              { label: "تنبيهات الاختبارات والمراجعات", value: examAlerts, set: setExamAlerts },
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

          {/* حفظ/إلغاء + خطر */}
          <div className="flex gap-3 mt-7">
            {editing ? (
              <>
                <QBtn onClick={save} className="!px-8">حفظ</QBtn>
                <QBtn variant="ghost" onClick={() => setEditing(false)}>إلغاء</QBtn>
              </>
            ) : (
              <QBtn onClick={startEdit} className="!px-8">تعديل البيانات</QBtn>
            )}
            {savedMsg && <span className="self-center text-[12px] font-bold" style={{ color: QC.success }}>تم الحفظ ✓</span>}
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t" style={{ borderColor: QC.line }}>
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

        {/* روابط الحساب */}
        <div className="mt-5 space-y-2.5">
          {menu.map((it) => (
            <Link key={it.label} href={it.href}
              className="w-full flex items-center gap-3.5 bg-white border rounded-2xl px-5 h-[58px] transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: QC.line }}>
              <span className="w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{ background: QC.surfaceSoft, color: QC.muted }}>
                <Icon name={it.icon} size={16} />
              </span>
              <span className="flex-1 font-bold text-[13.5px]" style={{ color: QC.ink }}>{it.label}</span>
              <Icon name="back" size={14} className="rotate-180" style={{ color: QC.faint }} />
            </Link>
          ))}
        </div>

        <p className="text-center text-[12px] mt-8" style={{ color: QC.faint }}>The Q © 2026 · الإصدار 1.0</p>
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
