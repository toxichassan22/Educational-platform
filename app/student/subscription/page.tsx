"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Badge, Btn, Modal } from "@/components/ui";
import { activeSub, packageById, subjectsOfGrade, subjectById, Package } from "@/lib/data";

type Step = "choose" | "pay" | "processing" | "done";

export default function Subscription() {
  const { db, me, subscribe } = useStore();

  const [sel, setSel] = useState<Package | null>(null);
  const [step, setStep] = useState<Step>("choose");
  const [method, setMethod] = useState<"KNET" | "Visa" | "Mastercard">("KNET");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; pct: number } | null>(null);
  const [codeErr, setCodeErr] = useState("");
  const [subjPick, setSubjPick] = useState("");

  if (!me) return <AppShell role="student">{null}</AppShell>;
  const sub = activeSub(db, me.id);
  const currentPkg = sub ? packageById(db, sub.packageId) : null;
  const subSubject = sub?.subjectId ? subjectById(db, sub.subjectId) : null;
  const mySubjects = subjectsOfGrade(db, me.gradeId);
  const myPayments = db.payments.filter((p) => p.userId === me.id);

  const applyCode = () => {
    const found = db.discountCodes.find((c) => c.code === code.trim().toUpperCase());
    if (found) { setApplied(found); setCodeErr(""); }
    else { setApplied(null); setCodeErr("كود غير صحيح"); }
  };

  const finalPrice = sel ? Math.max(0, sel.priceKwd * (1 - (applied?.pct ?? 0) / 100)) : 0;

  const pay = () => {
    setStep("processing");
    setTimeout(() => {
      subscribe(me.id, sel!.id, method, Number(finalPrice.toFixed(2)), sel!.scope === "subject" ? subjPick : undefined);
      setStep("done");
    }, 1800);
  };

  const daysLeft = sub ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86400000)) : 0;

  return (
    <AppShell role="student">
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900">الاشتراك والباقات</h1>
          <p className="text-slate-400 text-sm">اختر الباقة المناسبة وادفع بأمان عبر KNET أو Visa</p>
        </div>

        {/* الاشتراك الحالي */}
        {sub && currentPkg && (
          <Card className="p-5 border-2 border-emerald-200 bg-emerald-50/50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Icon name="check" size={22} />
                </div>
                <div>
                  <div className="font-extrabold text-primary-900">{currentPkg.name} <Badge tone="green">نشط</Badge></div>
                  <div className="text-xs text-slate-500 mt-1">
                    من {sub.startDate} إلى {sub.endDate} · متبقّي {daysLeft} يومًا
                    {subSubject && <> · يفتح مادة <b className="text-primary-700">{subSubject.name}</b> فقط</>}
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400">التجديد التلقائي</div>
                <div className="font-bold text-sm text-primary-800">مفعّل</div>
              </div>
            </div>
          </Card>
        )}

        {/* الباقات */}
        <div className="grid sm:grid-cols-3 gap-4">
          {db.packages.map((p) => {
            const isCurrent = currentPkg?.id === p.id;
            return (
              <div key={p.id} className={`relative rounded-3xl p-6 flex flex-col transition-all ${p.popular ? "bg-night-900 text-white" : "bg-white border border-slate-200 card-hover"} ${isCurrent ? "ring-2 ring-emerald-400" : ""}`}>
                {p.popular && <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-gold-500 text-night-950 text-[10px] font-black px-3 py-1 rounded-full">الأكثر اشتراكًا</div>}
                <h3 className={`font-black text-center ${p.popular ? "text-white" : "text-primary-950"}`}>{p.name}</h3>
                <div className="text-center my-4">
                  <span className={`text-3xl font-black ${p.popular ? "text-gold-400" : "text-primary-800"}`}>{p.priceKwd}</span>
                  <span className={`text-xs ${p.popular ? "text-white/50" : "text-slate-400"}`}> د.ك / {p.period}</span>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-xs ${p.popular ? "text-white/80" : "text-slate-600"}`}>
                      <span className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 ${p.popular ? "bg-emerald-400/20 text-emerald-300" : "bg-emerald-50 text-emerald-500"}`}>
                        <Icon name="check" size={11} />
                      </span> {f}
                    </li>
                  ))}
                </ul>
                <Btn variant={isCurrent ? "outline" : p.popular ? "gold" : "primary"} className="w-full" disabled={isCurrent}
                  onClick={() => { setSel(p); setStep("choose"); setApplied(null); setCode(""); setSubjPick(""); }}>
                  {isCurrent ? "باقتك الحالية" : "اشترك"}
                </Btn>
              </div>
            );
          })}
        </div>

        {/* سجل المدفوعات */}
        <Card className="p-6 border border-slate-100">
          <h2 className="font-extrabold text-primary-900 mb-4">سجل المدفوعات</h2>
          {myPayments.length === 0 && <p className="text-sm text-slate-400">لا توجد مدفوعات سابقة</p>}
          <div className="space-y-2">
            {myPayments.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary-600">
                  <Icon name="card" size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-primary-900">{p.packageName}</div>
                  <div className="text-[11px] text-slate-400">{p.date} · {p.method}</div>
                </div>
                <div className="font-extrabold text-primary-800">{p.amountKwd} د.ك</div>
                <Badge tone={p.status === "success" ? "green" : p.status === "failed" ? "red" : "amber"}>
                  {p.status === "success" ? "ناجحة" : p.status === "failed" ? "فاشلة" : "معلقة"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ===== مودال الدفع ===== */}
      <Modal open={!!sel && step !== "done"} onClose={() => { setSel(null); setStep("choose"); }} title={`إتمام الاشتراك — ${sel?.name ?? ""}`}>
        {sel && step === "choose" && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-primary-900">{sel.name}</div>
                <div className="text-xs text-slate-400">{sel.period}</div>
              </div>
              <div className="text-xl font-extrabold text-primary-800">{sel.priceKwd} د.ك</div>
            </div>

            {/* باقة المادة: الطالب يختار مادة واحدة تُفتح له */}
            {sel.scope === "subject" && (
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">اختر المادة اللي تفتحها</label>
                <div className="grid grid-cols-2 gap-2">
                  {mySubjects.map((s) => (
                    <button key={s.id} type="button" onClick={() => setSubjPick(s.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm font-bold transition-all ${subjPick === s.id ? "border-primary-500 bg-primary-50 text-primary-800" : "border-slate-200 text-slate-500 hover:border-primary-200"}`}>
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                        <Icon name={s.icon} size={14} />
                      </span>
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
                {!subjPick && <div className="text-[11px] text-amber-600 mt-1.5 font-bold">اختر مادة واحدة — باقي المواد تفضل مقفولة</div>}
              </div>
            )}

            {/* كود الخصم */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">كود الخصم (جرّب KUWAIT20)</label>
              <div className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" placeholder="XXXX"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 text-left" />
                <Btn variant="outline" onClick={applyCode}>تطبيق</Btn>
              </div>
              {codeErr && <div className="text-xs text-red-500 mt-1">{codeErr}</div>}
              {applied && <div className="text-xs text-emerald-600 mt-1 font-bold">تم تطبيق خصم {applied.pct}%</div>}
            </div>

            {/* طريقة الدفع */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">طريقة الدفع</label>
              <div className="grid grid-cols-3 gap-2">
                {(["KNET", "Visa", "Mastercard"] as const).map((m) => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={`py-3 rounded-xl border-2 font-extrabold text-sm transition-all ${method === m ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-500"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500"><span>السعر</span><span>{sel.priceKwd} د.ك</span></div>
              {applied && <div className="flex justify-between text-emerald-600"><span>خصم {applied.pct}%</span><span>-{(sel.priceKwd * applied.pct / 100).toFixed(2)} د.ك</span></div>}
              <div className="flex justify-between font-extrabold text-primary-900 text-base pt-1"><span>الإجمالي</span><span>{finalPrice.toFixed(2)} د.ك</span></div>
            </div>

            <Btn variant="gold" className="w-full !py-3" disabled={sel.scope === "subject" && !subjPick} onClick={() => setStep("pay")}>متابعة للدفع</Btn>
            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <Icon name="lock" size={11} /> دفع آمن ومشفر — بيئة تجريبية (Sandbox)
            </p>
          </div>
        )}

        {sel && step === "pay" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 text-white flex items-center justify-between bg-night-900">
              <div>
                <div className="text-[10px] text-white/60">إجمالي المبلغ</div>
                <div className="text-2xl font-extrabold">{finalPrice.toFixed(2)} د.ك</div>
              </div>
              <div className="font-extrabold text-lg bg-white/15 px-4 py-1.5 rounded-xl">{method}</div>
            </div>
            {method === "KNET" ? (
              <div className="space-y-3">
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-600 outline-none">
                  <option>بنك الكويت الوطني NBK</option><option>بيت التمويل الكويتي KFH</option><option>بنك بوبيان</option><option>البنك الأهلي المتحد</option>
                </select>
                <input dir="ltr" placeholder="رقم البطاقة" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-left" />
                <div className="grid grid-cols-2 gap-3">
                  <input dir="ltr" placeholder="MM/YY" className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-left" />
                  <input dir="ltr" placeholder="PIN" type="password" className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-left" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input dir="ltr" placeholder="رقم البطاقة  ••••  ••••  ••••" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-left" />
                <input placeholder="الاسم على البطاقة" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400" />
                <div className="grid grid-cols-2 gap-3">
                  <input dir="ltr" placeholder="MM/YY" className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-left" />
                  <input dir="ltr" placeholder="CVV" type="password" className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-left" />
                </div>
              </div>
            )}
            <Btn variant="gold" className="w-full !py-3" onClick={pay}>ادفع {finalPrice.toFixed(2)} د.ك</Btn>
            <button onClick={() => setStep("choose")} className="w-full text-xs text-slate-400 font-bold">← رجوع</button>
          </div>
        )}

        {step === "processing" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin mb-5" />
            <div className="font-bold text-primary-900">جارٍ معالجة الدفع…</div>
            <div className="text-xs text-slate-400 mt-1">التواصل مع بوابة {method} الآمنة</div>
          </div>
        )}
      </Modal>

      {/* نجاح الدفع */}
      <Modal open={step === "done"} onClose={() => { setSel(null); setStep("choose"); }} title="">
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mb-4 animate-pop">
            <Icon name="check" size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-primary-900 mb-1">تم الدفع بنجاح!</h3>
          <p className="text-sm text-slate-500 mb-1">اشتراكك في «{sel?.name}» مفعّل الآن</p>
          <p className="text-xs text-slate-400 mb-6">أُرسل إشعار تأكيد إلى بريدك الإلكتروني</p>
          <Btn className="w-full" onClick={() => { setSel(null); setStep("choose"); }}>متابعة الدراسة</Btn>
        </div>
      </Modal>
    </AppShell>
  );
}
