"use client";

import React, { use } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Badge, Btn } from "@/components/ui";
import { lessonById, unitById, subjectById, lessonsOfUnit, unitsOfSubject, questionsOfLesson, attemptsOfUser, canAccessLesson } from "@/lib/data";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { db, me } = useStore();
  const lessonId = decodeURIComponent(id);
  const lesson = lessonById(db, lessonId);
  const unit = lesson && unitById(db, lesson.unitId);
  const subject = unit && subjectById(db, unit.subjectId);
  const siblings = unit ? lessonsOfUnit(db, unit.id) : [];
  const idx = siblings.findIndex((l) => l.id === lessonId);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];
  const questions = lesson ? questionsOfLesson(db, lesson.id) : [];
  const myAttempts = lesson && me ? attemptsOfUser(db, me.id).filter((a) => a.lessonId === lesson.id) : [];
  const best = myAttempts.length ? Math.max(...myAttempts.map((a) => Math.round((a.score / a.total) * 100))) : null;

  if (!lesson) {
    return <AppShell role="student"><Card className="p-10 text-center text-slate-400">الدرس غير موجود</Card></AppShell>;
  }

  // ===== حماية المحتوى: غير المشترك يشوف شاشة قفل بدل المحتوى =====
  const locked = me ? !canAccessLesson(db, me.id, lesson) : true;
  if (locked) {
    const freeLesson = subject ? unitsOfSubject(db, subject.id).flatMap((u) => lessonsOfUnit(db, u.id)).find((l) => l.free) : null;
    return (
      <AppShell role="student">
        <div className="max-w-2xl mx-auto space-y-5 animate-fade-up">
          {/* مسار التنقل */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/student/browse" className="hover:text-primary-600">المواد</Link>
            <Icon name="back" size={13} />
            <Link href={`/student/subject/${subject?.id}`} className="hover:text-primary-600">{subject?.name}</Link>
            <Icon name="back" size={13} />
            <span className="text-primary-800 font-bold">{lesson.title}</span>
          </div>

          <div className="rounded-[2rem] p-8 md:p-10 text-center relative overflow-hidden bg-night-900">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold-500/15 blur-3xl" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gold-500 text-night-950 flex items-center justify-center mb-5 animate-float shadow-2xl shadow-gold-500/30">
                <Icon name="lock" size={36} />
              </div>
              <div className="inline-block bg-white/10 text-gold-300 text-[11px] font-black px-3.5 py-1.5 rounded-full mb-4">محتوى حصري للمشتركين</div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{lesson.title}</h1>
              <p className="text-white/55 text-sm mb-2">{subject?.name} · {unit?.title} · {lesson.durationMin} دقيقة</p>
              <p className="text-white/70 leading-relaxed mb-7 max-w-md mx-auto">
                هذا الدرس — بفيديو الشرح والمذكرة والاختبار الذكي — متاح للمشتركين فقط.
                اشترك الآن وافتح <b className="text-gold-300">كل دروس موادك</b> فورًا.
              </p>

              <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto mb-8">
                {[["video", "فيديوهات الشرح"], ["doc", "مذكرات PDF"], ["target", "اختبارات ذكية"]].map(([ic, t]) => (
                  <div key={t} className="bg-white/[.07] border border-white/10 rounded-2xl p-3.5">
                    <div className="text-gold-400 mx-auto w-fit mb-1.5"><Icon name={ic} size={19} /></div>
                    <div className="text-[10px] font-bold text-white/70">{t}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/student/subscription"
                  className="bg-gold-500 hover:bg-gold-600 text-night-950 px-9 py-3.5 rounded-2xl font-black transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-gold-500/25">
                  <Icon name="gem" size={18} /> اشترك الآن — من 9.9 د.ك
                </Link>
                {freeLesson && (
                  <Link href={`/student/lesson/${freeLesson.id}`}
                    className="border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors">
                    جرّب الدرس المجاني
                  </Link>
                )}
              </div>
              <p className="text-white/35 text-[11px] mt-5">دفع آمن عبر KNET و Visa · كود خصم تجريبي KUWAIT20</p>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="student">
      <div className="space-y-5 animate-fade-up">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/student/browse" className="hover:text-primary-600">المواد</Link>
          <Icon name="back" size={13} />
          <Link href={`/student/subject/${subject?.id}`} className="hover:text-primary-600">{subject?.name}</Link>
          <Icon name="back" size={13} />
          <span className="text-primary-800 font-bold">{lesson.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* الفيديو + المذكرة */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="overflow-hidden border border-slate-100">
              <video key={lesson.id} controls preload="metadata" className="w-full aspect-video bg-black">
                <source src={lesson.videoUrl} type="video/mp4" />
              </video>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-extrabold text-primary-900">{lesson.title}</h1>
                    <div className="text-sm text-slate-400 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Icon name="clock" size={13} /> {lesson.durationMin} دقيقة</span>
                      <span>{unit?.title} · {subject?.name}</span>
                    </div>
                  </div>
                  {best !== null && <Badge tone={best >= 80 ? "green" : best >= 50 ? "amber" : "red"}>أفضل نتيجة: {best}%</Badge>}
                </div>
              </div>
            </Card>

            {/* المذكرة */}
            <Card className="p-6 border border-slate-100 print-area">
              {/* هيدر الطباعة — يظهر في الـ PDF فقط */}
              <div className="hidden print:block mb-6 pb-4 border-b-2 border-primary-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-black text-2xl text-primary-800">منصة تفوّق — مذكرة درس</div>
                    <div className="text-sm text-slate-500 mt-1">«{lesson.title}» · {subject?.name} · {unit?.title}</div>
                  </div>
                  <div className="text-xs text-slate-400 font-bold">tafawwug.edu.kw</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-extrabold text-primary-900 flex items-center gap-2">
                  <Icon name="doc" size={19} className="text-primary-500" /> مذكرة الدرس
                </h2>
                <button onClick={() => window.print()}
                  className="no-print flex items-center gap-1.5 text-primary-600 text-sm font-bold hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Icon name="download" size={15} /> تحميل PDF
                </button>
              </div>
              <div className="space-y-5">
                {lesson.note.map((sec, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-primary-700 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs flex items-center justify-center font-extrabold">{i + 1}</span>
                      {sec.heading}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">{sec.body}</p>
                    {sec.points && (
                      <ul className="space-y-1.5 mr-8">
                        {sec.points.map((p, j) => (
                          <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                            <Icon name="check" size={14} className="text-emerald-500 mt-1 shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-4">
            {/* الاختبار */}
            <div className="rounded-3xl p-5 bg-night-900">
              <div>
              <div className="w-12 h-12 rounded-xl bg-gold-500 text-night-950 flex items-center justify-center mb-3">
                <Icon name="target" size={23} />
              </div>
              <h3 className="font-black text-white mb-1">اختبر نفسك واكسب XP</h3>
              <p className="text-xs text-white/55 leading-relaxed mb-4">
                {questions.length} أسئلة · تصحيح تلقائي فوري · الوقت المقترح {Math.max(3, questions.length)} دقائق
              </p>
              {myAttempts.length > 0 && (
                <div className="text-xs text-white/60 mb-3 bg-white/10 rounded-xl p-2.5">
                  آخر نتيجة: <b className="text-gold-300">{Math.round(myAttempts[myAttempts.length - 1].score / myAttempts[myAttempts.length - 1].total * 100)}%</b> — المحاولات: {myAttempts.length}
                </div>
              )}
              <Link href={`/student/exam/${lesson.id}`}>
                <Btn variant="gold" className="w-full">{myAttempts.length ? "أعد الاختبار" : "ابدأ الاختبار"}</Btn>
              </Link>
              </div>
            </div>

            {/* دروس الوحدة */}
            <Card className="p-4 border border-slate-100">
              <h3 className="font-extrabold text-primary-900 text-sm mb-3">دروس الوحدة</h3>
              <div className="space-y-1">
                {siblings.map((l) => (
                  <Link key={l.id} href={`/student/lesson/${l.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${l.id === lessonId ? "bg-primary-50 text-primary-700 font-bold" : "text-slate-600 hover:bg-slate-50"}`}>
                    <Icon name={l.id === lessonId ? "play" : "video"} size={15} className={l.id === lessonId ? "text-primary-600" : "text-slate-300"} />
                    <span className="flex-1 truncate">{l.title}</span>
                    <span className="text-[10px] text-slate-400">{l.durationMin}د</span>
                  </Link>
                ))}
              </div>
            </Card>

            {/* تنقل */}
            <div className="flex gap-2">
              {prev && <Link href={`/student/lesson/${prev.id}`} className="flex-1"><Btn variant="outline" className="w-full text-xs">← السابق</Btn></Link>}
              {next && <Link href={`/student/lesson/${next.id}`} className="flex-1"><Btn variant="outline" className="w-full text-xs">التالي ←</Btn></Link>}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
