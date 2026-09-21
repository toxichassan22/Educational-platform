"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Progress, Badge } from "@/components/ui";
import { gradeOf, stageOfGrade, attemptsOfUser, subjectOfLesson, lessonById, activeSub, packageById, subjectsOfGrade, User } from "@/lib/data";
import { buildNotifs, whenLabel } from "@/components/NotifBell";

function ChildCard({ child, defaultOpen }: { child: User; defaultOpen: boolean }) {
  const { db } = useStore();
  const [expanded, setExpanded] = useState(defaultOpen);
  const grade = gradeOf(db, child.gradeId);
  const stage = stageOfGrade(db, child.gradeId);
  const attempts = attemptsOfUser(db, child.id);
  const sub = activeSub(db, child.id);
  const pkg = sub ? packageById(db, sub.packageId) : null;

  const avg = attempts.length ? Math.round((attempts.reduce((t, a) => t + a.score / a.total, 0) / attempts.length) * 100) : 0;
  const subjects = subjectsOfGrade(db, child.gradeId);
  const perSubject = subjects.map((s) => {
    const list = attempts.filter((a) => subjectOfLesson(db, a.lessonId)?.id === s.id);
    if (!list.length) return null;
    return { name: s.name, color: s.color, icon: s.icon, avg: Math.round(list.reduce((t, a) => t + a.score / a.total, 0) / list.length * 100), count: list.length };
  }).filter(Boolean) as { name: string; color: string; icon: string; avg: number; count: number }[];

  const recent = [...attempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const studyMin = attempts.reduce((t, a) => t + a.timeTakenSec, 0) / 60;

  return (
    <Card className="overflow-hidden border border-slate-100">
      <button onClick={() => setExpanded((e) => !e)} className="w-full p-5 flex items-center gap-4 hover:bg-slate-50/60 transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-extrabold text-xl">
          {child.name[0]}
        </div>
        <div className="flex-1 text-right">
          <div className="font-extrabold text-primary-900 flex items-center gap-2">
            {child.name}
            {pkg ? <Badge tone="green">{pkg.name}</Badge> : <Badge tone="gray">بدون اشتراك</Badge>}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{grade?.name} · {stage?.name}</div>
        </div>
        <div className="hidden sm:grid grid-cols-3 gap-6 text-center">
          <div><div className="text-xl font-extrabold text-primary-800">{avg}%</div><div className="text-[10px] text-slate-400">المعدل</div></div>
          <div><div className="text-xl font-extrabold text-primary-800">{attempts.length}</div><div className="text-[10px] text-slate-400">اختبارًا</div></div>
          <div><div className="text-xl font-extrabold text-primary-800">{Math.round(studyMin)}</div><div className="text-[10px] text-slate-400">دقيقة دراسة</div></div>
        </div>
        <Icon name="down" size={18} className={`text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-5 grid md:grid-cols-2 gap-5 animate-fade-up">
          {/* أداء المواد */}
          <div>
            <h4 className="font-extrabold text-sm text-primary-900 mb-3">الأداء حسب المادة</h4>
            {perSubject.length === 0 && <p className="text-xs text-slate-400">لم يؤدِّ اختبارات بعد</p>}
            <div className="space-y-3">
              {perSubject.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-600">{s.name}</span>
                    <span className="font-extrabold text-primary-800">{s.avg}%</span>
                  </div>
                  <Progress value={s.avg} color={s.avg >= 70 ? "#059669" : s.avg >= 50 ? "#f59e0b" : "#ef4444"} h={7} />
                </div>
              ))}
            </div>
          </div>

          {/* آخر الاختبارات */}
          <div>
            <h4 className="font-extrabold text-sm text-primary-900 mb-3">أحدث الاختبارات</h4>
            {recent.length === 0 && <p className="text-xs text-slate-400">لا يوجد نشاط بعد</p>}
            <div className="space-y-2">
              {recent.map((a) => {
                const l = lessonById(db, a.lessonId);
                const pct = Math.round((a.score / a.total) * 100);
                return (
                  <div key={a.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-extrabold ${pct >= 80 ? "bg-emerald-100 text-emerald-600" : pct >= 50 ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-500"}`}>
                      {pct}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-primary-900 truncate">{l?.title}</div>
                      <div className="text-[10px] text-slate-400">{a.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function ParentHome() {
  const { db, me } = useStore();
  if (!me) return <AppShell role="parent">{null}</AppShell>;
  const children = (me.childrenIds ?? []).map((id) => db.users.find((u) => u.id === id)).filter(Boolean) as User[];

  return (
    <AppShell role="parent">
      <div className="space-y-6 animate-fade-up">
        <div className="rounded-[2rem] p-6 text-white relative overflow-hidden hero-mesh">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <h1 className="text-2xl font-black mb-1 relative">أهلاً {me.name}</h1>
          <p className="text-white/70 text-sm">تابع مستوى أبنائك الدراسي لحظة بلحظة — درجاتهم، تقدمهم، ونشاطهم</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"><Icon name="users" size={20} /></div>
            <div><div className="text-xl font-extrabold text-primary-900">{children.length}</div><div className="text-xs text-slate-400">أبناء مسجلون</div></div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Icon name="check" size={20} /></div>
            <div><div className="text-xl font-extrabold text-primary-900">{children.filter((c) => activeSub(db, c.id)).length}</div><div className="text-xs text-slate-400">اشتراكات نشطة</div></div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gold-500/15 text-gold-600 flex items-center justify-center"><Icon name="bell" size={20} /></div>
            <div><div className="text-xl font-extrabold text-primary-900">{buildNotifs(db, me).length}</div><div className="text-xs text-slate-400">تنبيهات</div></div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="font-extrabold text-primary-900 text-lg">أبنائي</h2>
          {children.map((c, i) => (
            <ChildCard key={c.id} child={c} defaultOpen={i === 0} />
          ))}
        </div>

        <Card className="p-5 border border-slate-100">
          <h3 className="font-extrabold text-primary-900 mb-3 flex items-center gap-2"><Icon name="bell" size={17} className="text-gold-500" /> آخر الإشعارات</h3>
          <div className="space-y-2.5 text-sm">
            {buildNotifs(db, me).map((n) => (
              <div key={n.id} className="flex gap-3 items-start bg-slate-50 rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${n.color}15`, color: n.color }}>
                  <Icon name={n.icon} size={15} />
                </div>
                <div className="flex-1">
                  {n.text}
                  <div className="text-[10px] text-slate-400 mt-0.5">{whenLabel(n.ts)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
