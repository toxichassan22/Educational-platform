"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import QShell, { QCard, QBtn, QPill, QModal, QPageHead } from "@/components/q/QShell";
import { SubjectRail } from "@/components/q/SubjectRail";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { gradeOf, stageOfGrade, attemptsOfUser, subjectOfLesson, lessonById, activeSub, packageById, subjectsOfGrade, subjectById, unitsOfSubject, lessonsOfUnit, canAccessLesson, User } from "@/lib/data";
import { QC, qSubjectArt } from "@/lib/theme-q";

export default function ParentHome() {
  const { db, me } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  if (!me) return <QShell role="parent">{null}</QShell>;
  const children = (me.childrenIds ?? []).map((id) => db.users.find((u) => u.id === id)).filter(Boolean) as User[];
  const child = children.find((c) => c.id === selected) ?? children[0];

  return (
    <QShell role="parent">
      <div className="space-y-6">
        {/* ===== هيرو ولي الأمر ===== */}
        <div className="rounded-2xl px-6 sm:px-10 py-7 text-white relative" style={{ background: QC.brand }}>
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-lg text-[12px] font-bold">
              <Icon name="gradcap" size={15} /> {children.length === 1 ? "طالب واحد" : `${children.length} طلاب`}
            </span>
            <div className="text-left">
              <h1 className="text-[24px] sm:text-[28px] font-extrabold">حساب ولي الأمر</h1>
              <p className="text-white/80 text-[13px] font-semibold mt-1">حسابات الأبناء</p>
            </div>
          </div>

          {/* بطاقات الأبناء داخل الهيرو */}
          <div className="flex items-end gap-5 mt-6">
            {children.map((c) => {
              const sel = child?.id === c.id;
              return (
                <button key={c.id} onClick={() => setSelected(c.id)} className="flex flex-col items-center gap-2 group">
                  <span
                    className="w-[72px] h-[72px] rounded-2xl overflow-hidden transition-all"
                    style={{ border: sel ? "3px solid #fff" : "3px solid transparent", boxShadow: sel ? "0 0 0 3px rgba(255,255,255,.35)" : undefined, opacity: sel ? 1 : 0.75 }}
                  >
                    <img src="/theq/ui/avatar.png" alt={c.name} className="w-full h-full object-cover" />
                  </span>
                  <span className="text-[12.5px] font-bold">{c.name.split(" ")[0]}</span>
                </button>
              );
            })}
            <button onClick={() => setAddOpen(true)} className="flex flex-col items-center gap-2 mb-0.5">
              <span className="w-[72px] h-[72px] rounded-2xl border-2 border-dashed border-white/50 grid place-items-center text-white/80 hover:border-white hover:text-white transition-colors">
                <Icon name="plus" size={24} />
              </span>
              <span className="text-[12.5px] font-bold text-white/85">إضافة طالب</span>
            </button>
          </div>
        </div>

        {/* ===== كارت الطالب المختار ===== */}
        {child ? (
          <ChildPanel key={child.id} child={child} />
        ) : (
          <QCard className="!p-10 text-center">
            <p className="font-bold" style={{ color: QC.muted }}>لا يوجد أبناء مسجلون — أضف طالبًا من الأعلى</p>
          </QCard>
        )}
      </div>

      <AddChildModal open={addOpen} onClose={() => setAddOpen(false)} parentId={me.id} onAdded={setSelected} />
    </QShell>
  );
}

// ===================== كارت الطالب =====================

