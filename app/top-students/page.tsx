"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon, Logo, KuwaitFlag } from "@/components/ui";

const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"];

const STUDENTS_2025 = [
  { name: "يوسف عبدالمحسن حسين الابراهيم", rank: "الأول على الكويت – علمي", pct: "100%", img: "/uula/st-yousef.webp", quote: "ساعدتني علا أدرس بسهولة وبسرعة. المصادر واضحة وما أحتاج أتعب نفسي في البحث. وفي بنك أسئلة الفيزياء، كل سؤال له حل وشرح واضح، وهذا خلّى الدراسة أسهل وأكثر تنظيمًا." },
  { name: "فجر علي ماجد العتيبي", rank: "الأول على الكويت – علمي", pct: "100%", img: "/uula/st-nour.webp", quote: "منو ما يعرف علا؟ أخوي الكبير هو أول واحد اشترك في علا ومن بعدها أنا وأخوي اشتركنا. أحس من لما بديت في علا ارتاحت — فيه مذكرات وفيه فيديوهات شرح وفيه بطاقات حفظ فصارت الدراسة أسهل وأمتع." },
  { name: "نورا محمد ربيح عبداللطيف", rank: "من أوائل الكويت – علمي", pct: "99.99%", img: "/uula/st-leen-nasser.webp", quote: "بدأت مع علا من صف العاشر بعد ما شفت عرض على الإنستجرام قبل الفاينل، واستمريت ثلاث سنوات. وأكثر شيء يميز علا هو الرد السريع على الأسئلة خلال دقائق." },
  { name: "لين محمد حريبات", rank: "من أوائل الكويت – علمي", pct: "99.99%", img: "/uula/st-leen.webp", quote: "الترتيب وتنظيم المذكرات والأسئلة ممتاز، والأسئلة التدريبية بعد الفيديوهات تأكد الفهم. كل شيء مرتب ومنظم، وهذا اللي يميزها عن باقي المنصات." },
  { name: "جمانة النجدي", rank: "الثاني على الكويتيين – علمي", pct: "99.99%", img: "/uula/st-jumana.webp", quote: "أحلى ميزة إني أقدر أطالع الفيديوهات وأعيدها على كيفي — أسرع وأبطئ الفيديو. وأي سؤال أحتاجه بس أسأل ويردون عليّ بأقل من دقايق." },
  { name: "سليم مسيكة", rank: "الأول على الكويت – علمي", pct: "100%", img: "/uula/st-saleem.webp", quote: "أفضل شي بعلا هو وجود فيديوهات فيها شرح من مدرسين خبراء — الطالب ينظم وقت دراسته على نمط حياته ويدرس على مدار 24 ساعة بأي وقت يبيه." },
];

export default function TopStudentsPage() {
  const [year, setYear] = useState("2025");
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
          <p className="text-[#9297a6] font-bold max-w-2xl mx-auto">نفتخر بإنجازات طلبة المنصة — تفوقهم وتصدرهم قائمة أوائل الطلاب على المستوى الوطني سنة بعد سنة.</p>
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
          {STUDENTS_2025.map((s) => (
            <div key={s.name} className="rounded-[2rem] overflow-hidden border border-[#2b3547] bg-[#161c29] shadow-2xl hover:-translate-y-1 transition-all">
              <div className="relative h-64 sm:h-72">
                <img src={s.img} alt={s.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161c29] via-[#161c29]/20 to-transparent" />
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
        {year !== "2025" && (
          <p className="text-center text-sm text-[#9297a6] font-bold mt-8">أرشيف سنة {year} — يُعرض قريبًا بنفس هذا التصميم.</p>
        )}
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

