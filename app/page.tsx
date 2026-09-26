"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { HeroArt, WatermelonArt, BookQrArt, LaptopArt, QuizArt, ChatArt, BoxArt } from "@/components/landing-art";

/* ===================== بيانات الصفحة ===================== */

const TOP_STUDENTS = [
  {
    name: "أحمد الكندري",
    rank: "الأول على الكويت - علمي",
    pct: "100%",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "المذكرات غطّت كل شي، والاختبارات ورّتني ضعفي قبل الامتحان.",
  },
  {
    name: "سارة العتيبي",
    rank: "الأولى على الكويت - أدبي",
    pct: "99.9%",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote: "كنت أذاكر بالوقت اللي يريحني وأعيد الشرح أكثر من مرة — هذا اللي فرق معي.",
  },
  {
    name: "يوسف المطيري",
    rank: "الثاني على الكويتيين - علمي",
    pct: "99.5%",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote: "أي سؤال يعقّدني أسأله للمعلم ويرد عليّ بسرعة، والتدريب رفع مستواي.",
  },
];

/* قصص إضافية تظهر عند «اعرض المزيد» */
const MORE_STUDENTS = [
  {
    name: "طالب الصف الحادي عشر",
    rank: "نسبة 98.5% — القسم العلمي",
    pct: "98.5%",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    quote: "فيديوهات الشرح القصيرة خلتني أراجع المنهج كاملًا قبل الامتحان بأسبوع.",
  },
  {
    name: "طالبة الصف التاسع",
    rank: "الأولى على المدرسة في الرياضيات",
    pct: "+28%",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote: "الاختبارات الذكية ورّتني غلطاتي بالضبط، وركزت مراجعتي عليها بس.",
  },
  {
    name: "طالب الصف الثامن",
    rank: "من متعثر إلى متفوق في فصل واحد",
    pct: "+40%",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    quote: "حفظ موضع الفيديو والمذكرات المرتبة خلّوا المذاكرة عادة يومية سهلة.",
  },
];

const FEATURES = [
  {
    id: "notes",
    title: "مذكرات تغطي كل شي",
    desc: "ملخصات منظمة تغطي منهجك من أوله لآخره — ما تحتاج أي مصدر ثاني.",
    order: "text-first",
    badge: "PDF قابل للطباعة",
    accent: "#22d3ee",
    points: ["تلخيص مركز لكل درس", "أمثلة وزارية محلولة", "خطة مراجعة أسبوعية"],
  },
  {
    id: "video",
    title: "شرح فيديو لكل درس",
    desc: "دروس مسجلة تشرح المنهج خطوة بخطوة — تعيدها متى تبي وبالوقت اللي يناسبك.",
    order: "img-first",
    badge: "استئناف من حيث توقفت",
    accent: "#a78bfa",
    points: ["فيديوهات قصيرة مركزة", "حفظ موضع المشاهدة", "ملاحظات بتوقيت الدرس"],
  },
  {
    id: "quiz",
    title: "اختبارات تقيس جاهزيتك",
    desc: "تدرّب على أسئلة بأسلوب الاختبارات السابقة واكشف نقاط ضعفك قبل يوم الامتحان.",
    order: "text-first",
    badge: "تحليل نقاط القوة والضعف",
    accent: "#34d399",
    points: ["تصحيح فوري مع الشرح", "مراجعة الأخطاء", "مقارنة التقدم"],
  },
  {
    id: "chat",
    title: "أميز المعلمين معك",
    desc: "تواصل مباشر مع معلمين خبرة يجاوبون على أسئلتك ويرشدونك أول بأول.",
    order: "img-first",
    badge: "ردود ومتابعة مستمرة",
    accent: "#fbbf24",
    points: ["إجابات سريعة على الأسئلة", "حصص مراجعة مباشرة", "تقارير لأولياء الأمور"],
  },
  {
    id: "box",
    title: "باقات تفوّق توفر عليك أكثر",
    desc: "اشتراك واحد يفتح كل مواد مرحلتك بسعر أوفر — وفّر حتى 80%.",
    order: "text-first",
    badge: "اشترك وجرب أول درس مجانًا",
    accent: "#4a9bf5",
    highlight: "خصم 80%",
    points: ["كل مواد الصف بسعر واحد", "دروس مجانية للتجربة", "إلغاء مرن في أي وقت"],
  },
];

