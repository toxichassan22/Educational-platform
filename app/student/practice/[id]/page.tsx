"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import QShell, { QCard, QBtn, QBackLink, QPill } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { lessonById, questionsOfLesson, followUpQuestions, unitById, subjectOfLesson, canAccessLesson } from "@/lib/data";
import { QC } from "@/lib/theme-q";

export default function PracticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PracticeSession key={id} lessonId={decodeURIComponent(id)} />;
}

function PracticeSession({ lessonId }: { lessonId: string }) {
  const { db, me } = useStore();
  const lesson = lessonById(db, lessonId);
  const questions = lesson ? followUpQuestions(lesson, questionsOfLesson(db, lesson.id)) : [];
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [done, setDone] = useState(false);
  const subject = subjectOfLesson(db, lessonId);
  const unit = lesson && unitById(db, lesson.unitId);

  if (!lesson) {
    return (
      <QShell role="student">
        <div className="text-center py-20 font-bold" style={{ color: QC.muted }}>التدريب غير موجود</div>
      </QShell>
    );
  }

  if (me && !canAccessLesson(db, me.id, lesson)) {
    return (
      <QShell role="student">
        <div className="max-w-lg mx-auto">
          <QCard className="!p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl grid place-items-center mb-4" style={{ background: QC.warningSoft, color: QC.warning }}>
              <Icon name="lock" size={30} />
            </div>
            <h2 className="text-[18px] font-extrabold mb-4" style={{ color: QC.ink }}>التدريب للمشتركين فقط</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <QBtn href="/student/subscription">اشترك الآن</QBtn>
              <QBtn variant="outline" href={`/student/lesson/${encodeURIComponent(lessonId)}`}>رجوع</QBtn>
            </div>
          </QCard>
        </div>
      </QShell>
    );
  }

  const answered = answers.filter((a) => a !== null).length;
  const score = questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const reset = () => {
    setAnswers(new Array(questions.length).fill(null));
    setDone(false);
  };

  return (
    <QShell role="student">
      <div className="max-w-3xl mx-auto space-y-5">
        <QBackLink href={`/student/lesson/${encodeURIComponent(lessonId)}`}>العودة إلى الدرس</QBackLink>

        <QCard className="!p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <QPill tone="trial">تدريب متابعة — أسئلة مختلفة عن الاختبار</QPill>
              <h1 className="text-[19px] font-extrabold mt-2.5 mb-1" style={{ color: QC.ink }}>{lesson.title}</h1>
              <p className="text-[12.5px]" style={{ color: QC.muted }}>{subject?.name} · {unit?.title}</p>
            </div>
            <QPill tone="locked">{answered}/{questions.length}</QPill>
          </div>
          <p className="text-[11.5px] mt-4" style={{ color: QC.faint }}>
            أسئلة تدريبية على نفس نقاط الدرس — نتيجتها لا تُحتسب في تقاريرك.
          </p>
        </QCard>

        {questions.length === 0 && (
          <QCard className="!p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl grid place-items-center mb-4" style={{ background: QC.brandSoft, color: QC.brand }}>
              <Icon name="target" size={26} />
            </div>
            <h2 className="font-extrabold mb-2" style={{ color: QC.ink }}>لا يوجد تدريب متخصص لهذا الدرس بعد</h2>
            <p className="text-[13px] mb-5" style={{ color: QC.muted }}>يمكنك إعادة الاختبار الكامل أو مراجعة المذكرة.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <QBtn href={`/student/exam/${encodeURIComponent(lessonId)}`}>إعادة الاختبار</QBtn>
              <QBtn variant="outline" href={`/student/lesson/${encodeURIComponent(lessonId)}`}>العودة للدرس</QBtn>
            </div>
          </QCard>
        )}

        {questions.map((q, i) => {
          const chosen = answers[i];
          const ok = done && chosen === q.correct;
          return (
            <QCard key={q.id} className="!p-5" pad>
              <div className="flex items-center gap-2 mb-3">
                <QPill tone={done ? (ok ? "ok" : "locked") : "trial"}>سؤال {i + 1}</QPill>
                <QPill tone="warn">{q.type === "mcq" ? "اختيار" : "صح / خطأ"}</QPill>
              </div>
              <h2 className="font-bold leading-relaxed mb-4 text-[14.5px]" style={{ color: QC.ink }}>{q.text}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  const selected = chosen === oi;
                  const isCorrect = done && oi === q.correct;
                  const isWrongPick = done && selected && oi !== q.correct;
                  return (
                    <button key={oi} disabled={done}
                      onClick={() => setAnswers((a) => a.map((x, j) => (j === i ? oi : x)))}
                      className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-right text-[13px] font-bold transition-all ${
                        isCorrect ? "border-emerald-500 bg-emerald-50"
                        : isWrongPick ? "border-rose-400 bg-rose-50"
                        : selected ? "border-[#006fff] bg-[#eff6ff]"
                        : "border-[#e2e8f0] hover:border-[#93c5fd]"}`}
                      style={{ color: isCorrect ? QC.success : isWrongPick ? QC.danger : QC.ink }}>
                      <span className={`w-6 h-6 rounded-lg border-2 grid place-items-center shrink-0 ${
                        isCorrect ? "border-emerald-500 bg-emerald-500 text-white"
                        : isWrongPick ? "border-rose-400 bg-rose-400 text-white"
                        : selected ? "text-white" : ""}`}
                        style={selected && !done ? { background: QC.brand, borderColor: QC.brand } : { borderColor: QC.lineSoft }}>
                        {(selected || isCorrect) && <Icon name={isCorrect ? "check" : isWrongPick ? "x" : "check"} size={12} />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {done && q.explanation && (
                <div className="mt-3 border rounded-xl px-3 py-2 text-[12px] leading-relaxed flex items-start gap-1.5"
                  style={{ background: QC.brandSoft, borderColor: QC.brandBorder, color: QC.body }}>
                  <Icon name="spark" size={13} className="mt-0.5 shrink-0" style={{ color: QC.brand }} />
                  <span><b style={{ color: QC.brand }}>الشرح:</b> {q.explanation}</span>
                </div>
              )}
            </QCard>
          );
        })}

        {questions.length > 0 && !done && (
          <QBtn className="w-full !h-[50px] !rounded-full" disabled={answered < questions.length} onClick={() => setDone(true)}>
            صحّح إجاباتي — {answered}/{questions.length}
          </QBtn>
        )}
        {questions.length > 0 && !done && answered < questions.length && (
          <p className="text-center text-[12px]" style={{ color: QC.muted }}>أجب على جميع الأسئلة لعرض التصحيح</p>
        )}

        {done && (
          <QCard className="!p-7 text-center">
            <div className="text-[44px] font-extrabold mb-1" style={{ color: pct >= 80 ? QC.success : pct >= 50 ? QC.warning : QC.danger }}>{pct}%</div>
            <p className="text-[13px] mb-1" style={{ color: QC.muted }}>أصبت {score} من {questions.length} في التدريب</p>
            <p className="text-[11.5px] mb-6" style={{ color: QC.faint }}>{pct >= 80 ? "مستوى ممتاز — جاهز لإعادة الاختبار الكامل" : "راجع الأقسام المحددة في المذكرة ثم أعد الاختبار الكامل"}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <QBtn href={`/student/exam/${encodeURIComponent(lessonId)}`}>
                <Icon name="target" size={15} /> إعادة الاختبار الكامل
              </QBtn>
              <QBtn variant="outline" onClick={reset}>إعادة التدريب</QBtn>
              <QBtn variant="outline" href={`/student/lesson/${encodeURIComponent(lessonId)}#notes`}>خطة المراجعة</QBtn>
            </div>
          </QCard>
        )}
      </div>
    </QShell>
  );
}
