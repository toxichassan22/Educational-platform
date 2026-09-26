"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon, DCard, Modal } from "@/components/ui";
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

  if (!me) return <AppShell role="student" dark>{null}</AppShell>;
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
    <AppShell role="student" dark>
      <div className="space-y-8 animate-fade-up">
        <div className="text-center pt-4">
          <h1 className="text-3xl sm:text-4xl font-black mb-3">اختار الباقة اللي تناسبك</h1>
          <p className="text-[#9297a6]">كل الباقات تشمل الفيديوهات والمذكرات والاختبارات</p>
        </div>

        {/* الاشتراك الحالي */}
        {sub && currentPkg && (
          <DCard className="p-5 !border-[#33bf6b]/40 bg-[#33bf6b]/5 max-w-3xl mx-auto w-full">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1a3d24] text-[#33bf6b] flex items-center justify-center">
                  <Icon name="check" size={22} />
                </div>
                <div>
                  <div className="font-black text-white flex items-center gap-2">{currentPkg.name}
                    <span className="text-[10px] font-black bg-[#1a3d24] text-[#33bf6b] px-2 py-0.5 rounded-full">نشط</span>
                  </div>
                  <div className="text-xs text-[#9297a6] mt-1">
                    من {sub.startDate} إلى {sub.endDate} · متبقّي {daysLeft} يومًا
                    {subSubject && <> · يفتح مادة <b className="text-[#4a9bf5]">{subSubject.name}</b> فقط</>}
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs text-[#9297a6]">التجديد التلقائي</div>
                <div className="font-bold text-sm">مفعّل</div>
              </div>
            </div>
          </DCard>
        )}

        {/* الباقات — 3 كروت، الوسطى مميزة */}
        <div className="flex flex-wrap items-stretch justify-center gap-6">
          {db.packages.map((p) => {
            const isCurrent = currentPkg?.id === p.id;
            const popular = !!p.popular;
            return (
              <div key={p.id}
                className={`relative rounded-[22px] p-7 flex flex-col w-full sm:w-[300px] transition-all ${
                  popular ? "bg-[#1a2c4d] border-[2.5px] border-[#2072e0] sm:scale-[1.06] shadow-2xl shadow-[#2072e0]/15" : "bg-[#161c29] border border-[#2b3547]"
                } ${isCurrent ? "ring-2 ring-[#33bf6b]" : ""}`}>
                {popular && (
                  <div className="absolute -top-3.5 right-1/2 translate-x-1/2 bg-[#2072e0] text-white text-xs font-black px-4 py-1.5 rounded-xl whitespace-nowrap">
                    الأكثر اشتراكًا
                  </div>
                )}
                <h3 className="font-black text-lg text-center mt-2">{p.name}</h3>
                <div className="text-center my-5 flex items-baseline justify-center gap-1.5" dir="ltr">
                  <span className={`text-6xl font-black ${popular ? "text-[#4a9bf5]" : "text-white"}`}>{p.priceKwd}</span>
                  <span className="text-sm font-bold text-[#9297a6]">د.ك</span>
                </div>
                <div className="text-center text-sm font-bold text-[#9297a6] mb-5 -mt-3">{p.period}</div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="font-black text-[#33bf6b]">✓</span>
                      <span className="text-[#c6cfdd]">{f}</span>
                    </li>
                  ))}
                </ul>
                <button disabled={isCurrent}
                  onClick={() => { setSel(p); setStep("choose"); setApplied(null); setCode(""); setSubjPick(""); }}
                  className={`w-full h-[52px] rounded-full font-black text-sm transition-all active:scale-[.98] disabled:opacity-60 ${
                    isCurrent ? "bg-[#1a2130] border border-[#2b3547] text-[#9297a6]"
                    : popular ? "bg-[#2072e0] hover:bg-[#1b63c4] text-white shadow-lg shadow-[#2072e0]/25"
                    : "bg-[#29344a] hover:bg-[#323f57] text-white"}`}>
                  {isCurrent ? "باقتك الحالية" : "اشترك الآن"}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm font-bold text-[#9297a6]">دفع آمن عبر KNET · Apple Pay · Visa</p>

        {/* سجل المدفوعات */}
        <DCard className="p-6 max-w-3xl mx-auto w-full">
          <h2 className="font-black mb-4">سجل المدفوعات</h2>
          {myPayments.length === 0 && <p className="text-sm text-[#9297a6]">لا توجد مدفوعات سابقة</p>}
          <div className="space-y-2">
            {myPayments.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1a2130]">
                <div className="w-10 h-10 rounded-xl bg-[#212936] border border-[#2b3547] flex items-center justify-center text-[#4a9bf5]">
                  <Icon name="card" size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{p.packageName}</div>
                  <div className="text-[11px] text-[#9297a6]">{p.date} · {p.method}</div>
                </div>
                <div className="font-black text-[#4a9bf5]">{p.amountKwd} د.ك</div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  p.status === "success" ? "bg-[#1a3d24] text-[#33bf6b]" : p.status === "failed" ? "bg-[#3d1a1a] text-[#e04d4d]" : "bg-[#3d321a] text-[#f5b329]"}`}>
                  {p.status === "success" ? "ناجحة" : p.status === "failed" ? "فاشلة" : "معلقة"}
                </span>
              </div>
            ))}
          </div>
        </DCard>
      </div>

      {/* ===== مودال الدفع ===== */}
      <Modal dark open={!!sel && step !== "done"} onClose={() => { setSel(null); setStep("choose"); }} title={`إتمام الاشتراك — ${sel?.name ?? ""}`}>
        {sel && step === "choose" && (
          <div className="space-y-4">
            <div className="bg-[#1a2130] rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-bold">{sel.name}</div>
                <div className="text-xs text-[#9297a6]">{sel.period}</div>
              </div>
              <div className="text-xl font-black text-[#4a9bf5]">{sel.priceKwd} د.ك</div>
            </div>

            {/* باقة المادة: الطالب يختار مادة واحدة تُفتح له */}
            {sel.scope === "subject" && (
              <div>
                <label className="text-xs font-bold text-[#9297a6] block mb-1.5">اختر المادة اللي تفتحها</label>
                <div className="grid grid-cols-2 gap-2">
                  {mySubjects.map((s) => (
                    <button key={s.id} type="button" onClick={() => setSubjPick(s.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm font-bold transition-all ${subjPick === s.id ? "border-[#2072e0] bg-[#1a3454] text-white" : "border-[#2b3547] text-[#9297a6] hover:border-[#2072e0]/50"}`}>
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                        <Icon name={s.icon} size={14} />
                      </span>
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
                {!subjPick && <div className="text-[11px] text-[#f5b329] mt-1.5 font-bold">اختر مادة واحدة — باقي المواد تفضل مقفولة</div>}
              </div>
            )}

            {/* كود الخصم */}
            <div>
              <label className="text-xs font-bold text-[#9297a6] block mb-1.5">كود الخصم (جرّب KUWAIT20)</label>
              <div className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" placeholder="XXXX"
                  className="flex-1 bg-[#1a2130] border border-[#2b3547] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2072e0] text-left placeholder:text-[#9297a6]/50" />
                <button onClick={applyCode}
                  className="border border-[#2072e0] text-[#4a9bf5] font-bold text-sm px-4 rounded-xl hover:bg-[#2072e0]/10 transition-colors">تطبيق</button>
              </div>
              {codeErr && <div className="text-xs text-[#e04d4d] mt-1">{codeErr}</div>}
              {applied && <div className="text-xs text-[#33bf6b] mt-1 font-bold">تم تطبيق خصم {applied.pct}%</div>}
            </div>

            {/* طريقة الدفع */}
            <div>
              <label className="text-xs font-bold text-[#9297a6] block mb-1.5">طريقة الدفع</label>
              <div className="grid grid-cols-3 gap-2">
                {(["KNET", "Visa", "Mastercard"] as const).map((m) => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${method === m ? "border-[#2072e0] bg-[#1a3454] text-[#4a9bf5]" : "border-[#2b3547] text-[#9297a6]"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#2b3547] pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-[#9297a6]"><span>السعر</span><span>{sel.priceKwd} د.ك</span></div>
              {applied && <div className="flex justify-between text-[#33bf6b]"><span>خصم {applied.pct}%</span><span>-{(sel.priceKwd * applied.pct / 100).toFixed(2)} د.ك</span></div>}
              <div className="flex justify-between font-black text-white text-base pt-1"><span>الإجمالي</span><span>{finalPrice.toFixed(2)} د.ك</span></div>
            </div>

            <button className="w-full h-[52px] rounded-full font-black text-[#0f1217] bg-[#f5b329] hover:bg-[#e0a41f] transition-all active:scale-[.98] disabled:opacity-50"
              disabled={sel.scope === "subject" && !subjPick} onClick={() => setStep("pay")}>متابعة للدفع</button>
            <p className="text-[10px] text-[#9297a6] text-center flex items-center justify-center gap-1">
              <Icon name="lock" size={11} /> دفع آمن ومشفر — بيئة تجريبية (Sandbox)
            </p>
          </div>
        )}

        {sel && step === "pay" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 text-white flex items-center justify-between bg-[#1a2c4d] border border-[#2072e0]/40">
              <div>
                <div className="text-[10px] text-[#9297a6]">إجمالي المبلغ</div>
                <div className="text-2xl font-black">{finalPrice.toFixed(2)} د.ك</div>
              </div>
              <div className="font-black text-lg bg-white/10 px-4 py-1.5 rounded-xl">{method}</div>
            </div>
            {method === "KNET" ? (
              <div className="space-y-3">
                <select className="w-full bg-[#1a2130] border border-[#2b3547] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2072e0]">
                  <option>بنك الكويت الوطني NBK</option><option>بيت التمويل الكويتي KFH</option><option>بنك بوبيان</option><option>البنك الأهلي المتحد</option>
                </select>
                <input dir="ltr" placeholder="رقم البطاقة" className="w-full bg-[#1a2130] border border-[#2b3547] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2072e0] text-left placeholder:text-[#9297a6]/50" />
                <div className="grid grid-cols-2 gap-3">
                  <input dir="ltr" placeholder="MM/YY" className="bg-[#1a2130] border border-[#2b3547] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2072e0] text-left placeholder:text-[#9297a6]/50" />
                  <input dir="ltr" placeholder="PIN" type="password" className="bg-[#1a2130] border border-[#2b3547] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2072e0] text-left placeholder:text-[#9297a6]/50" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input dir="ltr" placeholder="رقم البطاقة  ••••  ••••  ••••" className="w-full bg-[#1a2130] border border-[#2b3547] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2072e0] text-left placeholder:text-[#9297a6]/50" />
                <input placeholder="الاسم على البطاقة" className="w-full bg-[#1a2130] border border-[#2b3547] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2072e0] placeholder:text-[#9297a6]/50" />
                <div className="grid grid-cols-2 gap-3">
                  <input dir="ltr" placeholder="MM/YY" className="bg-[#1a2130] border border-[#2b3547] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2072e0] text-left placeholder:text-[#9297a6]/50" />
                  <input dir="ltr" placeholder="CVV" type="password" className="bg-[#1a2130] border border-[#2b3547] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2072e0] text-left placeholder:text-[#9297a6]/50" />
                </div>
              </div>
            )}
            <button className="w-full h-[52px] rounded-full font-black text-[#0f1217] bg-[#f5b329] hover:bg-[#e0a41f] transition-all active:scale-[.98]" onClick={pay}>ادفع {finalPrice.toFixed(2)} د.ك</button>
            <button onClick={() => setStep("choose")} className="w-full text-xs text-[#9297a6] font-bold">← رجوع</button>
          </div>
        )}

        {step === "processing" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#2b3547] border-t-[#2072e0] animate-spin mb-5" />
            <div className="font-bold text-white">جارٍ معالجة الدفع…</div>
            <div className="text-xs text-[#9297a6] mt-1">التواصل مع بوابة {method} الآمنة</div>
          </div>
        )}
      </Modal>

      {/* نجاح الدفع */}
      <Modal dark open={step === "done"} onClose={() => { setSel(null); setStep("choose"); }} title="">
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#1a3d24] text-[#33bf6b] flex items-center justify-center mb-4 animate-pop">
            <Icon name="check" size={40} />
          </div>
          <h3 className="text-xl font-black text-white mb-1">تم الدفع بنجاح!</h3>
          <p className="text-sm text-[#9297a6] mb-1">اشتراكك في «{sel?.name}» مفعّل الآن</p>
          <p className="text-xs text-[#9297a6]/70 mb-6">أُرسل إشعار تأكيد إلى بريدك الإلكتروني</p>
          <button className="w-full h-[52px] rounded-full font-black text-white bg-[#2072e0] hover:bg-[#1b63c4] transition-colors"
            onClick={() => { setSel(null); setStep("choose"); }}>متابعة الدراسة</button>
        </div>
      </Modal>
    </AppShell>
  );
}
