"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  const [openStudent, setOpenStudent] = useState<number | null>(null);

  /* ظهور العناصر عند التمرير */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("on")),
      { threshold: 0.12, rootMargin: "0px 0px 60px 0px" }
    );
    const els = [...document.querySelectorAll<HTMLElement>(".rv")];
    els.forEach((el) => io.observe(el));
    /* عنصر اتعدّاه التمرير السريع/القفز يبان فورًا بدل ما يفضل مخفي */
    const onScroll = () => {
      els.forEach((el) => {
        if (!el.classList.contains("on") && el.getBoundingClientRect().bottom < 0) el.classList.add("on");
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
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
              <div className="orb-glow absolute inset-0 rounded-full overflow-hidden" style={{ background: "radial-gradient(circle at 38% 30%, #22d3ee 0%, #0891b2 42%, #0e7490 68%, #155e75 100%)" }}>
                <div className="absolute rounded-full bg-white/10 blur-md" style={{ width: "34%", height: "22%", top: "12%", left: "18%", transform: "rotate(-24deg)" }} />
                <div className="absolute rounded-full bg-black/15 blur-lg" style={{ width: "55%", height: "40%", bottom: "-8%", right: "-5%" }} />
                <div className="absolute rounded-full bg-white/[.07]" style={{ width: "16%", height: "16%", top: "30%", left: "55%" }} />
                <div className="absolute rounded-full bg-black/10" style={{ width: "11%", height: "11%", top: "55%", left: "28%" }} />
                <div className="absolute rounded-full bg-white/[.06]" style={{ width: "8%", height: "8%", top: "68%", left: "60%" }} />
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset -18px -24px 60px rgba(4,12,28,.55), inset 14px 18px 50px rgba(255,255,255,.18)" }} />
              </div>
              {/* حلقة المدار */}
              <svg viewBox="0 0 100 100" className="orbit-ring absolute -inset-8 sm:-inset-12 w-[calc(100%+4rem)] sm:w-[calc(100%+6rem)] h-[calc(100%+4rem)] sm:h-[calc(100%+6rem)] opacity-70">
                <ellipse cx="50" cy="50" rx="49" ry="34" fill="none" stroke="rgba(251,191,36,.5)" strokeWidth=".45" strokeDasharray="2.5 3" transform="rotate(-18 50 50)" />
              </svg>
              {/* الطالب */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center z-10">
                <div className="animate-bob flex flex-col items-center">
                  <svg viewBox="0 0 120 118" className="w-28 h-28 sm:w-40 sm:h-40 drop-shadow-2xl">
                    {/* كتاف */}
                    <path d="M60 62c-24 0-40 14-44 34-1 6 3 9 9 9h70c6 0 10-3 9-9-4-20-20-34-44-34z" fill="#f59e0b" />
                    <path d="M60 62c-24 0-40 14-44 34-1 6 3 9 9 9h70c6 0 10-3 9-9-4-20-20-34-44-34z" fill="url(#gshade)" />
                    {/* رقبة وراس */}
                    <rect x="52" y="46" width="16" height="16" rx="6" fill="#f0b27a" />
                    <circle cx="60" cy="36" r="22" fill="#f7c794" />
                    {/* شعر */}
                    <path d="M38 34c0-14 10-24 22-24s22 10 22 24c0 3-1 5-2 6 1-8-4-16-10-18-8 4-18 4-24-2-4 3-6 8-6 14z" fill="#3b2b20" />
                    {/* طاقية التخرج */}
                    <path d="M60 4L104 22 60 40 16 22z" fill="#0b1526" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" />
                    <rect x="52" y="30" width="16" height="9" rx="3" fill="#0b1526" />
                    <path d="M100 24v16" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="100" cy="44" r="4" fill="#f59e0b" />
                    {/* عيون */}
                    <circle cx="51" cy="37" r="2.6" fill="#2b1d12" />
                    <circle cx="69" cy="37" r="2.6" fill="#2b1d12" />
                    <path d="M53 47c4 3 10 3 14 0" stroke="#c47b4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gshade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#fbbf24" stopOpacity="0" />
                        <stop offset="1" stopColor="#b45309" stopOpacity=".55" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="mt-1 bg-night-950/85 backdrop-blur rounded-2xl px-5 py-2.5 text-center border border-white/15 shadow-xl">
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
            className="rv rounded-[2rem] sm:rounded-[2.75rem] border border-white/[.07] overflow-hidden" style={{ background: "linear-gradient(180deg,#0e1930 0%,#0a1226 100%)" }}>
            <div className="mx-auto max-w-6xl px-6 sm:px-12 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
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
              <div className={`flex items-center justify-center min-h-[320px] sm:min-h-[420px] relative ${i % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                <FeatureArt kind={f.art} />
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

/* ===================== رسومات الأقسام — لقطات حقيقية من التطبيق في فريمات ===================== */

/* فريم جوال */
function PhoneFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative w-52 sm:w-64 rounded-[2.4rem] bg-slate-900 border-[5px] border-slate-700/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] overflow-hidden ${className}`}>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-slate-900 z-10 border border-slate-700/60" />
      <img src={src} alt={alt} className="w-full aspect-[9/17] object-cover object-top" />
    </div>
  );
}

/* فريم متصفح/تابلت */
function BrowserFrame({ src, alt, pos = "top", className = "" }: { src: string; alt: string; pos?: string; className?: string }) {
  return (
    <div className={`relative w-[320px] sm:w-[460px] rounded-2xl bg-slate-900 border border-slate-600/60 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800/90 border-b border-white/10" dir="ltr">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-gold-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        <div className="flex-1 mx-2 h-5 rounded-md bg-white/10" />
      </div>
      <img src={src} alt={alt} className="w-full aspect-[16/10] object-cover" style={{ objectPosition: pos }} />
    </div>
  );
}

/* توهج لوني خلف الرسمة */
function Glow({ color }: { color: string }) {
  return <div className="absolute w-[70%] h-[70%] rounded-full blur-[90px] opacity-25 pointer-events-none" style={{ background: color }} />;
}

function FeatureArt({ kind }: { kind: string }) {
  switch (kind) {
    case "notes": return <NotesArt />;
    case "video": return <VideoArt />;
    case "quiz": return <QuizArt />;
    case "chat": return <ChatArt />;
    case "box": return <BoxArt />;
    default: return null;
  }
}

/* مذكرات: جوال بعرض المذكرة + شارة PDF */
function NotesArt() {
  return (
    <div className="relative flex items-center justify-center">
      <Glow color="#f59e0b" />
      <div className="animate-bob">
        <PhoneFrame src="/shots/notes-phone.jpeg" alt="مذكرة الدرس داخل تطبيق تفوّق" />
      </div>
      <div className="absolute -top-4 -right-2 sm:right-6 rounded-xl bg-gold-500 text-night-950 text-[11px] font-black px-3.5 py-2 shadow-xl shadow-gold-500/30 drift flex items-center gap-1.5" style={{ "--r": "-7deg", "--d": "4.5s" } as React.CSSProperties}>
        <Icon name="download" size={13} /> PDF
      </div>
      <div className="absolute -bottom-3 -left-2 sm:left-4 rounded-2xl bg-night-950/90 backdrop-blur border border-white/15 px-4 py-2.5 shadow-xl drift flex items-center gap-2.5" style={{ "--r": "5deg", "--d": "5.4s", "--dl": "-2s" } as React.CSSProperties}>
        <span className="w-8 h-8 rounded-lg bg-primary-500/25 text-primary-300 flex items-center justify-center"><Icon name="doc" size={17} /></span>
        <div><div className="text-[11px] font-black">مذكرة الدرس</div><div className="text-[9px] text-white/45 font-bold">عرض + تحميل</div></div>
      </div>
    </div>
  );
}

/* فيديوهات: شاشة عرض بمشغل الدرس */
function VideoArt() {
  return (
    <div className="relative flex items-center justify-center">
      <Glow color="#22d3ee" />
      <div className="absolute -top-6 right-2 sm:right-8 w-12 h-12 rounded-full bg-gold-400 shadow-[0_0_45px_rgba(251,191,36,.55)] drift" style={{ "--d": "5s" } as React.CSSProperties} />
      <div className="absolute -bottom-6 left-4 sm:left-10 flex items-center gap-2 rounded-full bg-night-950/90 backdrop-blur border border-white/15 px-4 py-2 shadow-xl drift" style={{ "--r": "4deg", "--d": "6s", "--dl": "-2.5s" } as React.CSSProperties}>
        <Icon name="play" size={13} className="text-primary-300" filled />
        <span className="text-[11px] font-black text-white/85">أعدها كثر ما تبي</span>
      </div>
      <div className="animate-bob" style={{ transform: "rotate(2deg)" }}>
        <BrowserFrame src="/shots/lesson.jpeg" alt="صفحة الدرس والفيديو" pos="top" />
      </div>
    </div>
  );
}

/* اختبارات: جوال بالكويز + كونفيتي */
function QuizArt() {
  const confetti = [
    { x: -36, y: -24, c: "#f43f5e", r: "18deg", d: "4.6s" }, { x: 40, y: -44, c: "#fbbf24", r: "-14deg", d: "5.4s" },
    { x: 270, y: -18, c: "#22d3ee", r: "24deg", d: "5s" }, { x: -28, y: 250, c: "#a78bfa", r: "-20deg", d: "6s" },
    { x: 285, y: 240, c: "#34d399", r: "10deg", d: "4.2s" }, { x: 130, y: -52, c: "#fb923c", r: "0deg", d: "5.8s" },
  ];
  return (
    <div className="relative flex items-center justify-center">
      <Glow color="#34d399" />
      {confetti.map((c, i) => (
        <div key={i} className="absolute w-4 h-4 rounded-md drift z-10" style={{ left: `calc(50% + ${c.x - 130}px)`, top: c.y, background: c.c, "--r": c.r, "--d": c.d } as React.CSSProperties} />
      ))}
      <div className="animate-bob">
        <PhoneFrame src="/shots/exam-phone.jpeg" alt="اختبار ذكي داخل تطبيق تفوّق" />
      </div>
      <div className="absolute top-6 -left-2 sm:left-2 rounded-2xl bg-emerald-400 text-night-950 font-black text-lg px-4 py-2 shadow-xl shadow-emerald-400/30 drift" style={{ "--r": "-6deg", "--d": "5s", "--dl": "-1.5s" } as React.CSSProperties} dir="ltr">
        100%
      </div>
    </div>
  );
}

/* معلمين: شاشة المواد بأسماء المعلمين + فقاعات سؤال وجواب */
function ChatArt() {
  return (
    <div className="relative flex items-center justify-center">
      <Glow color="#a78bfa" />
      <div className="animate-bob" style={{ transform: "rotate(-2deg)" }}>
        <BrowserFrame src="/shots/browse.jpeg" alt="المواد والمعلمون في تفوّق" pos="center" />
      </div>
      <div className="absolute -top-3 right-0 sm:right-4 rounded-2xl rounded-br-md bg-white/95 text-night-950 px-4 py-2.5 shadow-2xl drift" style={{ "--r": "-4deg", "--d": "5.2s" } as React.CSSProperties}>
        <div className="text-[11px] font-black">سؤال: معادلة المماس؟</div>
        <div className="text-[9px] text-slate-500 font-bold mt-0.5">أحمد — قبل دقيقتين</div>
      </div>
      <div className="absolute -bottom-4 left-0 sm:left-6 rounded-2xl rounded-bl-md bg-primary-500 px-4 py-2.5 shadow-2xl shadow-primary-500/30 drift flex items-center gap-2.5" style={{ "--r": "4deg", "--d": "5.8s", "--dl": "-2.2s" } as React.CSSProperties}>
        <span className="w-7 h-7 rounded-full bg-gold-400 text-night-950 flex items-center justify-center text-[10px] font-black shrink-0">م</span>
        <div className="text-[11px] font-black">تم الرد خلال ٣ دقائق</div>
      </div>
    </div>
  );
}

/* باقات: شاشة الباقات + شارة الخصم */
function BoxArt() {
  return (
    <div className="relative flex items-center justify-center">
      <Glow color="#f59e0b" />
      <div className="animate-bob" style={{ transform: "rotate(1.5deg)" }}>
        <BrowserFrame src="/shots/subscription.jpeg" alt="باقات تفوّق" pos="top" />
      </div>
      <div className="absolute -top-4 -right-2 sm:right-6 rounded-full bg-gold-500 text-night-950 font-black text-sm px-4 py-2 shadow-xl shadow-gold-500/40 drift" style={{ "--r": "-8deg", "--d": "4.8s" } as React.CSSProperties} dir="ltr">
        -80%
      </div>
      <div className="absolute -bottom-3 -left-2 sm:left-4 rounded-xl bg-night-950/90 backdrop-blur border border-white/15 px-3.5 py-2 shadow-xl drift flex items-center gap-2" style={{ "--r": "5deg", "--d": "5.6s", "--dl": "-1.8s" } as React.CSSProperties}>
        <span className="text-[10px] font-black text-white/70">KNET</span>
        <span className="w-px h-3 bg-white/20" />
        <span className="text-[10px] font-black text-white/70">Visa</span>
      </div>
    </div>
  );
}
