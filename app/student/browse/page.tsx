"use client";

import React, { useState } from "react";
import Link from "next/link";
import QShell, { QPageHead, QCard, QEmpty, QPill } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { unitsOfSubject, lessonsOfUnit, subjectOfLesson, unitById, subjectById, gradeOf, attemptsOfUser, canAccessLesson } from "@/lib/data";
import { QC, qSubjectArt } from "@/lib/theme-q";

const STAGE_STYLE: Record<string, { icon: string; color: string }> = {
  primary: { icon: "gradcap", color: "#059669" },
  middle: { icon: "book", color: "#006fff" },
  high: { icon: "award", color: "#8b5cf6" },
};

export default function Browse() {
  const { db, me } = useStore();
  const [picked, setPicked] = useState<{ stage?: string; grade?: string }>({});
  const [query, setQuery] = useState("");
  const myGrade = me ? db.grades.find((g) => g.id === me.gradeId) : undefined;
  const stageId = picked.stage ?? myGrade?.stageId ?? "high";
  const gradeId = picked.grade ?? myGrade?.id ?? db.grades.find((g) => g.stageId === stageId)!.id;

  const grades = db.grades.filter((g) => g.stageId === stageId);
  const subjects = db.subjects.filter((s) => s.gradeId === gradeId);
  const myAttempts = me ? attemptsOfUser(db, me.id) : [];

  const q = query.trim();
  const searchResults = q.length >= 2
    ? db.lessons.filter((l) => {
        const u = unitById(db, l.unitId);
        const s = u && subjectById(db, u.subjectId);
        return l.title.includes(q) || u?.title.includes(q) || s?.name.includes(q) || s?.teacher.includes(q);
      }).slice(0, 30)
    : [];
  const searching = q.length >= 2;

  return (
    <QShell role="student" title="تصفح المنهج">
      <QPageHead sub="منهج الكويت كامل — المرحلة ← الصف ← المادة ← الدروس">تصفح المنهج</QPageHead>

      {/* البحث */}
      <div className="relative mb-6">
        <span className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: QC.faint }}>
          <Icon name="search" size={17} />
        </span>
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن درس أو مادة أو معلم…"
          className="w-full border rounded-2xl pr-11 pl-4 py-3.5 text-[13.5px] bg-white outline-none focus:border-[#006fff] transition-all"
          style={{ borderColor: QC.line }} />
        {query && (
          <button onClick={() => setQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg grid place-items-center" style={{ background: QC.surfaceSoft, color: QC.faint }}>
            <Icon name="x" size={13} />
          </button>
        )}
      </div>

      {searching ? (
        <QCard pad={false} className="overflow-hidden">
          <div className="px-5 py-3.5 border-b text-[12px] font-bold" style={{ borderColor: QC.line, background: QC.bgSoft, color: QC.muted }}>
            {searchResults.length} نتيجة لـ «{q}»
          </div>
          {searchResults.length === 0 && <QEmpty title="لا توجد نتائج" hint="جرّب كلمة ثانية" />}
          <div className="divide-y" style={{ borderColor: QC.line }}>
            {searchResults.map((l) => {
              const u = unitById(db, l.unitId);
              const s = u && subjectById(db, u.subjectId);
              const g = s && gradeOf(db, s.gradeId);
              const done = myAttempts.some((a) => a.lessonId === l.id);
              const locked = me ? !canAccessLesson(db, me.id, l) : true;
              return (
                <Link key={l.id} href={`/student/lesson/${encodeURIComponent(l.id)}`}
                  className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                    style={{ background: locked ? QC.surfaceSoft : QC.brandSoft, color: locked ? QC.faint : QC.brand }}>
                    <Icon name={locked ? "lock" : "play"} size={15} filled={!locked} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold flex items-center gap-2 flex-wrap" style={{ color: QC.ink }}>
                      {l.title}
                      {l.free && <QPill tone="trial">مجاني</QPill>}
                      {done && <QPill tone="ok">مُنجز</QPill>}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: QC.muted }}>
                      {s?.name} · {u?.title} · {g?.name} · {l.durationMin} دقيقة
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </QCard>
      ) : (
        <>
          {/* المراحل */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {db.stages.map((s) => {
              const t = STAGE_STYLE[s.id] ?? STAGE_STYLE.high;
              const active = stageId === s.id;
              const gCount = db.grades.filter((g) => g.stageId === s.id).length;
              const isMine = me?.gradeId && db.grades.find((g) => g.id === me.gradeId)?.stageId === s.id;
              return (
                <button key={s.id} onClick={() => setPicked({ stage: s.id, grade: db.grades.find(g => g.stageId === s.id)!.id })}
                  className="relative overflow-hidden text-right transition-all rounded-2xl border bg-white hover:-translate-y-0.5"
                  style={{ borderColor: active ? t.color : QC.line, boxShadow: active ? `0 0 0 2px ${t.color}33` : undefined }}>
                  <div className="p-4 md:p-5">
                    <div className="w-11 h-11 rounded-xl grid place-items-center mb-3"
                      style={{ background: `${t.color}18`, color: t.color }}>
                      <Icon name={t.icon} size={22} />
                    </div>
                    <div className="font-extrabold text-[14px] md:text-[15px]" style={{ color: QC.ink }}>{s.name}</div>
                    <div className="text-[10.5px] mt-0.5 font-bold" style={{ color: QC.muted }}>{gCount} صفوف</div>
                    {isMine && (
                      <span className="absolute top-3 left-3 text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: QC.brandSoft, color: QC.brand }}>صفك</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* الصفوف */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {grades.map((g) => {
              const t = STAGE_STYLE[stageId] ?? STAGE_STYLE.high;
              const active = gradeId === g.id;
              return (
                <button key={g.id} onClick={() => setPicked((p) => ({ ...p, grade: g.id }))}
                  className="px-4 py-2 rounded-xl font-bold text-[13px] whitespace-nowrap transition-all border"
                  style={active ? { background: t.color, borderColor: t.color, color: "#fff" } : { background: "#fff", borderColor: QC.line, color: QC.muted }}>
                  {g.name}
                  {g.id === me?.gradeId && <span className="mr-1.5">★</span>}
                </button>
              );
            })}
          </div>

          {/* المواد */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((s, i) => {
              const units = unitsOfSubject(db, s.id);
              const lessonsCount = units.reduce((n, u) => n + lessonsOfUnit(db, u.id).length, 0);
              const subjAttempts = myAttempts.filter((a) => subjectOfLesson(db, a.lessonId)?.id === s.id);
              const sAvg = subjAttempts.length ? Math.round(subjAttempts.reduce((t, a) => t + a.score / a.total, 0) / subjAttempts.length * 100) : null;
              const art = qSubjectArt(s);
              return (
                <Link key={s.id} href={`/student/subject/${encodeURIComponent(s.id)}`}
                  className="rounded-2xl border bg-white overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg animate-fade-up"
                  style={{ borderColor: QC.line, animationDelay: `${i * 50}ms` }}>
                  <div className="h-[110px] grid place-items-center" style={{ background: QC.bgSoft }}>
                    {art ? <img src={art} alt={s.name} className="max-h-[80%] object-contain" /> : <Icon name={s.icon} size={34} style={{ color: s.color }} />}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-extrabold text-[15px] leading-tight" style={{ color: QC.ink }}>{s.name}</div>
                      {sAvg !== null && (
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full" style={{ background: QC.successSoft, color: QC.success }}>{sAvg}%</span>
                      )}
                    </div>
                    <div className="text-[11px] mt-0.5 mb-3" style={{ color: QC.muted }}>{s.teacher}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: QC.surfaceSoft, color: QC.muted }}>{units.length} وحدات</span>
                      <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: QC.surfaceSoft, color: QC.muted }}>{lessonsCount} درسًا</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {subjects.length === 0 && <QEmpty title="لا توجد مواد لهذا الصف بعد" />}
        </>
      )}
    </QShell>
  );
}
