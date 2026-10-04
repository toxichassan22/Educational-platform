"use client";

import React, { use, useEffect, useEffectEvent, useRef, useState } from "react";
import Link from "next/link";
import QShell, { QBackLink, QCard, QBtn, QPill } from "@/components/q/QShell";
import { LessonCard, lessonViews } from "@/components/q/LessonCard";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { lessonById, unitById, subjectById, lessonsOfUnit, unitsOfSubject, questionsOfLesson, attemptsOfUser, canAccessLesson, lessonNotes, reviewSection, followUpQuestions, reviewMistakes } from "@/lib/data";
import { QC } from "@/lib/theme-q";

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

type Tab = "desc" | "comments" | "tasks";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <LessonContent key={id} lessonId={decodeURIComponent(id)} />;
}

function LessonContent({ lessonId }: { lessonId: string }) {
  const { db, me, saveLessonProgress, addStudyNote, removeStudyNote, toggleSavedLesson, storageError } = useStore();
  const lesson = lessonById(db, lessonId);
  const unit = lesson && unitById(db, lesson.unitId);
  const subject = unit && subjectById(db, unit.subjectId);
  const siblings = unit ? lessonsOfUnit(db, unit.id) : [];
  const idx = siblings.findIndex((l) => l.id === lessonId);
  const nextLessons = siblings.slice(idx + 1, idx + 4);
  const questions = lesson ? questionsOfLesson(db, lesson.id) : [];
  const myAttempts = lesson && me ? attemptsOfUser(db, me.id).filter((a) => a.lessonId === lesson.id) : [];
  const best = myAttempts.length ? Math.max(...myAttempts.map((a) => Math.round((a.score / a.total) * 100))) : null;
  const latestAttempt = myAttempts.at(-1);
  const mistakes = reviewMistakes(latestAttempt);
  const practiceQuestions = lesson ? followUpQuestions(lesson, questions) : [];

  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [tab, setTab] = useState<Tab>("desc");
  const [noteDraft, setNoteDraft] = useState("");
  const [reviewTarget, setReviewTarget] = useState<number | null>(null);
  const [qaDraft, setQaDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [qaList, setQaList] = useState<{ q: string; a: string }[]>([
    {
      q: "أستاذ شلون حسبت سرعة السيارة؟",
      a: `حياك الله! يمكنك استخدام هذه المعادلة (S = D / T): السرعة تساوي المسافة (D) على الزمن (T) — راجع قسم المعادلات في المذكرة بالأسفل.`,
    },
  ]);
  const notes = lesson && me ? (db.studyNotes ?? []).filter((n) => n.userId === me.id && n.lessonId === lesson.id) : [];
  const saved = lesson && me ? (db.lessonProgress ?? []).find((p) => p.userId === me.id && p.lessonId === lesson.id) : undefined;
  const resumable = !!(saved && lesson && saved.videoUrl === lesson.videoUrl && duration && saved.position > 10 && saved.position < duration - 10);
  const isSaved = !!(me && (db.savedLessons ?? []).some((s) => s.userId === me.id && s.lessonId === lessonId));

  const saveNow = () => {
    const video = videoRef.current;
    if (!video || !lesson || !Number.isFinite(video.duration) || video.duration <= 0 || video.currentTime < 5) return;
    saveLessonProgress(lesson.id, lesson.videoUrl, Math.floor(video.currentTime));
  };
  const persist = useEffectEvent(() => {
    if (!lesson || !me || me.role !== "student") return;
    saveNow();
  });

  useEffect(() => {
    const interval = setInterval(() => persist(), 5000);
    window.addEventListener("pagehide", persist);
    window.addEventListener("visibilitychange", persist);
    return () => {
      clearInterval(interval);
      window.removeEventListener("pagehide", persist);
      window.removeEventListener("visibilitychange", persist);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#notes") return;
    setTab("desc");
    const t = setTimeout(() => document.getElementById("notes")?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    return () => clearTimeout(t);
  }, [lesson?.id]);

  const addNote = () => {
    const video = videoRef.current;
    if (!video || !noteDraft.trim() || !lesson) return;
    addStudyNote(lesson.id, lesson.videoUrl, Math.floor(video.currentTime), noteDraft);
    setNoteDraft("");
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* تجاهل */ }
  };

  if (!lesson) {
    return (
      <QShell role="student">
        <div className="text-center py-20 font-bold" style={{ color: QC.muted }}>الدرس غير موجود</div>
      </QShell>
    );
  }

  // ===== حماية المحتوى =====
  const locked = me ? !canAccessLesson(db, me.id, lesson) : true;
  if (locked) {
    const freeLesson = subject ? unitsOfSubject(db, subject.id).flatMap((u) => lessonsOfUnit(db, u.id)).find((l) => l.free) : null;
    return (
      <QShell role="student">
        <div className="max-w-xl mx-auto">
          <QBackLink href={subject ? `/student/subject/${encodeURIComponent(subject.id)}/lectures` : "/student"}>
            العودة إلى الدروس
          </QBackLink>
          <QCard className="mt-4 !p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl grid place-items-center mb-4" style={{ background: QC.warningSoft, color: QC.warning }}>
              <Icon name="lock" size={28} />
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-black mb-3" style={{ background: QC.warningSoft, color: "#c2410c" }}>
              محتوى حصري للمشتركين
            </div>
            <h1 className="text-[20px] font-extrabold mb-1.5" style={{ color: QC.ink }}>{lesson.title}</h1>
            <p className="text-[13px] mb-5" style={{ color: QC.muted }}>{subject?.name} · {unit?.title} · {lesson.durationMin} دقيقة</p>
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {[["video", "فيديوهات الشرح"], ["doc", "مذكرات PDF"], ["target", "اختبارات ذكية"]].map(([ic, t]) => (
                <div key={t} className="rounded-xl border p-3" style={{ borderColor: QC.line, background: QC.bgSoft }}>
                  <div className="mx-auto w-fit mb-1.5" style={{ color: QC.brand }}><Icon name={ic} size={18} /></div>
                  <div className="text-[10px] font-bold" style={{ color: QC.muted }}>{t}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <QBtn href="/student/subscription">اشترك الآن — من 9.9 د.ك</QBtn>
              {freeLesson && <QBtn variant="outline" href={`/student/lesson/${encodeURIComponent(freeLesson.id)}`}>جرّب الدرس المجاني</QBtn>}
            </div>
            <p className="text-[11px] mt-4" style={{ color: QC.faint }}>دفع آمن عبر KNET و Visa · كود خصم تجريبي KUWAIT20</p>
          </QCard>
        </div>
      </QShell>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "desc", label: "الوصف", icon: "doc" },
    { key: "comments", label: `التعليقات (${qaList.length})`, icon: "chat" },
    { key: "tasks", label: "الواجبات", icon: "clipboard" },
  ];

  return (
    <QShell role="student">
      {/* العودة */}
      <QBackLink href={subject ? `/student/subject/${encodeURIComponent(subject.id)}/lectures` : "/student"}>
        العودة إلى دروس {subject?.name ?? ""}
      </QBackLink>

      {/* المشغل */}
      <div className="max-w-3xl mx-auto mt-4">
        <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
          <video ref={videoRef} key={lesson.id} controls preload="metadata" className="w-full aspect-video bg-black"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setSeconds(Math.floor(e.currentTarget.currentTime))}
            onPause={saveNow}
            onEnded={saveNow}>
            <source src={lesson.videoUrl} type="video/mp4" />
          </video>
        </div>

        {/* مشاهدات + أكشنز */}
        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1.5 text-[12px] font-bold" style={{ color: QC.muted }}>
            <Icon name="eye" size={15} /> <span dir="ltr">{lessonViews(lesson.id)}</span> مشاهدات
            {best !== null && <span className="text-emerald-600">· أفضل نتيجة {best}%</span>}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={share}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-[12px] font-bold transition-colors hover:bg-slate-50"
              style={{ borderColor: QC.line, color: QC.body }}>
              <Icon name="share" size={14} /> {copied ? "تم النسخ!" : "مشاركة"}
            </button>
            <button onClick={() => toggleSavedLesson(lesson.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-[12px] font-bold transition-colors hover:bg-slate-50"
              style={{ borderColor: isSaved ? QC.brand : QC.line, color: isSaved ? QC.brand : QC.body, background: isSaved ? QC.brandSoft : "#fff" }}>
              <Icon name="bookmark" size={14} filled={isSaved} /> {isSaved ? "محفوظ" : "حفظ"}
            </button>
          </div>
        </div>

        {/* استئناف المشاهدة */}
        {resumable && saved && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-2.5" style={{ borderColor: QC.brandBorder, background: QC.brandSoft }}>
            <span className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: QC.brandText }}>
              <Icon name="clock" size={14} /> آخر مرة وقفت عند <span dir="ltr">{formatTime(saved.position)}</span>
            </span>
            <div className="flex gap-1.5">
              <button onClick={() => { if (videoRef.current) { videoRef.current.currentTime = saved.position; videoRef.current.play(); } }}
                className="text-white text-[11px] font-bold px-3 py-1.5 rounded-lg" style={{ background: QC.brand }}>
                أكمل من هناك
              </button>
              <button onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play(); } }}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-white/70" style={{ color: QC.muted }}>
                من البداية
              </button>
            </div>
          </div>
        )}
        {storageError && <div className="mt-3 text-[12px] rounded-xl border px-3 py-2 font-bold" style={{ color: QC.danger, borderColor: "#fecaca", background: QC.dangerSoft }}>{storageError}</div>}

        {/* ===== التبويبات ===== */}
        <div className="flex gap-6 mt-5 border-b" style={{ borderColor: QC.line }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="pb-3 text-[13.5px] font-extrabold flex items-center gap-1.5 border-b-2 -mb-px transition-colors"
              style={{ color: tab === t.key ? QC.brand : QC.muted, borderColor: tab === t.key ? QC.brand : "transparent" }}>
              <Icon name={t.icon} size={15} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6 pb-2">
        {/* ===== الوصف ===== */}
        {tab === "desc" && (
          <div className="space-y-5">
            <QCard>
              <h2 className="font-extrabold text-[15px] mb-1" style={{ color: QC.ink }}>{lesson.title}</h2>
              <div className="text-[12px] font-semibold mb-4" style={{ color: QC.muted }}>
                {subject?.name} · {unit?.title} · {subject?.teacher} · {lesson.durationMin} دقيقة
              </div>
              {lesson.note[0] && <p className="text-[13px] leading-relaxed" style={{ color: QC.body }}>{lesson.note[0].body}</p>}

              <div id="notes" className="mt-5 pt-5 border-t" style={{ borderColor: QC.line }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-[14px] flex items-center gap-2" style={{ color: QC.ink }}>
                    <Icon name="doc" size={16} style={{ color: QC.brand }} /> ملخص الدرس
                  </h3>
                  <button onClick={() => window.print()} className="flex items-center gap-1.5 text-[12px] font-bold hover:underline" style={{ color: QC.brand }}>
                    <Icon name="download" size={14} /> تحميل PDF
                  </button>
                </div>
                <div className="space-y-4">
                  {lessonNotes(lesson).map((sec, i) => (
                    <div key={i} id={`note-sec-${i}`} className={`rounded-xl transition-all ${reviewTarget === i ? "ring-2 p-3 -m-3" : ""}`} style={reviewTarget === i ? { ["--tw-ring-color" as never]: QC.warning } : {}}>
                      <h4 className="font-bold text-[13px] mb-1.5 flex items-center gap-2" style={{ color: QC.brandText }}>
                        <span className="w-5 h-5 rounded-md text-[10px] grid place-items-center font-black" style={{ background: QC.brandSoft, color: QC.brand }}>{i + 1}</span>
                        {sec.heading}
                      </h4>
                      <p className="text-[12.5px] leading-relaxed" style={{ color: QC.muted }}>{sec.body}</p>
                      {sec.points && (
                        <ul className="space-y-1.5 mt-2 mr-7">
                          {sec.points.map((p, j) => (
                            <li key={j} className="text-[12.5px] flex items-start gap-2" style={{ color: QC.ink }}>
                              <Icon name="check" size={13} className="mt-0.5 shrink-0" style={{ color: QC.success }} /> {p}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </QCard>

            {/* خطة المراجعة */}
            {mistakes.length > 0 && (
              <QCard className="!border-[#fcd9a8]" pad>
                <h3 className="font-extrabold text-[14px] mb-1 flex items-center gap-2" style={{ color: QC.ink }}>
                  <Icon name="target" size={16} style={{ color: QC.warning }} /> خطة مراجعتك — بناءً على أخطاء آخر اختبار
                </h3>
                <p className="text-[12px] mb-3" style={{ color: QC.muted }}>
                  أخطأت في {mistakes.length} أسئلة آخر مرة. هذه الأقسام تشرحها:
                </p>
                <div className="space-y-1.5 mb-4">
                  {[...new Set(mistakes.map((m) => reviewSection(lesson, m.question)).filter((s): s is number => s !== null))].map((si) => (
                    <button key={si}
                      onClick={() => { setTab("desc"); setReviewTarget(si); setTimeout(() => document.getElementById(`note-sec-${si}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 60); }}
                      className="w-full flex items-center gap-2 text-right text-[12.5px] font-bold rounded-lg border px-3 py-2 transition-colors hover:bg-slate-50"
                      style={{ borderColor: QC.line, color: QC.ink }}>
                      <span className="w-5 h-5 rounded-md grid place-items-center shrink-0 text-[10px] font-black" style={{ background: QC.warningSoft, color: QC.warning }}>{si + 1}</span>
                      {lessonNotes(lesson)[si]?.heading ?? "قسم المراجعة"}
                    </button>
                  ))}
                </div>
                {practiceQuestions.length > 0 && (
                  <QBtn href={`/student/practice/${encodeURIComponent(lesson.id)}`} size="sm">
                    <Icon name="bolt" size={14} /> تدريب متابعة — {practiceQuestions.length} أسئلة مختلفة
                  </QBtn>
                )}
              </QCard>
            )}

            {/* ملاحظاتي */}
            <QCard>
              <h3 className="font-extrabold text-[14px] mb-2.5 flex items-center gap-1.5" style={{ color: QC.ink }}>
                <Icon name="edit" size={15} style={{ color: QC.brand }} /> ملاحظاتي
                <span className="text-[10px] font-semibold" style={{ color: QC.faint }}>— محفوظة بتوقيت اللقطة</span>
              </h3>
              <div className="flex gap-2">
                <input value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addNote(); }}
                  maxLength={500} placeholder="اكتب ملاحظة عند هذه اللحظة…"
                  className="flex-1 border rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-[#006fff] bg-white"
                  style={{ borderColor: QC.line }} />
                <QBtn onClick={addNote} disabled={!noteDraft.trim()} size="sm">
                  <Icon name="plus" size={13} /> {formatTime(seconds)}
                </QBtn>
              </div>
              {notes.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {notes.map((n) => (
                    <div key={n.id} className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] group" style={{ background: QC.bgSoft }}>
                      <button onClick={() => { if (videoRef.current) { videoRef.current.currentTime = n.seconds; videoRef.current.play(); } }}
                        className="shrink-0 text-[10px] font-black px-2 py-1 rounded-md" style={{ background: QC.brandSoft, color: QC.brand }} dir="ltr">
                        {formatTime(n.seconds)}
                      </button>
                      <span className="flex-1 text-[12.5px]" style={{ color: QC.ink }}>{n.text}</span>
                      <button onClick={() => removeStudyNote(n.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all" style={{ color: QC.faint }}>
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </QCard>
          </div>
        )}

        {/* ===== التعليقات ===== */}
        {tab === "comments" && (
          <QCard pad={false} className="overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: QC.line }}>
              <span className="w-9 h-9 rounded-full grid place-items-center" style={{ background: QC.brandSoft, color: QC.brand }}>
                <Icon name="chat" size={16} />
              </span>
              <div>
                <div className="font-extrabold text-[14px]" style={{ color: QC.ink }}>اسأل معلمك</div>
                <div className="text-[10px] font-bold" style={{ color: QC.success }}>يرد خلال دقائق عادة</div>
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: QC.line }}>
              {qaList.map((qa, i) => (
                <div key={i} className="px-5 py-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-black shrink-0 text-white" style={{ background: QC.faint }}>
                      {me?.name?.[0] ?? "ط"}
                    </span>
                    <div className="flex-1 rounded-2xl px-4 py-3 text-[13px] leading-relaxed" style={{ background: QC.surfaceSoft, color: QC.ink, borderTopRightRadius: 4 }}>{qa.q}</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-black text-white shrink-0" style={{ background: QC.brand }}>Q</span>
                    <div className="flex-1 rounded-2xl border px-4 py-3 text-[13px] leading-relaxed" style={{ background: QC.brandSoft, borderColor: QC.brandBorder, color: QC.ink, borderTopRightRadius: 4 }}>{qa.a}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t flex gap-2" style={{ borderColor: QC.line }}>
              <input value={qaDraft} onChange={(e) => setQaDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && qaDraft.trim()) { setQaList((l) => [...l, { q: qaDraft, a: "استلمنا سؤالك — هيرد عليك المعلم قريبًا." }]); setQaDraft(""); } }}
                placeholder="اكتب سؤالك عن الدرس…"
                className="flex-1 border rounded-full px-4 py-2.5 text-[13px] outline-none focus:border-[#006fff]"
                style={{ borderColor: QC.line }} />
              <QBtn onClick={() => { if (qaDraft.trim()) { setQaList((l) => [...l, { q: qaDraft, a: "استلمنا سؤالك — هيرد عليك المعلم قريبًا." }]); setQaDraft(""); } }}
                disabled={!qaDraft.trim()} size="sm" className="!rounded-full !px-5">إرسال</QBtn>
            </div>
          </QCard>
        )}

        {/* ===== الواجبات ===== */}
        {tab === "tasks" && (
          <div className="space-y-3">
            <Link href={`/student/exam/${encodeURIComponent(lesson.id)}`}
              className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: QC.line }}>
              <span className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: "#f3e8ff", color: "#8b5cf6" }}>
                <Icon name="clipboard" size={18} />
              </span>
              <span className="flex-1">
                <span className="block font-extrabold text-[14px]" style={{ color: QC.ink }}>اختبار الدرس</span>
                <span className="block text-[11.5px] mt-0.5" style={{ color: QC.muted }}>
                  {questions.length} سؤال · {myAttempts.length ? `أفضل نتيجة ${best}% — أعد المحاولة` : "لم يُحَل بعد"}
                </span>
              </span>
              <QPill tone={best !== null && best >= 70 ? "ok" : "warn"}>{best !== null ? `${best}%` : "جديد"}</QPill>
            </Link>

            {practiceQuestions.length > 0 && (
              <Link href={`/student/practice/${encodeURIComponent(lesson.id)}`}
                className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: QC.line }}>
                <span className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: QC.brandSoft, color: QC.brand }}>
                  <Icon name="bolt" size={18} />
                </span>
                <span className="flex-1">
                  <span className="block font-extrabold text-[14px]" style={{ color: QC.ink }}>تدريب متابعة</span>
                  <span className="block text-[11.5px] mt-0.5" style={{ color: QC.muted }}>{practiceQuestions.length} أسئلة مختلفة عن الاختبار</span>
                </span>
              </Link>
            )}

            <a href="#notes" onClick={() => setTab("desc")}
              className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: QC.line }}>
              <span className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: QC.successSoft, color: QC.success }}>
                <Icon name="doc" size={18} />
              </span>
              <span className="flex-1">
                <span className="block font-extrabold text-[14px]" style={{ color: QC.ink }}>المذكرة الشاملة</span>
                <span className="block text-[11.5px] mt-0.5" style={{ color: QC.muted }}>ملخص الدرس قابل للطباعة</span>
              </span>
            </a>
          </div>
        )}
      </div>

      {/* ===== دروس تالية ===== */}
      {nextLessons.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[17px] font-extrabold mb-3" style={{ color: QC.ink }}>الدروس التالية</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {nextLessons.map((l) => (
              <LessonCard key={l.id} lesson={l} unit={unit} subject={subject}
                locked={me ? !canAccessLesson(db, me.id, l) : true}
                href={`/student/lesson/${encodeURIComponent(l.id)}`} />
            ))}
          </div>
        </div>
      )}
    </QShell>
  );
}
