"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui";

const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"] as const;

type Student = {
  name: string;
  rank: string;
  pct: string;
  img: string;
  quote: string;
};

const ARCHIVE: Record<string, Student[]> = {
  "2025": [
    {
      name: "يوسف عبدالمحسن الابراهيم",
      rank: "الأول على الكويت – علمي",
      pct: "100%",
      img: "/uula/st-yousef.webp",
      quote: "ساعدتني تفوّق أدرس بسهولة وبسرعة. المصادر واضحة وما أحتاج أتعب نفسي في البحث. وفي بنك أسئلة الفيزياء، كل سؤال له حل وشرح واضح.",
    },
    {
      name: "فجر العتيبي",
      rank: "الأول على الكويت – علمي",
      pct: "100%",
      img: "/uula/st-nour.webp",
      quote: "من أول ما اشتركت في تفوّق ارتاحت — فيه مذكرات وفيه فيديوهات شرح فصارت الدراسة أسهل وأمتع.",
    },
    {
      name: "نورا عبداللطيف",
      rank: "من أوائل الكويت – علمي",
      pct: "99.99%",
      img: "/uula/st-leen-nasser.webp",
      quote: "بدأت مع تفوّق من الصف العاشر واستمريت ثلاث سنوات. أكثر شي يميزها الرد السريع على الأسئلة خلال دقائق.",
    },
    {
      name: "لين حريبات",
      rank: "من أوائل الكويت – علمي",
      pct: "99.99%",
      img: "/uula/st-leen.webp",
      quote: "الترتيب وتنظيم المذكرات والأسئلة ممتاز، والأسئلة التدريبية بعد الفيديوهات تأكد الفهم.",
    },
    {
      name: "جمانة النجدي",
      rank: "الثاني على الكويتيين – علمي",
      pct: "99.99%",
      img: "/uula/st-jumana.webp",
      quote: "أحلى ميزة إني أقدر أطالع الفيديوهات وأعيدها على كيفي — وأي سؤال يردّون عليّ بسرعة.",
    },
    {
      name: "سليم مسيكة",
      rank: "الأول على الكويت – علمي",
      pct: "100%",
      img: "/uula/st-saleem.webp",
      quote: "فيديوهات الشرح من مدرسين خبراء — الطالب ينظم وقت دراسته على مدار اليوم.",
    },
  ],
  "2024": [
    {
      name: "عبدالعزيز الدوسري",
      rank: "الأول على الكويت – علمي",
      pct: "100%",
      img: "/uula/st-yousef-d.webp",
      quote: "المذكرات المركزة وفّرت عليّ ساعات مراجعة، والاختبارات ورّتني ضعفي قبل الامتحان بأسبوع.",
    },
    {
      name: "هيا المطيري",
      rank: "من أوائل الكويت – علمي",
      pct: "99.8%",
      img: "/uula/st-jumana.webp",
      quote: "خطة المراجعة اليومية خلّت المذاكرة عادة سهلة بدل ما تكون ضغط آخر لحظة.",
    },
    {
      name: "محمد العنزي",
      rank: "الأول على مدرسته – رياضيات",
      pct: "99.5%",
      img: "/uula/st-saleem.webp",
      quote: "تدريب المتابعة بعد كل اختبار رفع مستواي في المواد اللي كنت أضعف فيها.",
    },
    {
      name: "دانة الرشيد",
      rank: "من أوائل الكويت – أدبي",
      pct: "99.2%",
      img: "/uula/st-leen.webp",
      quote: "المعلمين يجاوبون على الأسئلة بسرعة، وهذا كان الفرق وقت الضغط.",
    },
    {
      name: "فهد الصباح",
      rank: "تحسن +25% خلال فصل",
      pct: "+25%",
      img: "/uula/st-yousef.webp",
      quote: "من متعثر إلى متفوق — الفيديوهات القصيرة والمذكرات المرتبة غيّرت طريقتي.",
    },
    {
      name: "ريم الهاجري",
      rank: "الأولى على المدرسة – كيمياء",
      pct: "98.9%",
      img: "/uula/st-nour.webp",
      quote: "أي سؤال يعقّدني أسأله في المنصة ويردّ عليّ المعلم بشرح واضح.",
    },
  ],
  "2023": [
    {
      name: "سلطان القحطاني",
      rank: "الأول على الكويت – علمي",
      pct: "100%",
      img: "/uula/st-saleem.webp",
      quote: "المنهج مغطى من أوله لآخره — ما احتجت أي مصدر ثاني طول السنة.",
    },
    {
      name: "نورة الشمري",
      rank: "من أوائل الكويت – علمي",
      pct: "99.7%",
      img: "/uula/st-leen-nasser.webp",
      quote: "التقارير ورّتني وين نقاط قوتي ووين أركز، وهذا وفّر عليّ وقت كبير.",
    },
    {
      name: "يوسف المطيري",
      rank: "الأول على الكويت – علمي",
      pct: "99.6%",
      img: "/uula/st-yousef.webp",
      quote: "حفظ موضع الفيديو والملاحظات بتوقيت الدرس خلّوا المراجعة سريعة.",
    },
    {
      name: "شهد الدوسري",
      rank: "الثانية على المدرسة – أحياء",
      pct: "99.1%",
      img: "/uula/st-jumana.webp",
      quote: "الاختبارات الذكية تشبه أسلوب الوزارة — تدرّبت على الأسلوب نفسه.",
    },
    {
      name: "عبدالله العجمي",
      rank: "من أوائل الكويت – علمي",
      pct: "98.8%",
      img: "/uula/st-yousef-d.webp",
      quote: "الدعم الفني يرد بسرعة، وما واجهت أي مشكلة طول السنة.",
    },
    {
      name: "لمى العنزي",
      rank: "الأولى في اللغة الإنجليزية",
      pct: "98.5%",
      img: "/uula/st-nour.webp",
      quote: "أحب أعيد الشرح أكثر من مرة بالوقت اللي يناسبني — هذا اللي فرق معي.",
    },
  ],
  "2022": [
    {
      name: "خالد الأحمد",
      rank: "الأول على الكويت – علمي",
      pct: "100%",
      img: "/uula/st-yousef.webp",
      quote: "بدأت منتصف السنة وحققت هدفي — المنصة تعطيك خطة واضحة.",
    },
    {
      name: "مها الفهد",
      rank: "من أوائل الكويت – علمي",
      pct: "99.4%",
      img: "/uula/st-leen.webp",
      quote: "المذكرات المطبوعة كانت رفيقتي قبل كل اختبار.",
    },
    {
      name: "راكان المطيري",
      rank: "الأول على المدرسة – فيزياء",
      pct: "99.0%",
      img: "/uula/st-saleem.webp",
      quote: "الشرح خطوة بخطوة يخّلي الموضوع الصعب يبان بسيط.",
    },
    {
      name: "جنى الهاجري",
      rank: "من أوائل الكويت – أدبي",
      pct: "98.6%",
      img: "/uula/st-jumana.webp",
      quote: "الأسئلة التدريبية بعد كل درس تثبت المعلومة فورًا.",
    },
    {
      name: "فيصل العتيبي",
      rank: "تحسن +30% خلال سنة",
      pct: "+30%",
      img: "/uula/st-yousef-d.webp",
      quote: "من 60% إلى أوائل المدرسة — التزمت بالخطة اليومية بس.",
    },
    {
      name: "أروى السبيعي",
      rank: "الثانية على المدرسة – كيمياء",
      pct: "98.2%",
      img: "/uula/st-leen-nasser.webp",
      quote: "المراجعة مع المعلم أونلاين كانت تفرق معي قبل الاختبارات.",
    },
  ],
  "2021": [
    {
      name: "ناصر الجابر",
      rank: "الأول على الكويت – علمي",
      pct: "99.9%",
      img: "/uula/st-yousef-d.webp",
      quote: "أول سنة أستخدم منصة رقمية بشكل كامل — وكانت أفضل قرار.",
    },
    {
      name: "سارة الكندري",
      rank: "من أوائل الكويت – علمي",
      pct: "99.3%",
      img: "/uula/st-nour.webp",
      quote: "المحتوى مرتب بترتيب المنهج بالضبط، ما تضيع وقتك.",
    },
    {
      name: "عمر الدوسري",
      rank: "الأول على المدرسة – رياضيات",
      pct: "99.0%",
      img: "/uula/st-saleem.webp",
      quote: "كل سؤال صعب لقيت له شرح مفصل — هذا نادر.",
    },
    {
      name: "غلا المطيري",
      rank: "من أوائل الكويت – علمي",
      pct: "98.7%",
      img: "/uula/st-jumana.webp",
      quote: "التطبيق يشتغل على الجوال واللابتوب — أذاكر وأنا متنقلة.",
    },
    {
      name: "بندر العنزي",
      rank: "الأول في اللغة الإنجليزية",
      pct: "98.4%",
      img: "/uula/st-yousef.webp",
      quote: "بنك الأسئلة يغطي كل زوايا الدرس — ما تتفاجأ في الامتحان.",
    },
    {
      name: "دانة العلي",
      rank: "الثانية على المدرسة – أحياء",
      pct: "98.0%",
      img: "/uula/st-leen.webp",
      quote: "التقارير الأسبوعية ورّتني التقدم بشكل واضح.",
    },
  ],
  "2020": [
    {
      name: "ياسر الهاجري",
      rank: "الأول على الكويت – علمي",
      pct: "99.8%",
      img: "/uula/st-yousef.webp",
      quote: "منصة تفوّق ورّتني إن الدراسة الذكية أهم من الدراسة الطويلة.",
    },
    {
      name: "أمينة الرشيد",
      rank: "من أوائل الكويت – علمي",
      pct: "99.2%",
      img: "/uula/st-leen-nasser.webp",
      quote: "المذكرات والفيديو مع بعض يغطون المنهج كاملًا.",
    },
    {
      name: "تركي القحطاني",
      rank: "الأول على المدرسة – فيزياء",
      pct: "98.9%",
      img: "/uula/st-saleem.webp",
      quote: "أول سنة أذاكر بدون ضغط — والنتيجة أفضل من كل السنين.",
    },
    {
      name: "شهد المطيري",
      rank: "من أوائل الكويت – أدبي",
      pct: "98.5%",
      img: "/uula/st-jumana.webp",
      quote: "التنظيم والوضوح هو اللي خلّاني أستمر طول السنة.",
    },
    {
      name: "عبدالرحمن الدوسري",
      rank: "تحسن +20% خلال فصل",
      pct: "+20%",
      img: "/uula/st-yousef-d.webp",
      quote: "التدريب على الأخطاء بعد كل اختبار هو سر التحسن.",
    },
    {
      name: "نوف العنزي",
      rank: "الثانية على المدرسة – كيمياء",
      pct: "98.1%",
      img: "/uula/st-nour.webp",
      quote: "الدعم السريع على الأسئلة يعطيك أمان طول المذاكرة.",
    },
  ],
};

