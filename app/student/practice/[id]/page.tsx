"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Btn, Badge } from "@/components/ui";
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
    return <AppShell role="student"><Card className="p-10 text-center text-slate-400">التدريب غير موجود</Card></AppShell>;
  }

  if (me && !canAccessLesson(db, me.id, lesson)) {
    return (
      <AppShell role="student">
        <div className="max-w-lg mx-auto rounded-[2rem] p-10 text-center bg-night-900 animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500 text-night-950 flex items-center justify-center mb-4 animate-float">
            <Icon name="lock" size={30} />
          </div>
          <h2 className="text-xl font-black text-white mb-2">التدريب للمشتركين فقط</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/student/subscription" className="bg-gold-500 hover:bg-gold-600 text-night-950 px-7 py-3 rounded-2xl font-black text-sm transition-colors">اشترك الآن</Link>
            <Link href={`/student/lesson/${lessonId}`} className="border border-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors">رجوع</Link>
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
    <AppShell role="student">
      <div className="max-w-3xl mx-auto space-y-5 animate-fade-up">
        {/* الترويسة */}
        <div className="rounded-3xl p-6 md:p-7 bg-night-900 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-block bg-gold-500/15 text-gold-300 text-[11px] font-black px-3 py-1 rounded-full mb-3">تدريب متابعة — أسئلة مختلفة عن الاختبار</div>
              <h1 className="text-xl md:text-2xl font-black text-white mb-1">{lesson.title}</h1>
              <p className="text-white/50 text-sm">{subject?.name} · {unit?.title}</p>
            </div>
            <Badge tone="amber">{answered}/{questions.length}</Badge>
          </div>
          <p className="relative text-white/45 text-xs mt-4">أسئلة تدريبية على نفس نقاط الدرس — نتيجتها لا تُحتسب في تقاريرك، والاختبار الكامل هو مقياس التقدم.</p>
        </div>

        {questions.length === 0 && (
          <Card className="p-8 text-center border border-slate-100">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4"><Icon name="target" size={26} /></div>
            <h2 className="font-extrabold text-primary-900 mb-2">لا يوجد تدريب متخصص لهذا الدرس بعد</h2>
            <p className="text-sm text-slate-500 mb-5">يمكنك إعادة الاختبار الكامل أو مراجعة المذكرة.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/student/exam/${lessonId}`}><Btn variant="gold">إعادة الاختبار</Btn></Link>
              <Link href={`/student/lesson/${lessonId}`}><Btn variant="outline">العودة للدرس</Btn></Link>
            </div>
          </Card>
        )}

        {/* الأسئلة */}
        {questions.map((q, i) => {
          const chosen = answers[i];
          const ok = done && chosen === q.correct;
          return (
            <Card key={q.id} className={`p-5 sm:p-6 border-2 transition-colors ${done ? (ok ? "border-emerald-200" : "border-red-200") : "border-slate-100"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Badge tone={done ? (ok ? "green" : "red") : "blue"}>سؤال {i + 1}</Badge>
                <Badge tone="gray">{q.type === "mcq" ? "اختيار" : "صح / خطأ"}</Badge>
              </div>
              <h2 className="font-bold text-primary-900 leading-relaxed mb-4">{q.text}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  const selected = chosen === oi;
                  const isCorrect = done && oi === q.correct;
                  const isWrongPick = done && selected && oi !== q.correct;
                  return (
                    <button key={oi} disabled={done}
                      onClick={() => setAnswers((a) => a.map((x, j) => (j === i ? oi : x)))}
                      className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-right text-sm font-bold transition-all ${
                        isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                        : isWrongPick ? "border-red-300 bg-red-50 text-red-700"
                        : selected ? "border-primary-500 bg-primary-50 text-primary-800"
                        : "border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-slate-50"}`}>
                      <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                        isCorrect ? "border-emerald-500 bg-emerald-500 text-white"
                        : isWrongPick ? "border-red-400 bg-red-400 text-white"
                        : selected ? "border-primary-600 bg-primary-600 text-white" : "border-slate-300"}`}>
                        {(selected || isCorrect) && <Icon name={isCorrect ? "check" : isWrongPick ? "x" : "check"} size={12} />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {done && q.explanation && (
                <div className="mt-3 bg-primary-50/70 border border-primary-100 rounded-xl px-3 py-2 text-xs text-primary-800 leading-relaxed flex items-start gap-1.5">
                  <Icon name="spark" size={13} className="text-primary-500 mt-0.5 shrink-0" />
                  <span><b className="text-primary-600">الشرح:</b> {q.explanation}</span>
                </div>
              )}
            </Card>
          );
        })}

        {/* تسليم / نتيجة */}
        {questions.length > 0 && !done && (
          <Btn variant="gold" className="w-full !py-3.5" disabled={answered < questions.length} onClick={() => setDone(true)}>
            صحّح إجاباتي — {answered}/{questions.length}
          </Btn>
        )}
        {questions.length > 0 && !done && answered < questions.length && (
          <p className="text-center text-xs text-slate-400">أجب على جميع الأسئلة لعرض التصحيح</p>
        )}

        {done && (
          <div className="rounded-3xl p-7 text-center bg-night-900 animate-fade-up">
            <div className={`text-5xl font-black mb-1 ${pct >= 80 ? "text-emerald-300" : pct >= 50 ? "text-gold-300" : "text-rose-300"}`}>{pct}%</div>
            <p className="text-white/60 text-sm mb-1">أصبت {score} من {questions.length} في التدريب</p>
            <p className="text-white/40 text-xs mb-6">{pct >= 80 ? "مستوى ممتاز — جاهز لإعادة الاختبار الكامل" : "راجع الأقسام المحددة في المذكرة ثم أعد الاختبار الكامل لقياس تحسّنك"}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/student/exam/${lessonId}`} className="bg-gold-500 hover:bg-gold-600 text-night-950 px-7 py-3 rounded-2xl font-black text-sm transition-colors flex items-center gap-2">
                <Icon name="target" size={15} /> إعادة الاختبار الكامل
              </Link>
              <button onClick={reset} className="border border-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors">إعادة التدريب</button>
              <Link href={`/student/lesson/${lessonId}#review`} className="border border-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors">خطة المراجعة</Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
