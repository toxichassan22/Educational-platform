"use client";

import Link from "next/link";
import QShell, { QPageHead, QCard, QEmpty } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { attemptsOfUser, subjectOfLesson, lessonById, subjectsOfGrade } from "@/lib/data";
import { QC, qSubjectArt } from "@/lib/theme-q";

export default function Reports() {
  const { db, me } = useStore();
  if (!me) return <QShell role="student">{null}</QShell>;
  const attempts = attemptsOfUser(db, me.id);
  const subjects = subjectsOfGrade(db, me.gradeId);

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

  const tone = (v: number) => v >= 70 ? QC.success : v >= 50 ? QC.warning : QC.danger;

  return (
    <QShell role="student" title="تقاريري">
      <QPageHead sub="تحليل ذكي لمستواك في كل مادة ودرس">تقارير الأداء</QPageHead>

      {/* الملخص */}
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <QCard className="text-center">
          <div className="relative w-28 h-28 mx-auto mb-3">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke={QC.line} strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={tone(totalAvg)}
                strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(totalAvg / 100) * 264} 264`} className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[22px] font-extrabold" style={{ color: QC.ink }}>{totalAvg}%</div>
          </div>
          <div className="font-extrabold text-[14px]" style={{ color: QC.ink }}>معدلك العام</div>
          <div className="text-[11.5px] mt-1" style={{ color: QC.muted }}>عبر {perSubject.length} مواد مُختبَرة</div>
        </QCard>

        <QCard>
          <h3 className="font-extrabold text-[13px] mb-3 flex items-center gap-2" style={{ color: QC.success }}>
            <Icon name="award" size={16} /> نقاط القوة
          </h3>
          {strengths.length === 0 && <p className="text-[12px]" style={{ color: QC.muted }}>أدِّ مزيدًا من الاختبارات لاكتشاف نقاط قوتك</p>}
          <div className="space-y-2">
            {strengths.map((s) => (
              <div key={s.subject.id} className="flex items-center justify-between text-[13px]">
                <span className="font-bold" style={{ color: QC.ink }}>{s.subject.name}</span>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full" style={{ background: QC.successSoft, color: QC.success }}>{s.avg}%</span>
              </div>
            ))}
          </div>
        </QCard>

        <QCard>
          <h3 className="font-extrabold text-[13px] mb-3 flex items-center gap-2" style={{ color: QC.danger }}>
            <Icon name="target" size={16} /> تحتاج تركيزًا
          </h3>
          {weaknesses.length === 0 && <p className="text-[12px]" style={{ color: QC.muted }}>لا توجد مواد ضعيفة — استمر!</p>}
          <div className="space-y-2">
            {weaknesses.map((s) => (
              <div key={s.subject.id} className="flex items-center justify-between text-[13px]">
                <span className="font-bold" style={{ color: QC.ink }}>{s.subject.name}</span>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full" style={{ background: QC.dangerSoft, color: QC.danger }}>{s.avg}%</span>
              </div>
            ))}
          </div>
        </QCard>
      </div>

      {/* أداء المواد */}
      <QCard className="mb-5">
        <h2 className="font-extrabold text-[15px] mb-5" style={{ color: QC.ink }}>أدائك في كل مادة</h2>
        {perSubject.length === 0 && (
          <p className="text-[13px] text-center py-6" style={{ color: QC.muted }}>
            لم تُؤدِّ اختبارات بعد — <Link href="/student/browse" className="font-bold" style={{ color: QC.brand }}>ابدأ أول درس</Link>
          </p>
        )}
        <div className="space-y-4">
          {perSubject.map((s) => {
            const art = qSubjectArt(s.subject);
            return (
              <div key={s.subject.id} className="flex items-center gap-4">
                {art ? (
                  <img src={art} alt="" className="w-10 h-10 rounded-xl object-contain shrink-0" style={{ background: QC.bgSoft }} />
                ) : (
                  <div className="w-10 h-10 rounded-xl grid place-items-center shrink-0" style={{ background: `${s.subject.color}18`, color: s.subject.color }}>
                    <Icon name={s.subject.icon} size={18} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[13.5px]" style={{ color: QC.ink }}>{s.subject.name}</span>
                    <span className="text-[11px]" style={{ color: QC.muted }}>{s.count} اختبارًا · {s.lessons} دروس</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: QC.surfaceSoft }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.avg}%`, background: tone(s.avg) }} />
                    </div>
                    <span className="text-[13px] font-black w-10" style={{ color: tone(s.avg) }}>{s.avg}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </QCard>

      {/* سجل الاختبارات */}
      <QCard>
        <h2 className="font-extrabold text-[15px] mb-4" style={{ color: QC.ink }}>سجل الاختبارات</h2>
        {recent.length === 0 && <QEmpty title="لا توجد اختبارات بعد" />}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-right text-[11.5px] border-b" style={{ color: QC.muted, borderColor: QC.line }}>
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
                  <tr key={a.id} className="border-b last:border-0" style={{ borderColor: QC.line }}>
                    <td className="py-3 font-bold" style={{ color: QC.ink }}>{l?.title ?? "—"}</td>
                    <td className="py-3" style={{ color: QC.muted }}>{subj?.name}</td>
                    <td className="py-3">
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full" style={{ background: `${tone(p)}18`, color: tone(p) }}>
                        {a.score}/{a.total} ({p}%)
                      </span>
                    </td>
                    <td className="py-3 text-[11.5px]" style={{ color: QC.muted }}>{a.date}</td>
                    <td className="py-3 text-[11.5px]" style={{ color: QC.muted }} dir="ltr">{Math.floor(a.timeTakenSec / 60)}:{String(a.timeTakenSec % 60).padStart(2, "0")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </QCard>
    </QShell>
  );
}