const FEATURE_ART: Record<string, React.ReactNode> = {
  notes: <BookQrArt />,
  video: <LaptopArt />,
  quiz: <QuizArt />,
  chat: <ChatArt />,
  box: <BoxArt />,
};

/* نجوم الهيرو */
const STARS: [number, number, number][] = [
  [6, 12, 3], [14, 38, 2], [5, 65, 3], [18, 80, 2], [32, 10, 2], [48, 18, 3],
  [58, 75, 2], [72, 12, 3], [84, 28, 2], [91, 58, 3], [95, 16, 2], [64, 86, 2],
  [38, 52, 2], [28, 92, 3], [80, 84, 2], [12, 26, 2],
];

export default function Landing() {
  const [countryModal, setCountryModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("الكويت");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatSent, setChatSent] = useState(false);
  const [showMore, setShowMore] = useState(false);

  /* حركات الظهور عند التمرير */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("on")),
      { threshold: 0.1, rootMargin: "0px 0px 50px 0px" }
    );
    const elements = document.querySelectorAll<HTMLElement>(".rv");
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1217] text-white overflow-x-clip selection:bg-[#2072e0] selection:text-white">
      {/* ===================== الهيدر الثابت ===================== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0f1217]/85 backdrop-blur-md border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 h-[74px] flex items-center justify-between">
          {/* اليمين: اللوجو */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2072e0] flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#2072e0]/30">
              ت
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl leading-none text-white tracking-wide">تفوّق</span>
              <span className="text-[10px] text-white/50 font-bold tracking-widest mt-1">TAFAWWOQ</span>
            </div>
          </Link>

          {/* اليسار: أدوات الحساب */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/grades" className="hidden sm:inline-block text-sm font-bold text-white/80 hover:text-white transition-colors">
              تسوق
            </Link>

            {/* زر الدولة */}
            <button
              onClick={() => setCountryModal(true)}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur px-3.5 py-1.5 transition-all text-xs font-bold text-white/90"
            >
              <KuwaitFlag />
              <span>{selectedCountry}</span>
              <Icon name="down" size={13} className="text-white/50" />
            </button>

            {/* زر ادخل */}
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-full border-2 border-[#2072e0] text-white hover:bg-[#2072e0] px-5 py-2 text-sm font-black transition-all shadow-md shadow-[#2072e0]/20"
            >
              <Icon name="back" size={15} className="group-hover:-translate-x-1 transition-transform" />
              <span>ادخل</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ===================== نافذة اختيار الدولة ===================== */}
      {countryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-sm rounded-3xl bg-[#161c29] border border-white/10 p-6 shadow-2xl relative">
            <button
              onClick={() => setCountryModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-white/10 text-white/60"
            >
              <Icon name="x" size={18} />
            </button>
            <h3 className="text-lg font-black text-white text-center mb-1">اختر دولتك</h3>
            <p className="text-xs text-white/50 text-center mb-6">يعتمد المنهج والعملة على اختيار دولتك</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.05] border border-[#2072e0] text-white text-sm font-bold">
                <div className="flex items-center gap-2.5">
                  <KuwaitFlag />
                  <span>دولة الكويت (KWD)</span>
                </div>
                <Icon name="check" size={16} className="text-[#2072e0]" />
              </div>
            </div>

            <button
              onClick={() => setCountryModal(false)}
              className="w-full mt-6 py-3 rounded-full bg-[#2072e0] hover:bg-[#1b63c4] font-black text-sm text-white transition-all shadow-lg shadow-[#2072e0]/30"
            >
              حفظ
            </button>
          </div>
        </div>
      )}

      {/* ===================== الهيرو (1:1 Hero) ===================== */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 overflow-hidden">
        {/* نجوم الليل */}
        {STARS.map(([x, y, s], i) => (
          <span
            key={i}
            className="star-dot pointer-events-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: s,
              height: s,
              ["--d" as string]: `${2.5 + (i % 5) * 0.8}s`,
              ["--dl" as string]: `${(i % 7) * 0.5}s`,
            }}
          />
        ))}

        <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-8 grid lg:grid-cols-2 items-center gap-10 my-auto">
          {/* الجانب الأيمن: النص والعنوان والزر */}
          <div className="relative z-10 text-center lg:text-right">
            <div className="rv inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/12 px-4 py-1.5 text-xs font-bold text-amber-300 mb-6">
              <span>⭐</span>
              <span>مصمّمة لطلبة الكويت</span>
            </div>
            <h1 className="rv font-black leading-[1.14] text-[2.6rem] sm:text-6xl xl:text-[4.2rem] text-white">
              كل أدوات التفوق
              <br />
              <span className="text-gradient">في منصة واحدة</span>
            </h1>

            <p
              className="rv mt-6 text-white/70 text-lg sm:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 lg:ml-auto"
              style={{ "--rvd": "120ms" } as React.CSSProperties}
            >
              ارتقِ بمستواك مع مذكرات تفوّق المنظمة وشروحات الفيديو الواضحة واختبارات تقيس جاهزيتك
            </p>

            <div className="rv mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-3" style={{ "--rvd": "200ms" } as React.CSSProperties}>
              <Link
                href="/student/browse"
                className="inline-flex items-center gap-2 bg-[#2072e0] hover:bg-[#1b63c4] text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:scale-[1.03] shadow-xl shadow-[#2072e0]/35 active:scale-95"
              >
                استكشف المواد
              </Link>
            </div>
          </div>

          {/* الجانب الأيسر: دايرة التفوق + silhouette + النسبة */}
          <div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[560px]">
            <HeroArt />
          </div>
        </div>

        {/* مؤشر التمرير */}
        <div className="relative z-10 pb-2 flex justify-center">
          <a href="#trust" className="p-2 text-white/40 hover:text-white transition-colors animate-scroll-hint">
            <Icon name="down" size={24} />
          </a>
        </div>
      </section>

      {/* ===================== البانر الأزرق ===================== */}
      <section className="px-3 sm:px-6 pt-10">
        <div className="rounded-t-[2.5rem] sm:rounded-t-[3.5rem] py-16 sm:py-24 text-center relative overflow-hidden bg-[#2072e0] text-white shadow-2xl">
          <div className="relative mx-auto mb-4 w-fit">
            <WatermelonArt size={210} />
          </div>

          <h2 className="rv text-3xl sm:text-5xl font-black">ذاكر على راحتك</h2>
          <p
            className="rv mt-4 text-white/90 font-bold text-base sm:text-xl max-w-2xl mx-auto px-4"
            style={{ "--rvd": "120ms" } as React.CSSProperties}
          >
            قسمنا لك المنهج إلى أجزاء بسيطة تنجزها على وقتك وبراحتك
          </p>
        </div>
      </section>

      {/* ===================== كروت المميزات الخمسة بالتناوب ===================== */}
      <div id="features" className="px-3 sm:px-6 pb-8 space-y-6">
        {FEATURES.map((f) => (
          <section
            key={f.id}
            id={f.id === "box" ? "packages" : undefined}
            className="rv rounded-[2rem] sm:rounded-[2.75rem] bg-[#161c29] border border-white/[0.06] overflow-hidden shadow-2xl"
          >
            <div className="mx-auto max-w-6xl px-6 sm:px-12 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
              {/* النص والأزرار */}
              <div
                className={`text-center ${
                  f.order === "text-first" ? "lg:text-right lg:order-1" : "lg:text-right lg:order-2"
                }`}
              >
                <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-bold text-[#4a9bf5] mb-4">
                  {f.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-black mb-5 text-white">{f.title}</h2>
                <p className="text-white/65 font-bold text-base sm:text-xl leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
                  {f.desc}
                </p>
                <ul className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                  {f.points.map((p) => (
                    <li key={p} className="text-xs font-bold text-white/70 bg-white/[0.05] border border-white/10 rounded-full px-3.5 py-1.5">
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/student/browse"
                  className="inline-flex items-center gap-2 bg-[#2072e0] hover:bg-[#1b63c4] text-white font-black text-sm sm:text-base px-9 py-3.5 rounded-full transition-all hover:scale-[1.04] shadow-lg shadow-[#2072e0]/30 active:scale-95"
                >
                  استكشف المواد
                </Link>
              </div>

              {/* رسمة السكشن — SVG أصلية مرسومة */}
              <div
                className={`flex items-center justify-center min-h-[280px] sm:min-h-[340px] relative ${
                  f.order === "text-first" ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: f.accent }} />
                <div className="relative animate-bob">{FEATURE_ART[f.id]}</div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ===================== قسم قصص التفوق ===================== */}
      <section id="top-students" className="px-3 sm:px-6 pb-8">
        <div className="rounded-[2rem] sm:rounded-[2.75rem] bg-[#12161f] border border-white/[0.06] py-14 sm:py-20 px-6">
          <h2 className="rv text-center text-3xl sm:text-5xl font-black mb-12 text-white">تفوق طلبتنا هو قصتنا</h2>

          <div className="mx-auto max-w-6xl grid sm:grid-cols-3 gap-6">
            {(showMore ? [...TOP_STUDENTS, ...MORE_STUDENTS] : TOP_STUDENTS).map((s, i) => (
              <div
                key={s.name}
                className="rv group rounded-[2rem] overflow-hidden border border-[#2b3547] bg-gradient-to-b from-[#232c4a] to-[#161c29] shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ "--rvd": `${i * 100}ms` } as React.CSSProperties}
              >
                <div className="relative p-6 text-center">
                  {/* نسبة التفوق */}
                  <div className="font-black text-4xl sm:text-5xl text-white tracking-tight mb-4" dir="ltr">
                    {s.pct}
                  </div>

                  {/* صورة الطالب */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <img
                      src={s.img}
                      alt={s.name}
                      loading="lazy"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#2072e0]/40 shadow-lg shadow-[#2072e0]/20"
                    />
                  </div>

                  <div className="font-black text-xl text-white">{s.name}</div>
                  <div className="text-white/70 text-xs font-bold mt-1">{s.rank}</div>

                  <p className="mt-4 text-white/80 text-xs sm:text-sm leading-relaxed border-t border-white/10 pt-4 font-medium">
                    «{s.quote}»
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowMore(!showMore)}
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/85 font-bold text-sm px-8 py-3 rounded-full transition-all"
            >
              {showMore ? "عرض أقل" : "اعرض المزيد من القصص"}
              <Icon name="down" size={14} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
            </button>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#2072e0] hover:bg-[#1b63c4] text-white font-black text-sm px-8 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-[#2072e0]/30"
            >
              ابدأ قصتك معنا
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== الفوتر ===================== */}
      <footer className="bg-[#0a0d13] border-t border-white/[0.08] text-white pt-14 pb-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-12 border-b border-white/[0.08]">
            {/* أزرار التواصل الاجتماعي */}
            <div className="flex items-center gap-3">
              {[
                { icon: "fb", href: "https://facebook.com", label: "فيسبوك" },
                { icon: "xlogo", href: "https://x.com", label: "منصة إكس" },
                { icon: "yt", href: "https://youtube.com", label: "يوتيوب" },
                { icon: "ig", href: "https://instagram.com", label: "إنستغرام" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#2072e0] flex items-center justify-center text-white/70 hover:text-white transition-all"
                  aria-label={s.label}
                >
                  <Icon name={s.icon} size={16} />
                </a>
              ))}
            </div>

            {/* أزرار تحميل التطبيقات */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/20 transition-colors">
                <Icon name="apple" size={20} />
                <div className="text-right">
                  <div className="text-[9px] text-white/50 leading-none">Download on the</div>
                  <div className="text-xs font-black text-white leading-tight">App Store</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/20 transition-colors">
                <Icon name="gplay" size={18} />
                <div className="text-right">
                  <div className="text-[9px] text-white/50 leading-none">GET IT ON</div>
                  <div className="text-xs font-black text-white leading-tight">Google Play</div>
                </div>
              </div>
            </div>

            {/* محدد الدولة في الفوتر */}
            <button
              onClick={() => setCountryModal(true)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-bold text-white/80"
            >
              <div className="text-[10px] text-white/40">الدولة</div>
              <KuwaitFlag />
              <span>الكويت</span>
              <Icon name="down" size={12} className="text-white/40" />
            </button>
          </div>

          {/* روابط الفوتر */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10 text-sm">
            <div>
              <div className="font-black text-white mb-4">المنصة</div>
              <ul className="space-y-2 text-white/60 text-xs font-medium">
                <li><Link href="#top-students" className="hover:text-white">الطلبة الأوائل</Link></li>
                <li><Link href="#packages" className="hover:text-white">العروض والباقات</Link></li>
                <li><Link href="/login" className="hover:text-white">أولياء الأمور</Link></li>
                <li><Link href="/login" className="hover:text-white">المعلمون</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-black text-white mb-4">المراحل التعليمية</div>
              <ul className="space-y-2 text-white/60 text-xs font-medium">
                <li><Link href="/student/browse" className="hover:text-white">المرحلة الثانوية</Link></li>
                <li><Link href="/student/browse" className="hover:text-white">المرحلة المتوسطة</Link></li>
                <li><Link href="/student/browse" className="hover:text-white">المرحلة الابتدائية</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-black text-white mb-4">تواصل معنا</div>
              <ul className="space-y-2 text-white/60 text-xs font-medium">
                <li>
                  <button onClick={() => setChatOpen(true)} className="hover:text-[#2072e0] flex items-center gap-1.5">
                    <Icon name="chat" size={14} />
                    <span>محادثة أونلاين</span>
                  </button>
                </li>
                <li>
                  <a href="https://wa.me/96500000000" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1.5">
                    <Icon name="wa" size={14} />
                    <span>واتساب</span>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-black text-white mb-4">وسائل الدفع المعتمدة</div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-black text-sky-400 border border-white/10">KNET</span>
                <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-black text-white border border-white/10">Apple Pay</span>
                <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-black text-amber-300 border border-white/10">Visa</span>
              </div>
            </div>
          </div>

          {/* سطر الحقوق السفلي */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
            <div>
              تفوّق منصة كويتية مقرها في مدينة الكويت. شروط • الخصوصية
            </div>
            <div>
              تفوّق © جميع الحقوق محفوظة 2026
            </div>
          </div>
        </div>
      </footer>

      {/* ===================== زر المحادثة الحية العائم (Floating Chat) ===================== */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-center gap-3">
        {/* زر واتساب العائم */}
        <a
          href="https://wa.me/96500000000"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center shadow-2xl shadow-[#22c55e]/50 hover:scale-110 active:scale-95 transition-all"
          aria-label="تواصل معنا واتساب"
        >
          <Icon name="wa" size={26} />
        </a>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full bg-[#2072e0] hover:bg-[#1b63c4] text-white flex items-center justify-center shadow-2xl shadow-[#2072e0]/50 hover:scale-110 active:scale-95 transition-all"
          aria-label="محادثة الدعم الفني"
        >
          {chatOpen ? <Icon name="x" size={24} /> : <Icon name="chat" size={24} />}
        </button>

        {chatOpen && (
          <div className="absolute bottom-16 left-0 w-80 sm:w-96 rounded-3xl bg-[#161c29] border border-white/15 p-5 shadow-2xl animate-fade-up text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2072e0] flex items-center justify-center font-black text-sm">
                  ت
                </div>
                <div>
                  <div className="font-bold text-xs text-white">فريق دعم تفوّق</div>
                  <div className="text-[10px] text-emerald-400">متصل الآن للمساعدة</div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.04] rounded-2xl p-3 text-xs text-white/80 leading-relaxed mb-4">
              مرحباً بك! 👋 كيف نقدر نساعدك اليوم في اشتراكاتك أو المناهج؟
            </div>

            {chatSent ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 text-center font-bold">
                تم إرسال رسالتك! سيتواصل معك أحد ممثلي الدعم خلال دقائق.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (chatMsg.trim()) setChatSent(true);
                }}
                className="flex gap-2"
              >
                <input
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#2072e0]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2072e0] hover:bg-[#1b63c4] text-white text-xs font-bold transition-colors"
                >
                  إرسال
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* علم الكويت SVG */
function KuwaitFlag() {
  return (
    <svg viewBox="0 0 24 16" width="20" height="13" className="rounded-sm overflow-hidden shrink-0 shadow-sm">
      <rect width="24" height="5.33" fill="#007a3d" />
      <rect y="5.33" width="24" height="5.33" fill="#ffffff" />
      <rect y="10.66" width="24" height="5.34" fill="#ce1126" />
      <polygon points="0,0 8,5.33 8,10.66 0,16" fill="#000000" />
    </svg>
  );
}
