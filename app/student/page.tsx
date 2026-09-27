"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { gradeOf, subjectsOfGrade, unitsOfSubject, lessonsOfUnit, attemptsOfUser, activeSub, packageById, lessonById, subjectOfLesson, Lesson } from "@/lib/data";

export default function StudentHome() {
  const { me, db } = useStore();
  if (!me) return <AppShell role="student" dark>{null}</AppShell>;

  const grade = gradeOf(db, me.gradeId);
  const subjects = subjectsOfGrade(db, me.gradeId);
  const myAttempts = attemptsOfUser(db, me.id);
  const sub = activeSub(db, me.id);
  const pkg = sub ? packageById(db, sub.packageId) : null;

  const attemptedIds = new Set(myAttempts.map((a) => a.lessonId));
  let continueLesson: Lesson | null = null;
  const lastAttempt = [...myAttempts].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (lastAttempt) {
    const lastLesson = lessonById(db, lastAttempt.lessonId);
    if (lastLesson) {
      const siblings = lessonsOfUnit(db, lastLesson.unitId);
      const next = siblings[siblings.findIndex((l) => l.id === lastLesson.id) + 1];
      continueLesson = next && !attemptedIds.has(next.id) ? next : null;
    }
  }
  if (!continueLesson) {
    outer: for (const s of subjects) {
      for (const u of unitsOfSubject(db, s.id)) {
        for (const l of lessonsOfUnit(db, u.id)) {
          if (!attemptedIds.has(l.id)) { continueLesson = l; break outer; }
        }
      }
    }
  }
  const contSubject = continueLesson ? subjectOfLesson(db, continueLesson.id) : null;

  return (
    <AppShell role="student" dark>
      <div className="space-y-7 animate-fade-up">

        {/* ===== صف المواد — دوائر ملوّنة مثل UULA Hub ===== */}
        <div className="flex justify-center gap-5 sm:gap-7 overflow-x-auto pb-1 -mx-1 px-1">
          {subjects.map((s) => (
            <Link key={s.id} href={`/student/subject/${encodeURIComponent(s.id)}`}
              className="flex flex-col items-center gap-2.5 shrink-0 group">
              <span
                className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center shadow-lg shadow-black/30 group-hover:scale-105 group-hover:-translate-y-0.5 transition-all"
                style={{ background: s.color }}
              >
                <Icon name={s.icon} size={28} className="text-white" />
              </span>
              <span className="text-[11px] font-bold text-[#9297a6] group-hover:text-white transition-colors whitespace-nowrap">
                {s.name}
              </span>
            </Link>
          ))}
        </div>

        {/* ===== الجدولة — بطاقة لكل موعد ===== */}
        <div className="space-y-3 max-w-5xl">
          {contSubject && (
            <div className="flex items-center justify-between gap-4 bg-[#161c29] rounded-2xl px-5 py-4 border border-white/[0.04]">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "#2072e022", color: "#4a9bf5" }}>
                  <Icon name="video" size={20} />
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-[15px] text-white">بث مراجعة الاختبار</div>
                  <div className="text-[11px] font-bold text-[#33bf6b] mt-0.5">{contSubject.teacher}</div>
                </div>
              </div>
              <span className="text-[12px] font-bold text-[#9297a6] shrink-0 tabular-nums" dir="ltr">1:00 pm</span>
            </div>
          )}

          {continueLesson && contSubject ? (
            <Link href={`/student/lesson/${encodeURIComponent(continueLesson.id)}`}
              className="flex items-center justify-between gap-4 bg-[#161c29] rounded-2xl px-5 py-4 border border-white/[0.04] hover:border-[#2072e0]/40 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "#33bf6b22", color: "#33bf6b" }}>
                  <Icon name="play" size={18} filled />
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-[15px] text-white truncate">درس {continueLesson.title}</div>
                  <div className="text-[11px] font-bold text-[#4a9bf5] mt-0.5">خطة الدراسة — أكمل من حيث توقفت</div>
                </div>
              </div>
              <span className="text-[12px] font-bold text-[#9297a6] shrink-0 tabular-nums" dir="ltr">{continueLesson.durationMin}:00</span>
            </Link>
          ) : (
            <Link href="/student/browse"
              className="flex items-center gap-4 bg-[#161c29] rounded-2xl px-5 py-4 border border-white/[0.04] hover:border-[#2072e0]/40 transition-colors">
              <span className="w-11 h-11 rounded-2xl bg-[#f5b329]/15 text-[#f5b329] flex items-center justify-center shrink-0">
                <Icon name="trophy" size={20} />
              </span>
              <div>
                <div className="font-bold text-[15px] text-white">أنهيت كل الدروس المتاحة!</div>
                <div className="text-[11px] text-[#9297a6] mt-0.5">تصفح صفوفًا أخرى أو راجع أخطاءك</div>
              </div>
            </Link>
          )}
        </div>

        {/* ===== تايلات المواد — تدرّج غني مثل UULA ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {subjects.map((s, i) => {
            const lessons = unitsOfSubject(db, s.id).flatMap((u) => lessonsOfUnit(db, u.id));
            const done = lessons.filter((l) => attemptedIds.has(l.id)).length;
            const prog = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
            return (
              <Link key={s.id} href={`/student/subject/${encodeURIComponent(s.id)}`}
                className="relative aspect-[4/3.3] rounded-[26px] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 group"
                style={{
                  background: `linear-gradient(155deg, ${s.color} 0%, ${s.color}cc 42%, ${s.color}88 78%, #0d121c 145%)`,
                }}
              >
                {/* هالة ناعمة */}
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-25 blur-2xl" style={{ background: "#fff" }} />

                {/* أيقونة المادة */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-[22px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl border border-white/25"
                    style={{ background: "rgba(255,255,255,0.22)" }}
                  >
                    <Icon name={s.icon} size={34} className="text-white drop-shadow-lg" />
                  </span>
                </div>

                {prog === 0 && !sub && (
                  <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/35 backdrop-blur flex items-center justify-center">
                    <Icon name="lock" size={13} className="text-white/80" />
                  </span>
                )}

                {/* الاسم + شريط التقدم */}
                <div className="absolute bottom-0 inset-x-0 px-4 pb-3.5 pt-10 bg-gradient-to-t from-black/50 via-black/15 to-transparent">
                  <div className="flex items-end justify-between gap-2">
                    <div className="font-black text-[17px] sm:text-lg text-white drop-shadow">{s.name}</div>
                    <div className="flex items-center gap-2 pb-1">
                      {prog > 0 ? (
                        <>
                          <div className="w-14 h-1.5 bg-white/25 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: `${prog}%` }} />
                          </div>
                          <span className="text-[11px] font-black text-white/95 tabular-nums" dir="ltr">{prog}%</span>
                        </>
                      ) : (
                        <span className="text-[11px] font-bold text-white/70">{lessons.length} درسًا</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* شريحة الصف */}
        <div className="flex items-center gap-3 text-xs font-bold text-[#9297a6] pt-1">
          <span>{grade?.name}</span>
          {pkg && (
            <span className="bg-[#2072e0]/15 text-[#4a9bf5] px-2.5 py-1 rounded-full">{pkg.name}</span>
          )}
          <Link href="/grades" className="text-[#4a9bf5] hover:text-white transition-colors">تغيير الصف</Link>
        </div>
      </div>
    </AppShell>
  );
}
