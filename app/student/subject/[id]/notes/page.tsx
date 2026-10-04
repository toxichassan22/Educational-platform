"use client";

import React, { use } from "react";
import Link from "next/link";
import QShell, { QPageHead, QEmpty } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { subjectById, unitsOfSubject, lessonsOfUnit, canAccessLesson } from "@/lib/data";
import { QC } from "@/lib/theme-q";

/** حقيبة The Q — ملفات ومذكرات المادة */
export default function SubjectNotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const subjectId = decodeURIComponent(id);
  const { db, me } = useStore();
  const subject = subjectById(db, subjectId);
  const units = subject ? unitsOfSubject(db, subject.id) : [];

  if (!subject) {
    return (
      <QShell role="student">
        <div className="text-center py-20 font-bold" style={{ color: QC.muted }}>المادة غير موجودة</div>
      </QShell>
    );
  }

  return (
    <QShell role="student">
      <QPageHead href={`/student/subject/${encodeURIComponent(subject.id)}`}>الملاحظات</QPageHead>

      <div className="space-y-3">
        {units.map((u) => {
          const lessons = lessonsOfUnit(db, u.id);
          if (!lessons.length) return null;
          return (
            <div key={u.id} className="rounded-xl border overflow-hidden" style={{ borderColor: QC.line }}>
              <div className="px-5 py-3.5 font-bold text-[13.5px]" style={{ background: QC.bgSoft, color: QC.ink }}>
                {u.title}
              </div>
              <div className="divide-y" style={{ borderColor: QC.line }}>
                {lessons.map((l) => {
                  const locked = me ? !canAccessLesson(db, me.id, l) : true;
                  return (
                    <Link
                      key={l.id}
                      href={`/student/lesson/${encodeURIComponent(l.id)}#notes`}
                      className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <span
                        className="w-9 h-9 rounded-lg grid place-items-center shrink-0"
                        style={{ background: "#fdf4e7", color: QC.warning }}
                      >
                        <Icon name="doc" size={16} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13.5px] font-bold truncate" style={{ color: locked ? QC.muted : QC.ink }}>
                          مذكرة {l.title}
                        </span>
                        <span className="block text-[11px] mt-0.5" style={{ color: QC.faint }}>
                          PDF · ملخص قابل للطباعة
                        </span>
                      </span>
                      {locked ? (
                        <span style={{ color: QC.faint }}>
                          <Icon name="lock" size={15} />
                        </span>
                      ) : (
                        <span style={{ color: QC.faint }}>
                          <Icon name="download" size={15} />
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
        {units.every((u) => !lessonsOfUnit(db, u.id).length) && (
          <QEmpty title="لا توجد ملاحظات في هذه المادة بعد" />
        )}
      </div>
    </QShell>
  );
}
