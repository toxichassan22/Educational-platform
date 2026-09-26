import React from "react";

/* رسومات اللاندنج — أصول أصلية مرسومة بالكود (صفر صور خارجية) */

function ArtCard({ icon, accent, label }: { icon: string; accent: string; label: string }) {
  return (
    <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]">
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: accent }} />
      <div className="absolute inset-0 rounded-[2.5rem] bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center gap-4">
        <span className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-xl" style={{ background: accent }}>
          {icon}
        </span>
        <span className="text-sm font-black text-white/85">{label}</span>
      </div>
    </div>
  );
}

export function SkyBg() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
      <div className="absolute inset-0 bg-[#0f1217]" />
      <div className="absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-[#16233c] via-[#101828] to-transparent" />
      <div className="absolute -top-24 right-[12%] w-[34rem] h-[34rem] rounded-full bg-[#2072e0]/15 blur-3xl" />
    </div>
  );
}

export function HeroArt() {
  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="relative">
        <div className="absolute inset-0 -m-10 rounded-full bg-[#2072e0]/25 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[128%] aspect-square rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -top-10 sm:-top-14 inset-x-0 z-20 text-center pointer-events-none" dir="ltr">
          <span className="font-black text-white leading-none text-[4.2rem] sm:text-[6.5rem] lg:text-[7.5rem] drop-shadow-[0_6px_24px_rgba(0,0,0,.55)]">
            99.9%
          </span>
        </div>
        <div className="relative mt-12 sm:mt-16 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] lg:w-[460px] lg:h-[460px] rounded-full overflow-hidden shadow-2xl shadow-[#2072e0]/40 border border-white/10 bg-gradient-to-b from-[#1c2c4d] to-[#101828] flex items-center justify-center">
          <div className="text-center px-10">
            <div className="mx-auto mb-4 w-24 h-24 rounded-3xl bg-[#2072e0] flex items-center justify-center text-5xl font-black text-white shadow-xl">ت</div>
            <div className="font-black text-xl sm:text-2xl text-white">أوائل الكويت</div>
            <div className="text-xs sm:text-sm text-white/70 font-bold mt-1">يدرسون مع تفوّق كل يوم</div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 sm:bottom-7 inset-x-0 text-center px-6">
            <div className="font-black text-lg sm:text-2xl text-white">قصص تفوق حقيقية</div>
            <div className="text-xs sm:text-sm text-white/85 font-bold mt-1">من طلاب منصتنا</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WatermelonArt() {
  return <ArtCard icon="◐" accent="#33bf6b" label="ادرس وانت مرتاح" />;
}

export function BookQrArt() {
  return <ArtCard icon="📚" accent="#2072e0" label="مذكرات شاملة" />;
}

export function LaptopArt() {
  return <ArtCard icon="▶" accent="#8e5cf0" label="فيديوهات شرح" />;
}

export function QuizArt() {
  return <ArtCard icon="✓" accent="#33bf6b" label="اختبارات ذكية" />;
}

export function ChatArt() {
  return <ArtCard icon="✉" accent="#f5b329" label="نخبة المعلمين" />;
}

export function BoxArt() {
  return <ArtCard icon="◆" accent="#4a9bf5" label="باقات التوفير" />;
}

export function TopBadgeArt() {
  return (
    <div className="h-16 sm:h-24 aspect-square rounded-3xl bg-[#f5b329]/15 border border-[#f5b329]/40 flex items-center justify-center">
      <span className="text-4xl sm:text-5xl">🏆</span>
    </div>
  );
}

export function PayBadges() {
  const pays = ["KNET", "VISA", "MC"];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {pays.map((p) => (
        <span key={p} className="h-7 px-2.5 rounded-md bg-white text-[#0f1217] text-[11px] font-black flex items-center" dir="ltr">{p}</span>
      ))}
    </div>
  );
}
