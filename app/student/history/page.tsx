"use client";

import QShell, { QPageHead, QEmpty } from "@/components/q/QShell";
import { LessonCard } from "@/components/q/LessonCard";
import { useStore } from "@/lib/store";
import { lessonById, unitById, subjectById, canAccessLesson, attemptsOfUser } from "@/lib/data";

/** سجل المشاهدة — الدروس اللي الطالب فتحها أو شاهد جزءًا منها */
export default function HistoryPage() {
  const { db, me } = useStore();
  if (!me) return <QShell role="student">{null}</QShell>;

  const attempted = new Set(attemptsOfUser(db, me.id).map((a) => a.lessonId));
  const rows = (db.lessonProgress ?? [])
    .filter((p) => p.userId === me.id)
    .map((p) => {
      const lesson = lessonById(db, p.lessonId);
      const unit = lesson && unitById(db, lesson.unitId);
      const subject = unit && subjectById(db, unit.subjectId);
      return lesson ? { lesson, unit, subject, position: p.position } : null;
    })
    .filter(Boolean)
    .reverse() as { lesson: NonNullable<ReturnType<typeof lessonById>>; unit: ReturnType<typeof unitById>; subject: ReturnType<typeof subjectById>; position: number }[];

  return (
    <QShell role="student" title="سجل المشاهدة">
      <QPageHead href="/student" sub="ارجع لأي درس وقفت فيه">سجل المشاهدة</QPageHead>
      {rows.length === 0 ? (
        <QEmpty title="لم تشاهد أي درس بعد" hint="ابدأ أول درس من صفحة المواد" />
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