function ChildPanel({ child }: { child: User }) {
  const { db, login } = useStore();
  const router = useRouter();
  const [payOpen, setPayOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [impersonateAsk, setImpersonateAsk] = useState(false);

  const grade = gradeOf(db, child.gradeId);
  const stage = stageOfGrade(db, child.gradeId);
  const sub = activeSub(db, child.id);
  const pkg = sub ? packageById(db, sub.packageId) : null;
  const subjects = subjectsOfGrade(db, child.gradeId);
  const online = Math.random() > 0.5; // حالة اتصال شكلية للديمو

  const stateOf = (s: (typeof subjects)[0]) => {
    const lessons = unitsOfSubject(db, s.id).flatMap((u) => lessonsOfUnit(db, u.id));
    if (!lessons.length) return "locked" as const;
    const open = lessons.filter((l) => canAccessLesson(db, child.id, l)).length;
    if (open === 0) return "locked" as const;
    if (open === lessons.length) return "subscribed" as const;
    return "trial" as const;
  };

  return (
    <>
      <QCard className="!p-5 sm:!p-6">
        {/* اسم + حالة + اشترك */}
        <div className="flex items-center gap-4">
          <div className="relative w-[62px] h-[62px] rounded-2xl overflow-hidden shrink-0">
            <img src="/theq/ui/avatar.png" alt={child.name} className="w-full h-full object-cover" />
            <button onClick={() => setEditOpen(true)} className="absolute bottom-1 left-1 w-5 h-5 rounded-md grid place-items-center text-white" style={{ background: QC.brand }}>
              <Icon name="edit" size={10} />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[19px] font-extrabold" style={{ color: QC.ink }}>{child.name}</div>
            <div className="flex items-center gap-1.5 text-[12px] font-bold mt-0.5" style={{ color: QC.muted }}>
              <span className="w-2 h-2 rounded-full" style={{ background: online ? QC.success : "#f97316" }} />
              {online ? "متصل" : "غير متصل"}
            </div>
          </div>
          {pkg ? (
            <QPill tone="ok">{pkg.name}</QPill>
          ) : (
            <QBtn onClick={() => setPayOpen(true)} className="!px-7">اشترك</QBtn>
          )}
        </div>

        {/* الصف والمنهج */}
        <div className="mt-5 rounded-xl px-5 py-4 flex items-center justify-between gap-3" style={{ background: QC.brandSoft }}>
          <div>
            <div className="text-[16px] font-extrabold" style={{ color: QC.ink }}>{grade?.name ?? "—"}</div>
            <div className="text-[12px] font-semibold mt-0.5" style={{ color: QC.muted }}>{stage?.name} · الفصل الأول</div>
            <div className="flex flex-wrap gap-2 mt-2.5">
              <span className="px-3 py-1 rounded-lg text-[10.5px] font-bold bg-white" style={{ color: QC.brandText }}>المنهج المصري</span>
              <span className="px-3 py-1 rounded-lg text-[10.5px] font-bold bg-white" style={{ color: QC.brandText }}>المنهج الحكومي العام</span>
            </div>
          </div>
          <button onClick={() => setEditOpen(true)} className="flex flex-col items-center gap-1 shrink-0">
            <span className="w-8 h-8 rounded-full bg-white grid place-items-center shadow-sm" style={{ color: QC.brand }}>
              <Icon name="down" size={14} />
            </span>
            <span className="text-[11px] font-bold" style={{ color: QC.brand }}>تغيير</span>
          </button>
        </div>

        {/* أزرار */}
        <div className="mt-4 flex items-stretch gap-2.5">
          <button onClick={() => setEditOpen(true)} className="w-12 rounded-xl border grid place-items-center transition-colors hover:bg-slate-50" style={{ borderColor: QC.line, color: QC.muted }} title="إعدادات الطالب">
            <Icon name="settings" size={18} />
          </button>
          <button onClick={() => setImpersonateAsk(true)} className="w-12 rounded-xl border grid place-items-center transition-colors hover:bg-slate-50" style={{ borderColor: QC.line, color: QC.muted }} title="الدخول بحساب الطالب">
            <Icon name="exit" size={18} />
          </button>
          <QBtn href={`/parent/report/${encodeURIComponent(child.id)}`} className="flex-1 !py-3.5">
            آخر تقرير للطالب
          </QBtn>
        </div>
        {pkg && (
          <button onClick={() => setPayOpen(true)} className="mt-3 w-full text-center text-[12px] font-bold py-2 rounded-xl border transition-colors hover:bg-slate-50" style={{ borderColor: QC.line, color: QC.brand }}>
            ترقية / تجديد الاشتراك — ينتهي {sub?.endDate}
          </button>
        )}
      </QCard>

      {/* ===== موادي ===== */}
      <div className="mt-6">
        <SubjectRail
          subjects={subjects}
          title="موادي"
          hrefOf={(s) => `/student/subject/${encodeURIComponent(s.id)}`}
          artOf={(s) => qSubjectArt(s) || null}
          stateOf={stateOf}
        />
      </div>

      {/* ===== خصائص البرنامج ===== */}
      <QCard className="mt-6" pad>
        <h3 className="font-extrabold text-[15px] mb-4" style={{ color: QC.ink }}>خصائص البرنامج</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {[
            "متابعة درجات وتقدم أبنائك لحظة بلحظة",
            "تقارير أداء مفصلة لكل مادة",
            "تجديد الاشتراكات وإدارتها من مكان واحد",
            "الدخول لحساب الطالب لمتابعة تجربته",
          ].map((f) => (
            <div key={f} className="flex items-start gap-2.5 text-[13px] font-semibold" style={{ color: QC.body }}>
              <span className="w-5 h-5 rounded-full grid place-items-center shrink-0 mt-0.5" style={{ background: QC.brandSoft, color: QC.brand }}>
                <Icon name="check" size={11} />
              </span>
              {f}
            </div>
          ))}
        </div>
      </QCard>

      <PayModal child={child} open={payOpen} onClose={() => setPayOpen(false)} />
      <EditChildModal child={child} open={editOpen} onClose={() => setEditOpen(false)} />
      <QModal open={impersonateAsk} onClose={() => setImpersonateAsk(false)} title="الدخول بحساب الطالب">
        <p className="text-[13.5px] leading-relaxed mb-5" style={{ color: QC.body }}>
          هتدخل بحساب <b>{child.name}</b> وتشوف المنصة بعينه — للعودة لحسابك سجّل خروج وادخل من جديد.
        </p>
        <div className="flex gap-3">
          <QBtn className="flex-1" onClick={() => { if (login(child.id)) router.push("/student"); }}>متابعة</QBtn>
          <QBtn variant="ghost" className="flex-1" onClick={() => setImpersonateAsk(false)}>تراجع</QBtn>
        </div>
      </QModal>
    </>
  );
}

// ===================== إضافة طالب =====================

function AddChildModal({ open, onClose, parentId, onAdded }: { open: boolean; onClose: () => void; parentId: string; onAdded: (id: string) => void }) {
  const { db, addStudent } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gradeId, setGradeId] = useState(db.grades[0]?.id ?? "");

  const submit = () => {
    if (!name.trim()) return;
    const id = addStudent(parentId, { name: name.trim(), gradeId, phone });
    onAdded(id);
    setName(""); setPhone("");
    onClose();
  };

  return (
    <QModal open={open} onClose={onClose} title="إضافة طالب">
      <div className="space-y-4">
        <div>
          <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>اسم الطالب</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: يوسف الكندري"
            className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff]" style={{ borderColor: QC.line }} />
        </div>
        <div>
          <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>رقم الهاتف</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" placeholder="5XXXXXXX"
            className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
        </div>
        <div>
          <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>الصف</label>
          <select value={gradeId} onChange={(e) => setGradeId(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none bg-white" style={{ borderColor: QC.line }}>
            {db.grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <QBtn className="w-full" disabled={!name.trim()} onClick={submit}>إضافة الطالب</QBtn>
      </div>
    </QModal>
  );
}

// ===================== تعديل طالب =====================

function EditChildModal({ child, open, onClose }: { child: User; open: boolean; onClose: () => void }) {
  const { db, updateStudent } = useStore();
  const [name, setName] = useState(child.name);
  const [phone, setPhone] = useState(child.phone ?? "");
  const [gradeId, setGradeId] = useState(child.gradeId ?? "");

  const submit = () => {
    updateStudent(child.id, { name: name.trim() || child.name, phone, gradeId });
    onClose();
  };

  return (
    <QModal open={open} onClose={onClose} title={`إعدادات ${child.name.split(" ")[0]}`}>
      <div className="space-y-4">
        <div>
          <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>الاسم</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff]" style={{ borderColor: QC.line }} />
        </div>
        <div>
          <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>رقم الهاتف</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr"
            className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
        </div>
        <div>
          <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>الصف</label>
          <select value={gradeId} onChange={(e) => setGradeId(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none bg-white" style={{ borderColor: QC.line }}>
            {db.grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <QBtn className="w-full" onClick={submit}>حفظ التعديلات</QBtn>
      </div>
    </QModal>
  );
}

// ===================== مودال الدفع (فاتح) =====================

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
    <QModal open={open} onClose={close} title={`اشتراك لـ ${child.name.split(" ")[0]}`}>
      {step === "form" && pkg && (
        <div className="space-y-4">
          <div className="space-y-2">
            {db.packages.map((p) => (
              <button key={p.id} onClick={() => { setSel(p.id); if (p.scope !== "subject") setSubjPick(""); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-right transition-all"
                style={pkg.id === p.id ? { borderColor: QC.brand, background: QC.brandSoft } : { borderColor: QC.line }}>
                <div className="w-5 h-5 rounded-full border-2 grid place-items-center shrink-0" style={pkg.id === p.id ? { background: QC.brand, borderColor: QC.brand } : { borderColor: QC.lineSoft }}>
                  {pkg.id === p.id && <Icon name="check" size={11} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-extrabold flex items-center gap-2" style={{ color: QC.ink }}>
                    {p.name} {p.popular && <QPill tone="trial">الأكثر اشتراكًا</QPill>}
                  </div>
                  <div className="text-[11px]" style={{ color: QC.muted }}>{p.scope === "subject" ? "مادة واحدة تختارها" : p.scope === "stage" ? "كل مواد المرحلة" : "كل المنصة"}</div>
                </div>
                <div className="font-extrabold shrink-0" style={{ color: QC.ink }}>{p.priceKwd} <span className="text-[10px] font-bold" style={{ color: QC.muted }}>د.ك/{p.period}</span></div>
              </button>
            ))}
          </div>

          {needSubject && (
            <div>
              <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>المادة اللي تنفتح لـ {child.name.split(" ")[0]}</label>
              <div className="grid grid-cols-2 gap-2">
                {gradeSubjects.map((s) => (
                  <button key={s.id} onClick={() => setSubjPick(s.id)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border-2 text-[13px] font-bold transition-all"
                    style={subjPick === s.id ? { borderColor: QC.brand, background: QC.brandSoft, color: QC.ink } : { borderColor: QC.line, color: QC.muted }}>
                    <span className="w-7 h-7 rounded-lg grid place-items-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                      <Icon name={s.icon} size={14} />
                    </span>
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>كود الخصم (جرّب KUWAIT20)</label>
            <div className="flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" placeholder="XXXX"
                className="flex-1 border rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#006fff] text-left" style={{ borderColor: QC.line }} />
              <QBtn variant="outline" onClick={applyCode}>تطبيق</QBtn>
            </div>
            {codeErr && <div className="text-[11.5px] mt-1" style={{ color: QC.danger }}>{codeErr}</div>}
            {applied && <div className="text-[11.5px] mt-1 font-bold" style={{ color: QC.success }}>تم تطبيق خصم {applied.pct}%</div>}
          </div>

          <div>
            <label className="text-[12px] font-bold block mb-1.5" style={{ color: QC.body }}>طريقة الدفع</label>
            <div className="grid grid-cols-3 gap-2">
              {(["KNET", "Visa", "Mastercard"] as const).map((m) => (
                <button key={m} onClick={() => setMethod(m)}
                  className="py-2.5 rounded-xl border-2 font-extrabold text-[13px] transition-all"
                  style={method === m ? { borderColor: QC.brand, background: QC.brandSoft, color: QC.brand } : { borderColor: QC.line, color: QC.muted }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-3 space-y-1.5 text-[13px]" style={{ borderColor: QC.line }}>
            <div className="flex justify-between" style={{ color: QC.muted }}><span>{pkg.name}</span><span>{pkg.priceKwd} د.ك</span></div>
            {applied && <div className="flex justify-between" style={{ color: QC.success }}><span>خصم {applied.pct}%</span><span>-{(pkg.priceKwd * applied.pct / 100).toFixed(2)} د.ك</span></div>}
            <div className="flex justify-between font-extrabold text-[15px] pt-1" style={{ color: QC.ink }}><span>الإجمالي</span><span>{finalPrice.toFixed(2)} د.ك</span></div>
          </div>

          <QBtn className="w-full !py-3.5" disabled={needSubject && !subjPick} onClick={pay}>
            ادفع {finalPrice.toFixed(2)} د.ك عبر {method}
          </QBtn>
          <p className="text-[10px] text-center flex items-center justify-center gap-1" style={{ color: QC.muted }}>
            <Icon name="lock" size={11} /> دفع آمن ومشفر — بيئة تجريبية (Sandbox)
          </p>
        </div>
      )}

      {step === "processing" && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full border-4 animate-spin mb-5" style={{ borderColor: QC.line, borderTopColor: QC.brand }} />
          <div className="font-bold" style={{ color: QC.ink }}>جارٍ معالجة الدفع…</div>
          <div className="text-[12px] mt-1" style={{ color: QC.muted }}>التواصل مع بوابة {method} الآمنة</div>
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto rounded-full grid place-items-center mb-4 animate-pop" style={{ background: QC.successSoft, color: QC.success }}>
            <Icon name="check" size={40} />
          </div>
          <h3 className="text-[19px] font-extrabold mb-1" style={{ color: QC.ink }}>تم الدفع بنجاح!</h3>
          <p className="text-[13px] mb-1" style={{ color: QC.muted }}>
            اشتراك {child.name.split(" ")[0]} في «{pkg?.name}» مفعّل الآن{subjPick && pkg?.scope === "subject" ? ` — مادة ${subjectById(db, subjPick)?.name}` : ""}
          </p>
          <p className="text-[11.5px] mb-6" style={{ color: QC.faint }}>الدروس والاختبارات اتفتحت له فورًا</p>
          <QBtn className="w-full" onClick={close}>تم</QBtn>
        </div>
      )}
    </QModal>
  );
}
