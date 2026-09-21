"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Icon, Logo } from "@/components/ui";

/* ===================== محتوى الصفحة ===================== */

const AWARDS = [
  { icon: "laurel", label: "الطلبة الأوائل" },
  { icon: "laurel", label: "أقوى المذكرات" },
  { icon: "star", label: "4.9/5 تقييم الطلاب" },
  { icon: "laurel", label: "نخبة المعلمين" },
  { icon: "laurel", label: "دعم أولياء الأمور" },
];

const TOP_STUDENTS = [
  {
    pct: "100%", name: "أحمد الكندري", rank: "الأول على الكويت — علمي", initial: "أ",
    quote: "تفوّق خلّتني أذاكر بأي وقت وأي مكان — ما عدت مرتبط بوقت مدرس، وهذا اللي فرق معي.",
  },
  {
    pct: "100%", name: "عبدالله المطيري", rank: "الأول على الكويت — علمي", initial: "ع",
    quote: "أفضل شي الفيديوهات من مدرسين خبراء — نظمت وقت دراستي على نمط حياتي، أذاكر ٢٤ ساعة متى ما أبي.",
  },
  {
    pct: "99.9%", name: "سارة الكندري", rank: "الثاني على الكويتيين — علمي", initial: "س",
    quote: "أحلى ميزة إني أعيد الفيديو وأتحكم بسرعته، والاختبارات الذكية ورّتني نقاط ضعفي بالضبط.",
  },
];

const FEATURES: {
  id: string; title: string; desc: string; art: "notes" | "video" | "quiz" | "chat" | "box";
}[] = [
  { id: "notes", title: "مذكرات شاملة", desc: "أقوى مذكرات بالكويت تغطي منهجك بالكامل وتغنيك عن كل المصادر الأخرى", art: "notes" },
  { id: "video", title: "فيديوهات شرح مميزة", desc: "فيديوهات مسجلة تشرح لك المذكرة بالكامل — تقدر تعيدها في أي وقت، كثر ما تبي", art: "video" },
  { id: "quiz", title: "اختبارات ذكية", desc: "ثبّت معلوماتك واستعد لاختباراتك مع اختبارات تفوّق الذكية المبنية على اختبارات سابقة وتعالج نقاط ضعفك", art: "quiz" },
  { id: "chat", title: "نخبة المعلمين معاك", desc: "تابع أقوى المعلمين اللي يشرحون لك كل المواد ويجاوبون أسئلتك ويفهمونك", art: "chat" },
  { id: "box", title: "وفّر أكثر مع باقات تفوّق", desc: "اشتراك واحد يفتح جميع مواد مرحلتك بسعر خيالي! وفّر لغاية 80%", art: "box" },
];

/* نقاط نجوم ثابتة للهيرو */
const STARS: [number, number, number][] = [
  [6, 12, 3], [12, 40, 2], [4, 62, 3], [18, 80, 2], [30, 8, 2], [46, 18, 3],
  [55, 75, 2], [70, 10, 3], [82, 30, 2], [90, 60, 3], [94, 15, 2], [62, 88, 2],
  [36, 55, 2], [25, 90, 3], [78, 85, 2], [10, 28, 2],
];

