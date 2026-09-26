"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon, DCard } from "@/components/ui";
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
    return <AppShell role="student" dark><DCard className="p-10 text-center text-[#99a8bd]">المادة غير موجودة</DCard></AppShell>;
  }

  const bestAttempt = (lessonId: string) => {
    const list = myAttempts.filter((a) => a.lessonId === lessonId);
    if (!list.length) return null;
    return Math.max(...list.map((a) => Math.round((a.score / a.total) * 100)));
  };

  const totalLessons = units.reduce((n, u) => n + lessonsOfUnit(db, u.id).length, 0);
  const doneLessons = units.reduce((n, u) => n + lessonsOfUnit(db, u.id).filter((l) => bestAttempt(l.id) !== null).length, 0);
  const pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  // أول درس مفتوح وغير منجز = «الحالي»
  const allLessons = units.flatMap((u) => lessonsOfUnit(db, u.id));
  const nextId = allLessons.find((l) => bestAttempt(l.id) === null && (!me || canAccessLesson(db, me.id, l)))?.id;

  return (
    <AppShell role="student" dark>
      <div className="space-y-6 animate-fade-up">

        {/* مسار التنقل */}
        <div className="flex items-center gap-2.5 text-sm">
          <Link href="/student" className="text-[#99a8bd] font-bold hover:text-white transition-colors">الرئيسية</Link>
          <span className="text-[#99a8bd] font-bold">‹</span>
          <span className="text-white font-bold">{subject.name}</span>
        </div>

        {/* هيدر المادة — عنوان كبير مثل صفحة المادة في UULA */}
        <div className="rounded-[26px] p-7 sm:p-9 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${subject.color} 0%, ${subject.color}66 60%, #141a26 140%)` }}>
          <div className="flex items-center gap-5 flex-wrap relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 shadow-xl">
              <Icon name={subject.icon} size={34} className="text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow">{subject.name}</h1>
              <div className="text-white/80 font-bold text-sm mt-1.5">{grade?.name} · {totalLessons} درسًا · أ/ {subject.teacher}</div>
            </div>
            <div className="bg-black/25 backdrop-blur rounded-2xl px-6 py-3 text-center">
              <div className="text-xs font-bold text-white/70 mb-0.5">نسبة الإنجاز</div>
              <div className="text-2xl font-black text-white">{pct}%</div>
            </div>
          </div>
        </div>

        {/* زبدة المادة — ملخص المنهج */}
        {allLessons[0] && (
          <Link href={`/student/lesson/${allLessons[0].id}#notes`}
            className="flex items-center gap-4 bg-[#161c29] border border-white/[0.05] rounded-2xl px-5 py-4 hover:border-[#f5b329]/50 transition-colors group">
            <span className="w-11 h-11 rounded-xl bg-[#f5b329]/15 text-[#f5b329] flex items-center justify-center text-xl shrink-0">🧈</span>
            <div className="flex-1">
              <div className="font-bold text-white">زبدة المادة</div>
              <div className="text-[11px] font-bold text-[#99a8bd] mt-0.5">ملخص مركز لأهم ما في المنهج</div>
            </div>
            <Icon name="back" size={16} className="text-[#99a8bd] group-hover:-translate-x-1 transition-transform" />
          </Link>
        )}

        {/* الوحدات والدروس — صفوف مرقّمة مثل UULA */}
        <div className="space-y-3">
          {units.map((u, ui) => {
            const lessons = lessonsOfUnit(db, u.id);
            const open = openUnit === u.id;
            return (
              <DCard key={u.id} className="overflow-hidden rounded-2xl">
                <button onClick={() => setOpenUnit(open ? null : u.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#1a2130]/60 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-[#1a2e4d] text-[#4a9bf5] flex items-center justify-center text-sm font-black shrink-0 border border-[#2072e0]/30">
                    {ui + 1}
                  </span>
                  <div className="flex-1 text-right font-bold">{u.title}</div>
                  <span className="text-[12px] font-bold text-[#99a8bd]">{lessons.length} دروس</span>
                  <Icon name="down" size={14} className={`text-[#8e99ab] transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                  <div className="border-t border-[#2b3547]/70">
                    {lessons.map((l) => {
                      const lpct = bestAttempt(l.id);
                      const locked = me ? !canAccessLesson(db, me.id, l) : false;
                      const isNow = l.id === nextId;
                      const state = locked ? "lock" : lpct !== null ? "done" : isNow ? "now" : "todo";
                      return (
                        <Link key={l.id} href={`/student/lesson/${l.id}`}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-[#1a2130]/60 transition-colors border-b border-[#2b3547]/50 last:border-0 group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            state === "done" ? "bg-[#1a3d24] text-[#33bf6b]"
                            : state === "now" ? "bg-[#1a2e4d] text-[#2072e0]"
                            : "bg-[#212936] text-[#8e99ab]"}`}>
                            {state === "lock" ? <Icon name="lock" size={15} />
                              : state === "done" ? <Icon name="check" size={17} />
                              : <Icon name="play" size={14} filled />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-bold flex items-center gap-2 flex-wrap ${locked ? "text-[#99a8bd]" : "text-white"}`}>
                              {l.title}
                              {l.free && <span className="text-[11px] font-black bg-[#1a3d24] text-[#33bf6b] px-2 py-0.5 rounded-lg">مجاني</span>}
                              {locked && <span className="text-[10px] font-black bg-[#212936] text-[#8e99ab] px-2 py-0.5 rounded-lg">للمشتركين</span>}
                            </div>
                            <div className="text-[13px] text-[#99a8bd] mt-1">فيديو · {l.durationMin} دقيقة
                              {questionsOfLesson(db, l.id).length > 0 && <span> · {questionsOfLesson(db, l.id).length} أسئلة</span>}
                            </div>
                          </div>
                          {lpct !== null && (
                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${lpct >= 80 ? "bg-[#1a3d24] text-[#33bf6b]" : lpct >= 50 ? "bg-[#3d321a] text-[#f5b329]" : "bg-[#3d1a1a] text-[#e04d4d]"}`}>{lpct}%</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </DCard>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
