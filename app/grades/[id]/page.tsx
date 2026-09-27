"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Icon, Logo, KuwaitFlag } from "@/components/ui";
import { gradeShop } from "@/lib/data";
import { stageTheme } from "@/lib/theme";

export default function GradeShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const gradeId = decodeURIComponent(id);
  const { db, me } = useStore();
  const shop = gradeShop(db, gradeId);
  const theme = stageTheme(shop?.stageId);

  return (
    <div className="min-h-screen bg-[#0f1217] text-white">
      <header className="border-b border-[#2b3547]/60">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-7">
            <Link href="/"><Logo size={38} light /></Link>
            <Link href="/grades" className="text-sm font-bold text-[#9297a6] hover:text-white transition-colors">المكتبة</Link>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:flex items-center gap-2 bg-[#161c29] border border-[#2b3547] rounded-full px-3.5 py-2">
              <KuwaitFlag w={22} />
              <Icon name="down" size={10} className="text-[#9297a6]" />
            </span>
            {me ? (
              <Link href={me.role === "student" ? "/student" : me.role === "parent" ? "/parent" : "/admin"}
                className="flex items-center gap-2.5 bg-[#161c29] border border-[#2b3547] rounded-full ps-1.5 pe-4 py-1.5">
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm bg-[#d99e66]">{me.name[0]}</span>
                <span className="hidden sm:block text-sm font-bold">{me.name}</span>
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 border-2 border-[#2072e0] text-white font-bold text-sm px-5 py-2 rounded-full">
                <Icon name="back" size={15} /> ادخل
              </Link>
            )}
          </div>
        </div>
      </header>

      {!shop ? (
        <main className="max-w-[1100px] mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black mb-2">الصف غير موجود</h1>
          <Link href="/grades" className="inline-block bg-[#2072e0] text-white font-bold text-sm px-8 py-3 rounded-full">ارجع للمكتبة</Link>
        </main>
      ) : (
        <main className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-10 pb-20 animate-fade-up">
          <div className="text-sm font-bold text-[#9297a6] mb-4">
            <Link href="/grades" className="hover:text-white">المكتبة</Link>
            <span className="mx-2">‹</span>
            <span className="text-white">{shop.gradeName}</span>
          </div>
          <div className="rounded-[28px] p-7 sm:p-10 relative overflow-hidden mb-8" style={{ background: theme.color }}>
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="relative">
              <span className="inline-block text-[11px] font-black px-3 py-1 rounded-full bg-white/15 mb-3">{shop.stageName}</span>
              <h1 className="text-3xl sm:text-4xl font-black mb-2">{shop.gradeName}</h1>
              <p className="text-white/75 font-bold text-sm mb-5">{theme.tagline} — {shop.subjects.length} مواد · {shop.lessonsCount} درسًا</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/bundles" className="bg-white text-sm font-black px-8 py-3 rounded-full" style={{ color: theme.color }}>اشترك وافتح كل المواد</Link>
                <Link href="/login" className="border-2 border-white/40 text-white text-sm font-bold px-8 py-3 rounded-full">جرّب {shop.freeLessons} دروس مجانية</Link>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-black mb-4">مواد {shop.gradeName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {shop.subjects.map((s) => (
              <Link key={s.id} href={`/student/subject/${encodeURIComponent(s.id)}`}>
                <div className="bg-[#161c29] rounded-2xl p-5 h-full border border-[#2b3547]">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${s.color}20`, color: s.color }}>
                    <Icon name={s.icon} size={24} />
                  </div>
                  <div className="font-black text-lg">{s.name}</div>
                  <div className="text-[#9297a6] text-[11px] mt-0.5">{s.teacher}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="bg-[#161c29] border border-[#2b3547] rounded-[28px] p-7 text-center">
            <h2 className="text-2xl font-black mb-2">جاهز تبدأ {shop.gradeName}؟</h2>
            <p className="text-[#9297a6] text-sm mb-6">اشتراك واحد يفتح كل المواد — فيديوهات ومذكرات واختبارات</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/bundles" className="bg-[#2072e0] text-white font-black text-sm px-9 py-3.5 rounded-full">شوف العروض</Link>
              <Link href="/parents" className="border border-[#2b3547] font-bold text-sm px-9 py-3.5 rounded-full">لأولياء الأمور</Link>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

