"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, Icon, Btn, Modal, Badge } from "@/components/ui";
import { unitsOfSubject, lessonsOfUnit } from "@/lib/data";

export default function QuestionsTab() {
  const { db, addQuestion, deleteQuestion } = useStore();
  const [subjectId, setSubjectId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [open, setOpen] = useState(false);

  const [text, setText] = useState("");
  const [type, setType] = useState<"mcq" | "tf">("mcq");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);

  const subject = db.subjects.find((s) => s.id === subjectId);
  const lessons = subject ? unitsOfSubject(db, subject.id).flatMap((u) => lessonsOfUnit(db, u.id)) : [];
  const questions = db.questions.filter((q) => q.lessonId === lessonId);

  const save = () => {
    if (!text.trim() || !lessonId) return;
    const options = type === "tf" ? ["صح", "خطأ"] : opts.filter((o) => o.trim());
    if (options.length < 2) return;
    addQuestion({ lessonId, text: text.trim(), type, options, correct: Math.min(correct, options.length - 1) });
    setText(""); setOpts(["", "", "", ""]); setCorrect(0); setOpen(false);
  };

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <Card className="lg:col-span-2 p-4 border border-slate-100 h-fit">
        <h3 className="font-extrabold text-primary-900 text-sm mb-3">اختر الدرس</h3>
        <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setLessonId(""); }}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-primary-400 mb-3">
          <option value="">— اختر المادة —</option>
          {db.subjects.filter((s) => s.gradeId === "g10" || s.gradeId === "g11" || s.gradeId === "g12").slice(0, 25).map((s) => (
            <option key={s.id} value={s.id}>{s.name} — {db.grades.find(g => g.id === s.gradeId)?.name}</option>
          ))}
        </select>
        {subject && (
          <div className="space-y-1.5 max-h-96 overflow-y-auto">
            {lessons.map((l) => {
              const qc = db.questions.filter((q) => q.lessonId === l.id).length;
              return (
                <button key={l.id} onClick={() => setLessonId(l.id)}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-right text-sm transition-all border ${lessonId === l.id ? "border-primary-400 bg-primary-50/60 font-bold text-primary-800" : "border-transparent hover:bg-slate-50 text-slate-600"}`}>
                  <Icon name="doc" size={14} className="text-slate-300 shrink-0" />
                  <span className="flex-1 truncate">{l.title}</span>
                  <Badge tone={qc ? "blue" : "gray"}>{qc}</Badge>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="lg:col-span-3 p-4 border border-slate-100 min-h-[300px]">
        {!lessonId ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 py-16">
            <Icon name="target" size={40} />
            <p className="text-sm mt-3 text-slate-400">اختر درسًا لعرض بنك أسئلته</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-primary-900 text-sm">أسئلة «{lessons.find(l => l.id === lessonId)?.title}» ({questions.length})</h3>
              <Btn className="!py-1.5 !px-3 text-xs" onClick={() => setOpen(true)}><Icon name="plus" size={13} /> سؤال</Btn>
            </div>
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
              {questions.map((q, i) => (
                <div key={q.id} className="border border-slate-100 rounded-xl p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs flex items-center justify-center font-extrabold shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-primary-900 mb-1.5">{q.text}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {q.options.map((o, oi) => (
                          <span key={oi} className={`text-[11px] px-2 py-0.5 rounded-lg ${oi === q.correct ? "bg-emerald-100 text-emerald-700 font-bold" : "bg-slate-100 text-slate-500"}`}>{o}</span>
                        ))}
                      </div>
                    </div>
                    <Badge tone={q.type === "mcq" ? "amber" : "gray"}>{q.type === "mcq" ? "اختيارات" : "صح/خطأ"}</Badge>
                    <button onClick={() => deleteQuestion(q.id)} className="p-1 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500"><Icon name="trash" size={14} /></button>
                  </div>
                </div>
              ))}
              {questions.length === 0 && <p className="text-xs text-slate-400 text-center py-8">لا أسئلة — أضف أول سؤال</p>}
            </div>
          </>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة سؤال جديد" wide>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">نص السؤال</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="اكتب السؤال…"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">نوع السؤال</label>
            <div className="flex gap-2">
              {(["mcq", "tf"] as const).map((t) => (
                <button key={t} onClick={() => { setType(t); setCorrect(0); }}
                  className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold ${type === t ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-500"}`}>
                  {t === "mcq" ? "اختيار من متعدد" : "صح / خطأ"}
                </button>
              ))}
            </div>
          </div>
          {type === "mcq" && (
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">الخيارات (اختر الصحيحة بالضغط على الرقم)</label>
              <div className="space-y-2">
                {opts.map((o, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button onClick={() => setCorrect(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-extrabold shrink-0 ${correct === i ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {i + 1}
                    </button>
                    <input value={o} onChange={(e) => setOpts(opts.map((x, xi) => (xi === i ? e.target.value : x)))} placeholder={`الخيار ${i + 1}`}
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "tf" && (
            <div className="flex gap-2">
              {["صح", "خطأ"].map((o, i) => (
                <button key={o} onClick={() => setCorrect(i)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold ${correct === i ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500"}`}>
                  {o}
                </button>
              ))}
            </div>
          )}
          <Btn className="w-full" onClick={save}>حفظ السؤال</Btn>
        </div>
      </Modal>
    </div>
  );
}
