"use client";

import QShell, { QPageHead, QEmpty } from "@/components/q/QShell";
import { LessonCard } from "@/components/q/LessonCard";
import { useStore } from "@/lib/store";
import { lessonById, unitById, subjectById, canAccessLesson, attemptsOfUser } from "@/lib/data";

/** الدروس المحفوظة — زر «حفظ» في صفحة الدرس */
export default function SavedPage() {
  const { db, me } = useStore();
  if (!me) return <QShell role="student">{null}</QShell>;

  const attempted = new Set(attemptsOfUser(db, me.id).map((a) => a.lessonId));
  const rows = (db.savedLessons ?? [])
    .filter((s) => s.userId === me.id)
    .map((s) => {
      const lesson = lessonById(db, s.lessonId);
      const unit = lesson && unitById(db, lesson.unitId);
      const subject = unit && subjectById(db, unit.subjectId);
      return lesson ? { lesson, unit, subject, addedAt: s.addedAt } : null;
    })
    .filter(Boolean)
    .reverse() as { lesson: NonNullable<ReturnType<typeof lessonById>>; unit: ReturnType<typeof unitById>; subject: ReturnType<typeof subjectById>; addedAt: string }[];

  return (
    <QShell role="student" title="الدروس المحفوظة">
      <QPageHead href="/student" sub="احفظ الدروس للرجوع إليها لاحقًا">الدروس المحفوظة</QPageHead>
      {rows.length === 0 ? (
        <QEmpty title="لا توجد دروس محفوظة" hint="اضغط «حفظ» داخل أي درس ليظهر هنا" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rows.map(({ lesson, unit, subject }) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              unit={unit ?? undefined}
              subject={subject ?? undefined}
              locked={!canAccessLesson(db, me.id, lesson)}
              done={attempted.has(lesson.id)}
              href={`/student/lesson/${encodeURIComponent(lesson.id)}`}
            />
          ))}
        </div>
      )}
    </QShell>
  );
}
