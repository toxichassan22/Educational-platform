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
  const contPct = contSubject
    ? (() => {
        const ls = unitsOfSubject(db, contSubject.id).flatMap((u) => lessonsOfUnit(db, u.id));
        const done = ls.filter((l) => attemptedIds.has(l.id)).length;
        return ls.length ? Math.round((done / ls.length) * 100) : 0;
      })()
    : 0;

  return (
    <AppShell role="student" dark>
      <div className="space-y-7 animate-fade-up">

        {/* ===== التحية + شريحة الصف ===== */}
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black">أهلاً {me.name.split(" ")[0]}</h1>
          <Link href="/grades"
            className="flex items-center gap-2.5 bg-[#161c29] border border-[#2b3547] rounded-2xl px-4 py-2 hover:border-[#2072e0]/60 transition-colors">
            <span className="text-sm font-bold text-[#4a9bf5]">{grade?.name}</span>
            {pkg && <span className="text-[10px] font-black bg-[#2072e0]/15 text-[#4a9bf5] px-2 py-0.5 rounded-full">{pkg.name}</span>}
            <span className="text-xs font-bold text-[#99a8bd]">تغيير</span>
          </Link>
        </div>

        {/* ===== أكمل من حيث توقفت ===== */}
        {continueLesson && contSubject ? (
          <Link href={`/student/lesson/${continueLesson.id}`}
            className="flex items-center gap-5 bg-[#1a2130] border border-[#2b3547] rounded-[20px] p-6 sm:p-7 hover:border-[#2072e0]/60 transition-all group">
            <div className="w-16 h-16 rounded-full bg-[#2072e0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-[#2072e0]/30">
              <Icon name="play" size={26} filled className="text-white -mr-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-[#99a8bd] mb-1">أكمل من حيث توقفت</div>
              <div className="text-lg sm:text-xl font-bold truncate">{contSubject.name} — {continueLesson.title}</div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
              <div className="w-52 h-2.5 bg-[#2b3547] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#33bf6b] transition-all" style={{ width: `${contPct}%` }} />
              </div>
              <span className="text-sm font-bold text-[#33bf6b]">{contPct}%</span>
            </div>
          </Link>
        ) : (
          <Link href="/student/browse"
            className="flex items-center gap-5 bg-[#1a2130] border border-[#2b3547] rounded-[20px] p-6 sm:p-7 hover:border-[#2072e0]/60 transition-all">
            <div className="w-16 h-16 rounded-full bg-[#f5b329]/15 text-[#f5b329] flex items-center justify-center shrink-0">
              <Icon name="trophy" size={28} />
            </div>
            <div>
              <div className="text-lg font-bold">أنهيت كل الدروس المتاحة!</div>
              <div className="text-sm text-[#99a8bd] mt-1">تصفح صفوفًا أخرى أو راجع أخطاءك السابقة</div>
            </div>
          </Link>
        )}

        {/* ===== موادك الدراسية ===== */}
        <h2 className="text-xl sm:text-2xl font-black pt-2">موادك الدراسية</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((s, i) => {
            const lessons = unitsOfSubject(db, s.id).flatMap((u) => lessonsOfUnit(db, u.id));
            const done = lessons.filter((l) => attemptedIds.has(l.id)).length;
            const prog = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
            return (
              <Link key={s.id} href={`/student/subject/${s.id}`}
                className="bg-[#161c29] border border-[#2b3547] rounded-[18px] p-6 min-h-[150px] flex flex-col justify-between transition-all hover:border-[#2072e0]/60 hover:-translate-y-0.5 animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${s.color}20`, color: s.color }}>
                    <Icon name={s.icon} size={26} />
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-bold text-[#99a8bd]">{prog}%</div>
                    <div className="w-36 h-2 bg-[#2b3547] rounded-full overflow-hidden mt-1.5">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${prog}%`, background: prog > 0 ? "#33bf6b" : "#2072e0" }} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-black text-lg">{s.name}</div>
                  <div className="text-sm font-bold text-[#99a8bd] mt-0.5">{lessons.length} درسًا</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
