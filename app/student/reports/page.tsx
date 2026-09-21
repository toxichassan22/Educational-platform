"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Progress, Badge } from "@/components/ui";
import { attemptsOfUser, subjectOfLesson, lessonById, subjectsOfGrade } from "@/lib/data";

export default function Reports() {
  const { db, me } = useStore();
  if (!me) return <AppShell role="student">{null}</AppShell>;
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

  return (
    <AppShell role="student">
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900">تقارير الأداء</h1>
          <p className="text-slate-400 text-sm">تحليل ذكي لمستواك في كل مادة ودرس</p>
        </div>

        {/* الملخص */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 text-center border border-slate-100">
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={totalAvg >= 70 ? "#059669" : totalAvg >= 50 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(totalAvg / 100) * 264} 264`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-primary-900">{totalAvg}%</div>
            </div>
            <div className="font-bold text-primary-900">معدلك العام</div>
            <div className="text-xs text-slate-400 mt-1">عبر {perSubject.length} مواد مُختبَرة</div>
          </Card>

          <Card className="p-5 border border-slate-100">
            <h3 className="font-extrabold text-emerald-600 text-sm mb-3 flex items-center gap-2"><Icon name="award" size={16} /> نقاط القوة</h3>
            {strengths.length === 0 && <p className="text-xs text-slate-400">أدِّ مزيدًا من الاختبارات لاكتشاف نقاط قوتك</p>}
            <div className="space-y-2">
              {strengths.map((s) => (
                <div key={s.subject.id} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700">{s.subject.name}</span>
                  <Badge tone="green">{s.avg}%</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border border-slate-100">
            <h3 className="font-extrabold text-red-500 text-sm mb-3 flex items-center gap-2"><Icon name="target" size={16} /> تحتاج تركيزًا</h3>
            {weaknesses.length === 0 && <p className="text-xs text-slate-400">لا توجد مواد ضعيفة — استمر!</p>}
            <div className="space-y-2">
              {weaknesses.map((s) => (
                <div key={s.subject.id} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700">{s.subject.name}</span>
                  <Badge tone="red">{s.avg}%</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* أداء المواد */}
        <Card className="p-6 border border-slate-100">
          <h2 className="font-extrabold text-primary-900 mb-5">أدائك في كل مادة</h2>
          <div className="space-y-4">
            {perSubject.length === 0 && <p className="text-sm text-slate-400 text-center py-6">لم تُؤدِّ اختبارات بعد — <Link href="/student/browse" className="text-primary-600 font-bold">ابدأ أول درس</Link></p>}
            {perSubject.map((s) => (
              <div key={s.subject.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.subject.color}15`, color: s.subject.color }}>
                  <Icon name={s.subject.icon} size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-primary-900">{s.subject.name}</span>
                    <span className="text-xs text-slate-400">{s.count} اختبارًا · {s.lessons} دروس</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={s.avg} color={s.avg >= 70 ? "#059669" : s.avg >= 50 ? "#f59e0b" : "#ef4444"} h={9} />
                    <span className="text-sm font-extrabold text-primary-800 w-10">{s.avg}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* سجل الاختبارات */}
        <Card className="p-6 border border-slate-100">
          <h2 className="font-extrabold text-primary-900 mb-4">سجل الاختبارات</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
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
                  const pct = Math.round((a.score / a.total) * 100);
                  return (
                    <tr key={a.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 font-bold text-primary-900">{l?.title ?? "—"}</td>
                      <td className="py-3 text-slate-500">{subj?.name}</td>
                      <td className="py-3"><Badge tone={pct >= 80 ? "green" : pct >= 50 ? "amber" : "red"}>{a.score}/{a.total} ({pct}%)</Badge></td>
                      <td className="py-3 text-slate-400 text-xs">{a.date}</td>
                      <td className="py-3 text-slate-400 text-xs" dir="ltr">{Math.floor(a.timeTakenSec / 60)}:{String(a.timeTakenSec % 60).padStart(2, "0")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
