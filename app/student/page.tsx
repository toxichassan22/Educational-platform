"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { Card, Icon, Progress, Badge } from "@/components/ui";
import { gradeOf, stageOfGrade, subjectsOfGrade, unitsOfSubject, lessonsOfUnit, attemptsOfUser, activeSub, packageById, lessonById, subjectOfLesson, Lesson } from "@/lib/data";
import { stageTheme } from "@/lib/theme";

const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const CLASSMATES = [
  { name: "يوسف عبدالعزيز", xp: 1240 },
  { name: "جمانة النجدي", xp: 980 },
  { name: "سليم مسيكة", xp: 720 },
  { name: "فاطمة العنزي", xp: 460 },
  { name: "عبدالله المطيري", xp: 210 },
];

export default function StudentHome() {
  const { me, db } = useStore();
  if (!me) return <AppShell role="student">{null}</AppShell>;

  const grade = gradeOf(db, me.gradeId);
  const stage = stageOfGrade(db, me.gradeId);
  const theme = stageTheme(stage?.id);
  const subjects = subjectsOfGrade(db, me.gradeId);
  const myAttempts = attemptsOfUser(db, me.id);
  const sub = activeSub(db, me.id);
  const pkg = sub ? packageById(db, sub.packageId) : null;

  // ===== Gamification =====
  const xp = myAttempts.reduce((t, a) => t + a.score * 15, 0) + new Set(myAttempts.map((a) => a.lessonId)).size * 25;
  const level = Math.floor(xp / 300) + 1;
  const xpInLevel = xp % 300;
  const today = new Date().toISOString().slice(0, 10);
  const todayXP = myAttempts.filter((a) => a.date === today).reduce((t, a) => t + a.score * 15 + 25, 0);
  const dailyGoal = 100;

  // الستريك: أيام متتالية منتهية باليوم أو أمس
  const days = new Set(myAttempts.map((a) => a.date));
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (days.has(d)) streak++;
    else if (i > 0) break;
  }
  // آخر ٧ أيام
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    return { label: DAY_NAMES[d.getDay()], done: days.has(key), isToday: key === today };
  });

  // ===== كمّل من وقفت =====
  const attemptedIds = new Set(myAttempts.map((a) => a.lessonId));
  let continueLesson: Lesson | null = null;
  const lastAttempt = [...myAttempts].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (lastAttempt) {
    const lastLesson = lessonById(db, lastAttempt.lessonId);
    if (lastLesson) {
      const siblings = lessonsOfUnit(db, lastLesson.unitId);
      const next = siblings[siblings.findIndex((l) => l.id === lastLesson.id) + 1];
      continueLesson = next && !attemptedIds.has(next.id) ? next : null;
    }
  }
  if (!continueLesson) {
    outer: for (const s of subjects) {
      for (const u of unitsOfSubject(db, s.id)) {
        for (const l of lessonsOfUnit(db, u.id)) {
          if (!attemptedIds.has(l.id)) { continueLesson = l; break outer; }
        }
      }
    }
  }
  const contSubject = continueLesson ? subjectOfLesson(db, continueLesson.id) : null;

  // ===== ترتيب المتصدرين =====
  const board = [...CLASSMATES.map((c) => ({ ...c, me: false })), { name: me.name.split(" ")[0] + " (أنت)", xp, me: true }]
    .sort((a, b) => b.xp - a.xp);
  const myRank = board.findIndex((b) => b.me) + 1;

  // ===== الأوسمة =====
  const perfect = myAttempts.some((a) => a.score === a.total);
  const avg = myAttempts.length ? Math.round((myAttempts.reduce((s, a) => s + a.score / a.total, 0) / myAttempts.length) * 100) : 0;
  const medals = [
    { icon: "rocket", label: "أول خطوة", desc: "أكمل أول اختبار", got: myAttempts.length > 0 },
    { icon: "bolt", label: "قناص", desc: "نتيجة 100%", got: perfect },
    { icon: "flame", label: "مثابر", desc: "٣ أيام متتالية", got: streak >= 3 },
    { icon: "trophy", label: "ناجم", desc: "معدل 90%+", got: avg >= 90 },
    { icon: "target", label: "مكثّف", desc: "١٠ اختبارات", got: myAttempts.length >= 10 },
    { icon: "gem", label: "الأسطورة", desc: "المستوى ٥", got: level >= 5 },
  ];

  const lastAttempts = [...myAttempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const totalLessons = subjects.reduce((n, s) => n + unitsOfSubject(db, s.id).reduce((m, u) => m + lessonsOfUnit(db, u.id).length, 0), 0);
  const doneLessons = attemptedIds.size;
  const completion = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  return (
    <AppShell role="student">
      <div className="space-y-5 animate-fade-up">

        {/* ===== البطل: تحية + مستوى — لون مسطح واحد لمرحلته ===== */}
        <div className="rounded-3xl p-6 md:p-7 text-white relative overflow-hidden"
          style={{ background: theme.color }}>
          <div className="absolute top-4 left-4 md:left-8 flex items-center gap-1.5 text-[10px] font-black text-white/50">
            <span style={{ color: theme.accent }}><Icon name={theme.icon} size={12} /></span> {theme.title} · {stage?.name}
          </div>
          <div className="relative flex items-center gap-5 flex-wrap">
            {/* حلقة المستوى */}
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={theme.accent} strokeWidth="9" strokeLinecap="round"
                  strokeDasharray={`${(xpInLevel / 300) * 264} 264`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[9px] text-white/50 font-bold">مستوى</span>
                <span className="text-3xl font-black leading-none">{level}</span>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-2xl md:text-3xl font-black mb-1">هلا {me.name.split(" ")[0]}!</h1>
              <p className="text-white/60 text-sm mb-3">{grade?.name} · ترتيبك #{myRank} بين زمايلك</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/10 rounded-full px-3.5 py-1.5 text-xs font-black flex items-center gap-1.5">
                  <Icon name="flame" size={14} className="text-orange-400 animate-flame" /> {streak} أيام متتالية
                </span>
                <span className="bg-white/10 rounded-full px-3.5 py-1.5 text-xs font-black flex items-center gap-1.5">
                  <Icon name="bolt" size={14} className="text-gold-400" /> {xp} XP
                </span>
                <span className="bg-white/10 rounded-full px-3.5 py-1.5 text-xs font-black flex items-center gap-1.5">
                  <Icon name="chart" size={14} className="text-emerald-300" /> معدلك {avg}%
                </span>
              </div>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] text-white/50 font-bold mb-1">{xpInLevel}/300 XP للمستوى التالي</div>
              <div className="w-36 h-2 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(xpInLevel / 300) * 100}%`, background: theme.accent }} />
              </div>
            </div>
          </div>
        </div>

        {/* ===== وصول سريع: موادي بأسلوب علا (دوائر) ===== */}
        <div className="flex gap-4 overflow-x-auto pt-2 pb-2 px-1">
          {subjects.slice(0, 10).map((s, i) => {
            const lessons = unitsOfSubject(db, s.id).flatMap((u) => lessonsOfUnit(db, u.id));
            const done = lessons.filter((l) => attemptedIds.has(l.id)).length;
            const prog = lessons.length ? done / lessons.length : 0;
            return (
              <Link key={s.id} href={`/student/subject/${s.id}`} className="flex flex-col items-center gap-2 shrink-0 group">
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `${s.color}14`, color: s.color, border: `2px solid ${s.color}30` }}>
                  <Icon name={s.icon} size={26} />
                  {prog > 0 && (
                    <svg viewBox="0 0 64 64" className="absolute -inset-1 w-[72px] h-[72px] -rotate-90">
                      <circle cx="32" cy="32" r="30" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle cx="32" cy="32" r="30" fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${prog * 188.5} 188.5`} />
                    </svg>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-600 max-w-[70px] truncate">{s.name}</span>
              </Link>
            );
          })}
          <Link href="/student/browse" className="flex flex-col items-center gap-2 shrink-0 group">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-primary-400 group-hover:text-primary-500 transition-colors">
              <Icon name="grid" size={24} />
            </div>
            <span className="text-[11px] font-bold text-slate-400">كل المنهج</span>
          </Link>
        </div>

        {/* ===== كمّل من وقفت + هدف اليوم ===== */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* كمّل المذاكرة */}
          {continueLesson && contSubject ? (
            <Link href={`/student/lesson/${continueLesson.id}`} className="lg:col-span-2 block group">
              <div className="relative rounded-3xl p-6 md:p-7 text-white overflow-hidden h-full card-hover"
                style={{ background: contSubject.color }}>
                <div className="relative flex items-center gap-5">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon name="play" size={34} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-white/70 bg-white/15 inline-block px-2.5 py-1 rounded-full mb-2">كمّل من وقفت</div>
                    <h2 className="text-xl md:text-2xl font-black truncate">{continueLesson.title}</h2>
                    <div className="text-white/70 text-sm mt-1">{contSubject.name} · {continueLesson.durationMin} دقيقة · <span className="text-gold-300 font-bold">+{continueLesson.durationMin * 5} XP</span></div>
                  </div>
                  <div className="hidden sm:flex w-14 h-14 rounded-full bg-white text-night-900 items-center justify-center shadow-2xl group-hover:scale-110 transition-transform shrink-0">
                    <Icon name="back" size={22} className="rotate-180" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/student/browse" className="lg:col-span-2 block group">
              <div className="relative rounded-3xl p-6 md:p-7 text-white overflow-hidden h-full bg-night-900 card-hover">
                <div className="relative flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-gold-500/20 flex items-center justify-center"><Icon name="trophy" size={30} className="text-gold-400" /></div>
                  <div>
                    <h2 className="text-xl font-black">أنهيت كل الدروس المتاحة!</h2>
                    <p className="text-white/60 text-sm mt-1">تصفح صفوفًا أخرى أو راجع أخطاءك السابقة</p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* هدف اليوم */}
          <Card className="p-5 border border-slate-100 flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#eef2f7" strokeWidth="11" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#0e7490" strokeWidth="11" strokeLinecap="round"
                  strokeDasharray={`${Math.min(1, todayXP / dailyGoal) * 264} 264`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><Icon name="bolt" size={22} className="text-primary-600" /></div>
            </div>
            <div>
              <div className="font-black text-primary-950">هدف اليوم</div>
              <div className="text-xs text-slate-400 mt-0.5 mb-1.5">اكسب {dailyGoal} XP من الدروس والاختبارات</div>
              <div className="text-sm font-black text-primary-700">{todayXP}/{dailyGoal} XP {todayXP >= dailyGoal && <Badge tone="green">تم!</Badge>}</div>
            </div>
          </Card>
        </div>

        {/* ===== أسبوع الستريك + المتصدرون ===== */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* الستريك الأسبوعي */}
          <Card className="lg:col-span-3 p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-primary-950 flex items-center gap-2">
                <Icon name="flame" size={19} className="text-orange-500" /> سلسلة مذاكرتك
              </h2>
              <span className="text-xs font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full">{streak} أيام</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {week.map((d, i) => (
                <div key={i} className="text-center">
                  <div className={`h-11 rounded-2xl flex items-center justify-center mb-1.5 transition-all ${
                    d.done ? "bg-amber-500 text-white"
                    : d.isToday ? "border-2 border-dashed border-primary-300 text-primary-300"
                    : "bg-slate-100 text-slate-300"}`}>
                    {d.done ? <Icon name="check" size={17} /> : d.isToday ? <span className="text-lg">؟</span> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </div>
                  <div className={`text-[10px] font-bold ${d.isToday ? "text-primary-600" : "text-slate-400"}`}>{d.isToday ? "اليوم" : d.label.slice(0, 5)}</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">كل يوم مذاكرة = لهب أطول. لا تكسر السلسلة!</p>
          </Card>

          {/* المتصدرون */}
          <Card className="lg:col-span-2 p-5 border border-slate-100">
            <h2 className="font-black text-primary-950 flex items-center gap-2 mb-4">
              <Icon name="trophy" size={19} className="text-gold-500" /> متصدرو الأسبوع
            </h2>
            <div className="space-y-1.5">
              {board.slice(0, 5).map((c, i) => (
                <div key={c.name} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${c.me ? "bg-primary-50 border border-primary-200" : ""}`}>
                  <span className={`w-6 text-center text-sm font-black ${i === 0 ? "text-gold-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-slate-300"}`}>
                    {i + 1}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white ${c.me ? "bg-primary-600" : "bg-slate-300"}`}>
                    {c.name[0]}
                  </div>
                  <span className={`flex-1 text-sm truncate ${c.me ? "font-black text-primary-900" : "font-bold text-slate-600"}`}>{c.name}</span>
                  <span className="text-xs font-black text-slate-500" dir="ltr">{c.xp} XP</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ===== موادي ===== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-primary-950 text-lg flex items-center gap-2"><Icon name="gamepad" size={20} className="text-primary-600" /> موادي</h2>
            <Link href="/student/browse" className="text-primary-600 text-sm font-bold hover:underline">كل المواد ←</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.slice(0, 8).map((s, i) => {
              const units = unitsOfSubject(db, s.id);
              const lessons = units.flatMap((u) => lessonsOfUnit(db, u.id));
              const done = lessons.filter((l) => attemptedIds.has(l.id)).length;
              const prog = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
              return (
                <Link key={s.id} href={`/student/subject/${s.id}`} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="bg-white rounded-2xl p-4 h-full border border-slate-200 card-hover">
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}14`, color: s.color }}>
                        <Icon name={s.icon} size={22} />
                      </div>
                      {prog > 0 && <span className="text-[10px] font-black px-2 py-1 rounded-full" style={{ background: `${s.color}14`, color: s.color }}>{done}/{lessons.length}</span>}
                    </div>
                    <div className="font-black text-[15px] text-primary-950 leading-tight">{s.name}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5 mb-3">{s.teacher}</div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${prog}%`, background: s.color }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ===== الأوسمة + آخر الاختبارات ===== */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-5 border border-slate-100">
            <h2 className="font-black text-primary-950 mb-4 flex items-center gap-2"><Icon name="award" size={19} className="text-violet-500" /> أوسمتك</h2>
            <div className="grid grid-cols-3 gap-3">
              {medals.map((m) => (
                <div key={m.label} className={`rounded-2xl p-3.5 text-center transition-all ${m.got ? "bg-primary-50 border border-primary-100" : "bg-slate-50 opacity-50 grayscale"}`}>
                  <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2 ${m.got ? "bg-primary-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                    <Icon name={m.got ? m.icon : "lock"} size={18} />
                  </div>
                  <div className={`text-xs font-black ${m.got ? "text-primary-900" : "text-slate-400"}`}>{m.label}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">{m.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-primary-950 flex items-center gap-2"><Icon name="clock" size={18} className="text-primary-500" /> آخر اختباراتي</h2>
              <Link href="/student/reports" className="text-primary-600 text-xs font-bold hover:underline">التقرير الكامل ←</Link>
            </div>
            {lastAttempts.length === 0 && <p className="text-sm text-slate-400 py-6 text-center">لم تؤدِ أي اختبار بعد — أول اختبار يفتح وسام «أول خطوة»!</p>}
            <div className="space-y-3">
              {lastAttempts.map((a) => {
                const l = lessonById(db, a.lessonId);
                const subj = subjectOfLesson(db, a.lessonId);
                const pct = Math.round((a.score / a.total) * 100);
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm text-white ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500"}`}>
                      {pct}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-primary-950 truncate">{l?.title ?? "درس محذوف"}</div>
                      <div className="text-[11px] text-slate-400">{subj?.name} · {a.date === today ? "اليوم" : a.date}</div>
                    </div>
                    <Link href={`/student/exam/${a.lessonId}`} className="text-primary-600 text-xs font-bold bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors shrink-0">إعادة</Link>
                  </div>
                );
              })}
            </div>
            {/* شريط إنجاز المنهج */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-500">إنجاز منهج {grade?.name}</span>
                <span className="font-black text-primary-700">{completion}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-primary-600 transition-all duration-1000" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </Card>
        </div>

        {/* شريط الاشتراك — صغير */}
        {!pkg && (
          <Link href="/student/subscription" className="block">
            <div className="rounded-3xl p-5 bg-night-900 flex items-center gap-4 card-hover">
              <div className="w-11 h-11 rounded-xl bg-gold-500/15 flex items-center justify-center shrink-0"><Icon name="gem" size={21} className="text-gold-400" /></div>
              <div className="flex-1">
                <div className="font-black text-white text-sm">فعّل اشتراكك الكامل</div>
                <div className="text-white/55 text-xs">افتح كل المواد والاختبارات غير المحدودة</div>
              </div>
              <div className="bg-gold-500 text-night-950 text-xs font-black px-4 py-2 rounded-xl shrink-0">الباقات ←</div>
            </div>
          </Link>
        )}
      </div>
    </AppShell>
  );
}
