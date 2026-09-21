"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon, Badge } from "@/components/ui";
import { unitsOfSubject, lessonsOfUnit, subjectOfLesson, unitById, subjectById, gradeOf, attemptsOfUser } from "@/lib/data";
import { stageTheme } from "@/lib/theme";

export default function Browse() {
  const { db, me } = useStore();
  // الافتراضي = مرحلة الطالب وصفه — يتحدد بعد تحميل الحساب، والاختيار اليدوي يغلّبه
  const [picked, setPicked] = useState<{ stage?: string; grade?: string }>({});
  const [query, setQuery] = useState("");
  const myGrade = me ? db.grades.find((g) => g.id === me.gradeId) : undefined;
  const stageId = picked.stage ?? myGrade?.stageId ?? "high";
  const gradeId = picked.grade ?? myGrade?.id ?? db.grades.find((g) => g.stageId === stageId)!.id;

  const grades = db.grades.filter((g) => g.stageId === stageId);
  const subjects = db.subjects.filter((s) => s.gradeId === gradeId);
  const myAttempts = me ? attemptsOfUser(db, me.id) : [];

  // بحث شامل في كل المنهج: عنوان الدرس / الوحدة / المادة / المعلم
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
    <AppShell role="student">
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-black text-primary-950">تصفح المنهج</h1>
          <p className="text-slate-400 text-sm">منهج الكويت كامل — المرحلة ← الصف ← المادة ← الدروس</p>
        </div>

        {/* البحث */}
        <div className="relative">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"><Icon name="target" size={17} /></span>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن درس أو مادة أو معلم… (مثال: نيوتن، النحو، العتيبي)"
            className="w-full bg-white border border-slate-200 rounded-2xl pr-11 pl-4 py-3.5 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all shadow-sm" />
          {query && (
            <button onClick={() => setQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200">
              <Icon name="x" size={13} />
            </button>
          )}
        </div>

        {searching ? (
          /* ===== نتائج البحث ===== */
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 text-xs font-bold text-slate-500">
              {searchResults.length} نتيجة لـ «{q}»
            </div>
            {searchResults.length === 0 && (
              <div className="p-10 text-center text-slate-400 text-sm">
                <Icon name="target" size={36} className="mx-auto mb-3 text-slate-200" />
                لا توجد نتائج — جرّب كلمة ثانية
              </div>
            )}
            <div className="divide-y divide-slate-50">
              {searchResults.map((l) => {
                const u = unitById(db, l.unitId);
                const s = u && subjectById(db, u.subjectId);
                const g = s && gradeOf(db, s.gradeId);
                const done = myAttempts.some((a) => a.lessonId === l.id);
                return (
                  <Link key={l.id} href={`/student/lesson/${l.id}`} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50/70 transition-colors group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s?.color ?? "#64748b"}14`, color: s?.color ?? "#64748b" }}>
                      <Icon name="play" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-primary-950 flex items-center gap-2 flex-wrap">
                        {l.title}
                        {l.free && <span className="text-[10px] font-black bg-gold-400/15 text-gold-600 px-2 py-0.5 rounded-full">مجاني</span>}
                        {done && <Badge tone="green">مُنجز</Badge>}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s?.name} · {u?.title} · {g?.name} · {l.durationMin} دقيقة</div>
                    </div>
                    <Icon name="back" size={15} className="text-slate-300 group-hover:text-primary-500 rotate-180 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
        <>

        {/* المراحل — لكل مرحلة شخصيتها البصرية */}
        <div className="grid grid-cols-3 gap-3">
          {db.stages.map((s) => {
            const t = stageTheme(s.id);
            const active = stageId === s.id;
            const gCount = db.grades.filter((g) => g.stageId === s.id).length;
            return (
              <button key={s.id} onClick={() => setPicked({ stage: s.id, grade: db.grades.find(g => g.stageId === s.id)!.id })}
                className={`relative overflow-hidden text-right transition-all ${t.radius} ${active ? "scale-[1.02]" : "opacity-75 hover:opacity-100"}`}
                style={active ? { background: t.color } : { background: "#fff", border: "1px solid #e2e8f0" }}>
                <div className="relative p-4 md:p-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${active ? "bg-white/15" : "bg-slate-100"}`}
                    style={!active ? { color: t.color } : { color: "#fff" }}>
                    <Icon name={t.icon} size={22} />
                  </div>
                  <div className={`font-black text-sm md:text-base ${active ? "text-white" : "text-primary-950"}`}>{s.name}</div>
                  <div className={`text-[10px] md:text-[11px] mt-0.5 font-bold ${active ? "text-white/60" : "text-slate-400"}`}>{active ? t.tagline : `${gCount} صفوف`}</div>
                  {me?.gradeId && db.grades.find(g => g.id === me.gradeId)?.stageId === s.id && (
                    <span className={`absolute top-3 left-3 text-[9px] font-black px-2 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-primary-100 text-primary-700"}`}>صفك</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* الصفوف */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {grades.map((g) => {
            const t = stageTheme(stageId);
            return (
              <button key={g.id} onClick={() => setPicked((p) => ({ ...p, grade: g.id }))}
                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${gradeId === g.id ? "text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"}`}
                style={gradeId === g.id ? { background: t.color } : {}}>
                {g.name}
                {g.id === me?.gradeId && <span className="mr-1.5" style={{ color: t.accent }}>★</span>}
              </button>
            );
          })}
        </div>

        {/* المواد — بطاقات بيضاء بنكهة لون المادة */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((s, i) => {
            const units = unitsOfSubject(db, s.id);
            const lessonsCount = units.reduce((n, u) => n + lessonsOfUnit(db, u.id).length, 0);
            const subjAttempts = myAttempts.filter((a) => subjectOfLesson(db, a.lessonId)?.id === s.id);
            const sAvg = subjAttempts.length ? Math.round(subjAttempts.reduce((t, a) => t + a.score / a.total, 0) / subjAttempts.length * 100) : null;
            return (
              <Link key={s.id} href={`/student/subject/${s.id}`} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="bg-white rounded-2xl p-5 h-full border border-slate-200 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}14`, color: s.color }}>
                      <Icon name={s.icon} size={24} />
                    </div>
                    {sAvg !== null && (
                      <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background: `${s.color}14`, color: s.color }}>{sAvg}%</span>
                    )}
                  </div>
                  <div className="font-black text-lg text-primary-950 leading-tight">{s.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5 mb-4">{s.teacher}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{units.length} وحدات</span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{lessonsCount} درسًا</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {subjects.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-100">
            <Icon name="grid" size={40} className="mx-auto mb-3 text-slate-200" />
            لا توجد مواد لهذا الصف بعد
          </div>
        )}
        </>
        )}
      </div>
    </AppShell>
  );
}
