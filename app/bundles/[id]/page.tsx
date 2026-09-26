"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/ui";
import { bundleOffer, gradeShop } from "@/lib/data";


export default function BundleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const pkgId = decodeURIComponent(id);
  const { db } = useStore();
  const offer = bundleOffer(db, pkgId);
  const demo = gradeShop(db, "g10");

  if (!offer) {
    return (
      <div className="min-h-screen bg-[#0f1217] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-2">العرض غير موجود</h1>
          <Link href="/bundles" className="inline-block bg-[#2072e0] text-white text-sm font-bold px-8 py-3 rounded-full">كل العروض</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1217] text-white">
      <header className="border-b border-[#2b3547]/60">
        <div className="max-w-[1100px] mx-auto px-4 h-[72px] flex items-center justify-between">
          <Link href="/"><Logo size={38} light /></Link>
          <Link href="/bundles" className="text-sm font-bold text-[#9297a6] hover:text-white">كل العروض</Link>
        </div>
      </header>
      <main className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-10 pb-20 animate-fade-up">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-[#161c29] border border-[#2b3547] rounded-[28px] p-8">
            <h1 className="text-3xl font-black mb-2">{offer.name}</h1>
            <div className="flex items-baseline gap-2 my-4" dir="ltr">
              <span className="text-6xl font-black text-[#4a9bf5]">{offer.priceKwd}</span>
              <span className="font-bold text-[#9297a6]">د.ك / {offer.period}</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {offer.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="font-black text-[#33bf6b]">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="block text-center w-full h-[52px] leading-[52px] rounded-full font-black text-sm bg-[#2072e0] text-white">
              سجّل واشترك الآن
            </Link>
          </div>
          <div className="bg-[#161c29] border border-[#2b3547] rounded-[28px] p-8">
            <h2 className="font-black text-lg mb-2">وش تحصل عليه؟</h2>
            <p className="text-sm text-[#9297a6] leading-relaxed mb-4">
              مثال حي من {demo?.gradeName}: {demo?.subjects.length} مواد · {demo?.lessonsCount} درس فيديو — وأول {demo?.freeLessons} دروس مجانية.
            </p>
            <Link href="/grades/g10" className="inline-block border border-[#2072e0] text-[#4a9bf5] text-sm font-bold px-6 py-3 rounded-full">
              تصفح مثالًا حيًا
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
