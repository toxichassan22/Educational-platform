"use client";

import React, { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Btn, Badge, Progress } from "@/components/ui";
import { lessonById, questionsOfLesson, subjectOfLesson, unitById, canAccessLesson } from "@/lib/data";

type Phase = "intro" | "taking" | "result";

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { db, me, addAttempt } = useStore();
  const lessonId = decodeURIComponent(id);
  const lesson = lessonById(db, lessonId);
  const questions = useMemo(() => questionsOfLesson(db, lessonId), [db, lessonId]);
  const subject = subjectOfLesson(db, lessonId);
  const unit = lesson && unitById(db, lesson.unitId);

  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startTs, setStartTs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSec = Math.max(60, questions.length * 45);

  const finish = (ans: (number | null)[], secs: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!me) return;
    const score = questions.reduce((s, q, i) => s + (ans[i] === q.correct ? 1 : 0), 0);
    addAttempt({ userId: me.id, lessonId: lessonId, score, total: questions.length, timeTakenSec: Math.round((Date.now() - startTs) / 1000) });
    setPhase("result");
  };

  const start = () => {
    if (!questions.length) return;
    setAnswers(new Array(questions.length).fill(null));
    setCurrent(0);
    setSecondsLeft(totalSec);
    setStartTs(Date.now());
    setPhase("taking");
  };

  useEffect(() => {
    if (phase !== "taking") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setAnswers((ans) => { setTimeout(() => finish(ans, 0), 0); return ans; });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!lesson) {
    return <AppShell role="student"><Card className="p-10 text-center text-slate-400">الاختبار غير موجود</Card></AppShell>;
  }

  // حماية المحتوى: الاختبار للمشتركين مثل الدرس
  if (me && !canAccessLesson(db, me.id, lesson)) {
    return (
      <AppShell role="student">
        <div className="max-w-lg mx-auto rounded-[2rem] p-10 text-center bg-night-900 animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500 text-night-950 flex items-center justify-center mb-4 animate-float">
            <Icon name="lock" size={30} />
          </div>
          <h2 className="text-xl font-black text-white mb-2">الاختبار للمشتركين فقط</h2>
          <p className="text-white/55 text-sm mb-6">اشترك لتؤدي اختبار «{lesson.title}» وتكسب XP</p>
          <div className="flex gap-3 justify-center">
            <Link href="/student/subscription" className="bg-gold-500 hover:bg-gold-600 text-night-950 px-7 py-3 rounded-2xl font-black text-sm transition-colors">اشترك الآن</Link>
            <Link href={`/student/lesson/${lessonId}`} className="border border-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors">رجوع</Link>
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

  return (
    <AppShell role="student">
      <div className="max-w-3xl mx-auto animate-fade-up">

        {/* ===== شاشة البداية ===== */}
        {phase === "intro" && (
          <div className="rounded-3xl p-8 text-center bg-night-900">
            <div>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gold-500 text-night-950 flex items-center justify-center mb-5 animate-float">
                <Icon name="target" size={38} />
              </div>
              <h1 className="text-2xl font-black text-white mb-2">اختبار درس «{lesson.title}»</h1>
              <p className="text-white/50 text-sm mb-7">{subject?.name} · {unit?.title}</p>

              <div className="grid grid-cols-3 gap-3 mb-7 max-w-sm mx-auto">
                <div className="bg-white/[.07] border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-black text-white">{questions.length}</div>
                  <div className="text-[11px] text-white/50 font-bold">سؤال</div>
                </div>
                <div className="bg-white/[.07] border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-black text-white">{Math.ceil(totalSec / 60)}</div>
                  <div className="text-[11px] text-white/50 font-bold">دقائق</div>
                </div>
                <div className="bg-white/[.07] border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-black text-gold-400">+{questions.length * 15}</div>
                  <div className="text-[11px] text-white/50 font-bold">XP متاح</div>
                </div>
              </div>

              <div className="bg-white/[.07] border border-white/10 rounded-2xl p-3.5 text-xs text-white/70 mb-7 text-right leading-relaxed max-w-md mx-auto">
                <b className="text-gold-300">تعليمات:</b> الاختبار موقوت ويبدأ فور ضغط «ابدأ». تُحفظ إجاباتك تلقائيًا ويمكنك التنقل بين الأسئلة — وعند انتهاء الوقت يُسلَّم تلقائيًا ويُصحَّح فورًا.
              </div>

              <div className="flex gap-3 justify-center">
                {questions.length > 0 ? (
                  <button onClick={start}
                    className="bg-gold-500 hover:bg-gold-600 text-night-950 px-10 py-3.5 rounded-2xl font-black transition-colors active:scale-95 flex items-center gap-2">
                    <Icon name="bolt" size={18} /> ابدأ الاختبار
                  </button>
                ) : (
                  <div className="bg-white/[.07] border border-white/10 rounded-2xl px-6 py-3.5 text-sm font-bold text-white/60">
                    لا توجد أسئلة لهذا الدرس بعد — راجع المذكرة حاليًا
                  </div>
                )}
                <Link href={`/student/lesson/${lessonId}`}
                  className="border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors">
                  رجوع للدرس
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ===== أثناء الاختبار ===== */}
        {phase === "taking" && questions.length > 0 && (
          <div className="space-y-4">
            {/* شريط الحالة */}
            <Card className="p-4 flex items-center gap-4 border border-slate-100 sticky top-[72px] z-30">
              <div className={`flex items-center gap-2 font-extrabold ${secondsLeft < 60 ? "text-red-500" : "text-primary-800"}`}>
                <Icon name="clock" size={18} />
                <span className="text-lg tabular-nums" dir="ltr">{mm}:{ss}</span>
              </div>
              <div className="flex-1">
                <Progress value={(answered / questions.length) * 100} />
              </div>
              <div className="text-xs font-bold text-slate-500">{answered}/{questions.length}</div>
              <Btn variant="danger" className="!py-1.5 !px-3 text-xs" onClick={() => finish(answers, secondsLeft)}>تسليم</Btn>
            </Card>

            {/* السؤال */}
            <Card className="p-6 border border-slate-100" key={current}>
              <div className="flex items-center justify-between mb-5">
                <Badge tone="blue">سؤال {current + 1} من {questions.length}</Badge>
                <Badge tone={questions[current].type === "mcq" ? "amber" : "gray"}>
                  {questions[current].type === "mcq" ? "اختيار من متعدد" : "صح / خطأ"}
                </Badge>
              </div>

              <h2 className="text-lg font-bold text-primary-900 leading-relaxed mb-6">{questions[current].text}</h2>

              <div className="space-y-2.5">
                {questions[current].options.map((opt, oi) => {
                  const selected = answers[current] === oi;
                  return (
                    <button key={oi}
                      onClick={() => setAnswers((a) => a.map((x, i) => (i === current ? oi : x)))}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-right transition-all ${
                        selected ? "border-primary-500 bg-primary-50" : "border-slate-200 hover:border-primary-300 hover:bg-slate-50 bg-white"}`}>
                      <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                        selected ? "border-primary-600 bg-primary-600" : "border-slate-300"}`}>
                        {selected && <Icon name="check" size={14} className="text-white" />}
                      </div>
                      <span className={`text-sm font-bold ${selected ? "text-primary-900" : "text-slate-600"}`}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* تنقل + مؤشر الأسئلة */}
            <div className="flex items-center justify-between">
              <Btn variant="outline" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>السابق</Btn>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {questions.map((q, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      i === current ? "bg-primary-600 text-white scale-110" : answers[i] !== null ? "bg-primary-100 text-primary-700" : "bg-white border border-slate-200 text-slate-400"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              {current === questions.length - 1
                ? <Btn variant="gold" onClick={() => finish(answers, secondsLeft)}>تسليم الاختبار</Btn>
                : <Btn onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>التالي</Btn>}
            </div>
          </div>
        )}

        {/* ===== النتيجة ===== */}
        {phase === "result" && (
          <div className="space-y-5">
            <div className="rounded-3xl p-8 text-center bg-night-900">
              <div>
                <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-4 animate-pop ${
                  pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-gold-500" : "bg-rose-500"} text-white`}>
                  <Icon name={pct >= 50 ? "trophy" : "refresh"} size={44} />
                </div>
                <div className={`text-6xl font-black mb-1 ${pct >= 80 ? "text-emerald-300" : pct >= 50 ? "text-gold-300" : "text-rose-300"}`}>{pct}%</div>
                <h2 className="text-xl font-black text-white mb-1">
                  {pct >= 80 ? "ممتاز! أداء أسطوري" : pct >= 50 ? "جيد — أنت قريب" : "راجع الدرس وحاول مجددًا"}
                </h2>
                <p className="text-white/50 text-sm mb-2">أجبت بشكل صحيح على {score} من {questions.length} أسئلة</p>
                <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-1.5 text-gold-300 font-black text-sm mb-6">
                  <Icon name="bolt" size={15} /> +{score * 15} XP
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button onClick={start} className="bg-gold-500 hover:bg-gold-600 text-night-950 px-7 py-3 rounded-2xl font-black text-sm transition-colors flex items-center gap-2">
                    <Icon name="refresh" size={15} /> إعادة الاختبار
                  </button>
                  <Link href={`/student/lesson/${lessonId}`} className="border border-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors">مراجعة الدرس</Link>
                  <Link href="/student/reports" className="border border-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors">تقريري الكامل</Link>
                </div>
              </div>
            </div>

            {/* مراجعة الإجابات */}
            <Card className="p-6 border border-slate-100">
              <h3 className="font-extrabold text-primary-900 mb-4">مراجعة الإجابات</h3>
              <div className="space-y-4">
                {questions.map((q, i) => {
                  const ok = answers[i] === q.correct;
                  return (
                    <div key={q.id} className={`rounded-2xl border-2 p-4 ${ok ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${ok ? "bg-emerald-500" : "bg-red-500"} text-white`}>
                          <Icon name={ok ? "check" : "x"} size={14} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-primary-900 mb-2">{i + 1}. {q.text}</div>
                          <div className="text-xs space-y-1">
                            <div className={ok ? "text-emerald-700" : "text-red-600"}>
                              إجابتك: <b>{answers[i] !== null ? q.options[answers[i]!] : "— بدون إجابة"}</b>
                            </div>
                            {!ok && <div className="text-emerald-700">الإجابة الصحيحة: <b>{q.options[q.correct]}</b></div>}
                            {q.explanation && (
                              <div className="mt-2 bg-primary-50/70 border border-primary-100 rounded-xl px-3 py-2 text-primary-800 leading-relaxed flex items-start gap-1.5">
                                <Icon name="spark" size={13} className="text-primary-500 mt-0.5 shrink-0" />
                                <span><b className="text-primary-600">الشرح:</b> {q.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
