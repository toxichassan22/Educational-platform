"use client";

import React, { use } from "react";
import Link from "next/link";
import QShell, { QPageHead } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { subjectById, unitsOfSubject, lessonsOfUnit, attemptsOfUser } from "@/lib/data";
import { QC } from "@/lib/theme-q";

/** إحصائيات المادة — صفّان: الشرح والأسئلة مثل TheQ */
export default function SubjectStatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const subjectId = decodeURIComponent(id);
  const { db, me } = useStore();
  const subject = subjectById(db, subjectId);
  const units = subject ? unitsOfSubject(db, subject.id) : [];
  const lessons = units.flatMap((u) => lessonsOfUnit(db, u.id));
  const attempts = me ? attemptsOfUser(db, me.id) : [];

  if (!subject) {
    return (
      <QShell role="student">
        <div className="text-center py-20 font-bold" style={{ color: QC.muted }}>المادة غير موجودة</div>
      </QShell>
    );
  }

  const subjectLessonIds = new Set(lessons.map((l) => l.id));
  const watched = (db.lessonProgress ?? []).filter((p) => p.userId === me?.id && subjectLessonIds.has(p.lessonId)).length;
  const taken = attempts.filter((a) => subjectLessonIds.has(a.lessonId)).length;
  const base = `/student/subject/${encodeURIComponent(subject.id)}`;

  const rows = [
    {
      title: "الشرح",
      sub: `${watched}/${lessons.length} حضر`,
      href: `${base}/lectures`,
      bg: "#8b5cf6",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
          <polygon points="8 5 19 12 8 19" />
        </svg>
      ),
      iconSoft: "#f3e8ff",
      arrow: "#8b5cf6",
    },
    {
      title: "الأسئلة",
      sub: `${taken} حضر`,
      href: `${base}/exams`,
      bg: "#f59200",
      icon: (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="4" width="14" height="18" rx="2" />
          <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
          <path d="M9 13l2 2 4-4" />
        </svg>
      ),
      iconSoft: "#fff7ed",
      arrow: "#f59200",
    },
  ];

  return (
    <QShell role="student">
      <QPageHead href={`/student/subject/${encodeURIComponent(subject.id)}`}>الإحصائيات</QPageHead>

      <div className="space-y-4">
        {rows.map((r) => (
          <Link
            key={r.title}
            href={r.href}
            className="flex items-center gap-4 rounded-2xl border bg-white px-5 py-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderColor: QC.line }}
          >
            <span className="w-12 h-12 rounded-2xl grid place-items-center shrink-0" style={{ background: r.bg }}>
              {r.icon}
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-extrabold" style={{ color: QC.ink }}>
                {r.title}
              </span>
              <span className="block text-[12px] font-bold mt-0.5" style={{ color: r.bg }}>
                {r.sub}
              </span>
            </span>
            <span className="w-8 h-8 rounded-full grid place-items-center" style={{ background: r.iconSoft, color: r.arrow }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </QShell>
  );
}