export default function Landing() {
  const { db } = useStore();
  const [openStudent, setOpenStudent] = useState<number | null>(null);

  /* ظهور العناصر عند التمرير */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("on")),
      { threshold: 0.18 }
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-night-950 text-white overflow-x-clip">
      {/* ===================== الهيدر ===================== */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 h-[74px] flex items-center justify-between">
          <Logo size={40} light />
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="#packages" className="hidden sm:block text-sm font-black text-white/85 hover:text-white transition-colors">العروض</a>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-4 py-2">
              <KuwaitFlag />
              <span className="text-xs font-bold text-white/85">الكويت</span>
            </div>
            <Link href="/login"
              className="group flex items-center gap-2 rounded-full border-2 border-primary-400/70 text-white px-5 py-2 text-sm font-black hover:bg-primary-500/15 transition-colors">
              <Icon name="back" size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              ادخل
            </Link>
          </div>
        </div>
      </header>

      {/* ===================== الهيرو ===================== */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* نجوم */}
        {STARS.map(([x, y, s], i) => (
          <span key={i} className="star-dot" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, ["--d" as string]: `${2.6 + (i % 5) * 0.9}s`, ["--dl" as string]: `${(i % 7) * 0.6}s` }} />
        ))}

        <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-8 flex-1 grid lg:grid-cols-2 items-center gap-10 pt-28 pb-16">
          {/* النص */}
          <div className="relative z-10 text-center lg:text-right">
            <h1 className="rv font-black leading-[1.12] text-[2.6rem] sm:text-6xl xl:text-[4rem]">
              كل اللي تحتاجه
              <br />
              <span className="text-white/40">للتفوّق</span> بمكان واحد
            </h1>
            <p className="rv mt-6 text-white/65 text-lg sm:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 lg:ml-auto" style={{ "--rvd": "120ms" } as React.CSSProperties}>
              ارفع درجاتك مع مذكرات تفوّق الشاملة وفيديوهاتها المميزة واختباراتها الذكية
            </p>
            <div className="rv mt-9" style={{ "--rvd": "220ms" } as React.CSSProperties}>
              <Link href="/login"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-night-950 font-black text-base sm:text-lg px-9 py-4 rounded-full transition-all hover:scale-[1.03] shadow-xl shadow-gold-500/25">
                استكشف المواد
              </Link>
            </div>
            <div className="rv mt-7 flex items-center justify-center lg:justify-end gap-2 text-white/55 text-sm font-bold" style={{ "--rvd": "300ms" } as React.CSSProperties}>
              <Icon name="medal" size={18} className="text-gold-400" />
              الخيار الأول لطلاب الكويت
            </div>
          </div>

          {/* الكوكب والطالب المتفوق */}
          <div className="relative flex items-center justify-center min-h-[340px] sm:min-h-[420px] lg:min-h-[540px]">
            <div className="absolute font-black text-white/95 select-none leading-none -top-2 sm:top-0 left-2 sm:left-6 text-[6.5rem] sm:text-[9rem] lg:text-[11rem] tracking-tight z-20 pointer-events-none" style={{ textShadow: "0 10px 40px rgba(6,11,29,.6)" }}>
              100<span className="text-[0.55em]">%</span>
            </div>
            {/* الكوكب */}
            <div className="relative w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px]">
              <div className="orb-glow absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 38% 30%, #22d3ee 0%, #0891b2 42%, #0e7490 68%, #155e75 100%)" }} />
              {/* حلقة المدار */}
              <svg viewBox="0 0 100 100" className="orbit-ring absolute -inset-8 sm:-inset-12 w-[calc(100%+4rem)] sm:w-[calc(100%+6rem)] h-[calc(100%+4rem)] sm:h-[calc(100%+6rem)] opacity-70">
                <ellipse cx="50" cy="50" rx="49" ry="34" fill="none" stroke="rgba(251,191,36,.5)" strokeWidth=".45" strokeDasharray="2.5 3" transform="rotate(-18 50 50)" />
              </svg>
              {/* الطالب */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center z-10">
                <div className="animate-bob flex flex-col items-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 border-4 border-white/90 shadow-2xl flex items-center justify-center text-night-950 font-black text-4xl sm:text-5xl">
                    أ
                  </div>
                  <div className="mt-3 bg-night-950/85 backdrop-blur rounded-2xl px-5 py-2.5 text-center border border-white/15 shadow-xl">
                    <div className="font-black text-sm sm:text-base">أحمد الكندري</div>
                    <div className="text-white/55 text-[11px] font-bold mt-0.5">الأول على الكويت — علمي</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* مؤشر التمرير */}
        <div className="relative z-10 pb-8 flex justify-center">
          <Icon name="down" size={22} className="text-white/60 animate-scroll-hint" />
        </div>
      </section>

      {/* ===================== شريط الإنجازات ===================== */}
      <section className="py-14 sm:py-20">
        <h2 className="rv text-center text-3xl sm:text-5xl font-black text-white/25 mb-10 sm:mb-14 px-4">سنوات من الإنجازات والتفوق</h2>
        <div className="ticker-mask overflow-hidden" dir="ltr">
          <div className="flex w-max animate-marquee" style={{ direction: "ltr" }}>
            {[0, 1].map((k) => (
              <div key={k} className="flex items-center gap-14 sm:gap-24 px-7 sm:px-12">
                {AWARDS.map((a) => (
                  <div key={a.label} className="flex flex-col items-center gap-3 shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/15 bg-white/[.04] flex items-center justify-center text-white/50">
                      <Icon name={a.icon} size={a.icon === "star" ? 26 : 34} filled={a.icon === "star"} />
                    </div>
                    <span className="text-white/60 text-sm sm:text-base font-bold whitespace-nowrap">{a.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ادرس وأنت مرتاح ===================== */}
      <section className="px-3 sm:px-6">
        <div className="rounded-t-[2.5rem] sm:rounded-t-[3.5rem] py-16 sm:py-24 text-center relative overflow-hidden" style={{ background: "linear-gradient(170deg, #0891b2 0%, #0e7490 55%, #155e75 100%)" }}>
          {/* قرص الدفعات */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 mx-auto mb-10">
            <div className="pie-spin absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="absolute inset-0" style={{ transform: `rotate(${i * 45}deg)` }}>
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 origin-[50%_100%]" style={{ height: "50%" }}>
                    <div className="wedge-in rounded-t-full border-2 border-white/25"
                      style={{
                        width: 96, height: 96, transformOrigin: "50% 100%",
                        background: i % 2 ? "rgba(251,191,36,.92)" : "rgba(255,255,255,.95)",
                        clipPath: "polygon(50% 100%, 8% 0, 92% 0)",
                        animationDelay: `${i * 90}ms`,
                      }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-700 border-4 border-white/90 shadow-xl flex items-center justify-center text-white">
                <Icon name="book" size={26} />
              </div>
            </div>
          </div>
          <h2 className="rv text-3xl sm:text-5xl font-black">ادرس وأنت مرتاح</h2>
          <p className="rv mt-4 text-white/80 font-bold text-base sm:text-xl max-w-2xl mx-auto px-4" style={{ "--rvd": "120ms" } as React.CSSProperties}>
            مرتبين لك منهجك بطريقة سهلة عشان تدرس المادة على دفعات وأنت مرتاح!
          </p>
        </div>
      </section>

      {/* ===================== أقسام المميزات ===================== */}
      <div className="px-3 sm:px-6 pb-6 space-y-6">
        {FEATURES.map((f, i) => (
          <section key={f.id} id={f.id === "box" ? "packages" : undefined}
            className="rv rounded-[2rem] sm:rounded-[2.75rem] bg-night-900 border border-white/[.06] overflow-hidden">
            <div className="mx-auto max-w-6xl px-6 sm:px-12 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
              {/* النص — يتناوب يمين/يسار مثل UULA */}
              <div className={`text-center ${i % 2 === 0 ? "lg:text-left lg:order-2" : "lg:text-right lg:order-1"}`}>
                <h2 className="text-3xl sm:text-5xl font-black mb-5">{f.title}</h2>
                <p className="text-white/60 font-bold text-base sm:text-xl leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">{f.desc}</p>
                <Link href="/login"
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-black text-sm sm:text-base px-8 py-3.5 rounded-full transition-all hover:scale-[1.04] shadow-lg shadow-primary-500/30">
                  استكشف المواد
                </Link>
              </div>
              {/* الرسمة */}
              <div className={`flex items-center justify-center min-h-[260px] sm:min-h-[340px] ${i % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                <FeatureArt kind={f.art} subjects={db.subjects} />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ===================== نجاحكم نجاحنا ===================== */}
      <section id="top-students" className="px-3 sm:px-6 pb-6">
        <div className="rounded-[2rem] sm:rounded-[2.75rem] bg-night-900 border border-white/[.06] py-14 sm:py-20 px-6">
          <h2 className="rv text-center text-3xl sm:text-5xl font-black mb-12">نجاحكم نجاحنا</h2>
          <div className="mx-auto max-w-6xl grid sm:grid-cols-3 gap-5">
            {TOP_STUDENTS.map((s, i) => {
              const open = openStudent === i;
              return (
                <button key={s.name} onClick={() => setOpenStudent(open ? null : i)}
                  className="rv group relative rounded-[1.75rem] overflow-hidden text-right transition-transform hover:-translate-y-2 duration-300"
                  style={{ background: "linear-gradient(165deg, #155e75 0%, #0c3a52 45%, #07182c 100%)", "--rvd": `${i * 110}ms` } as React.CSSProperties}>
                  <div className="stars-bg absolute inset-0" />
                  <div className="relative p-6 pb-0">
                    <div className="pct-shine font-black text-5xl sm:text-6xl text-gold-grad leading-none mb-5" dir="ltr">{s.pct}</div>
                    <div className="flex justify-center">
                      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-t-full bg-gradient-to-b from-white/20 to-white/[.03] border border-white/15 border-b-0 flex items-end justify-center overflow-hidden">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 flex items-center justify-center text-night-950 font-black text-4xl translate-y-4">
                          {s.initial}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative p-6 pt-4 text-center">
                    <div className="font-black text-lg">{s.name}</div>
                    <div className="text-white/55 text-xs font-bold mt-1">{s.rank}</div>
                    <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                      <p className="overflow-hidden text-white/75 text-sm leading-relaxed font-medium">«{s.quote}»</p>
                    </div>
                    <div className="mt-4 text-[11px] font-black text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {open ? "اضغط للإخفاء" : "اضغط لقراءة القصة"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="rv text-center mt-10">
            <Link href="/login" className="inline-block bg-primary-500 hover:bg-primary-400 text-white font-black text-sm sm:text-base px-10 py-3.5 rounded-full transition-all hover:scale-[1.04] shadow-lg shadow-primary-500/30">
              أرني المزيد
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== الفوتر ===================== */}
      <footer className="px-3 sm:px-6 pb-6">
        <div className="rounded-[2rem] sm:rounded-[2.75rem] bg-night-900 border border-white/[.06] px-8 sm:px-14 py-12">
          <div className="flex flex-col lg:flex-row justify-between gap-10">
            {/* روابط */}
            <div className="flex gap-16 sm:gap-24 order-2 lg:order-1">
              <div>
                <div className="text-white/40 text-sm font-bold mb-4">المنصة</div>
                <div className="space-y-3 flex flex-col items-start">
                  <a href="#top-students" className="font-black text-sm hover:text-primary-300 transition-colors">الطلبة الأوائل</a>
                  <a href="#packages" className="font-black text-sm hover:text-primary-300 transition-colors">العروض</a>
                  <Link href="/login" className="font-black text-sm hover:text-primary-300 transition-colors">أولياء الأمور</Link>
                </div>
              </div>
              <div>
                <div className="text-white/40 text-sm font-bold mb-4">تواصل معنا</div>
                <div className="space-y-3 flex flex-col items-start">
                  <button className="font-black text-sm hover:text-primary-300 transition-colors">محادثة أونلاين</button>
                  <span className="font-black text-sm text-white/85">واتساب</span>
                </div>
              </div>
            </div>
            {/* سوشال + المتاجر */}
            <div className="order-1 lg:order-2 flex flex-col items-start gap-6">
              <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5">
                <span className="text-white/45 text-[11px] font-bold">الدولة</span>
                <KuwaitFlag />
                <span className="text-xs font-bold">الكويت</span>
                <Icon name="down" size={13} className="text-white/40" />
              </div>
              <div className="flex items-center gap-3">
                {["fb", "xlogo", "yt", "ig"].map((s) => (
                  <span key={s} className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white/80 cursor-pointer">
                    <Icon name={s} size={18} filled={s !== "ig"} />
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <StoreBadge icon="gplay" top="GET IT ON" bottom="Google Play" />
                <StoreBadge icon="apple" top="Download on the" bottom="App Store" />
              </div>
            </div>
          </div>
          {/* الشريط السفلي */}
          <div className="mt-10 pt-7 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white/45 text-xs font-bold text-center sm:text-right">
              تفوّق شركة كويتية مقرها في مدينة الكويت. <span className="text-white/60">شروط</span> • <span className="text-white/60">الخصوصية</span>
              <div className="mt-1.5 text-white/35">تفوّق © جميع الحقوق محفوظة 2026</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-black text-white/70">KNET</span>
              <span className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-black text-white/70">Apple Pay</span>
            </div>
          </div>
        </div>
      </footer>

      {/* زر المحادثة العائم */}
      <button className="fixed bottom-5 left-5 z-50 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-primary-500 hover:bg-primary-400 shadow-2xl shadow-primary-500/40 flex items-center justify-center text-white transition-transform hover:scale-110" aria-label="محادثة">
        <Icon name="chat" size={24} filled />
      </button>
    </div>
  );
}

/* ===================== عناصر مساعدة ===================== */

function KuwaitFlag() {
  return (
    <span className="inline-block w-6 h-4 rounded-[3px] overflow-hidden relative shrink-0" dir="ltr">
      <span className="absolute inset-x-0 top-0 h-1/3 bg-[#007a3d]" />
      <span className="absolute inset-x-0 top-1/3 h-1/3 bg-white" />
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[#ce1126]" />
      <span className="absolute left-0 top-0 bottom-0 w-[38%] bg-black" style={{ clipPath: "polygon(0 0, 100% 33%, 100% 67%, 0 100%)" }} />
    </span>
  );
}

function StoreBadge({ icon, top, bottom }: { icon: string; top: string; bottom: string }) {
  return (
    <span className="flex items-center gap-2.5 rounded-xl border border-white/25 px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer" dir="ltr">
      <Icon name={icon} size={22} filled />
      <span className="leading-tight text-left">
        <span className="block text-[8px] font-bold text-white/60 tracking-wide">{top}</span>
        <span className="block text-sm font-black">{bottom}</span>
      </span>
    </span>
  );
}

/* ===================== رسومات الأقسام (CSS/SVG بدل الصور) ===================== */

function FeatureArt({ kind, subjects }: { kind: string; subjects: { name: string; color: string; icon: string }[] }) {
  switch (kind) {
    case "notes": return <NotesArt />;
    case "video": return <VideoArt />;
    case "quiz": return <QuizArt />;
    case "chat": return <ChatArt />;
    case "box": return <BoxArt subjects={subjects} />;
    default: return null;
  }
}

/* مذكرات: كتاب مفتوح + جوال QR */
function NotesArt() {
  return (
    <div className="relative animate-bob">
      {/* كتاب مفتوح */}
      <div className="flex w-[280px] sm:w-[360px] drop-shadow-2xl" style={{ perspective: 600 }}>
        <div className="flex-1 bg-white rounded-r-2xl rounded-l-md p-4 space-y-2.5 border-r-4 border-slate-200" style={{ transform: "rotateY(14deg)", transformOrigin: "left" }}>
          {[70, 90, 55, 80, 65].map((w, i) => <div key={i} className="h-2 rounded-full bg-slate-200" style={{ width: `${w}%` }} />)}
          <div className="h-16 rounded-lg bg-primary-100 flex items-center justify-center text-primary-500"><Icon name="chart" size={26} /></div>
        </div>
        <div className="flex-1 bg-slate-50 rounded-l-2xl rounded-r-md p-4 space-y-2.5" style={{ transform: "rotateY(-14deg)", transformOrigin: "right" }}>
          {[85, 60, 75, 50, 88].map((w, i) => <div key={i} className="h-2 rounded-full bg-slate-200" style={{ width: `${w}%`, marginInlineStart: "auto" }} />)}
          <div className="h-16 rounded-lg bg-gold-400/20 flex items-center justify-center text-gold-600"><Icon name="atom" size={26} /></div>
        </div>
      </div>
      {/* جوال بـ QR */}
      <div className="absolute -bottom-10 -right-4 sm:-right-8 w-24 sm:w-28 rounded-[1.4rem] bg-night-950 border-2 border-white/15 p-2.5 shadow-2xl drift" style={{ "--r": "-8deg", "--d": "5.5s" } as React.CSSProperties}>
        <div className="rounded-xl bg-white p-2 grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={`aspect-square rounded-[2px] ${[0, 1, 4, 5, 2, 8, 11, 13, 14, 15, 6, 9].includes(i) ? "bg-night-950" : "bg-slate-200"}`} />
          ))}
        </div>
        <div className="mt-2 h-1.5 w-8 mx-auto rounded-full bg-white/20" />
      </div>
      {/* شارة PDF */}
      <div className="absolute -top-5 -left-3 rounded-xl bg-gold-500 text-night-950 text-[11px] font-black px-3 py-2 shadow-xl drift" style={{ "--r": "6deg", "--d": "4.5s", "--dl": "-2s" } as React.CSSProperties}>
        PDF
      </div>
    </div>
  );
}

/* فيديوهات: مشغل فيديو */
function VideoArt() {
  return (
    <div className="relative">
      {/* شمس وقمر عائمان */}
      <div className="absolute -top-8 right-6 w-12 h-12 rounded-full bg-gold-400 shadow-[0_0_40px_rgba(251,191,36,.5)] drift" style={{ "--d": "5s" } as React.CSSProperties} />
      <div className="absolute -top-4 left-8 w-9 h-9 rounded-full bg-primary-300 drift" style={{ clipPath: "circle(50%)", "--d": "6.5s", "--dl": "-3s" } as React.CSSProperties} />
      <div className="absolute -top-4 left-8 w-9 h-9 rounded-full bg-night-900 translate-x-2 -translate-y-1 drift" style={{ "--d": "6.5s", "--dl": "-3s" } as React.CSSProperties} />
      {/* التابلت */}
      <div className="animate-bob w-[300px] sm:w-[400px] rounded-2xl bg-night-950 border-2 border-white/15 p-3 shadow-2xl">
        <div className="rounded-xl overflow-hidden relative aspect-video" style={{ background: "linear-gradient(140deg,#155e75,#0891b2)" }}>
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center text-primary-700 shadow-xl">
              <Icon name="play" size={24} filled />
            </div>
          </div>
          <div className="absolute bottom-2.5 inset-x-3 flex items-center gap-2" dir="ltr">
            <span className="text-[9px] font-bold text-white/80">07:14</span>
            <div className="flex-1 h-1 rounded-full bg-white/25"><div className="h-full w-[58%] rounded-full bg-gold-400" /></div>
            <span className="text-[9px] font-bold text-white/80">12:30</span>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 rounded-lg bg-white/[.06] p-1.5">
              <div className="h-8 rounded-md bg-white/10 mb-1.5" />
              <div className="h-1.5 rounded-full bg-white/15 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* اختبارات: جوال كويز + كونفيتي */
function QuizArt() {
  const confetti = [
    { x: -38, y: -30, c: "#f43f5e", r: "18deg", d: "4.6s" }, { x: 30, y: -46, c: "#fbbf24", r: "-14deg", d: "5.4s" },
    { x: 285, y: -20, c: "#22d3ee", r: "24deg", d: "5s" }, { x: -30, y: 190, c: "#a78bfa", r: "-20deg", d: "6s" },
    { x: 300, y: 200, c: "#34d399", r: "10deg", d: "4.2s" }, { x: 140, y: -55, c: "#fb923c", r: "0deg", d: "5.8s" },
  ];
  return (
    <div className="relative">
      {confetti.map((c, i) => (
        <div key={i} className="absolute w-4 h-4 rounded-md drift" style={{ left: c.x, top: c.y, background: c.c, "--r": c.r, "--d": c.d } as React.CSSProperties} />
      ))}
      <div className="animate-bob w-56 sm:w-64 rounded-[2rem] bg-night-950 border-2 border-white/15 p-4 shadow-2xl">
        <div className="flex justify-center gap-1.5 mb-4" dir="ltr">
          {[1, 1, 1, 1, 0, 0, 0].map((v, i) => (
            <div key={i} className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center ${v ? "bg-emerald-400 text-night-950" : "bg-white/10 text-white/50"}`}>{i + 1}</div>
          ))}
        </div>
        <div className="rounded-xl bg-white/[.07] p-3.5 mb-3">
          <div className="h-2.5 rounded-full bg-white/25 w-4/5 mb-2" />
          <div className="h-2.5 rounded-full bg-white/15 w-3/5" />
        </div>
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`rounded-lg px-3 py-2.5 text-[10px] font-black flex items-center justify-between ${i === 1 ? "bg-primary-500 text-white" : "bg-white/[.06] text-white/60"}`}>
              <div className="h-1.5 rounded-full bg-current opacity-60" style={{ width: `${60 - i * 12}%` }} />
              {i === 1 && <Icon name="check" size={12} />}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-black text-gold-400" dir="ltr">10:05</span>
          <span className="rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black px-3 py-1" dir="ltr">100%</span>
        </div>
      </div>
    </div>
  );
}

/* معلمين: فقاعات محادثة */
function ChatArt() {
  const bubbles = [
    { w: "w-40", me: false, lines: [85, 60] }, { w: "w-48", me: true, lines: [90, 70, 45] },
    { w: "w-36", me: false, lines: [75, 50] }, { w: "w-44", me: true, lines: [80, 55] },
  ];
  return (
    <div className="relative">
      <div className="absolute -top-6 -right-8 w-16 h-12 rounded-2xl bg-white/[.07] drift" style={{ "--r": "-10deg", "--d": "5s", clipPath: "polygon(0 0,100% 0,100% 78%,38% 78%,22% 100%,26% 78%,0 78%)" } as React.CSSProperties} />
      <div className="absolute -bottom-4 -left-8 w-14 h-11 rounded-2xl bg-gold-500/25 drift" style={{ "--r": "12deg", "--d": "6s", clipPath: "polygon(0 0,100% 0,100% 76%,70% 76%,82% 100%,76% 76%,0 76%)" } as React.CSSProperties} />
      <div className="animate-bob w-60 sm:w-72 rounded-[2rem] bg-night-950 border-2 border-white/15 p-4 shadow-2xl space-y-3">
        {bubbles.map((b, i) => (
          <div key={i} className={`${b.w} max-w-full rounded-2xl p-3 space-y-1.5 ${b.me ? "bg-primary-600/80 mr-auto rounded-bl-md" : "bg-white/10 ml-auto rounded-br-md"}`}>
            {b.lines.map((w, j) => (
              <div key={j} className={`h-2 rounded-full ${b.me ? "bg-white/50" : "bg-white/30"}`} style={{ width: `${w}%` }} />
            ))}
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 flex items-center justify-center text-night-950 font-black text-sm shrink-0">م</div>
          <div className="rounded-xl bg-white/10 px-3 py-2 flex gap-1">
            {[0, 1, 2].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60 star-dot" style={{ ["--d" as string]: "1.2s", ["--dl" as string]: `${i * 0.25}s`, position: "relative" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* باقات: صندوق أيقونات المواد */
function BoxArt({ subjects }: { subjects: { name: string; color: string; icon: string }[] }) {
  const chips = subjects.slice(0, 12);
  return (
    <div className="relative">
      <div className="animate-bob rounded-[2rem] bg-gradient-to-b from-white/10 to-white/[.03] border border-white/15 p-5 sm:p-7 shadow-2xl">
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {chips.map((s, i) => (
            <div key={`${s.name}-${i}`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center drift"
              style={{ background: `${s.color}26`, color: s.color, border: `1.5px solid ${s.color}55`, "--d": `${4.5 + (i % 4)}s`, "--dl": `${-(i % 5)}s`, "--r": `${(i % 3 - 1) * 5}deg` } as React.CSSProperties}>
              <Icon name={s.icon} size={24} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -top-4 -right-4 rounded-full bg-gold-500 text-night-950 font-black text-sm px-4 py-2 shadow-xl shadow-gold-500/30 drift" style={{ "--r": "-8deg", "--d": "4.8s" } as React.CSSProperties} dir="ltr">
        -80%
      </div>
    </div>
  );
}