export default function TopStudentsPage() {
  const [year, setYear] = useState<string>("2025");
  const students = ARCHIVE[year] ?? [];

  return (
    <div className="min-h-screen bg-[#0f1217] text-white">
      <header className="border-b border-[#2b3547]/60">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-7">
            <Link href="/"><Logo size={38} light /></Link>
            <Link href="/bundles" className="text-sm font-bold text-[#9297a6] hover:text-white transition-colors">العروض</Link>
          </div>
          <Link href="/login" className="bg-[#2072e0] hover:bg-[#1b63c4] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors">ادخل</Link>
        </div>
      </header>
      <main className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-12 pb-20 animate-fade-up">
        <div className="text-center mb-8">
          <span className="inline-block text-[11px] font-black px-4 py-1.5 rounded-full bg-[#f5b329]/15 text-[#f5b329] border border-[#f5b329]/30 mb-4">شركاء النجاح والتفوق</span>
          <h1 className="text-3xl sm:text-5xl font-black mb-3">أوائل منصة تفوّق {year} | نجاحكم نجاحنا</h1>
          <p className="text-[#9297a6] font-bold max-w-2xl mx-auto">
            نفتخر بإنجازات طلبة المنصة — تفوقهم وتصدرهم قائمة أوائل الطلاب على المستوى الوطني سنة بعد سنة.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {YEARS.map((y) => (
            <button key={y} onClick={() => setYear(y)} dir="ltr"
              className={`px-5 py-2 rounded-full font-black text-sm transition-all ${year === y ? "bg-[#2072e0] text-white shadow-lg" : "bg-[#161c29] text-[#9297a6] border border-[#2b3547] hover:border-[#2072e0]/60"}`}>
              {y}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((s) => (
            <div key={s.name} className="rounded-[2rem] overflow-hidden border border-[#2b3547] bg-[#161c29] shadow-2xl hover:-translate-y-1 transition-all">
              <div className="relative h-64 sm:h-72">
                <div className="absolute inset-0 bg-gradient-to-b from-[#3b0764] via-[#2a1050] to-[#161c29]" />
                <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161c29] via-transparent to-transparent" />
                <div className="absolute top-4 inset-x-0 text-center font-black text-4xl text-white drop-shadow-[0_4px_16px_rgba(0,0,0,.5)]" dir="ltr">{s.pct}</div>
                <div className="absolute bottom-3 inset-x-0 text-center px-4">
                  <div className="font-black text-lg text-white">{s.name}</div>
                  <div className="text-[#9297a6] text-xs font-bold mt-0.5">{s.rank}</div>
                </div>
              </div>
              <p className="p-5 text-white/75 text-xs sm:text-sm leading-relaxed text-center font-medium">«{s.quote}»</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/grades" className="bg-[#2072e0] hover:bg-[#1b63c4] text-white font-black text-sm px-9 py-3.5 rounded-full transition-colors">ابدأ قصتك معنا</Link>
          <Link href="/bundles" className="border border-[#2b3547] font-bold text-sm px-9 py-3.5 rounded-full hover:border-[#2072e0]/60 transition-colors">شوف العروض</Link>
        </div>
      </main>
      <div className="pb-10 flex justify-center">
        <Link href="/" className="text-xs font-bold text-[#9297a6] hover:text-white transition-colors">← رجوع للرئيسية</Link>
      </div>
    </div>
  );
}
