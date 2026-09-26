"use client";

import Link from "next/link";
import { Icon, Logo, KuwaitFlag } from "@/components/ui";


const STEPS = [
  { icon: "user", title: "أنشئ حسابًا لابنك", desc: "دقيقة واحدة برقم الهاتف — يختار صفه الدراسي من المكتبة." },
  { icon: "gem", title: "اشترك في باقة مرحلته", desc: "اشتراك واحد يفتح كل المواد — أو باقة مادة واحدة للتركيز." },
  { icon: "chart", title: "تابع تقدمه لحظة بلحظة", desc: "درجات الاختبارات ومعدل كل مادة ووقت الدراسة في لوحتك." },
];

export default function ParentsPage() {
  return (
    <div className="min-h-screen bg-[#0f1217] text-white">
      <header className="border-b border-[#2b3547]/60">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-7">
            <Link href="/"><Logo size={38} light /></Link>
            <Link href="/bundles" className="text-sm font-bold text-white hover:text-white">العروض</Link>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:flex items-center gap-2 bg-[#161c29] border border-[#2b3547] rounded-full px-3.5 py-2">
              <KuwaitFlag w={22} />
              <Icon name="down" size={10} className="text-[#9297a6]" />
            </span>
            <Link href="/login" className="bg-[#2072e0] hover:bg-[#1b63c4] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors">ادخل كولي أمر</Link>
          </div>
        </div>
      </header>
      <main className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-12 pb-20 animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-black mb-4">تابع مستوى أبنائك لحظة بلحظة</h1>
          <p className="text-[#9297a6] font-bold max-w-xl mx-auto">درجاتهم وتقدمهم ونشاطهم — وتدفع لهم الاشتراك من نفس اللوحة.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <Link href="/login" className="bg-[#2072e0] text-white font-black text-sm px-9 py-3.5 rounded-full">ادخل كولي أمر</Link>
            <Link href="/bundles" className="border border-[#2b3547] font-bold text-sm px-9 py-3.5 rounded-full">شوف العروض</Link>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="bg-[#161c29] border border-[#2b3547] rounded-[22px] p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#2072e0]/15 text-[#4a9bf5] flex items-center justify-center mb-4">
                <Icon name={s.icon} size={22} />
              </div>
              <div className="text-xs font-black text-[#5f6370] mb-1">خطوة {i + 1}</div>
              <h3 className="font-black mb-1.5">{s.title}</h3>
              <p className="text-sm text-[#9297a6] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
