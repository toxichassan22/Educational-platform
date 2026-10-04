"use client";

import React, { useState } from "react";
import QShell, { QCard, QBtn, QModal, QPill } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { activeSub, packageById, subjectsOfGrade, subjectById, Package } from "@/lib/data";
import { QC } from "@/lib/theme-q";

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

  if (!me) return <QShell role="student">{null}</QShell>;
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
    <QShell role="student" title="الاشتراك">
      <div className="space-y-7">
        <div className="text-center pt-2">
          <h1 className="text-[26px] sm:text-[30px] font-extrabold mb-2" style={{ color: QC.ink }}>اختار الباقة اللي تناسبك</h1>
          <p className="text-[13.5px]" style={{ color: QC.muted }}>كل الباقات تشمل الفيديوهات والمذكرات والاختبارات</p>
        </div>

        {/* الاشتراك الحالي */}
        {sub && currentPkg && (
          <QCard className="max-w-3xl mx-auto w-full" pad>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl grid place-items-center" style={{ background: QC.successSoft, color: QC.success }}>
                  <Icon name="check" size={22} />
                </div>
                <div>
                  <div className="font-extrabold flex items-center gap-2" style={{ color: QC.ink }}>
                    {currentPkg.name}
                    <QPill tone="ok">نشط</QPill>
                  </div>
                  <div className="text-[12px] mt-1" style={{ color: QC.muted }}>
                    من {sub.startDate} إلى {sub.endDate} · متبقّي {daysLeft} يومًا
                    {subSubject && <> · يفتح مادة <b style={{ color: QC.brand }}>{subSubject.name}</b> فقط</>}
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="text-[11px]" style={{ color: QC.muted }}>التجديد التلقائي</div>
                <div className="font-bold text-[13px]" style={{ color: QC.ink }}>مفعّل</div>
              </div>
            </div>
          </QCard>
        )}

        {/* الباقات */}
        <div className="flex flex-wrap items-stretch justify-center gap-6">
          {db.packages.map((p) => {
            const isCurrent = currentPkg?.id === p.id;
            const popular = !!p.popular;
            return (
              <div key={p.id}
                className={`relative rounded-2xl p-7 flex flex-col w-full sm:w-[300px] bg-white transition-all ${popular ? "sm:scale-[1.05]" : ""}`}
                style={{ border: popular ? `2px solid ${QC.brand}` : `1px solid ${QC.line}`, boxShadow: popular ? "0 12px 40px -12px rgba(0,111,255,.25)" : undefined }}>
                {popular && (
                  <div className="absolute -top-3.5 right-1/2 translate-x-1/2 text-white text-[11px] font-black px-4 py-1.5 rounded-xl whitespace-nowrap" style={{ background: QC.brand }}>
                    الأكثر اشتراكًا
                  </div>
                )}
                <h3 className="font-extrabold text-[16px] text-center mt-2" style={{ color: QC.ink }}>{p.name}</h3>
                <div className="text-center my-5 flex items-baseline justify-center gap-1.5" dir="ltr">
                  <span className="text-[52px] font-extrabold" style={{ color: popular ? QC.brand : QC.ink }}>{p.priceKwd}</span>
                  <span className="text-[13px] font-bold" style={{ color: QC.muted }}>د.ك</span>
                </div>
                <div className="text-center text-[12.5px] font-bold mb-5 -mt-3" style={{ color: QC.muted }}>{p.period}</div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[13px]">
                      <span className="font-black" style={{ color: QC.success }}>✓</span>
                      <span style={{ color: QC.body }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button disabled={isCurrent}
                  onClick={() => { setSel(p); setStep("choose"); setApplied(null); setCode(""); setSubjPick(""); }}
                  className="w-full h-[50px] rounded-full font-extrabold text-[13.5px] transition-all active:scale-[.98] disabled:opacity-60"
                  style={isCurrent
                    ? { background: QC.surfaceSoft, color: QC.muted }
                    : { background: QC.brand, color: "#fff" }}>
                  {isCurrent ? "باقتك الحالية" : "اشترك الآن"}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[13px] font-bold" style={{ color: QC.muted }}>دفع آمن عبر KNET · Apple Pay · Visa</p>

        {/* سجل المدفوعات */}
        <QCard className="max-w-3xl mx-auto w-full">
          <h2 className="font-extrabold text-[15px] mb-4" style={{ color: QC.ink }}>سجل المدفوعات</h2>
          {myPayments.length === 0 && <p className="text-[13px]" style={{ color: QC.muted }}>لا توجد مدفوعات سابقة</p>}
          <div className="space-y-2">
            {myPayments.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: QC.bgSoft }}>
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-white border" style={{ borderColor: QC.line, color: QC.brand }}>
                  <Icon name="card" size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold" style={{ color: QC.ink }}>{p.packageName}</div>
                  <div className="text-[11px]" style={{ color: QC.muted }}>{p.date} · {p.method}</div>
                </div>
                <div className="font-extrabold" style={{ color: QC.brand }}>{p.amountKwd} د.ك</div>
                <QPill tone={p.status === "success" ? "ok" : p.status === "failed" ? "warn" : "locked"}>
                  {p.status === "success" ? "ناجحة" : p.status === "failed" ? "فاشلة" : "معلقة"}
                </QPill>
              </div>
            ))}
          </div>
        </QCard>
      </div>

      {/* ===== مودال الدفع ===== */}
      <QModal open={!!sel && step !== "done"} onClose={() => { setSel(null); setStep("choose"); }} title={`إتمام الاشتراك — ${sel?.name ?? ""}`}>
        {sel && step === "choose" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: QC.bgSoft }}>
              <div>
                <div className="font-bold text-[14px]" style={{ color: QC.ink }}>{sel.name}</div>
                <div className="text-[11.5px]" style={{ color: QC.muted }}>{sel.period}</div>
              </div>
              <div className="text-[20px] font-extrabold" style={{ color: QC.brand }}>{sel.priceKwd} د.ك</div>
            </div>

            {sel.scope === "subject" && (
              <div>
                <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>اختر المادة اللي تفتحها</label>
                <div className="grid grid-cols-2 gap-2">
                  {mySubjects.map((s) => (
                    <button key={s.id} type="button" onClick={() => setSubjPick(s.id)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border-2 text-[13px] font-bold transition-all"
                      style={subjPick === s.id ? { borderColor: QC.brand, background: QC.brandSoft, color: QC.ink } : { borderColor: QC.line, color: QC.muted }}>
                      <span className="w-7 h-7 rounded-lg grid place-items-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                        <Icon name={s.icon} size={14} />
                      </span>
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
                {!subjPick && <div className="text-[11px] mt-1.5 font-bold" style={{ color: QC.warning }}>اختر مادة واحدة — باقي المواد تفضل مقفولة</div>}
              </div>
            )}

            <div>
              <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>كود الخصم (جرّب KUWAIT20)</label>
              <div className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" placeholder="XXXX"
                  className="flex-1 border rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
                <button onClick={applyCode} className="border font-bold text-[13px] px-4 rounded-xl transition-colors"
                  style={{ borderColor: QC.brand, color: QC.brand }}>تطبيق</button>
              </div>
              {codeErr && <div className="text-[11.5px] mt-1" style={{ color: QC.danger }}>{codeErr}</div>}
              {applied && <div className="text-[11.5px] mt-1 font-bold" style={{ color: QC.success }}>تم تطبيق خصم {applied.pct}%</div>}
            </div>

            <div>
              <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>طريقة الدفع</label>
              <div className="grid grid-cols-3 gap-2">
                {(["KNET", "Visa", "Mastercard"] as const).map((m) => (
                  <button key={m} onClick={() => setMethod(m)}
                    className="py-3 rounded-xl border-2 font-extrabold text-[13px] transition-all"
                    style={method === m ? { borderColor: QC.brand, background: QC.brandSoft, color: QC.brand } : { borderColor: QC.line, color: QC.muted }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-3 space-y-1.5 text-[13px]" style={{ borderColor: QC.line }}>
              <div className="flex justify-between" style={{ color: QC.muted }}><span>السعر</span><span>{sel.priceKwd} د.ك</span></div>
              {applied && <div className="flex justify-between" style={{ color: QC.success }}><span>خصم {applied.pct}%</span><span>-{(sel.priceKwd * applied.pct / 100).toFixed(2)} د.ك</span></div>}
              <div className="flex justify-between font-extrabold text-[15px] pt-1" style={{ color: QC.ink }}><span>الإجمالي</span><span>{finalPrice.toFixed(2)} د.ك</span></div>
            </div>

            <QBtn className="w-full !h-[50px] !rounded-full" disabled={sel.scope === "subject" && !subjPick} onClick={() => setStep("pay")}>
              متابعة للدفع
            </QBtn>
            <p className="text-[10px] text-center flex items-center justify-center gap-1" style={{ color: QC.muted }}>
              <Icon name="lock" size={11} /> دفع آمن ومشفر — بيئة تجريبية (Sandbox)
            </p>
          </div>
        )}

        {sel && step === "pay" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 text-white flex items-center justify-between" style={{ background: QC.navy }}>
              <div>
                <div className="text-[10px] text-white/70">إجمالي المبلغ</div>
                <div className="text-[22px] font-extrabold">{finalPrice.toFixed(2)} د.ك</div>
              </div>
              <div className="font-extrabold text-[16px] bg-white/10 px-4 py-1.5 rounded-xl">{method}</div>
            </div>
            {method === "KNET" ? (
              <div className="space-y-3">
                <select className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff] bg-white" style={{ borderColor: QC.line }}>
                  <option>بنك الكويت الوطني NBK</option><option>بيت التمويل الكويتي KFH</option><option>بنك بوبيان</option><option>البنك الأهلي المتحد</option>
                </select>
                <input dir="ltr" placeholder="رقم البطاقة" className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
                <div className="grid grid-cols-2 gap-3">
                  <input dir="ltr" placeholder="MM/YY" className="border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
                  <input dir="ltr" placeholder="PIN" type="password" className="border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input dir="ltr" placeholder="رقم البطاقة  ••••  ••••  ••••" className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
                <input placeholder="الاسم على البطاقة" className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff]" style={{ borderColor: QC.line }} />
                <div className="grid grid-cols-2 gap-3">
                  <input dir="ltr" placeholder="MM/YY" className="border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
                  <input dir="ltr" placeholder="CVV" type="password" className="border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
                </div>
              </div>
            )}
            <QBtn className="w-full !h-[50px] !rounded-full" onClick={pay}>ادفع {finalPrice.toFixed(2)} د.ك</QBtn>
            <button onClick={() => setStep("choose")} className="w-full text-[12px] font-bold" style={{ color: QC.muted }}>← رجوع</button>
          </div>
        )}

        {step === "processing" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full border-4 animate-spin mb-5" style={{ borderColor: QC.line, borderTopColor: QC.brand }} />
            <div className="font-bold" style={{ color: QC.ink }}>جارٍ معالجة الدفع…</div>
            <div className="text-[12px] mt-1" style={{ color: QC.muted }}>التواصل مع بوابة {method} الآمنة</div>
          </div>
        )}
      </QModal>

      {/* نجاح الدفع */}
      <QModal open={step === "done"} onClose={() => { setSel(null); setStep("choose"); }} title="">
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto rounded-full grid place-items-center mb-4 animate-pop" style={{ background: QC.successSoft, color: QC.success }}>
            <Icon name="check" size={40} />
          </div>
          <h3 className="text-[19px] font-extrabold mb-1" style={{ color: QC.ink }}>تم الدفع بنجاح!</h3>
          <p className="text-[13px] mb-1" style={{ color: QC.muted }}>اشتراكك في «{sel?.name}» مفعّل الآن</p>
          <p className="text-[11.5px] mb-6" style={{ color: QC.faint }}>أُرسل إشعار تأكيد إلى بريدك الإلكتروني</p>
          <QBtn className="w-full !h-[50px] !rounded-full" onClick={() => { setSel(null); setStep("choose"); }}>متابعة الدراسة</QBtn>
        </div>
      </QModal>
    </QShell>
  );
}
