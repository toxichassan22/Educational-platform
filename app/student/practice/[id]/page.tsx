"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon, DCard } from "@/components/ui";
import { lessonById, questionsOfLesson, followUpQuestions, unitById, subjectOfLesson, canAccessLesson } from "@/lib/data";

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
    return <AppShell role="student" dark><DCard className="p-10 text-center text-[#9297a6]">التدريب غير موجود</DCard></AppShell>;
  }

  if (me && !canAccessLesson(db, me.id, lesson)) {
    return (
      <AppShell role="student" dark>
        <div className="max-w-lg mx-auto rounded-[2rem] p-10 text-center bg-[#161c29] border border-[#2b3547] animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f5b329] text-[#0f1217] flex items-center justify-center mb-4 animate-float">
            <Icon name="lock" size={30} />
          </div>
          <h2 className="text-xl font-black text-white mb-2">التدريب للمشتركين فقط</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/student/subscription" className="bg-[#f5b329] hover:bg-[#e0a41f] text-[#0f1217] px-7 py-3 rounded-2xl font-black text-sm transition-colors">اشترك الآن</Link>
            <Link href={`/student/lesson/${lessonId}`} className="border border-[#2b3547] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#1a2130] transition-colors">رجوع</Link>
          </div>
        </div>
      </AppShell>
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
    <AppShell role="student" dark>
      <div className="max-w-3xl mx-auto space-y-5 animate-fade-up">
        {/* الترويسة */}
        <DCard className="rounded-3xl p-6 md:p-7 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#8e5cf0]/15 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-block bg-[#8e5cf0]/15 text-[#b592f7] text-[11px] font-black px-3 py-1 rounded-full mb-3">تدريب متابعة — أسئلة مختلفة عن الاختبار</div>
              <h1 className="text-xl md:text-2xl font-black text-white mb-1">{lesson.title}</h1>
              <p className="text-[#9297a6] text-sm">{subject?.name} · {unit?.title}</p>
            </div>
            <span className="text-[11px] font-black bg-[#3d321a] text-[#f5b329] px-2.5 py-1 rounded-full">{answered}/{questions.length}</span>
          </div>
          <p className="relative text-[#9297a6]/70 text-xs mt-4">أسئلة تدريبية على نفس نقاط الدرس — نتيجتها لا تُحتسب في تقاريرك، والاختبار الكامل هو مقياس التقدم.</p>
        </DCard>

        {questions.length === 0 && (
          <DCard className="p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2072e0]/15 text-[#4a9bf5] flex items-center justify-center mb-4"><Icon name="target" size={26} /></div>
            <h2 className="font-black mb-2">لا يوجد تدريب متخصص لهذا الدرس بعد</h2>
            <p className="text-sm text-[#9297a6] mb-5">يمكنك إعادة الاختبار الكامل أو مراجعة المذكرة.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/student/exam/${lessonId}`} className="bg-[#f5b329] hover:bg-[#e0a41f] text-[#0f1217] px-7 py-3 rounded-full font-black text-sm transition-colors">إعادة الاختبار</Link>
              <Link href={`/student/lesson/${lessonId}`} className="border border-[#2b3547] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#1a2130] transition-colors">العودة للدرس</Link>
            </div>
          </DCard>
        )}

        {/* الأسئلة */}
        {questions.map((q, i) => {
          const chosen = answers[i];
          const ok = done && chosen === q.correct;
          return (
            <DCard key={q.id} className={`p-5 sm:p-6 !border-2 transition-colors ${done ? (ok ? "!border-emerald-500/40" : "!border-[#e04d4d]/40") : ""}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${done ? (ok ? "bg-[#1a3d24] text-[#33bf6b]" : "bg-[#3d1a1a] text-[#e04d4d]") : "bg-[#2072e0]/15 text-[#4a9bf5]"}`}>سؤال {i + 1}</span>
                <span className="text-[11px] font-black bg-[#212936] text-[#9297a6] px-2.5 py-0.5 rounded-full">{q.type === "mcq" ? "اختيار" : "صح / خطأ"}</span>
              </div>
              <h2 className="font-bold leading-relaxed mb-4">{q.text}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  const selected = chosen === oi;
                  const isCorrect = done && oi === q.correct;
                  const isWrongPick = done && selected && oi !== q.correct;
                  return (
                    <button key={oi} disabled={done}
                      onClick={() => setAnswers((a) => a.map((x, j) => (j === i ? oi : x)))}
                      className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-right text-sm font-bold transition-all ${
                        isCorrect ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                        : isWrongPick ? "border-[#e04d4d] bg-[#e04d4d]/10 text-[#e04d4d]"
                        : selected ? "border-[#2072e0] bg-[#1a3454] text-white"
                        : "border-[#2b3547] text-[#c6cfdd] hover:border-[#2072e0]/50 hover:bg-[#1a2130]"}`}>
                      <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                        isCorrect ? "border-emerald-500 bg-emerald-500 text-white"
                        : isWrongPick ? "border-[#e04d4d] bg-[#e04d4d] text-white"
                        : selected ? "border-[#2072e0] bg-[#2072e0] text-white" : "border-[#5a6577]"}`}>
                        {(selected || isCorrect) && <Icon name={isCorrect ? "check" : isWrongPick ? "x" : "check"} size={12} />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {done && q.explanation && (
                <div className="mt-3 bg-[#1a3454] border border-[#2072e0]/30 rounded-xl px-3 py-2 text-xs text-[#c6cfdd] leading-relaxed flex items-start gap-1.5">
                  <Icon name="spark" size={13} className="text-[#4a9bf5] mt-0.5 shrink-0" />
                  <span><b className="text-[#4a9bf5]">الشرح:</b> {q.explanation}</span>
                </div>
              )}
            </DCard>
          );
        })}

        {/* تسليم / نتيجة */}
        {questions.length > 0 && !done && (
          <button className="w-full h-[52px] rounded-full font-black text-[#0f1217] bg-[#f5b329] hover:bg-[#e0a41f] transition-all active:scale-[.98] disabled:opacity-40"
            disabled={answered < questions.length} onClick={() => setDone(true)}>
            صحّح إجاباتي — {answered}/{questions.length}
          </button>
        )}
        {questions.length > 0 && !done && answered < questions.length && (
          <p className="text-center text-xs text-[#9297a6]">أجب على جميع الأسئلة لعرض التصحيح</p>
        )}

        {done && (
          <DCard className="rounded-3xl p-7 text-center animate-fade-up">
            <div className={`text-5xl font-black mb-1 ${pct >= 80 ? "text-emerald-300" : pct >= 50 ? "text-[#f5b329]" : "text-rose-300"}`}>{pct}%</div>
            <p className="text-[#9297a6] text-sm mb-1">أصبت {score} من {questions.length} في التدريب</p>
            <p className="text-[#9297a6]/60 text-xs mb-6">{pct >= 80 ? "مستوى ممتاز — جاهز لإعادة الاختبار الكامل" : "راجع الأقسام المحددة في المذكرة ثم أعد الاختبار الكامل لقياس تحسّنك"}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/student/exam/${lessonId}`} className="bg-[#2072e0] hover:bg-[#1b63c4] text-white px-7 py-3 rounded-full font-black text-sm transition-colors flex items-center gap-2">
                <Icon name="target" size={15} /> إعادة الاختبار الكامل
              </Link>
              <button onClick={reset} className="border border-[#2b3547] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#1a2130] transition-colors">إعادة التدريب</button>
              <Link href={`/student/lesson/${lessonId}#review`} className="border border-[#2b3547] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#1a2130] transition-colors">خطة المراجعة</Link>
            </div>
          </DCard>
        )}
      </div>
    </AppShell>
  );
}
