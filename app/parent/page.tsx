"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Progress, Badge, Btn, Modal } from "@/components/ui";
import { gradeOf, stageOfGrade, attemptsOfUser, subjectOfLesson, lessonById, activeSub, packageById, subjectsOfGrade, subjectById, User } from "@/lib/data";
import { buildNotifs, whenLabel } from "@/components/NotifBell";

function ChildCard({ child, defaultOpen }: { child: User; defaultOpen: boolean }) {
  const { db } = useStore();
  const [expanded, setExpanded] = useState(defaultOpen);
  const [payOpen, setPayOpen] = useState(false);
  const grade = gradeOf(db, child.gradeId);
  const stage = stageOfGrade(db, child.gradeId);
  const attempts = attemptsOfUser(db, child.id);
  const sub = activeSub(db, child.id);
  const pkg = sub ? packageById(db, sub.packageId) : null;

  const avg = attempts.length ? Math.round((attempts.reduce((t, a) => t + a.score / a.total, 0) / attempts.length) * 100) : 0;
  const subjects = subjectsOfGrade(db, child.gradeId);
  const perSubject = subjects.map((s) => {
    const list = attempts.filter((a) => subjectOfLesson(db, a.lessonId)?.id === s.id);
    if (!list.length) return null;
    return { name: s.name, color: s.color, icon: s.icon, avg: Math.round(list.reduce((t, a) => t + a.score / a.total, 0) / list.length * 100), count: list.length };
  }).filter(Boolean) as { name: string; color: string; icon: string; avg: number; count: number }[];

  const recent = [...attempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const studyMin = attempts.reduce((t, a) => t + a.timeTakenSec, 0) / 60;

  return (
    <Card className="overflow-hidden border border-[#2b3547]">
      <div className="w-full p-5 flex items-center gap-3">
        <button onClick={() => setExpanded((e) => !e)} className="flex-1 min-w-0 flex items-center gap-4 text-right hover:bg-white/[0.03] rounded-2xl transition-colors -m-2 p-2">
          <div className="w-14 h-14 rounded-2xl bg-[#2072e0]/15 text-[#4a9bf5] flex items-center justify-center font-extrabold text-xl shrink-0">
            {child.name[0]}
          </div>
          <div className="flex-1 text-right min-w-0">
            <div className="font-extrabold text-white flex items-center gap-2 flex-wrap">
              {child.name}
              {pkg ? <Badge tone="green">{pkg.name}</Badge> : <Badge tone="gray">بدون اشتراك</Badge>}
            </div>
            <div className="text-xs text-[#99a8bd] mt-0.5">{grade?.name} · {stage?.name}</div>
          </div>
          <div className="hidden sm:grid grid-cols-3 gap-6 text-center shrink-0">
            <div><div className="text-xl font-extrabold text-white">{avg}%</div><div className="text-[10px] text-[#99a8bd]">المعدل</div></div>
            <div><div className="text-xl font-extrabold text-white">{attempts.length}</div><div className="text-[10px] text-[#99a8bd]">اختبارًا</div></div>
            <div><div className="text-xl font-extrabold text-white">{Math.round(studyMin)}</div><div className="text-[10px] text-[#99a8bd]">دقيقة دراسة</div></div>
          </div>
        </button>
        {!pkg && (
          <button onClick={() => setPayOpen(true)}
            className="shrink-0 bg-gold-500 hover:bg-gold-600 text-night-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-gold-500/25">
            <Icon name="gem" size={14} /> اشترك الآن
          </button>
        )}
        <button onClick={() => setExpanded((e) => !e)} className="p-2 shrink-0">
          <Icon name="down" size={18} className={`text-[#99a8bd] transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-[#2b3547] p-5 grid md:grid-cols-2 gap-5 animate-fade-up">
          {/* حالة الاشتراك */}
          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 bg-[#1a2130] rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2.5 text-sm">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${pkg ? "bg-emerald-500/15 text-emerald-300" : "bg-[#2b3547] text-[#99a8bd]"}`}>
                <Icon name="gem" size={16} />
              </span>
              {pkg ? (
                <span className="text-[#99a8bd]">مشترك في <b className="text-white">{pkg.name}</b>
                  {sub?.subjectId && subjectById(db, sub.subjectId) ? ` — مادة ${subjectById(db, sub.subjectId)!.name}` : ""}
                  <span className="text-[#99a8bd] text-xs"> · ينتهي {sub?.endDate}</span>
                </span>
              ) : (
                <span className="text-[#99a8bd]">بدون اشتراك نشط — يشوف الدروس المجانية فقط</span>
              )}
            </div>
            <Btn variant={pkg ? "outline" : "gold"} className="!py-2 text-xs" onClick={() => setPayOpen(true)}>
              {pkg ? "ترقية / تجديد" : "اشترك لابنك"}
            </Btn>
          </div>

          {/* أداء المواد */}
          <div>
            <h4 className="font-extrabold text-sm text-white mb-3">الأداء حسب المادة</h4>
            {perSubject.length === 0 && <p className="text-xs text-[#99a8bd]">لم يؤدِّ اختبارات بعد</p>}
            <div className="space-y-3">
              {perSubject.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#99a8bd]">{s.name}</span>
                    <span className="font-extrabold text-white">{s.avg}%</span>
                  </div>
                  <Progress value={s.avg} color={s.avg >= 70 ? "#059669" : s.avg >= 50 ? "#f59e0b" : "#ef4444"} h={7} />
                </div>
              ))}
            </div>
          </div>

          {/* آخر الاختبارات */}
          <div>
            <h4 className="font-extrabold text-sm text-white mb-3">أحدث الاختبارات</h4>
            {recent.length === 0 && <p className="text-xs text-[#99a8bd]">لا يوجد نشاط بعد</p>}
            <div className="space-y-2">
              {recent.map((a) => {
                const l = lessonById(db, a.lessonId);
                const pct = Math.round((a.score / a.total) * 100);
                return (
                  <div key={a.id} className="flex items-center gap-3 bg-[#1a2130] rounded-xl p-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-extrabold ${pct >= 80 ? "bg-emerald-500/15 text-emerald-300" : pct >= 50 ? "bg-amber-500/15 text-amber-300" : "bg-red-500/15 text-red-300"}`}>
                      {pct}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{l?.title}</div>
                      <div className="text-[10px] text-[#99a8bd]">{a.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <PayModal child={child} open={payOpen} onClose={() => setPayOpen(false)} />
    </Card>
  );
}

// ===== مودال اشتراك الأبناء — ولي الأمر يدفع مباشرة =====
function PayModal({ child, open, onClose }: { child: User; open: boolean; onClose: () => void }) {
  const { db, subscribe } = useStore();
  const [sel, setSel] = useState("");
  const [method, setMethod] = useState<"KNET" | "Visa" | "Mastercard">("KNET");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; pct: number } | null>(null);
  const [codeErr, setCodeErr] = useState("");
  const [subjPick, setSubjPick] = useState("");
  const [step, setStep] = useState<"form" | "processing" | "done">("form");

  const pkg = db.packages.find((p) => p.id === sel) ?? db.packages.find((p) => p.popular) ?? db.packages[0];
  const gradeSubjects = subjectsOfGrade(db, child.gradeId);
  const needSubject = pkg?.scope === "subject";
  const finalPrice = pkg ? Math.max(0, pkg.priceKwd * (1 - (applied?.pct ?? 0) / 100)) : 0;

  const applyCode = () => {
    const found = db.discountCodes.find((c) => c.code === code.trim().toUpperCase());
    if (found) { setApplied(found); setCodeErr(""); }
    else { setApplied(null); setCodeErr("كود غير صحيح"); }
  };

  const pay = () => {
    if (!pkg) return;
    setStep("processing");
    setTimeout(() => {
      subscribe(child.id, pkg.id, method, Number(finalPrice.toFixed(2)), needSubject ? subjPick : undefined);
      setStep("done");
    }, 1600);
  };

  const close = () => {
    onClose();
    setTimeout(() => { setStep("form"); setApplied(null); setCode(""); setSubjPick(""); }, 250);
  };

  return (
    <Modal open={open} onClose={close} title={`اشتراك لـ ${child.name.split(" ")[0]}`}>
      {step === "form" && pkg && (
        <div className="space-y-4">
          {/* الباقات */}
          <div className="space-y-2">
            {db.packages.map((p) => (
              <button key={p.id} onClick={() => { setSel(p.id); if (p.scope !== "subject") setSubjPick(""); }}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-right transition-all ${pkg.id === p.id ? "border-[#2072e0] bg-[#2072e0]/10" : "border-[#2b3547] hover:border-[#2072e0]/40"}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${pkg.id === p.id ? "border-[#2072e0] bg-[#2072e0]" : "border-[#2b3547]"}`}>
                  {pkg.id === p.id && <Icon name="check" size={11} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold text-white">{p.name} {p.popular && <Badge tone="amber">الأكثر اشتراكًا</Badge>}</div>
                  <div className="text-[11px] text-[#99a8bd]">{p.scope === "subject" ? "مادة واحدة تختارها" : p.scope === "stage" ? "كل مواد المرحلة" : "كل المنصة"}</div>
                </div>
                <div className="font-black text-white shrink-0">{p.priceKwd} <span className="text-[10px] font-bold text-[#99a8bd]">د.ك/{p.period}</span></div>
              </button>
            ))}
          </div>

          {/* باقة المادة: اختيار المادة */}
          {needSubject && (
            <div>
              <label className="text-xs font-bold text-[#99a8bd] block mb-1.5">المادة اللي تنفتح لـ {child.name.split(" ")[0]}</label>
              <div className="grid grid-cols-2 gap-2">
                {gradeSubjects.map((s) => (
                  <button key={s.id} onClick={() => setSubjPick(s.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm font-bold transition-all ${subjPick === s.id ? "border-[#2072e0] bg-[#2072e0]/15 text-white" : "border-[#2b3547] text-[#99a8bd] hover:border-[#2072e0]/40"}`}>
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                      <Icon name={s.icon} size={14} />
                    </span>
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* كود الخصم */}
          <div>
            <label className="text-xs font-bold text-[#99a8bd] block mb-1.5">كود الخصم (جرّب KUWAIT20)</label>
            <div className="flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" placeholder="XXXX"
                className="flex-1 border border-[#2b3547] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2072e0] text-left" />
              <Btn variant="outline" onClick={applyCode}>تطبيق</Btn>
            </div>
            {codeErr && <div className="text-xs text-red-400 mt-1">{codeErr}</div>}
            {applied && <div className="text-xs text-emerald-400 mt-1 font-bold">تم تطبيق خصم {applied.pct}%</div>}
          </div>

          {/* طريقة الدفع */}
          <div>
            <label className="text-xs font-bold text-[#99a8bd] block mb-1.5">طريقة الدفع</label>
            <div className="grid grid-cols-3 gap-2">
              {(["KNET", "Visa", "Mastercard"] as const).map((m) => (
                <button key={m} onClick={() => setMethod(m)}
                  className={`py-2.5 rounded-xl border-2 font-extrabold text-sm transition-all ${method === m ? "border-[#2072e0] bg-[#2072e0]/15 text-[#4a9bf5]" : "border-[#2b3547] text-[#99a8bd]"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#2b3547] pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-[#99a8bd]"><span>{pkg.name}</span><span>{pkg.priceKwd} د.ك</span></div>
            {applied && <div className="flex justify-between text-emerald-400"><span>خصم {applied.pct}%</span><span>-{(pkg.priceKwd * applied.pct / 100).toFixed(2)} د.ك</span></div>}
            <div className="flex justify-between font-extrabold text-white text-base pt-1"><span>الإجمالي</span><span>{finalPrice.toFixed(2)} د.ك</span></div>
          </div>

          <Btn variant="gold" className="w-full !py-3" disabled={needSubject && !subjPick} onClick={pay}>
            ادفع {finalPrice.toFixed(2)} د.ك عبر {method}
          </Btn>
          <p className="text-[10px] text-[#99a8bd] text-center flex items-center justify-center gap-1">
            <Icon name="lock" size={11} /> دفع آمن ومشفر — بيئة تجريبية (Sandbox)
          </p>
        </div>
      )}

      {step === "processing" && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#2072e0]/25 border-t-[#2072e0] animate-spin mb-5" />
          <div className="font-bold text-white">جارٍ معالجة الدفع…</div>
          <div className="text-xs text-[#99a8bd] mt-1">التواصل مع بوابة {method} الآمنة</div>
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/15 text-emerald-300 flex items-center justify-center mb-4 animate-pop">
            <Icon name="check" size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-white mb-1">تم الدفع بنجاح!</h3>
          <p className="text-sm text-[#99a8bd] mb-1">اشتراك {child.name.split(" ")[0]} في «{pkg?.name}» مفعّل الآن{subjPick && pkg?.scope === "subject" ? ` — مادة ${subjectById(db, subjPick)?.name}` : ""}</p>
          <p className="text-xs text-[#99a8bd] mb-6">الدروس والاختبارات اتفتحت له فورًا</p>
          <Btn className="w-full" onClick={close}>تم</Btn>
        </div>
      )}
    </Modal>
  );
}

export default function ParentHome() {
  const { db, me } = useStore();
  if (!me) return <AppShell role="parent" dark>{null}</AppShell>;
  const children = (me.childrenIds ?? []).map((id) => db.users.find((u) => u.id === id)).filter(Boolean) as User[];

  return (
    <AppShell role="parent" dark>
      <div className="space-y-6 animate-fade-up">
        <div className="rounded-[2rem] p-6 text-white relative overflow-hidden hero-mesh">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <h1 className="text-2xl font-black mb-1 relative">أهلاً {me.name}</h1>
          <p className="text-white/70 text-sm">تابع مستوى أبنائك الدراسي لحظة بلحظة — درجاتهم، تقدمهم، ونشاطهم</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#2072e0]/15 text-[#4a9bf5] flex items-center justify-center"><Icon name="users" size={20} /></div>
            <div><div className="text-xl font-extrabold text-white">{children.length}</div><div className="text-xs text-[#99a8bd]">أبناء مسجلون</div></div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center"><Icon name="check" size={20} /></div>
            <div><div className="text-xl font-extrabold text-white">{children.filter((c) => activeSub(db, c.id)).length}</div><div className="text-xs text-[#99a8bd]">اشتراكات نشطة</div></div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gold-500/15 text-gold-400 flex items-center justify-center"><Icon name="bell" size={20} /></div>
            <div><div className="text-xl font-extrabold text-white">{buildNotifs(db, me).length}</div><div className="text-xs text-[#99a8bd]">تنبيهات</div></div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="font-extrabold text-white text-lg">أبنائي</h2>
          {children.map((c, i) => (
            <ChildCard key={c.id} child={c} defaultOpen={i === 0} />
          ))}
        </div>

        <Card className="p-5 border border-[#2b3547]">
          <h3 className="font-extrabold text-white mb-3 flex items-center gap-2"><Icon name="bell" size={17} className="text-gold-500" /> آخر الإشعارات</h3>
          <div className="space-y-2.5 text-sm">
            {buildNotifs(db, me).map((n) => (
              <div key={n.id} className="flex gap-3 items-start bg-[#1a2130] rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${n.color}15`, color: n.color }}>
                  <Icon name={n.icon} size={15} />
                </div>
                <div className="flex-1">
                  {n.text}
                  <div className="text-[10px] text-[#99a8bd] mt-0.5">{whenLabel(n.ts)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
