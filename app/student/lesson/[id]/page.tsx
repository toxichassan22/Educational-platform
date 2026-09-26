"use client";

import React, { use, useEffect, useEffectEvent, useRef, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon, DCard } from "@/components/ui";
import { lessonById, unitById, subjectById, lessonsOfUnit, unitsOfSubject, questionsOfLesson, attemptsOfUser, canAccessLesson, lessonNotes, reviewSection, followUpQuestions, reviewMistakes } from "@/lib/data";

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <LessonContent key={id} lessonId={decodeURIComponent(id)} />;
}

function LessonContent({ lessonId }: { lessonId: string }) {
  const { db, me, saveLessonProgress, addStudyNote, removeStudyNote, storageError } = useStore();
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
  const [noteDraft, setNoteDraft] = useState("");
  const [reviewTarget, setReviewTarget] = useState<number | null>(null);
  const [qaDraft, setQaDraft] = useState("");
  const [qaList, setQaList] = useState<{ q: string; a: string }[]>([
    {
      q: "أستاذ شلون حسبت سرعة السيارة؟",
      a: `حياك الله! يمكنك استخدام هذه المعادلة (S = D / T: السرعة تساوي المسافة (D) على الزمن (T — راجع قسم المعادلات في المذكرة بالأسفل.`,
    },
  ]);
  const notes = lesson && me ? (db.studyNotes ?? []).filter((n) => n.userId === me.id && n.lessonId === lesson.id) : [];
  const saved = lesson && me ? (db.lessonProgress ?? []).find((p) => p.userId === me.id && p.lessonId === lesson.id) : undefined;
  const resumable = !!(saved && lesson && saved.videoUrl === lesson.videoUrl && duration && saved.position > 10 && saved.position < duration - 10);

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
    if (window.location.hash !== "#review") return;
    const t = setTimeout(() => document.getElementById("review")?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
    return () => clearTimeout(t);
  }, [lesson?.id]);

  const addNote = () => {
    const video = videoRef.current;
    if (!video || !noteDraft.trim() || !lesson) return;
    addStudyNote(lesson.id, lesson.videoUrl, Math.floor(video.currentTime), noteDraft);
    setNoteDraft("");
  };

  if (!lesson) {
    return <AppShell role="student" dark><DCard className="p-10 text-center text-[#99a8bd]">الدرس غير موجود</DCard></AppShell>;
  }

  // ===== حماية المحتوى: غير المشترك يشوف شاشة قفل بدل المحتوى =====
  const locked = me ? !canAccessLesson(db, me.id, lesson) : true;
  if (locked) {
    const freeLesson = subject ? unitsOfSubject(db, subject.id).flatMap((u) => lessonsOfUnit(db, u.id)).find((l) => l.free) : null;
    return (
      <AppShell role="student" dark>
        <div className="max-w-2xl mx-auto space-y-5 animate-fade-up">
          <div className="flex items-center gap-2.5 text-sm">
            <Link href="/student/browse" className="text-[#99a8bd] font-bold hover:text-white">المواد</Link>
            <span className="text-[#99a8bd] font-bold">‹</span>
            <Link href={`/student/subject/${subject?.id}`} className="text-[#99a8bd] font-bold hover:text-white">{subject?.name}</Link>
            <span className="text-[#99a8bd] font-bold">‹</span>
            <span className="text-white font-bold">{lesson.title}</span>
          </div>

          <div className="rounded-[2rem] p-8 md:p-10 text-center relative overflow-hidden bg-[#161c29] border border-[#2b3547]">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#f5b329]/10 blur-3xl" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#f5b329] text-[#0f1217] flex items-center justify-center mb-5 animate-float shadow-2xl shadow-[#f5b329]/25">
                <Icon name="lock" size={36} />
              </div>
              <div className="inline-block bg-white/10 text-[#f5b329] text-[11px] font-black px-3.5 py-1.5 rounded-full mb-4">محتوى حصري للمشتركين</div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{lesson.title}</h1>
              <p className="text-[#99a8bd] text-sm mb-2">{subject?.name} · {unit?.title} · {lesson.durationMin} دقيقة</p>
              <p className="text-white/70 leading-relaxed mb-7 max-w-md mx-auto">
                هذا الدرس — بفيديو الشرح والمذكرة والاختبار الذكي — متاح للمشتركين فقط.
                اشترك الآن وافتح <b className="text-[#f5b329]">كل دروس موادك</b> فورًا.
              </p>

              <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto mb-8">
                {[["video", "فيديوهات الشرح"], ["doc", "مذكرات PDF"], ["target", "اختبارات ذكية"]].map(([ic, t]) => (
                  <div key={t} className="bg-[#1a2130] border border-[#2b3547] rounded-2xl p-3.5">
                    <div className="text-[#f5b329] mx-auto w-fit mb-1.5"><Icon name={ic} size={19} /></div>
                    <div className="text-[10px] font-bold text-[#99a8bd]">{t}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/student/subscription"
                  className="bg-[#f5b329] hover:bg-[#e0a41f] text-[#0f1217] px-9 py-3.5 rounded-2xl font-black transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-[#f5b329]/20">
                  <Icon name="gem" size={18} /> اشترك الآن — من 9.9 د.ك
                </Link>
                {freeLesson && (
                  <Link href={`/student/lesson/${freeLesson.id}`}
                    className="border border-[#2b3547] text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#1a2130] transition-colors">
                    جرّب الدرس المجاني
                  </Link>
                )}
              </div>
              <p className="text-[#99a8bd]/60 text-[11px] mt-5">دفع آمن عبر KNET و Visa · كود خصم تجريبي KUWAIT20</p>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="student" dark>
      <div className="space-y-6 animate-fade-up">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2.5 text-sm">
          <Link href={`/student/subject/${subject?.id}`} className="text-[#99a8bd] font-bold hover:text-white">{subject?.name}</Link>
          <span className="text-[#99a8bd] font-bold">‹</span>
          <span className="text-white font-bold">{lesson.title}</span>
        </div>

        {/* ===== مشغل الفيديو ===== */}
        <div className="rounded-[20px] overflow-hidden bg-[#0a0d12] border border-[#2b3547]">
          <video ref={videoRef} key={lesson.id} controls preload="metadata" className="w-full aspect-video bg-black"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setSeconds(Math.floor(e.currentTarget.currentTime))}
            onPause={saveNow}
            onEnded={saveNow}>
            <source src={lesson.videoUrl} type="video/mp4" />
          </video>
        </div>

        {/* ===== العنوان + بيلز الأفعال — مثل صفحة الدرس في UULA ===== */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] font-black text-[#4a9bf5] mb-1">درس</div>
            <h1 className="text-xl sm:text-2xl font-black">{lesson.title}</h1>
            <div className="text-[#99a8bd] font-bold text-sm mt-1.5 flex items-center gap-2.5 flex-wrap">
              <span>{unit?.title} · أ/ {subject?.teacher}</span>
              <span className="flex items-center gap-1"><Icon name="clock" size={13} /> {lesson.durationMin} دقيقة</span>
              {best !== null && <span className="text-[#33bf6b]">أفضل نتيجة {best}%</span>}
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <a href="#notes"
              className="flex items-center gap-2 bg-[#1a2130] border border-white/[0.05] rounded-full px-5 py-2.5 font-bold text-sm hover:border-[#2072e0]/60 transition-colors">
              <Icon name="doc" size={16} className="text-[#8e99ab]" /> المذكرة
            </a>
            <Link href={`/student/exam/${lesson.id}`}
              className="flex items-center gap-2 bg-[#1a2130] border border-white/[0.05] rounded-full px-5 py-2.5 font-bold text-sm hover:border-[#2072e0]/60 transition-colors">
              <Icon name="chat" size={16} className="text-[#8e99ab]" /> أسئلة
            </Link>
            {practiceQuestions.length > 0 && (
              <Link href={`/student/practice/${lesson.id}`}
                className="flex items-center gap-2 bg-[#8e5cf0] hover:bg-[#7c4de0] rounded-full px-5 py-2.5 font-bold text-sm text-white transition-colors">
                <Icon name="bolt" size={16} /> تدريب متابعة
              </Link>
            )}
          </div>
        </div>

        {/* ===== محتوى الدرس — قائمة أجزاء مثل UULA ===== */}
        <DCard className="rounded-2xl divide-y divide-[#2b3547]/60 overflow-hidden">
          <div className="flex items-center gap-4 px-5 py-4">
            <span className="w-11 h-11 rounded-xl bg-[#1a2e4d] flex items-center justify-center shrink-0">
              <Icon name="play" size={16} filled className="text-[#4a9bf5]" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">درس {lesson.title}</div>
              <div className="text-[11px] text-[#99a8bd] mt-0.5">فيديو شرح</div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#99a8bd] shrink-0" dir="ltr">
              <Icon name="clock" size={13} /> {lesson.durationMin}:00
            </span>
          </div>
          <a href="#notes" className="flex items-center gap-4 px-5 py-4 hover:bg-[#1a2130]/50 transition-colors">
            <span className="w-11 h-11 rounded-xl bg-[#1a3d24] flex items-center justify-center shrink-0">
              <Icon name="doc" size={16} className="text-[#33bf6b]" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">المذكرة الشاملة</div>
              <div className="text-[11px] text-[#99a8bd] mt-0.5">ملخص الدرس قابل للطباعة</div>
            </div>
            <Icon name="back" size={15} className="text-[#99a8bd] shrink-0" />
          </a>
          <Link href={`/student/exam/${lesson.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-[#1a2130]/50 transition-colors">
            <span className="w-11 h-11 rounded-xl bg-[#2d2144] flex items-center justify-center shrink-0">
              <Icon name="target" size={16} className="text-[#a78bfa]" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">اختبار الدرس</div>
              <div className="text-[11px] text-[#99a8bd] mt-0.5">{questions.length} سؤال · {myAttempts.length ? "أعد المحاولة" : "لم يُحَل بعد"}</div>
            </div>
            <Icon name="back" size={15} className="text-[#99a8bd] shrink-0" />
          </Link>
        </DCard>

        {/* استكمال المشاهدة */}
        {resumable && saved && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1a2e4d] border border-[#2072e0]/40 rounded-2xl px-4 py-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Icon name="clock" size={14} className="text-[#4a9bf5]" /> آخر مرة وقفت عند <span dir="ltr">{formatTime(saved.position)}</span>
            </span>
            <div className="flex gap-1.5">
              <button onClick={() => { if (videoRef.current) { videoRef.current.currentTime = saved.position; videoRef.current.play(); } }}
                className="bg-[#2072e0] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#1b63c4] transition-colors">
                أكمل من هناك
              </button>
              <button onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play(); } }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-[#99a8bd] hover:bg-[#1a2130] transition-colors">
                من البداية
              </button>
            </div>
          </div>
        )}
        {storageError && <div className="text-xs text-[#e04d4d] bg-[#e04d4d]/10 border border-[#e04d4d]/30 rounded-xl px-3 py-2 font-bold">{storageError}</div>}

        {/* ===== ملخص الدرس ===== */}
        <DCard className="p-7 rounded-[18px] print-area">
          <div id="notes" />
          {/* هيدر الطباعة — يظهر في الـ PDF فقط */}
          <div className="hidden print:block mb-6 pb-4 border-b-2 border-[#2072e0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-2xl text-[#2072e0]">منصة تفوّق — مذكرة درس</div>
                <div className="text-sm text-slate-500 mt-1">«{lesson.title}» · {subject?.name} · {unit?.title}</div>
              </div>
              <div className="text-xs text-slate-400 font-bold">tafawwug.edu.kw</div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-lg flex items-center gap-2">
              <Icon name="doc" size={19} className="text-[#4a9bf5]" /> ملخص الدرس
            </h2>
            <button onClick={() => window.print()}
              className="no-print flex items-center gap-1.5 text-[#4a9bf5] text-sm font-bold hover:bg-[#2072e0]/10 px-3 py-1.5 rounded-lg transition-colors">
              <Icon name="download" size={15} /> تحميل PDF
            </button>
          </div>

          {/* خطة مراجعة موجهة من أخطاء آخر اختبار */}
          {mistakes.length > 0 && (
            <div id="review" className="mb-6 rounded-2xl border-2 border-[#f5b329]/40 bg-[#f5b329]/5 p-4 no-print">
              <h3 className="font-black text-sm mb-1 flex items-center gap-2 text-white">
                <Icon name="target" size={16} className="text-[#f5b329]" /> خطة مراجعتك — بناءً على أخطاء آخر اختبار
              </h3>
              <p className="text-xs text-[#99a8bd] mb-3">أخطأت في {mistakes.length} {mistakes.length === 1 ? "سؤال" : "أسئلة"} آخر مرة. هذه الأقسام تشرحها، وبعدها يوجد تدريب متابعة بأسئلة مختلفة.</p>
              <div className="space-y-1.5 mb-3">
                {[...new Set(mistakes.map((m) => reviewSection(lesson, m.question)).filter((s): s is number => s !== null))].map((si) => (
                  <button key={si} onClick={() => { setReviewTarget(si); document.getElementById(`note-sec-${si}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                    className="w-full flex items-center gap-2 text-right text-xs font-bold text-white bg-[#1a2130] hover:bg-[#212936] rounded-lg px-3 py-2 transition-colors">
                    <span className="w-5 h-5 rounded-md bg-[#f5b329]/20 text-[#f5b329] flex items-center justify-center shrink-0">{si + 1}</span>
                    {lessonNotes(lesson)[si]?.heading ?? "قسم المراجعة"}
                    <Icon name="down" size={12} className="mr-auto text-[#8e99ab]" />
                  </button>
                ))}
              </div>
              {practiceQuestions.length > 0 && (
                <Link href={`/student/practice/${lesson.id}`}
                  className="inline-flex items-center gap-2 bg-[#f5b329] hover:bg-[#e0a41f] text-[#0f1217] rounded-xl px-5 py-2.5 text-xs font-black transition-colors">
                  <Icon name="bolt" size={14} /> تدريب متابعة — {practiceQuestions.length} أسئلة مختلفة
                </Link>
              )}
            </div>
          )}

          <div className="space-y-5">
            {lessonNotes(lesson).map((sec, i) => (
              <div key={i} id={`note-sec-${i}`} className={`rounded-xl transition-all ${reviewTarget === i ? "bg-[#f5b329]/10 ring-2 ring-[#f5b329]/40 p-3 -m-3" : ""}`}>
                <h3 className="font-bold text-[#4a9bf5] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#2072e0]/15 text-[#4a9bf5] text-xs flex items-center justify-center font-black">{i + 1}</span>
                  {sec.heading}
                </h3>
                <p className="text-sm text-[#99a8bd] leading-relaxed mb-2">{sec.body}</p>
                {sec.points && (
                  <ul className="space-y-1.5 mr-8">
                    {sec.points.map((p, j) => (
                      <li key={j} className="text-sm text-[#c6cfdd] flex items-start gap-2">
                        <Icon name="check" size={14} className="text-[#33bf6b] mt-1 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* ملاحظات بوقت الفيديو */}
          <div className="mt-6 pt-5 border-t border-[#2b3547]/70 no-print">
            <h3 className="font-bold text-sm mb-2.5 flex items-center gap-1.5">
              <Icon name="edit" size={15} className="text-[#4a9bf5]" /> ملاحظاتي <span className="text-[10px] text-[#99a8bd] font-medium">— محفوظة بتوقيت اللقطة</span>
            </h3>
            <div className="flex gap-2">
              <input value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addNote(); }}
                maxLength={500} placeholder="اكتب ملاحظة عند هذه اللحظة…"
                className="flex-1 bg-[#1a2130] border border-[#2b3547] rounded-xl px-3 py-2 text-sm text-white placeholder:text-[#99a8bd]/50 outline-none focus:border-[#2072e0]" />
              <button onClick={addNote} disabled={!noteDraft.trim()}
                className="bg-[#2072e0] hover:bg-[#1b63c4] disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
                <Icon name="plus" size={13} /> {formatTime(seconds)}
              </button>
            </div>
            {notes.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {notes.map((n) => (
                  <div key={n.id} className="flex items-center gap-2 bg-[#1a2130] rounded-xl px-3 py-2 text-sm group">
                    <button onClick={() => { if (videoRef.current) { videoRef.current.currentTime = n.seconds; videoRef.current.play(); } }}
                      className="shrink-0 text-[10px] font-black bg-[#2072e0]/20 text-[#4a9bf5] px-2 py-1 rounded-md hover:bg-[#2072e0]/30 transition-colors" dir="ltr">
                      {formatTime(n.seconds)}
                    </button>
                    <span className="flex-1 text-[#c6cfdd] text-xs">{n.text}</span>
                    <button onClick={() => removeStudyNote(n.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[#8e99ab] hover:text-[#e04d4d] transition-all">
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DCard>

        {/* ===== اسأل معلمك — Q&A مثل UULA ===== */}
        <DCard className="rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2b3547]/60">
            <span className="w-9 h-9 rounded-full bg-[#2072e0]/15 text-[#4a9bf5] flex items-center justify-center">
              <Icon name="chat" size={16} />
            </span>
            <div>
              <div className="font-bold text-sm">اسأل معلمك</div>
              <div className="text-[10px] text-[#33bf6b] font-bold">يرد خلال دقائق عادة</div>
            </div>
          </div>
          <div className="divide-y divide-[#2b3547]/40">
            {qaList.map((qa, i) => (
              <div key={i} className="px-5 py-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#2b3547] flex items-center justify-center text-xs font-black shrink-0">{me?.name?.[0] ?? "ط"}</span>
                  <div className="flex-1 bg-[#1a2130] rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-[#c6cfdd] leading-relaxed">{qa.q}</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#2072e0] flex items-center justify-center text-[11px] font-black text-white shrink-0">ت</span>
                  <div className="flex-1">
                    <div className="bg-[#16233c] border border-[#2072e0]/25 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-[#c6cfdd] leading-relaxed">{qa.a}</div>
                    <div className="flex gap-3 mt-2 pr-2">
                      <button className="text-[#99a8bd] hover:text-[#33bf6b] transition-colors"><Icon name="check" size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-[#2b3547]/60 flex gap-2">
            <input value={qaDraft} onChange={(e) => setQaDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && qaDraft.trim()) { setQaList((l) => [...l, { q: qaDraft, a: "استلمنا سؤالك — هيرد عليك المعلم قريبًا." }]); setQaDraft(""); } }}
              placeholder="اكتب سؤالك عن الدرس…"
              className="flex-1 bg-[#1a2130] border border-[#2b3547] rounded-full px-4 py-2.5 text-sm text-white placeholder:text-[#99a8bd]/50 outline-none focus:border-[#2072e0]" />
            <button
              onClick={() => { if (qaDraft.trim()) { setQaList((l) => [...l, { q: qaDraft, a: "استلمنا سؤالك — هيرد عليك المعلم قريبًا." }]); setQaDraft(""); } }}
              disabled={!qaDraft.trim()}
              className="bg-[#2072e0] hover:bg-[#1b63c4] disabled:opacity-40 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors">
              إرسال
            </button>
          </div>
        </DCard>

        {/* ===== الدروس التالية ===== */}
        {nextLessons.length > 0 && (
          <>
            <h2 className="text-xl font-black pt-2">الدروس التالية</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {nextLessons.map((l) => (
                <Link key={l.id} href={`/student/lesson/${l.id}`}
                  className="bg-[#161c29] border border-[#2b3547] rounded-2xl overflow-hidden hover:border-[#2072e0]/60 transition-all group">
                  <div className="h-[74px] bg-[#1a2433] flex items-center justify-center">
                    <span className="w-9 h-9 rounded-full bg-[#1a3d66] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="play" size={14} filled className="text-white" />
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-sm truncate">{l.title}</div>
                    <div className="text-xs text-[#99a8bd] mt-1">{l.durationMin} دقيقة</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
