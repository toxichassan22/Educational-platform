"use client";

import React, { use, useEffect, useEffectEvent, useRef, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon, DCard } from "@/components/ui";
import { lessonById, questionsOfLesson, subjectOfLesson, unitById, canAccessLesson, attemptsOfUser, compareAttempts, reviewMistakes, Attempt, Question } from "@/lib/data";

type Phase = "intro" | "taking" | "result";

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ExamSession key={id} lessonId={decodeURIComponent(id)} />;
}

function ExamSession({ lessonId }: { lessonId: string }) {
  const { db, me, addAttempt } = useStore();
  const lesson = lessonById(db, lessonId);
  const [sessionQuestions, setSessionQuestions] = useState<Question[] | null>(null);
  const questions = sessionQuestions ?? questionsOfLesson(db, lessonId);
  const [baseline, setBaseline] = useState<Attempt>();
  const [result, setResult] = useState<Attempt>();
  const submitted = useRef(false);
  const subject = subjectOfLesson(db, lessonId);
  const unit = lesson && unitById(db, lesson.unitId);

  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startTs, setStartTs] = useState(0);
  const [showExplain, setShowExplain] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSec = Math.max(60, questions.length * 45);

  const finish = (ans: (number | null)[]) => {
    if (submitted.current || !me || me.role !== "student" || !lesson || !questions.length || !canAccessLesson(db, me.id, lesson)) return;
    submitted.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    const now = new Date().toISOString();
    const attempt: Attempt = {
      id: `at-${crypto.randomUUID()}`, userId: me.id, lessonId,
      score: questions.reduce((s, q, i) => s + (ans[i] === q.correct ? 1 : 0), 0),
      total: questions.length, date: now.slice(0, 10), submittedAt: now,
      timeTakenSec: Math.min(totalSec, Math.max(0, Math.round((Date.now() - startTs) / 1000))),
      answers: questions.map((question, i) => ({ question, selected: ans[i] ?? null })),
    };
    addAttempt(attempt);
    setResult(attempt);
    setPhase("result");
  };

  const start = () => {
    const nextQuestions = questionsOfLesson(db, lessonId);
    if (!nextQuestions.length || !me || me.role !== "student") return;
    submitted.current = false;
    setBaseline(attemptsOfUser(db, me.id).filter((a) => a.lessonId === lessonId).at(-1));
    setSessionQuestions(nextQuestions.map((q) => ({ ...q, options: [...q.options] })));
    setAnswers(new Array(nextQuestions.length).fill(null));
    setCurrent(0);
    setSecondsLeft(Math.max(60, nextQuestions.length * 45));
    setStartTs(Date.now());
    setPhase("taking");
  };

  const tick = useEffectEvent(() => {
    const remaining = Math.max(0, Math.ceil((startTs + totalSec * 1000 - Date.now()) / 1000));
    setSecondsLeft(remaining);
    if (remaining === 0) finish(answers);
  });

  useEffect(() => {
    if (phase !== "taking") return;
    timerRef.current = setInterval(() => tick(), 250);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  if (!lesson) {
    return <AppShell role="student" dark><DCard className="p-10 text-center text-[#9297a6]">الاختبار غير موجود</DCard></AppShell>;
  }

  // حماية المحتوى: الاختبار للمشتركين مثل الدرس
  if (me && !canAccessLesson(db, me.id, lesson)) {
    return (
      <AppShell role="student" dark>
        <div className="max-w-lg mx-auto rounded-[2rem] p-10 text-center bg-[#161c29] border border-[#2b3547] animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f5b329] text-[#0f1217] flex items-center justify-center mb-4 animate-float">
            <Icon name="lock" size={30} />
          </div>
          <h2 className="text-xl font-black text-white mb-2">الاختبار للمشتركين فقط</h2>
          <p className="text-[#9297a6] text-sm mb-6">اشترك لتؤدي اختبار «{lesson.title}» وتكسب XP</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/student/subscription" className="bg-[#f5b329] hover:bg-[#e0a41f] text-[#0f1217] px-7 py-3 rounded-2xl font-black text-sm transition-colors">اشترك الآن</Link>
            <Link href={`/student/lesson/${lessonId}`} className="border border-[#2b3547] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#1a2130] transition-colors">رجوع</Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const answered = answers.filter((a) => a !== null).length;
  const score = questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const difference = result ? compareAttempts(result, baseline) : null;
  const mistakes = reviewMistakes(result);

  return (
    <AppShell role="student" dark>
      <div className="max-w-[860px] mx-auto animate-fade-up">

        {/* ===== شاشة البداية ===== */}
        {phase === "intro" && (
          <DCard className="rounded-[24px] p-8 sm:p-10 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-[#f5b329] text-[#0f1217] flex items-center justify-center mb-5 animate-float">
              <Icon name="target" size={38} />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">اختبار درس «{lesson.title}»</h1>
            <p className="text-[#9297a6] text-sm mb-7">{subject?.name} · {unit?.title}</p>

            <div className="grid grid-cols-3 gap-3 mb-7 max-w-sm mx-auto">
              <div className="bg-[#1a2130] border border-[#2b3547] rounded-2xl p-4">
                <div className="text-2xl font-black text-white">{questions.length}</div>
                <div className="text-[11px] text-[#9297a6] font-bold">سؤال</div>
              </div>
              <div className="bg-[#1a2130] border border-[#2b3547] rounded-2xl p-4">
                <div className="text-2xl font-black text-white">{Math.ceil(totalSec / 60)}</div>
                <div className="text-[11px] text-[#9297a6] font-bold">دقائق</div>
              </div>
              <div className="bg-[#1a2130] border border-[#2b3547] rounded-2xl p-4">
                <div className="text-2xl font-black text-[#f5b329]">+{questions.length * 15}</div>
                <div className="text-[11px] text-[#9297a6] font-bold">XP متاح</div>
              </div>
            </div>

            <div className="bg-[#1a2130] border border-[#2b3547] rounded-2xl p-3.5 text-xs text-[#c6cfdd] mb-7 text-right leading-relaxed max-w-md mx-auto">
              <b className="text-[#f5b329]">تعليمات:</b> الاختبار موقوت ويبدأ فور ضغط «ابدأ». يمكنك التنقل بين الأسئلة أثناء المحاولة؛ لا تغلق الصفحة قبل التسليم. عند انتهاء الوقت تُسلَّم الإجابات تلقائيًا وتُحفظ النتيجة ومراجعتها على هذا المتصفح.
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {questions.length > 0 ? (
                <button onClick={start}
                  className="bg-[#2072e0] hover:bg-[#1b63c4] text-white px-10 py-3.5 rounded-full font-black transition-colors active:scale-95 flex items-center gap-2 shadow-lg shadow-[#2072e0]/25">
                  <Icon name="bolt" size={18} /> ابدأ الاختبار
                </button>
              ) : (
                <div className="bg-[#1a2130] border border-[#2b3547] rounded-2xl px-6 py-3.5 text-sm font-bold text-[#9297a6]">
                  لا توجد أسئلة لهذا الدرس بعد — راجع المذكرة حاليًا
                </div>
              )}
              <Link href={`/student/lesson/${lessonId}`}
                className="border border-[#2b3547] text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-[#1a2130] transition-colors">
                رجوع للدرس
              </Link>
            </div>
          </DCard>
        )}

        {/* ===== أثناء الاختبار — تصحيح فوري بستايل UULA ===== */}
        {phase === "taking" && questions.length > 0 && (
          <div className="space-y-5">
            {/* الشريط العلوي: «اختبار» + بيل المستوى + المؤقت */}
            <div className="flex items-center justify-between gap-4 flex-wrap sticky top-[84px] z-30">
              <div className="flex items-center gap-3">
                <span className="font-black">اختبار</span>
                <span className="flex items-center gap-1.5 bg-[#8e5cf0]/20 border border-[#8e5cf0]/40 text-[#b79bf7] text-[11px] font-black px-3 py-1 rounded-full">
                  <Icon name="bolt" size={11} />
                  {current < questions.length / 3 ? "سهل" : current < (questions.length * 2) / 3 ? "متوسط" : "صعب"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-[#9297a6]">السؤال {current + 1} من {questions.length}</span>
                <span className={`flex items-center gap-2 bg-[#161c29] border border-[#2b3547] rounded-2xl px-4 py-2 font-bold ${secondsLeft < 60 ? "text-[#e04d4d]" : "text-[#f5b329]"}`}>
                  <Icon name="clock" size={16} />
                  <span className="tabular-nums" dir="ltr">{mm}:{ss}</span>
                </span>
                <button onClick={() => finish(answers)}
                  className="bg-[#3d1a1a] border border-[#e04d4d]/40 text-[#e04d4d] font-bold text-sm px-4 py-2 rounded-2xl hover:bg-[#e04d4d]/15 transition-colors">
                  تسليم
                </button>
              </div>
            </div>

            {/* كارت السؤال */}
            <DCard className="rounded-[20px] p-7 sm:p-9" key={current}>
              <h2 className="text-lg sm:text-xl font-black leading-relaxed mb-7">{questions[current].text}</h2>

              <div className="space-y-3.5">
                {questions[current].options.map((opt, oi) => {
                  const answeredThis = answers[current] !== null;
                  const selected = answers[current] === oi;
                  const isCorrect = oi === questions[current].correct;
                  // بعد الاختيار: الصح يتلوّن أخضر والغلط المختار أحمر — مثل UULA
                  const cls = !answeredThis
                    ? selected ? "border-[#2072e0] bg-[#1a3454]" : "border-[#2b3547] bg-[#1a2130] hover:border-[#2072e0]/50"
                    : isCorrect ? "border-[#22c55e] bg-[#22c55e]/10"
                    : selected ? "border-[#e04d4d] bg-[#e04d4d]/10"
                    : "border-[#2b3547] bg-[#1a2130] opacity-60";
                  return (
                    <button key={oi} disabled={answeredThis}
                      onClick={() => setAnswers((a) => a.map((x, i) => (i === current ? oi : x)))}
                      className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-2xl border-2 text-right transition-all ${cls}`}>
                      {answeredThis && isCorrect ? (
                        <span className="w-[22px] h-[22px] rounded-full bg-[#22c55e] flex items-center justify-center shrink-0">
                          <Icon name="check" size={12} className="text-white" />
                        </span>
                      ) : answeredThis && selected ? (
                        <span className="w-[22px] h-[22px] rounded-full bg-[#e04d4d] flex items-center justify-center shrink-0">
                          <Icon name="x" size={12} className="text-white" />
                        </span>
                      ) : (
                        <span className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          selected ? "border-[#2072e0]" : "border-[#5a6577]"}`}>
                          {selected && <span className="w-3 h-3 rounded-full bg-[#2072e0]" />}
                        </span>
                      )}
                      <span className="font-bold">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* الفيدباك الفوري: صح يا بطل + اشرح لي */}
              {answers[current] !== null && (
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#2b3547]/50">
                  {answers[current] === questions[current].correct ? (
                    <span className="font-black text-[#22c55e]">صح يا بطل!</span>
                  ) : (
                    <span className="font-black text-[#e04d4d]">إجابة غير صحيحة</span>
                  )}
                  {questions[current].explanation && (
                    <button onClick={() => setShowExplain((s) => !s)}
                      className="flex items-center gap-1.5 text-sm font-bold text-[#4a9bf5] hover:text-white transition-colors">
                      <Icon name="chat" size={15} /> اشرح لي!
                    </button>
                  )}
                </div>
              )}
              {answers[current] !== null && showExplain && questions[current].explanation && (
                <div className="mt-3 bg-[#1a3454] border border-[#2072e0]/30 rounded-xl px-4 py-3 text-sm text-[#c6cfdd] leading-relaxed">
                  <b className="text-[#4a9bf5]">الشرح:</b> {questions[current].explanation}
                </div>
              )}
            </DCard>

            {/* تنقل + مؤشر الأسئلة */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => { setCurrent((c) => Math.max(0, c - 1)); setShowExplain(false); }} disabled={current === 0}
                className="bg-[#161c29] border border-[#2b3547] text-white font-bold text-sm px-7 py-3 rounded-full disabled:opacity-40 hover:bg-[#1a2130] transition-colors">
                ‹ السابق
              </button>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {questions.map((_, i) => (
                  <button key={i} onClick={() => { setCurrent(i); setShowExplain(false); }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      i === current ? "bg-[#2072e0] text-white scale-110" : answers[i] !== null ? "bg-[#1a3454] border border-[#2072e0]/50 text-[#4a9bf5]" : "bg-[#161c29] border border-[#2b3547] text-[#9297a6]"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              {current === questions.length - 1
                ? <button onClick={() => finish(answers)}
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-sm px-7 py-3 rounded-full transition-colors">تسليم الاختبار</button>
                : <button onClick={() => { setCurrent((c) => Math.min(questions.length - 1, c + 1)); setShowExplain(false); }}
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-sm px-8 py-3 rounded-full transition-colors">السؤال التالي</button>}
            </div>
          </div>
        )}

        {/* ===== النتيجة ===== */}
        {phase === "result" && (
          <div className="space-y-5">
            <DCard className="rounded-[24px] p-8 text-center">
              <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-4 animate-pop ${
                pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-[#f5b329]" : "bg-rose-500"} text-white`}>
                <Icon name={pct >= 50 ? "trophy" : "refresh"} size={44} />
              </div>
              <div className={`text-6xl font-black mb-1 ${pct >= 80 ? "text-emerald-300" : pct >= 50 ? "text-[#f5b329]" : "text-rose-300"}`}>{pct}%</div>
              <h2 className="text-xl font-black text-white mb-1">
                {pct >= 80 ? "ممتاز! أداء أسطوري" : pct >= 50 ? "جيد — أنت قريب" : "راجع الدرس وحاول مجددًا"}
              </h2>
              <p className="text-[#9297a6] text-sm mb-2">أجبت بشكل صحيح على {score} من {questions.length} أسئلة</p>
              <div className="inline-flex items-center gap-1.5 bg-[#1a2130] rounded-full px-4 py-1.5 text-[#f5b329] font-black text-sm mb-6">
                <Icon name="bolt" size={15} /> +{score * 15} XP
              </div>
              <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={start} className="bg-[#2072e0] hover:bg-[#1b63c4] text-white px-7 py-3 rounded-full font-black text-sm transition-colors flex items-center gap-2">
                  <Icon name="refresh" size={15} /> إعادة الاختبار
                </button>
                <Link href={`/student/lesson/${lessonId}`} className="border border-[#2b3547] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#1a2130] transition-colors">مراجعة الدرس</Link>
                <Link href="/student/reports" className="border border-[#2b3547] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#1a2130] transition-colors">تقريري الكامل</Link>
              </div>
            </DCard>

            <DCard className="p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[#4a9bf5] font-black mb-3"><Icon name="target" /> خطوتك التالية</div>
              {difference !== null && baseline && (
                <div className="bg-[#1a3454] rounded-xl p-4 mb-4" role="status">
                  <div className="text-sm font-bold text-white">المحاولة السابقة {Math.round(baseline.score / baseline.total * 100)}% ← الآن {pct}%</div>
                  <p className="text-xs text-[#9297a6] mt-2">{difference > 0 ? `تحسّن بمقدار ${difference} نقطة مئوية` : difference < 0 ? `انخفاض بمقدار ${Math.abs(difference)} نقطة مئوية — راجع الأخطاء ثم حاول مجددًا` : "نفس نتيجة المحاولة السابقة — راجع تفاصيل الإجابات"} · مقارنة لنفس أسئلة الاختبار، وليست مقياسًا شاملًا لإتقان المادة.</p>
                </div>
              )}
              <p className="text-sm text-[#9297a6] leading-relaxed mb-4">{mistakes.length ? `لديك ${mistakes.length} أسئلة تحتاج مراجعة، بما فيها الأسئلة غير المجابة. جهزنا لك شرح الإجابات وروابط للمذكرة؛ راجعها ثم أعد الاختبار لقياس الفرق.` : "أجبت عن كل الأسئلة بشكل صحيح. انتقل للدرس التالي أو راجع ملخص الدرس لتثبيت فهمك."}</p>
              <Link href={`/student/lesson/${lessonId}#review`} className="inline-flex items-center gap-2 bg-[#2072e0] text-white rounded-xl px-5 py-3 text-sm font-bold">
                <Icon name="book" size={17} /> {mistakes.length ? "افتح خطة المراجعة" : "العودة إلى الدرس"}
              </Link>
            </DCard>

            {/* مراجعة الإجابات */}
            <DCard className="p-6">
              <h3 className="font-black mb-4">مراجعة الإجابات</h3>
              <div className="space-y-4">
                {questions.map((q, i) => {
                  const ok = answers[i] === q.correct;
                  return (
                    <div key={q.id} className={`rounded-2xl border-2 p-4 ${ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-[#e04d4d]/30 bg-[#e04d4d]/5"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${ok ? "bg-emerald-500" : "bg-[#e04d4d]"} text-white`}>
                          <Icon name={ok ? "check" : "x"} size={14} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm mb-2">{i + 1}. {q.text}</div>
                          <div className="text-xs space-y-1">
                            <div className={ok ? "text-emerald-400" : "text-[#e04d4d]"}>
                              إجابتك: <b>{answers[i] !== null ? q.options[answers[i]!] : "— بدون إجابة"}</b>
                            </div>
                            {!ok && <div className="text-emerald-400">الإجابة الصحيحة: <b>{q.options[q.correct]}</b></div>}
                            {q.explanation && (
                              <div className="mt-2 bg-[#1a3454] border border-[#2072e0]/30 rounded-xl px-3 py-2 text-[#c6cfdd] leading-relaxed flex items-start gap-1.5">
                                <Icon name="spark" size={13} className="text-[#4a9bf5] mt-0.5 shrink-0" />
                                <span><b className="text-[#4a9bf5]">الشرح:</b> {q.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DCard>
          </div>
        )}
      </div>
    </AppShell>
  );
}
