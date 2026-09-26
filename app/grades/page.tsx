"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Icon, Logo, KuwaitFlag } from "@/components/ui";

/* مراحل إضافية خارج صفوف المدرسة — نفس تايلات UULA */
const EXTRAS = [
  { name: "اختبار القدرات", img: "/uula/grade-qudrat.png" },
  { name: "الجامعة", img: "/uula/grade-uni.png" },
];

export default function GradesPage() {
  const { db, me } = useStore();
  const router = useRouter();

  const pick = () => {
    if (me?.role === "student") router.push("/student");
    else router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0f1217] text-white">
      {/* نافبار — نفس نمط UULA */}
      <header className="border-b border-[#2b3547]/60">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-7">
            <Link href="/"><Logo size={38} light /></Link>
            <Link href="/grades" className="text-white text-sm font-bold hover:text-white transition-colors">تسوق</Link>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:flex items-center gap-2 bg-[#161c29] border border-[#2b3547] rounded-full px-3.5 py-2">
              <KuwaitFlag w={22} />
              <Icon name="down" size={10} className="text-[#8e99ab]" />
            </span>
            {me ? (
              <Link href={me.role === "student" ? "/student" : me.role === "parent" ? "/parent" : "/admin"}
                className="flex items-center gap-2.5 bg-[#161c29] border border-[#2b3547] rounded-full ps-1.5 pe-4 py-1.5 hover:border-[#2072e0]/60 transition-colors">
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm bg-[#d99e66]">{me.name[0]}</span>
                <span className="hidden sm:block text-sm font-bold">{me.name}</span>
              </Link>
            ) : (
              <Link href="/login"
                className="flex items-center gap-2 border-2 border-[#2072e0] text-white hover:bg-[#2072e0] font-bold text-sm px-5 py-2 rounded-full transition-all">
                <Icon name="back" size={15} />
                ادخل
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-12 pb-20">
        <h1 className="text-center text-3xl sm:text-4xl font-black mb-12">المكتبة</h1>

        {/* تايلات الصفوف — أرقام UULA ثلاثية الأبعاد */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {db.grades.map((g) => {
            const hasArt = g.order >= 4 && g.order <= 12;
            return (
              <button key={g.id} onClick={pick} title={g.name}
                className="aspect-square bg-[#1a2030] hover:bg-[#1f2637] border border-white/[0.05] rounded-[26px] flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 group">
                {hasArt ? (
                  <img
                    src={`/uula/grade-${g.order}.png`}
                    alt={g.name}
                    loading="lazy"
                    className="w-[62%] h-auto drop-shadow-2xl group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="text-6xl sm:text-7xl font-black bg-gradient-to-b from-[#5c9dff] to-[#2b5fb8] bg-clip-text text-transparent tabular-nums" dir="ltr">
                    {g.order}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* مرحلة أخرى */}
        <h2 className="text-2xl sm:text-3xl font-black mt-16 mb-7 text-right">مرحلة أخرى</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {EXTRAS.map((x) => (
            <button key={x.name} onClick={pick}
              className="aspect-square bg-[#1a2030] hover:bg-[#1f2637] border border-white/[0.05] rounded-[26px] p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 group text-right">
              <span className="font-black text-base sm:text-lg">{x.name}</span>
              <img src={x.img} alt={x.name} loading="lazy" className="w-2/3 h-auto self-start drop-shadow-2xl group-hover:scale-105 transition-transform" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
