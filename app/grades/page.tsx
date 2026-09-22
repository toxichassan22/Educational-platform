"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Icon, Logo, KuwaitFlag } from "@/components/ui";

const EXTRAS = [
  { name: "اختبار القدرات", mark: "★" },
  { name: "الجامعة", mark: "🎓" },
  { name: "دورات إضافية", mark: "+" },
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
      {/* نافبار — نفس نمط فيجما */}
      <header className="border-b border-[#2b3547]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-7">
            <Link href="/"><Logo size={38} light /></Link>
            <Link href="/grades" className="text-[#99a8bd] text-sm font-bold hover:text-white transition-colors">تسوق</Link>
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
                className="bg-[#2072e0] hover:bg-[#1b63c4] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors">
                ادخل
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 py-14">
        <h1 className="text-center text-3xl sm:text-4xl font-black mb-3">المراحل الدراسية</h1>
        <p className="text-center text-[#99a8bd] mb-12">اختار صفك وابدأ الاشتراك في مواد مرحلتك</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {db.grades.map((g) => (
            <button key={g.id} onClick={pick}
              className="bg-[#161c29] border border-[#2b3547] rounded-[18px] py-9 px-4 text-center transition-all hover:border-[#2072e0]/70 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2072e0]/10 group">
              <div className="text-6xl sm:text-7xl font-black text-[#5999ff] mb-4 tabular-nums" dir="ltr">{g.order}</div>
              <div className="font-bold text-lg">{g.name}</div>
            </button>
          ))}
          {EXTRAS.map((x) => (
            <button key={x.name} onClick={pick}
              className="bg-[#161c29] border border-[#2b3547] rounded-[18px] py-9 px-4 text-center transition-all hover:border-[#2072e0]/70 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2072e0]/10">
              <div className="text-5xl font-black text-[#5999ff] mb-4 h-[4.5rem] flex items-center justify-center">{x.mark}</div>
              <div className="font-bold text-lg">{x.name}</div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
