"use client";

import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import QShell, { QPageHead, QBtn, QEmpty } from "@/components/q/QShell";
import { LessonCard } from "@/components/q/LessonCard";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { subjectById, unitsOfSubject, lessonsOfUnit, attemptsOfUser, canAccessLesson, activeSub } from "@/lib/data";
import { QC, qSubjectArt } from "@/lib/theme-q";

export default function LecturesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const subjectId = decodeURIComponent(id);
  const { db, me } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "locked">("all");
  const subject = subjectById(db, subjectId);
  const units = subject ? unitsOfSubject(db, subject.id) : [];
  const myAttempts = me ? attemptsOfUser(db, me.id) : [];
  const attempted = useMemo(() => new Set(myAttempts.map((a) => a.lessonId)), [myAttempts]);
  const sub = me ? activeSub(db, me.id) : null;

  if (!subject) {
    return (
      <QShell role="student">
        <div className="text-center py-20 font-bold" style={{ color: QC.muted }}>المادة غير موجودة</div>
      </QShell>
    );
  }

  const q = query.trim();
  const visible = (l: ReturnType<typeof lessonsOfUnit>[number]) => {
    const locked = me ? !canAccessLesson(db, me.id, l) : true;
    if (filter === "open" && locked) return false;
    if (filter === "locked" && !locked) return false;
    if (q && !l.title.includes(q) && !l.note.some((n) => n.heading.includes(q) || n.body.includes(q))) return false;
    return true;
  };

  const art = qSubjectArt(subject);
  const total = units.reduce((n, u) => n + lessonsOfUnit(db, u.id).length, 0);

  return (
    <QShell role="student">
      <QPageHead href={`/student/subject/${encodeURIComponent(subject.id)}`} sub="جمعنا لك دروس الفيديو">
        دروس {subject.name}
      </QPageHead>

      {/* بحث + فلتر */}
      <div className="flex items-center gap-3 mb-5">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="border rounded-xl px-3.5 py-2.5 text-[13px] font-bold bg-white outline-none shrink-0"
          style={{ borderColor: QC.line, color: QC.body }}
        >
          <option value="all">كل المحتوى</option>
          <option value="open">المتاح لي</option>
          <option value="locked">المقفل</option>
        </select>
        <div className="relative flex-1">
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: QC.faint }}>
            <Icon name="search" size={16} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن المحاضرات بالوصف…"
            className="w-full border rounded-xl pr-10 pl-4 py-2.5 text-[13px] bg-white outline-none focus:border-[#006fff]"
            style={{ borderColor: QC.line }}
          />
        </div>
        {art && <img src={art} alt="" className="h-14 w-auto hidden sm:block" />}
      </div>

      {/* بانر الاشتراك */}
      {!sub && (
        <div className="rounded-2xl px-6 py-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-white" style={{ background: QC.brand }}>
          <span className="text-[13px] font-bold">اشترك للوصول إلى جميع دروس {subject.name} بدون قيود</span>
          <QBtn href="/student/subscription" size="sm" style={{ background: "#fff", color: QC.navy, border: "none" }}>
            اشترك الآن
          </QBtn>
        </div>
      )}

      {/* الدروس حسب الوحدة */}
      {units.map((u) => {
        const lessons = lessonsOfUnit(db, u.id).filter(visible);
        if (!lessons.length) return null;
        return (
          <section key={u.id} className="mb-7">
            <h3 className="text-[15px] font-extrabold mb-3 flex items-baseline gap-2" style={{ color: QC.ink }}>
              {u.title}
              <span className="text-[11px] font-semibold" style={{ color: QC.faint }}>
                {lessons.length} درسًا
              </span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((l) => {
                const locked = me ? !canAccessLesson(db, me.id, l) : true;
                return (
                  <LessonCard
                    key={l.id}
                    lesson={l}
                    unit={u}
                    subject={subject}
                    locked={locked}
                    done={attempted.has(l.id)}
                    href={`/student/lesson/${encodeURIComponent(l.id)}`}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {total === 0 && <QEmpty title="لا توجد دروس في هذه المادة بعد" />}
    </QShell>
  );
}
