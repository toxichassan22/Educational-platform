"use client";

import React, { use, useEffect, useEffectEvent, useRef, useState } from "react";
import Link from "next/link";
import QShell, { QCard, QBtn, QBackLink } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { lessonById, questionsOfLesson, subjectOfLesson, unitById, canAccessLesson, attemptsOfUser, compareAttempts, reviewMistakes, Attempt, Question } from "@/lib/data";
import { QC } from "@/lib/theme-q";

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
    return (
      <QShell role="student">
        <div className="text-center py-20 font-bold" style={{ color: QC.muted }}>الاختبار غير موجود</div>
      </QShell>
    );
  }

  // حماية المحتوى
  if (me && !canAccessLesson(db, me.id, lesson)) {
    return (
      <QShell role="student">
        <div className="max-w-lg mx-auto">
          <QCard className="!p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl grid place-items-center mb-4" style={{ background: QC.warningSoft, color: QC.warning }}>
              <Icon name="lock" size={30} />
            </div>
            <h2 className="text-[18px] font-extrabold mb-2" style={{ color: QC.ink }}>الاختبار للمشتركين فقط</h2>
            <p className="text-[13px] mb-6" style={{ color: QC.muted }}>اشترك لتؤدي اختبار «{lesson.title}»</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <QBtn href="/student/subscription">اشترك الآن</QBtn>
              <QBtn variant="outline" href={`/student/lesson/${encodeURIComponent(lessonId)}`}>رجوع</QBtn>
            </div>
          </QCard>
        </div>
      </QShell>
    );
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const score = questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const difference = result ? compareAttempts(result, baseline) : null;
  const mistakes = reviewMistakes(result);

  /* ===== شاشة اكتمال الاختبار الزرقاء الكاملة (TheQ) ===== */
  if (phase === "result") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(160deg, ${QC.brand} 0%, #0057d8 55%, ${QC.navyDeep} 100%)`, color: "#fff" }}>
        <header className="sticky top-0 z-40 text-white" style={{ background: QC.navy }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
            <span className="font-bold text-[15px] px-3 py-1.5">الاختبار</span>
            <img src="/theq/ui/logo.png" alt="The Q App" className="h-[34px] w-auto" />
          </div>
        </header>

        <div className="flex-1 grid place-items-center px-4 py-10">
          <div className="text-center max-w-lg w-full">
            <div className="w-24 h-24 mx-auto rounded-full grid place-items-center mb-5 bg-white/15">
              <div className="w-16 h-16 rounded-full bg-white grid place-items-center animate-pop">
                <Icon name="check" size={34} style={{ color: QC.brand }} />
              </div>
            </div>
            <h1 className="text-[26px] font-extrabold mb-2">اكتمل الاختبار</h1>
            <p className="text-white/85 text-[14px] font-semibold mb-6">تم تسليم اختبارك بنجاح — نتيجتك {score}/{questions.length} ({pct}%)</p>
            <Link href={subject ? `/student/subject/${encodeURIComponent(subject.id)}` : "/student"}
              className="inline-flex items-center justify-center gap-2 bg-white rounded-2xl px-8 py-4 font-extrabold text-[15px] w-full sm:w-auto transition-transform active:scale-[.98]"
              style={{ color: QC.brand }}>
              <Icon name="home" size={18} /> العودة إلى المادة
            </Link>
            <div className="mt-5">
              <button onClick={start} className="text-white/85 hover:text-white text-[13px] font-bold inline-flex items-center gap-1.5">
                <Icon name="refresh" size={14} /> جرّب اختبارًا آخر
              </button>
            </div>
          </div>
        </div>

        {/* مراجعة الإجابات + الخطوة التالية */}
        <div className="w-full max-w-3xl mx-auto px-4 pb-12 space-y-4">
          {(difference !== null || mistakes.length > 0) && (
            <div className="rounded-2xl bg-white p-5" style={{ color: QC.body }}>
              <div className="flex items-center gap-2 font-extrabold mb-3" style={{ color: QC.ink }}>
                <Icon name="target" size={17} style={{ color: QC.brand }} /> خطوتك التالية
              </div>
              {difference !== null && baseline && (
                <div className="rounded-xl p-4 mb-3" style={{ background: QC.brandSoft }}>
                  <div className="text-[13px] font-bold" style={{ color: QC.ink }}>
                    المحاولة السابقة {Math.round(baseline.score / baseline.total * 100)}% ← الآن {pct}%
                  </div>
                  <p className="text-[11.5px] mt-1.5" style={{ color: QC.muted }}>
                    {difference > 0 ? `تحسّن بمقدار ${difference} نقطة مئوية` : difference < 0 ? `انخفاض بمقدار ${Math.abs(difference)} نقطة — راجع الأخطاء ثم حاول مجددًا` : "نفس نتيجة المحاولة السابقة"} · مقارنة لنفس أسئلة الاختبار.
                  </p>
                </div>
              )}
              <p className="text-[12.5px] leading-relaxed mb-3" style={{ color: QC.muted }}>
                {mistakes.length ? `لديك ${mistakes.length} أسئلة تحتاج مراجعة. جهزنا لك شرح الإجابات وروابط للمذكرة.` : "أجبت عن كل الأسئلة بشكل صحيح. انتقل للدرس التالي أو راجع ملخص الدرس."}
              </p>
              <Link href={`/student/lesson/${encodeURIComponent(lessonId)}#notes`}
                className="inline-flex items-center gap-2 text-white rounded-xl px-5 py-2.5 text-[12.5px] font-bold" style={{ background: QC.brand }}>
                <Icon name="book" size={15} /> {mistakes.length ? "افتح خطة المراجعة" : "العودة إلى الدرس"}
              </Link>
            </div>
          )}

          <div className="rounded-2xl bg-white p-5" style={{ color: QC.body }}>
            <h3 className="font-extrabold mb-4" style={{ color: QC.ink }}>مراجعة الإجابات</h3>
            <div className="space-y-3.5">
              {questions.map((q, i) => {
                const ok = answers[i] === q.correct;
                return (
                  <div key={q.id} className="rounded-xl border-2 p-4" style={{ borderColor: ok ? "#a7f3d0" : "#fecaca", background: ok ? "#f0fdf9" : "#fff5f5" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full grid place-items-center shrink-0 mt-0.5 text-white" style={{ background: ok ? QC.success : QC.danger }}>
                        <Icon name={ok ? "check" : "x"} size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[13.5px] mb-2" style={{ color: QC.ink }}>{i + 1}. {q.text}</div>
                        <div className="text-[12px] space-y-1">
                          <div style={{ color: ok ? QC.success : QC.danger }}>
                            إجابتك: <b>{answers[i] !== null ? q.options[answers[i]!] : "— بدون إجابة"}</b>
                          </div>
                          {!ok && <div style={{ color: QC.success }}>الصحيحة: <b>{q.options[q.correct]}</b></div>}
                          {q.explanation && <div className="pt-1" style={{ color: QC.muted }}><b>الشرح:</b> {q.explanation}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QShell role="student" fab={phase !== "taking"}>
      <div className="max-w-[860px] mx-auto">
        {/* ===== شاشة البداية ===== */}
        {phase === "intro" && (
          <>
            <QBackLink href={subject ? `/student/subject/${encodeURIComponent(subject.id)}/exams` : "/student"}>
              العودة إلى الأسئلة
            </QBackLink>
            <QCard className="mt-4 !p-8 sm:!p-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl grid place-items-center mb-5" style={{ background: QC.navy, color: "#fff" }}>
                <Icon name="clipboard" size={38} />
              </div>
              <h1 className="text-[22px] font-extrabold mb-2" style={{ color: QC.ink }}>اختبار درس «{lesson.title}»</h1>
              <p className="text-[13px] mb-7" style={{ color: QC.muted }}>{subject?.name} · {unit?.title}</p>

              <div className="grid grid-cols-3 gap-3 mb-7 max-w-sm mx-auto">
                {[
                  [String(questions.length), "سؤال"],
                  [String(Math.ceil(totalSec / 60)), "دقائق"],
                  [`+${questions.length * 15}`, "XP متاح"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-2xl border p-4" style={{ borderColor: QC.line, background: QC.bgSoft }}>
                    <div className="text-[22px] font-extrabold" style={{ color: QC.ink }}>{v}</div>
                    <div className="text-[11px] font-bold" style={{ color: QC.muted }}>{l}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border p-4 text-[12px] mb-7 text-right leading-relaxed max-w-md mx-auto" style={{ borderColor: QC.line, background: QC.bgSoft, color: QC.body }}>
                <b style={{ color: QC.warning }}>تعليمات:</b> الاختبار موقوت ويبدأ فور ضغط «ابدأ». يمكنك التنقل بين الأسئلة أثناء المحاولة؛ لا تغلق الصفحة قبل التسليم. عند انتهاء الوقت تُسلَّم الإجابات تلقائيًا.
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {questions.length > 0 ? (
                  <QBtn onClick={start} className="!px-10 !py-3.5 !rounded-full !text-[14px]">
                    <Icon name="bolt" size={18} /> ابدأ الاختبار
                  </QBtn>
                ) : (
                  <div className="rounded-2xl border px-6 py-3.5 text-[13px] font-bold" style={{ borderColor: QC.line, color: QC.muted }}>
                    لا توجد أسئلة لهذا الدرس بعد — راجع المذكرة حاليًا
                  </div>
                )}
                <QBtn variant="outline" href={`/student/lesson/${encodeURIComponent(lessonId)}`} className="!px-6 !py-3.5 !rounded-full">
                  رجوع للدرس
                </QBtn>
              </div>
            </QCard>
          </>
        )}

        {/* ===== أثناء الاختبار ===== */}
        {phase === "taking" && questions.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap sticky top-[80px] z-30 py-2" style={{ background: QC.bgSoft }}>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-[16px]" style={{ color: QC.ink }}>اختبار</span>
                <span className="flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full" style={{ background: "#f3e8ff", color: "#7c3aed" }}>
                  <Icon name="bolt" size={11} />
                  {current < questions.length / 3 ? "سهل" : current < (questions.length * 2) / 3 ? "متوسط" : "صعب"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-bold" style={{ color: QC.muted }}>السؤال {current + 1} من {questions.length}</span>
                <span className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 font-bold"
                  style={{ borderColor: secondsLeft < 60 ? "#fecaca" : QC.line, color: secondsLeft < 60 ? QC.danger : QC.warning }}>
                  <Icon name="clock" size={16} />
                  <span className="tabular-nums" dir="ltr">{mm}:{ss}</span>
                </span>
                <button onClick={() => finish(answers)}
                  className="border font-bold text-[13px] px-4 py-2 rounded-xl transition-colors"
                  style={{ borderColor: "#fecaca", color: QC.danger, background: QC.dangerSoft }}>
                  تسليم
                </button>
              </div>
            </div>

            {/* كارت السؤال */}
            <QCard className="!p-7 sm:!p-9" key={current}>
              <h2 className="text-[17px] sm:text-[19px] font-extrabold leading-relaxed mb-7" style={{ color: QC.ink }}>{questions[current].text}</h2>

              <div className="space-y-3.5">
                {questions[current].options.map((opt, oi) => {
                  const answeredThis = answers[current] !== null;
                  const selected = answers[current] === oi;
                  const isCorrect = oi === questions[current].correct;
                  const cls = !answeredThis
                    ? selected ? "border-[#006fff] bg-[#eff6ff]" : "border-[#e2e8f0] bg-white hover:border-[#93c5fd]"
                    : isCorrect ? "border-emerald-500 bg-emerald-50"
                    : selected ? "border-rose-400 bg-rose-50"
                    : "border-[#e2e8f0] bg-white opacity-60";
                  return (
                    <button key={oi} disabled={answeredThis}
                      onClick={() => setAnswers((a) => a.map((x, i) => (i === current ? oi : x)))}
                      className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-2xl border-2 text-right transition-all ${cls}`}>
                      {answeredThis && isCorrect ? (
                        <span className="w-[22px] h-[22px] rounded-full grid place-items-center shrink-0 text-white" style={{ background: QC.success }}>
                          <Icon name="check" size={12} />
                        </span>
                      ) : answeredThis && selected ? (
                        <span className="w-[22px] h-[22px] rounded-full grid place-items-center shrink-0 text-white" style={{ background: QC.danger }}>
                          <Icon name="x" size={12} />
                        </span>
                      ) : (
                        <span className="w-[22px] h-[22px] rounded-full border-2 grid place-items-center shrink-0 transition-all" style={{ borderColor: selected ? QC.brand : QC.lineSoft }}>
                          {selected && <span className="w-3 h-3 rounded-full" style={{ background: QC.brand }} />}
                        </span>
                      )}
                      <span className="font-bold text-[14px]" style={{ color: QC.ink }}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {answers[current] !== null && (
                <div className="flex items-center justify-between mt-6 pt-5 border-t" style={{ borderColor: QC.line }}>
                  {answers[current] === questions[current].correct ? (
                    <span className="font-extrabold" style={{ color: QC.success }}>صح يا بطل!</span>
                  ) : (
                    <span className="font-extrabold" style={{ color: QC.danger }}>إجابة غير صحيحة</span>
                  )}
                  {questions[current].explanation && (
                    <button onClick={() => setShowExplain((s) => !s)}
                      className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: QC.brand }}>
                      <Icon name="chat" size={15} /> اشرح لي!
                    </button>
                  )}
                </div>
              )}
              {answers[current] !== null && showExplain && questions[current].explanation && (
                <div className="mt-3 border rounded-xl px-4 py-3 text-[13px] leading-relaxed" style={{ background: QC.brandSoft, borderColor: QC.brandBorder, color: QC.body }}>
                  <b style={{ color: QC.brand }}>الشرح:</b> {questions[current].explanation}
                </div>
              )}
            </QCard>

            {/* تنقل + مؤشر الأسئلة */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => { setCurrent((c) => Math.max(0, c - 1)); setShowExplain(false); }} disabled={current === 0}
                className="bg-white border font-bold text-[13px] px-7 py-3 rounded-full disabled:opacity-40 transition-colors"
                style={{ borderColor: QC.line, color: QC.body }}>
                ‹ السابق
              </button>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {questions.map((_, i) => (
                  <button key={i} onClick={() => { setCurrent(i); setShowExplain(false); }}
                    className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all border ${
                      i === current ? "text-white scale-110 border-transparent" : answers[i] !== null ? "bg-white" : "bg-white"}`}
                    style={
                      i === current
                        ? { background: QC.brand, borderColor: QC.brand }
                        : answers[i] !== null
                          ? { borderColor: QC.brandBorder, color: QC.brand, background: QC.brandSoft }
                          : { borderColor: QC.line, color: QC.faint }
                    }>
                    {i + 1}
                  </button>
                ))}
              </div>
              {current === questions.length - 1
                ? <button onClick={() => finish(answers)}
                    className="text-white font-extrabold text-[13px] px-7 py-3 rounded-full transition-colors" style={{ background: QC.success }}>
                    تسليم الاختبار</button>
                : <button onClick={() => { setCurrent((c) => Math.min(questions.length - 1, c + 1)); setShowExplain(false); }}
                    className="text-white font-extrabold text-[13px] px-8 py-3 rounded-full transition-colors" style={{ background: QC.success }}>
                    السؤال التالي</button>}
            </div>
          </div>
        )}
      </div>
    </QShell>
  );
}
