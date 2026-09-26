"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Icon, DCard } from "@/components/ui";
import { attemptsOfUser, subjectOfLesson, lessonById, subjectsOfGrade } from "@/lib/data";

export default function Reports() {
  const { db, me } = useStore();
  if (!me) return <AppShell role="student" dark>{null}</AppShell>;
  const attempts = attemptsOfUser(db, me.id);
  const subjects = subjectsOfGrade(db, me.gradeId);

  // أداء كل مادة
  const perSubject = subjects.map((s) => {
    const list = attempts.filter((a) => subjectOfLesson(db, a.lessonId)?.id === s.id);
    if (!list.length) return null;
    const avg = Math.round((list.reduce((t, a) => t + a.score / a.total, 0) / list.length) * 100);
    return { subject: s, avg, count: list.length, lessons: new Set(list.map((a) => a.lessonId)).size };
  }).filter(Boolean) as { subject: (typeof subjects)[0]; avg: number; count: number; lessons: number }[];

  const sorted = [...perSubject].sort((a, b) => b.avg - a.avg);
  const strengths = sorted.filter((s) => s.avg >= 70);
  const weaknesses = sorted.filter((s) => s.avg < 70);
  const totalAvg = perSubject.length ? Math.round(perSubject.reduce((t, s) => t + s.avg, 0) / perSubject.length) : 0;

  const recent = [...attempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  const tone = (v: number) => v >= 70 ? "#33bf6b" : v >= 50 ? "#f5b329" : "#e04d4d";

  return (
    <AppShell role="student" dark>
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-black">تقارير الأداء</h1>
          <p className="text-[#9297a6] text-sm">تحليل ذكي لمستواك في كل مادة ودرس</p>
        </div>

        {/* الملخص */}
        <div className="grid md:grid-cols-3 gap-4">
          <DCard className="p-6 text-center">
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#2b3547" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={tone(totalAvg)}
                  strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(totalAvg / 100) * 264} 264`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-black">{totalAvg}%</div>
            </div>
            <div className="font-bold">معدلك العام</div>
            <div className="text-xs text-[#9297a6] mt-1">عبر {perSubject.length} مواد مُختبَرة</div>
          </DCard>

          <DCard className="p-5">
            <h3 className="font-black text-[#33bf6b] text-sm mb-3 flex items-center gap-2"><Icon name="award" size={16} /> نقاط القوة</h3>
            {strengths.length === 0 && <p className="text-xs text-[#9297a6]">أدِّ مزيدًا من الاختبارات لاكتشاف نقاط قوتك</p>}
            <div className="space-y-2">
              {strengths.map((s) => (
                <div key={s.subject.id} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#c6cfdd]">{s.subject.name}</span>
                  <span className="text-[11px] font-black bg-[#1a3d24] text-[#33bf6b] px-2.5 py-0.5 rounded-full">{s.avg}%</span>
                </div>
              ))}
            </div>
          </DCard>

          <DCard className="p-5">
            <h3 className="font-black text-[#e04d4d] text-sm mb-3 flex items-center gap-2"><Icon name="target" size={16} /> تحتاج تركيزًا</h3>
            {weaknesses.length === 0 && <p className="text-xs text-[#9297a6]">لا توجد مواد ضعيفة — استمر!</p>}
            <div className="space-y-2">
              {weaknesses.map((s) => (
                <div key={s.subject.id} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#c6cfdd]">{s.subject.name}</span>
                  <span className="text-[11px] font-black bg-[#3d1a1a] text-[#e04d4d] px-2.5 py-0.5 rounded-full">{s.avg}%</span>
                </div>
              ))}
            </div>
          </DCard>
        </div>

        {/* أداء المواد */}
        <DCard className="p-6">
          <h2 className="font-black mb-5">أدائك في كل مادة</h2>
          <div className="space-y-4">
            {perSubject.length === 0 && <p className="text-sm text-[#9297a6] text-center py-6">لم تُؤدِّ اختبارات بعد — <Link href="/student/browse" className="text-[#4a9bf5] font-bold">ابدأ أول درس</Link></p>}
            {perSubject.map((s) => (
              <div key={s.subject.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.subject.color}20`, color: s.subject.color }}>
                  <Icon name={s.subject.icon} size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm">{s.subject.name}</span>
                    <span className="text-xs text-[#9297a6]">{s.count} اختبارًا · {s.lessons} دروس</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-[#2b3547] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.avg}%`, background: tone(s.avg) }} />
                    </div>
                    <span className="text-sm font-black w-10" style={{ color: tone(s.avg) }}>{s.avg}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DCard>

        {/* سجل الاختبارات */}
        <DCard className="p-6">
          <h2 className="font-black mb-4">سجل الاختبارات</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-[#9297a6] border-b border-[#2b3547]">
                  <th className="pb-3 font-bold">الدرس</th>
                  <th className="pb-3 font-bold">المادة</th>
                  <th className="pb-3 font-bold">الدرجة</th>
                  <th className="pb-3 font-bold">التاريخ</th>
                  <th className="pb-3 font-bold">الوقت</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => {
                  const l = lessonById(db, a.lessonId);
                  const subj = subjectOfLesson(db, a.lessonId);
                  const p = Math.round((a.score / a.total) * 100);
                  return (
                    <tr key={a.id} className="border-b border-[#2b3547]/50 last:border-0">
                      <td className="py-3 font-bold">{l?.title ?? "—"}</td>
                      <td className="py-3 text-[#9297a6]">{subj?.name}</td>
                      <td className="py-3">
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full" style={{ background: `${tone(p)}18`, color: tone(p) }}>
                          {a.score}/{a.total} ({p}%)
                        </span>
                      </td>
                      <td className="py-3 text-[#9297a6] text-xs">{a.date}</td>
                      <td className="py-3 text-[#9297a6] text-xs" dir="ltr">{Math.floor(a.timeTakenSec / 60)}:{String(a.timeTakenSec % 60).padStart(2, "0")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DCard>
      </div>
    </AppShell>
  );
}
