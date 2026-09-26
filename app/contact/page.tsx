"use client";

import Link from "next/link";
import { Icon, Logo, KuwaitFlag } from "@/components/ui";


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0f1217] text-white">
      <header className="border-b border-[#2b3547]/60">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-7">
            <Link href="/"><Logo size={38} light /></Link>
            <Link href="/bundles" className="text-sm font-bold text-[#9297a6] hover:text-white transition-colors">العروض</Link>
          </div>
          <span className="hidden sm:flex items-center gap-2 bg-[#161c29] border border-[#2b3547] rounded-full px-3.5 py-2 text-xs font-bold">
            <KuwaitFlag w={22} /> الكويت
          </span>
        </div>
      </header>
      <main className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-12 pb-20 animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-black mb-3">تواصل معنا</h1>
          <p className="text-[#9297a6] font-bold">تفوّق منصة كويتية مقرها في مدينة الكويت — نرد عليك بسرعة</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <a href="https://wa.me/96500000000" target="_blank" rel="noreferrer"
            className="bg-[#161c29] border border-[#2b3547] rounded-[22px] p-6 flex items-center gap-4 hover:border-[#33bf6b]/60 transition-all">
            <span className="w-14 h-14 rounded-2xl bg-[#33bf6b]/15 text-[#33bf6b] flex items-center justify-center shrink-0"><Icon name="wa" size={26} /></span>
            <span><span className="block font-black">واتساب</span><span className="block text-xs text-[#9297a6] font-bold mt-1" dir="ltr">+965 0000 0000</span></span>
          </a>
          <div className="bg-[#161c29] border border-[#2b3547] rounded-[22px] p-6 flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-[#2072e0]/15 text-[#4a9bf5] flex items-center justify-center shrink-0"><Icon name="chat" size={24} /></span>
            <span><span className="block font-black">محادثة أونلاين</span><span className="block text-xs text-[#9297a6] font-bold mt-1">من زر الشات العائم في كل صفحة</span></span>
          </div>
        </div>
        <div className="text-center mt-10">
          <Link href="/" className="text-xs font-bold text-[#9297a6] hover:text-white transition-colors">← رجوع للرئيسية</Link>
        </div>
      </main>
    </div>
  );
}
