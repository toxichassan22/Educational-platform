"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Badge } from "@/components/ui";
import { subjectById, unitsOfSubject, lessonsOfUnit, questionsOfLesson, attemptsOfUser, gradeOf, canAccessLesson } from "@/lib/data";

export default function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const subjectId = decodeURIComponent(id);
  const { db, me } = useStore();
  const subject = subjectById(db, subjectId);
  const units = subject ? unitsOfSubject(db, subject.id) : [];
  const [openUnit, setOpenUnit] = useState<string | null>(units[0]?.id ?? null);
  const myAttempts = me ? attemptsOfUser(db, me.id) : [];
  const grade = subject ? gradeOf(db, subject.gradeId) : null;

  if (!subject) {
    return <AppShell role="student"><Card className="p-10 text-center text-slate-400">المادة غير موجودة</Card></AppShell>;
  }

  const bestAttempt = (lessonId: string) => {
    const list = myAttempts.filter((a) => a.lessonId === lessonId);
    if (!list.length) return null;
    return Math.max(...list.map((a) => Math.round((a.score / a.total) * 100)));
  };

  const totalLessons = units.reduce((n, u) => n + lessonsOfUnit(db, u.id).length, 0);
  const doneLessons = units.reduce((n, u) => n + lessonsOfUnit(db, u.id).filter((l) => bestAttempt(l.id) !== null).length, 0);

  return (
    <AppShell role="student">
      <div className="space-y-5 animate-fade-up">
        {/* ترويسة المادة — لون مسطح واحد */}
        <div className="rounded-3xl p-6 md:p-7 text-white" style={{ background: subject.color }}>
          <div className="flex items-center gap-4">
            <Link href="/student/browse" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors shrink-0">
              <Icon name="chevron" size={18} />
            </Link>
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Icon name={subject.icon} size={30} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black">{subject.name}</h1>
              <div className="text-white/70 text-sm">{grade?.name} · {subject.teacher}</div>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white/15 rounded-2xl px-5 py-3 text-center">
                <div className="font-black text-xl">{doneLessons}/{totalLessons}</div>
                <div className="text-[10px] text-white/60 font-bold">درسًا منجزًا</div>
              </div>
            </div>
          </div>
          {/* شريط تقدم المادة */}
          <div className="mt-5 h-2 bg-black/15 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gold-400 transition-all duration-700" style={{ width: `${totalLessons ? (doneLessons / totalLessons) * 100 : 0}%` }} />
          </div>
        </div>

        {/* الوحدات والدروس */}
        {units.map((u, ui) => {
          const lessons = lessonsOfUnit(db, u.id);
          const open = openUnit === u.id;
          const unitDone = lessons.filter((l) => bestAttempt(l.id) !== null).length;
          return (
            <Card key={u.id} className="overflow-hidden border border-slate-100 shadow-sm">
              <button onClick={() => setOpenUnit(open ? null : u.id)}
                className="w-full flex items-center gap-3.5 p-4 hover:bg-slate-50/70 transition-colors">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black shrink-0"
                  style={{ background: `${subject.color}14`, color: subject.color }}>
                  {ui + 1}
                </div>
                <div className="flex-1 text-right">
                  <div className="font-black text-primary-950">{u.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{lessons.length} دروس · {unitDone} منجزة</div>
                </div>
                {unitDone === lessons.length && lessons.length > 0 && (
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full">مكتملة</span>
                )}
                <Icon name="down" size={18} className={`text-slate-300 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="border-t border-slate-100 bg-slate-50/40">
                  {lessons.map((l, li) => {
                    const pct = bestAttempt(l.id);
                    const qCount = questionsOfLesson(db, l.id).length;
                    const locked = me ? !canAccessLesson(db, me.id, l) : false;
                    return (
                      <Link key={l.id} href={`/student/lesson/${l.id}`}
                        className="flex items-center gap-3.5 px-4 py-4 hover:bg-white transition-colors border-b border-slate-100 last:border-0 group">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                          locked ? "bg-slate-100 text-slate-400"
                          : pct !== null
                            ? pct >= 80 ? "bg-emerald-100 text-emerald-600" : pct >= 50 ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-500"
                            : "bg-white text-slate-300 border border-slate-200 group-hover:border-primary-300 group-hover:text-primary-500"}`}>
                          {locked ? <Icon name="lock" size={15} /> : pct !== null ? <Icon name="check" size={17} /> : <Icon name="play" size={15} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-bold flex items-center gap-2 flex-wrap ${locked ? "text-slate-400" : "text-primary-950"}`}>
                            {l.title}
                            {l.free && <span className="text-[10px] font-black bg-gold-400/15 text-gold-600 px-2 py-0.5 rounded-full">مجاني</span>}
                            {locked && <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">للمشتركين</span>}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1"><Icon name="clock" size={11} /> {l.durationMin} دقيقة</span>
                            <span className="flex items-center gap-1"><Icon name="doc" size={11} /> مذكرة</span>
                            {qCount > 0 && <span className="flex items-center gap-1"><Icon name="target" size={11} /> {qCount} أسئلة</span>}
                          </div>
                        </div>
                        {pct !== null ? (
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${pct >= 80 ? "bg-emerald-100 text-emerald-600" : pct >= 50 ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-500"}`}>{pct}%</span>
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all">
                            <Icon name="back" size={14} className="rotate-180" />
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
