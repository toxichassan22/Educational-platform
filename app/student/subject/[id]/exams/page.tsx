"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import QShell, { QPageHead, QPill } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { subjectById, unitsOfSubject, lessonsOfUnit, questionsOfLesson, attemptsOfUser, canAccessLesson } from "@/lib/data";
import { QC } from "@/lib/theme-q";

/** صفحة اختيار الاختبار — نفس شكل TheQ: هيرو كحلي + اختر الفصل/الدرس + زر ابدأ */
export default function SubjectExamsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const subjectId = decodeURIComponent(id);
  const { db, me } = useStore();
  const router = useRouter();
  const [openUnit, setOpenUnit] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [warn, setWarn] = useState(false);
  const subject = subjectById(db, subjectId);
  const units = subject ? unitsOfSubject(db, subject.id) : [];
  const myAttempts = me ? attemptsOfUser(db, me.id) : [];

  if (!subject) {
    return (
      <QShell role="student">
        <div className="text-center py-20 font-bold" style={{ color: QC.muted }}>المادة غير موجودة</div>
      </QShell>
    );
  }

  const start = () => {
    if (!picked) {
      setWarn(true);
      return;
    }
    router.push(`/student/exam/${encodeURIComponent(picked)}`);
  };

  return (
    <QShell role="student">
      <QPageHead href={`/student/subject/${encodeURIComponent(subject.id)}`}>الأسئلة</QPageHead>

      {/* هيرو الاختبار الكحلي */}
      <div className="rounded-2xl px-6 sm:px-10 py-9 mb-6 text-white flex items-center gap-4" style={{ background: QC.navy }}>
        <span className="w-14 h-14 rounded-2xl grid place-items-center bg-white/10 shrink-0">
          <Icon name="clipboard" size={26} />
        </span>
        <div>
          <h2 className="text-[22px] font-extrabold">الاختبار</h2>
          <p className="text-white/75 text-[13px] font-semibold mt-1">اختبارات وتقييمات تدريبية</p>
        </div>
      </div>

      <h3 className="text-[15px] font-extrabold mb-3" style={{ color: QC.ink }}>
        اختر فصلاً
      </h3>

      {/* الوحدات + الدروس */}
      <div className="space-y-3">
        {units.map((u) => {
          const lessons = lessonsOfUnit(db, u.id).filter((l) => questionsOfLesson(db, l.id).length > 0);
          const open = openUnit === u.id;
          return (
            <div key={u.id} className="rounded-xl border overflow-hidden" style={{ borderColor: QC.line }}>
              <button
                onClick={() => setOpenUnit(open ? null : u.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-right transition-colors hover:bg-slate-50"
                style={{ background: QC.bgSoft }}
              >
                <span className="font-bold text-[14px]" style={{ color: QC.ink }}>
                  {u.title}
                </span>
                <span className="w-7 h-7 rounded-full grid place-items-center border bg-white shrink-0" style={{ borderColor: QC.line }}>
                  <Icon name="down" size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} style={{ color: QC.faint }} />
                </span>
              </button>

              {open && (
                <div className="divide-y" style={{ borderColor: QC.line }}>
                  {lessons.length === 0 && (
                    <div className="px-5 py-4 text-[12px]" style={{ color: QC.muted }}>
                      لا توجد اختبارات في هذه الوحدة
                    </div>
                  )}
                  {lessons.map((l) => {
                    const locked = me ? !canAccessLesson(db, me.id, l) : true;
                    const qs = questionsOfLesson(db, l.id).length;
                    const done = myAttempts.some((a) => a.lessonId === l.id);
                    const sel = picked === l.id;
                    return (
                      <button
                        key={l.id}
                        disabled={locked}
                        onClick={() => { setPicked(l.id); setWarn(false); }}
                        className="w-full flex items-center gap-3.5 px-5 py-3.5 text-right transition-colors hover:bg-slate-50 disabled:opacity-70"
                      >
                        {locked ? (
                          <span className="w-5 h-5 grid place-items-center shrink-0" style={{ color: QC.faint }}>
                            <Icon name="lock" size={15} />
                          </span>
                        ) : (
                          <span
                            className="w-5 h-5 rounded-full border-2 grid place-items-center shrink-0 transition-all"
                            style={{ borderColor: sel ? QC.brand : QC.lineSoft }}
                          >
                            {sel && <span className="w-2.5 h-2.5 rounded-full" style={{ background: QC.brand }} />}
                          </span>
                        )}
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13.5px] font-bold truncate" style={{ color: locked ? QC.muted : QC.ink }}>
                            {l.title}
                          </span>
                          <span className="block text-[11px] mt-0.5" style={{ color: QC.faint }}>
                            {qs} سؤال{done ? " · حُلّ سابقًا" : ""}
                          </span>
                        </span>
                        {l.free && !locked && <QPill tone="trial">تجريبي</QPill>}
                        {locked && <QPill tone="locked">مقفل</QPill>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* زر البدء + التحذير */}
      <div className="mt-6 flex flex-col items-end gap-2">
        {warn && (
          <p className="text-[12px] font-bold" style={{ color: QC.danger }}>
            يرجى اختيار درس واحد على الأقل
          </p>
        )}
        <button
          onClick={start}
          className="px-10 py-3 rounded-xl text-white font-extrabold text-[14px] transition-all active:scale-[.98]"
          style={{ background: picked ? QC.brand : QC.lineSoft }}
        >
          ابدأ
        </button>
      </div>
    </QShell>
  );
}
