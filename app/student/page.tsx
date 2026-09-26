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

  // ===== كمّل من وقفت =====
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
      <div className="space-y-8 animate-fade-up">

        {/* ===== صف المواد الدائري — مثل هب UULA ===== */}
        <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
          {subjects.map((s) => (
            <Link key={s.id} href={`/student/subject/${s.id}`}
              className="flex flex-col items-center gap-2 shrink-0 group">
              <span className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center border-2 border-white/10 group-hover:border-[#2072e0]/70 group-hover:scale-105 transition-all shadow-lg"
                style={{ background: `linear-gradient(145deg, ${s.color}, ${s.color}88)` }}>
                <Icon name={s.icon} size={26} className="text-white drop-shadow" />
              </span>
              <span className="text-[11px] font-bold text-[#99a8bd] group-hover:text-white transition-colors whitespace-nowrap">{s.name}</span>
            </Link>
          ))}
        </div>

        {/* ===== الجدولة — بث مراجعة + درسك القادم ===== */}
        <div className="space-y-3">
          {contSubject && (
            <div className="flex items-center justify-between gap-4 bg-[#161c29] border border-white/[0.05] rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-11 h-11 rounded-xl bg-[#2072e0]/15 text-[#4a9bf5] flex items-center justify-center shrink-0">
                  <Icon name="video" size={20} />
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-white truncate">بث مراجعة الاختبار</div>
                  <div className="text-[11px] font-bold text-[#33bf6b] mt-0.5">أستاذ {contSubject.teacher}</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#99a8bd] shrink-0" dir="ltr">1:00 pm</span>
            </div>
          )}

          {continueLesson && contSubject ? (
            <Link href={`/student/lesson/${continueLesson.id}`}
              className="flex items-center justify-between gap-4 bg-[#161c29] border border-white/[0.05] rounded-2xl px-5 py-4 hover:border-[#2072e0]/50 transition-colors group">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-11 h-11 rounded-xl bg-[#33bf6b]/15 text-[#33bf6b] flex items-center justify-center shrink-0">
                  <Icon name="play" size={18} filled />
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-white truncate">درس {continueLesson.title}</div>
                  <div className="text-[11px] font-bold text-[#4a9bf5] mt-0.5">خطة الدراسة — أكمل من حيث توقفت</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#99a8bd] shrink-0" dir="ltr">{continueLesson.durationMin}:00</span>
            </Link>
          ) : (
            <Link href="/student/browse"
              className="flex items-center gap-4 bg-[#161c29] border border-white/[0.05] rounded-2xl px-5 py-4 hover:border-[#2072e0]/50 transition-colors">
              <span className="w-11 h-11 rounded-xl bg-[#f5b329]/15 text-[#f5b329] flex items-center justify-center shrink-0">
                <Icon name="trophy" size={20} />
              </span>
              <div>
                <div className="font-bold text-sm text-white">أنهيت كل الدروس المتاحة!</div>
                <div className="text-[11px] text-[#99a8bd] mt-0.5">تصفح صفوفًا أخرى أو راجع أخطاءك السابقة</div>
              </div>
            </Link>
          )}
        </div>

        {/* ===== تايلات المواد الملوّنة — مثل جريد UULA ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {subjects.map((s, i) => {
            const lessons = unitsOfSubject(db, s.id).flatMap((u) => lessonsOfUnit(db, u.id));
            const done = lessons.filter((l) => attemptedIds.has(l.id)).length;
            const prog = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
            return (
              <Link key={s.id} href={`/student/subject/${s.id}`}
                className="relative aspect-[4/3.4] rounded-[26px] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 animate-fade-up group"
                style={{ animationDelay: `${i * 50}ms`, background: `linear-gradient(150deg, ${s.color} 0%, ${s.color}55 55%, #141a26 130%)` }}>
                {/* أيقونة المادة كبيرة في المنتصف */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                    <Icon name={s.icon} size={34} className="text-white drop-shadow-lg" />
                  </span>
                </div>
                {/* قفل لغير المشترك */}
                {prog === 0 && !sub && (
                  <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/35 backdrop-blur flex items-center justify-center">
                    <Icon name="lock" size={13} className="text-white/80" />
                  </span>
                )}
                {/* الاسم + التقدم أسفل التايل */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/45 to-transparent">
                  <div className="flex items-end justify-between gap-2">
                    <div className="font-black text-lg text-white drop-shadow">{s.name}</div>
                    {prog > 0 && (
                      <div className="flex items-center gap-1.5 pb-0.5">
                        <div className="w-14 h-1.5 bg-white/25 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${prog}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-white/90">{prog}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* شريحة الصف */}
        <div className="flex items-center gap-3 text-xs font-bold text-[#99a8bd]">
          <span>{grade?.name}</span>
          {pkg && <span className="bg-[#2072e0]/15 text-[#4a9bf5] px-2.5 py-1 rounded-full">{pkg.name}</span>}
          <Link href="/grades" className="text-[#4a9bf5] hover:text-white transition-colors">تغيير الصف</Link>
        </div>
      </div>
    </AppShell>
  );
}
