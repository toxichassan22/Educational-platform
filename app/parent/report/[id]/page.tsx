"use client";

import React, { use } from "react";
import QShell, { QPageHead, QCard, QPill, QEmpty } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { gradeOf, stageOfGrade, attemptsOfUser, subjectOfLesson, lessonById, activeSub, packageById, subjectsOfGrade } from "@/lib/data";
import { QC, qSubjectArt } from "@/lib/theme-q";

/** تقرير الطالب — /parent/report/[childId] */
export default function ChildReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const childId = decodeURIComponent(id);
  const { db, me } = useStore();
  if (!me) return <QShell role="parent">{null}</QShell>;

  const child = db.users.find((u) => u.id === childId && (me.childrenIds ?? []).includes(u.id));
  if (!child) {
    return (
      <QShell role="parent">
        <div className="text-center py-20 font-bold" style={{ color: QC.muted }}>الطالب غير موجود</div>
      </QShell>
    );
  }

  const grade = gradeOf(db, child.gradeId);
  const stage = stageOfGrade(db, child.gradeId);
  const sub = activeSub(db, child.id);
  const pkg = sub ? packageById(db, sub.packageId) : null;
  const attempts = attemptsOfUser(db, child.id);
  const subjects = subjectsOfGrade(db, child.gradeId);

  const avg = attempts.length ? Math.round((attempts.reduce((t, a) => t + a.score / a.total, 0) / attempts.length) * 100) : 0;
  const studyMin = Math.round(attempts.reduce((t, a) => t + a.timeTakenSec, 0) / 60);
  const perSubject = subjects.map((s) => {
    const list = attempts.filter((a) => subjectOfLesson(db, a.lessonId)?.id === s.id);
    if (!list.length) return null;
    return { subject: s, avg: Math.round((list.reduce((t, a) => t + a.score / a.total, 0) / list.length) * 100), count: list.length };
  }).filter(Boolean) as { subject: (typeof subjects)[0]; avg: number; count: number }[];

  const recent = [...attempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const tone = (v: number) => v >= 70 ? QC.success : v >= 50 ? QC.warning : QC.danger;

  return (
    <QShell role="parent" title="تقرير الطالب">
      <div className="max-w-2xl space-y-5">
        <QPageHead href="/parent">تقرير الطالب</QPageHead>

        {/* هيدر الطالب */}
        <QCard className="!p-5 flex items-center gap-4">
          <img src="/theq/ui/avatar.png" alt={child.name} className="w-14 h-14 rounded-2xl object-cover" />
          <div className="flex-1">
            <div className="text-[17px] font-extrabold" style={{ color: QC.ink }}>{child.name}</div>
            <div className="text-[12px] font-semibold mt-0.5" style={{ color: QC.muted }}>{grade?.name} · {stage?.name}</div>
          </div>
          {pkg ? <QPill tone="ok">{pkg.name}</QPill> : <QPill tone="locked">بدون اشتراك</QPill>}
        </QCard>

        {/* أرقام */}
        <div className="grid grid-cols-3 gap-3">
          {[
            [`${avg}%`, "المعدل العام"],
            [String(attempts.length), "اختبارًا"],
            [`${studyMin}`, "دقيقة دراسة"],
          ].map(([v, l]) => (
            <QCard key={l} className="!p-4 text-center">
              <div className="text-[24px] font-extrabold" style={{ color: QC.ink }}>{v}</div>
              <div className="text-[11px] font-bold mt-1" style={{ color: QC.muted }}>{l}</div>
            </QCard>
          ))}
        </div>

        {/* أداء المواد */}
        <QCard>
          <h3 className="font-extrabold text-[15px] mb-4" style={{ color: QC.ink }}>الأداء حسب المادة</h3>
          {perSubject.length === 0 && <p className="text-[12.5px]" style={{ color: QC.muted }}>لم يؤدِّ اختبارات بعد</p>}
          <div className="space-y-3.5">
            {perSubject.map((s) => (
              <div key={s.subject.id} className="flex items-center gap-3.5">
                {qSubjectArt(s.subject) ? (
                  <img src={qSubjectArt(s.subject)} alt="" className="w-9 h-9 rounded-lg object-contain shrink-0" style={{ background: QC.bgSoft }} />
                ) : (
                  <div className="w-9 h-9 rounded-lg grid place-items-center shrink-0" style={{ background: `${s.subject.color}18`, color: s.subject.color }}>
                    <Icon name={s.subject.icon} size={16} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-bold" style={{ color: QC.ink }}>{s.subject.name}</span>
                    <span className="text-[12px] font-black" style={{ color: tone(s.avg) }}>{s.avg}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: QC.surfaceSoft }}>
                    <div className="h-full rounded-full" style={{ width: `${s.avg}%`, background: tone(s.avg) }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </QCard>

        {/* آخر الاختبارات */}
        <QCard>
          <h3 className="font-extrabold text-[15px] mb-4" style={{ color: QC.ink }}>أحدث الاختبارات</h3>
          {recent.length === 0 && <QEmpty title="لا يوجد نشاط بعد" />}
          <div className="space-y-2">
            {recent.map((a) => {
              const l = lessonById(db, a.lessonId);
              const p = Math.round((a.score / a.total) * 100);
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: QC.bgSoft }}>
                  <div className="w-10 h-10 rounded-lg grid place-items-center text-[11px] font-extrabold shrink-0"
                    style={{ background: `${tone(p)}18`, color: tone(p) }}>
                    {p}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-bold truncate" style={{ color: QC.ink }}>{l?.title}</div>
                    <div className="text-[10.5px]" style={{ color: QC.muted }}>{a.date} · {a.score}/{a.total}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </QCard>
      </div>
    </QShell>
  );
}
