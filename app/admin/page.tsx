"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Badge, Btn, Modal } from "@/components/ui";
import { gradeOf, userById, packageById } from "@/lib/data";
import CurriculumTab from "@/components/admin/CurriculumTab";
import QuestionsTab from "@/components/admin/QuestionsTab";

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: "chart" },
  { id: "curriculum", label: "المنهج والمحتوى", icon: "grid" },
  { id: "questions", label: "بنك الأسئلة", icon: "target" },
  { id: "users", label: "المستخدمون", icon: "users" },
  { id: "packages", label: "الباقات", icon: "wallet" },
  { id: "sales", label: "المبيعات", icon: "card" },
] as const;

export default function AdminPage() {
  const { db, toggleUser, addPackage, deletePackage, addDiscountCode, deleteDiscountCode, resetDemo } = useStore();
  const [tab, setTab] = useState<string>("overview");

  const [pkgOpen, setPkgOpen] = useState(false);
  const [pkgName, setPkgName] = useState("");
  const [pkgPrice, setPkgPrice] = useState(9.9);
  const [pkgPeriod, setPkgPeriod] = useState("شهريًا");
  const [dcCode, setDcCode] = useState("");
  const [dcPct, setDcPct] = useState(10);

  const students = db.users.filter((u) => u.role === "student");
  const activeSubs = db.subscriptions.filter((s) => s.status === "active");
  const revenue = db.payments.filter((p) => p.status === "success").reduce((t, p) => t + p.amountKwd, 0);
  const avgScore = db.attempts.length ? Math.round(db.attempts.reduce((t, a) => t + a.score / a.total, 0) / db.attempts.length * 100) : 0;

  return (
    <AppShell role="admin">
      <div className="space-y-6 animate-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-primary-900">لوحة تحكم الإدارة</h1>
            <p className="text-slate-400 text-sm">إدارة كاملة للمحتوى والمستخدمين والاشتراكات — دون الحاجة للمطوّر</p>
          </div>
          <Btn variant="ghost" className="text-xs" onClick={resetDemo}><Icon name="refresh" size={14} /> إعادة تعيين البيانات التجريبية</Btn>
        </div>

        {/* التبويبات */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${tab === t.id ? "bg-primary-800 text-white shadow" : "bg-white text-slate-500 border border-slate-200 hover:border-primary-300"}`}>
              <Icon name={t.icon} size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* ===== نظرة عامة ===== */}
        {tab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3"><Icon name="users" size={19} /></div>
                <div className="text-2xl font-extrabold text-primary-900">{students.length}</div>
                <div className="text-xs text-slate-400">طالب مسجل</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3"><Icon name="check" size={19} /></div>
                <div className="text-2xl font-extrabold text-primary-900">{activeSubs.length}</div>
                <div className="text-xs text-slate-400">اشتراك نشط</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-600 flex items-center justify-center mb-3"><Icon name="wallet" size={19} /></div>
                <div className="text-2xl font-extrabold text-primary-900">{revenue.toFixed(1)} <span className="text-sm">د.ك</span></div>
                <div className="text-xs text-slate-400">إجمالي الإيرادات</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3"><Icon name="target" size={19} /></div>
                <div className="text-2xl font-extrabold text-primary-900">{avgScore}%</div>
                <div className="text-xs text-slate-400">متوسط درجات الاختبارات</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5 border border-slate-100">
                <h3 className="font-extrabold text-primary-900 text-sm mb-4">المحتوى المنشور</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 rounded-xl p-4"><div className="text-2xl font-extrabold text-primary-800">{db.subjects.length}</div><div className="text-[10px] text-slate-400 mt-1">مادة</div></div>
                  <div className="bg-slate-50 rounded-xl p-4"><div className="text-2xl font-extrabold text-primary-800">{db.lessons.length}</div><div className="text-[10px] text-slate-400 mt-1">درس</div></div>
                  <div className="bg-slate-50 rounded-xl p-4"><div className="text-2xl font-extrabold text-primary-800">{db.questions.length}</div><div className="text-[10px] text-slate-400 mt-1">سؤال</div></div>
                </div>
              </Card>
              <Card className="p-5 border border-slate-100">
                <h3 className="font-extrabold text-primary-900 text-sm mb-4">أحدث المدفوعات</h3>
                <div className="space-y-2">
                  {db.payments.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-xl px-3 py-2">
                      <span className="font-bold text-primary-900">{userById(db, p.userId)?.name}</span>
                      <span className="text-xs text-slate-400">{p.packageName}</span>
                      <span className="font-extrabold text-primary-800 text-xs">{p.amountKwd} د.ك</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ===== المنهج ===== */}
        {tab === "curriculum" && <CurriculumTab />}

        {/* ===== الأسئلة ===== */}
        {tab === "questions" && <QuestionsTab />}

        {/* ===== المستخدمون ===== */}
        {tab === "users" && (
          <Card className="p-5 border border-slate-100">
            <h3 className="font-extrabold text-primary-900 mb-4">المستخدمون ({db.users.filter(u => u.role !== "admin").length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-bold">الاسم</th><th className="pb-3 font-bold">النوع</th>
                    <th className="pb-3 font-bold">الصف</th><th className="pb-3 font-bold">الاشتراك</th>
                    <th className="pb-3 font-bold">الحالة</th><th className="pb-3 font-bold"></th>
                  </tr>
                </thead>
                <tbody>
                  {db.users.filter((u) => u.role !== "admin").map((u) => {
                    const s = db.subscriptions.find((x) => x.userId === u.id && x.status === "active");
                    return (
                      <tr key={u.id} className="border-b border-slate-50 last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs">{u.name[0]}</div>
                            <div><div className="font-bold text-primary-900">{u.name}</div><div className="text-[10px] text-slate-400" dir="ltr">{u.phone}</div></div>
                          </div>
                        </td>
                        <td className="py-3"><Badge tone={u.role === "parent" ? "amber" : "blue"}>{u.role === "parent" ? "ولي أمر" : "طالب"}</Badge></td>
                        <td className="py-3 text-slate-500 text-xs">{u.gradeId ? gradeOf(db, u.gradeId)?.name : `${u.childrenIds?.length ?? 0} أبناء`}</td>
                        <td className="py-3 text-xs text-slate-500">{s ? packageById(db, s.packageId)?.name : "—"}</td>
                        <td className="py-3"><Badge tone={u.active ? "green" : "red"}>{u.active ? "نشط" : "موقوف"}</Badge></td>
                        <td className="py-3">
                          <Btn variant={u.active ? "danger" : "primary"} className="!py-1 !px-3 text-xs" onClick={() => toggleUser(u.id)}>
                            {u.active ? "إيقاف" : "تفعيل"}
                          </Btn>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ===== الباقات ===== */}
        {tab === "packages" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-primary-900">الباقات ({db.packages.length})</h3>
              <Btn onClick={() => setPkgOpen(true)}><Icon name="plus" size={15} /> باقة جديدة</Btn>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {db.packages.map((p) => {
                const count = db.subscriptions.filter((s) => s.packageId === p.id && s.status === "active").length;
                return (
                  <Card key={p.id} className="p-5 border border-slate-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-extrabold text-primary-900">{p.name}</div>
                        <div className="text-xs text-slate-400">{p.scope === "subject" ? "مادة واحدة" : p.scope === "stage" ? "مرحلة كاملة" : "كل المنصة"}</div>
                      </div>
                      {p.popular && <Badge tone="amber">مميزة</Badge>}
                    </div>
                    <div className="text-2xl font-extrabold text-primary-800 mb-3">{p.priceKwd} <span className="text-sm font-normal text-slate-400">د.ك / {p.period}</span></div>
                    <div className="text-xs text-slate-500 mb-4">{count} مشترك نشط</div>
                    <Btn variant="danger" className="w-full !py-1.5 text-xs" onClick={() => deletePackage(p.id)}><Icon name="trash" size={13} /> حذف</Btn>
                  </Card>
                );
              })}
            </div>

            {/* أكواد الخصم */}
            <Card className="p-5 border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-extrabold text-primary-900">أكواد الخصم ({db.discountCodes.length})</h3>
                <div className="flex items-center gap-2">
                  <input value={dcCode} onChange={(e) => setDcCode(e.target.value.toUpperCase())} placeholder="CODE" dir="ltr"
                    className="w-32 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary-400 text-left font-bold" />
                  <input type="number" value={dcPct} onChange={(e) => setDcPct(+e.target.value)} min={1} max={90} dir="ltr"
                    className="w-20 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary-400 text-left" />
                  <Btn className="!py-2 !px-3 text-xs" onClick={() => {
                    if (dcCode.trim() && dcPct > 0) { addDiscountCode(dcCode.trim(), dcPct); setDcCode(""); }
                  }}><Icon name="plus" size={13} /> إضافة</Btn>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {db.discountCodes.map((c) => (
                  <div key={c.code} className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                    <span className="font-black text-primary-800 text-sm" dir="ltr">{c.code}</span>
                    <Badge tone="amber">خصم {c.pct}%</Badge>
                    <button onClick={() => deleteDiscountCode(c.code)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
                {db.discountCodes.length === 0 && <p className="text-xs text-slate-400">لا توجد أكواد — أضف أول كود خصم</p>}
              </div>
            </Card>
          </div>
        )}

        {/* ===== المبيعات ===== */}
        {tab === "sales" && (
          <div className="space-y-4">
          <Card className="p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-primary-900">سجل المدفوعات</h3>
              <Badge tone="green">إجمالي ناجح: {revenue.toFixed(2)} د.ك</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-bold">#</th><th className="pb-3 font-bold">المشترك</th>
                    <th className="pb-3 font-bold">الباقة</th><th className="pb-3 font-bold">المبلغ</th>
                    <th className="pb-3 font-bold">الطريقة</th><th className="pb-3 font-bold">التاريخ</th><th className="pb-3 font-bold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {db.payments.map((p, i) => (
                    <tr key={p.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 text-slate-400 text-xs">{db.payments.length - i}</td>
                      <td className="py-3 font-bold text-primary-900">{userById(db, p.userId)?.name}</td>
                      <td className="py-3 text-slate-500 text-xs">{p.packageName}</td>
                      <td className="py-3 font-extrabold text-primary-800">{p.amountKwd} د.ك</td>
                      <td className="py-3"><Badge tone={p.method === "KNET" ? "blue" : "gray"}>{p.method}</Badge></td>
                      <td className="py-3 text-slate-400 text-xs">{p.date}</td>
                      <td className="py-3"><Badge tone={p.status === "success" ? "green" : p.status === "failed" ? "red" : "amber"}>{p.status === "success" ? "ناجحة" : p.status === "failed" ? "فاشلة" : "معلقة"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* الاشتراكات */}
          <Card className="p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-primary-900">الاشتراكات ({db.subscriptions.length})</h3>
              <Badge tone="green">{activeSubs.length} نشط</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-bold">المشترك</th><th className="pb-3 font-bold">الباقة</th>
                    <th className="pb-3 font-bold">البداية</th><th className="pb-3 font-bold">الانتهاء</th>
                    <th className="pb-3 font-bold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {[...db.subscriptions].sort((a, b) => b.startDate.localeCompare(a.startDate)).map((s) => (
                    <tr key={s.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 font-bold text-primary-900">{userById(db, s.userId)?.name}</td>
                      <td className="py-3 text-slate-500 text-xs">{packageById(db, s.packageId)?.name}</td>
                      <td className="py-3 text-slate-400 text-xs">{s.startDate}</td>
                      <td className="py-3 text-slate-400 text-xs">{s.endDate}</td>
                      <td className="py-3"><Badge tone={s.status === "active" ? "green" : "gray"}>{s.status === "active" ? "نشط" : "منتهي"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          </div>
        )}

        {/* مودال باقة جديدة */}
        <Modal open={pkgOpen} onClose={() => setPkgOpen(false)} title="إنشاء باقة جديدة">
          <div className="space-y-3">
            <input value={pkgName} onChange={(e) => setPkgName(e.target.value)} placeholder="اسم الباقة (مثال: باقة الفصل الأول)"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">السعر (د.ك)</label>
                <input type="number" value={pkgPrice} onChange={(e) => setPkgPrice(+e.target.value)} dir="ltr"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 text-left" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">المدة</label>
                <select value={pkgPeriod} onChange={(e) => setPkgPeriod(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none">
                  <option>شهريًا</option><option>فصليًا</option><option>سنويًا</option>
                </select>
              </div>
            </div>
            <Btn className="w-full" onClick={() => {
              if (pkgName.trim()) {
                addPackage({ name: pkgName.trim(), scope: "stage", priceKwd: pkgPrice, period: pkgPeriod, features: ["جميع المواد", "اختبارات غير محدودة", "تقارير أداء"] });
                setPkgName(""); setPkgOpen(false);
              }
            }}>إنشاء الباقة</Btn>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
