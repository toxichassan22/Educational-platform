"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Icon, Logo, KuwaitFlag } from "@/components/ui";
import { bundleOffers } from "@/lib/data";

export default function BundlesPage() {
  const { db, me } = useStore();
  const offers = bundleOffers(db);
  return (
    <div className="min-h-screen bg-[#0f1217] text-white">
      <header className="border-b border-[#2b3547]/60">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-7">
            <Link href="/"><Logo size={38} light /></Link>
            <Link href="/grades" className="text-sm font-bold text-[#9297a6] hover:text-white">المكتبة</Link>
          </div>
          <Link href={me ? (me.role === "student" ? "/student/subscription" : me.role === "parent" ? "/parent" : "/admin") : "/login"}
            className="bg-[#2072e0] hover:bg-[#1b63c4] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors">
            {me ? "اشترك الآن" : "ادخل"}
          </Link>
        </div>
      </header>
      <main className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-12 pb-20 animate-fade-up">
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] font-black px-4 py-1.5 rounded-full bg-[#f5b329]/15 text-[#f5b329] border border-[#f5b329]/30 mb-4">عروض العام الدراسي</span>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">اشتراك واحد يفتح كل مواد مرحلتك</h1>
          <p className="text-[#9297a6] font-bold">فيديوهات + مذكرات + اختبارات ذكية — جرّب أول درس مجانًا</p>
        </div>
        <div className="flex flex-wrap items-stretch justify-center gap-6 mb-10">
          {offers.map((o) => (
            <div key={o.packageId}
              className={`relative rounded-[22px] p-7 flex flex-col w-full sm:w-[300px] ${o.popular ? "bg-[#1a2c4d] border-[2.5px] border-[#2072e0] sm:scale-[1.06] shadow-2xl" : "bg-[#161c29] border border-[#2b3547]"}`}>
              {o.popular && (
                <div className="absolute -top-3.5 right-1/2 translate-x-1/2 bg-[#2072e0] text-white text-xs font-black px-4 py-1.5 rounded-xl whitespace-nowrap">الأكثر اشتراكًا</div>
              )}
              <h3 className="font-black text-lg text-center mt-2">{o.name}</h3>
              <div className="text-center my-5 flex items-baseline justify-center gap-1.5" dir="ltr">
                <span className={`text-6xl font-black ${o.popular ? "text-[#4a9bf5]" : "text-white"}`}>{o.priceKwd}</span>
                <span className="text-sm font-bold text-[#9297a6]">د.ك</span>
              </div>
              <div className="text-center text-sm font-bold text-[#9297a6] mb-1 -mt-3">{o.period}</div>
              {o.wasPriceKwd && (
                <div className="text-center text-xs font-bold text-[#f5b329] mb-4">بدل {o.wasPriceKwd} د.ك — وفّر {o.savePct}%</div>
              )}
              <ul className="space-y-2.5 mb-6 flex-1">
                {o.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="font-black text-[#33bf6b]">✓</span>
                    <span className="text-[#fafbff]">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/bundles/${o.packageId}`}
                className={`text-center w-full h-[52px] leading-[52px] rounded-full font-black text-sm ${o.popular ? "bg-[#2072e0] text-white" : "bg-[#29344a] text-white"}`}>
                التفاصيل والاشتراك
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm font-bold text-[#9297a6]">دفع آمن عبر KNET · Visa · Mastercard — أكواد التجربة: KUWAIT20 و AHLAN10</p>
      </main>
    </div>
  );
}

