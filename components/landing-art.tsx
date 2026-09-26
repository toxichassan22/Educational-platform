import React from "react";

/* ============================================================
   رسومات اللاندينج — أصول UULA الحقيقية المستضافة محليًا
   (فيديوهات WebM/MP4 بخلفية شفافة + صور CDN)
   ============================================================ */

const A = (p: string) => `/uula/${p}`;

/* فيديو بخلفية شفافة: VP9 لكروم / HEVC لسفاري — نفس تكوين UULA */
function AlphaVideo({
  webm,
  mp4,
  size,
  label,
}: {
  webm: string;
  mp4: string;
  size: number;
  label: string;
}) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      width={size}
      aria-label={label}
      className="drop-shadow-2xl pointer-events-none select-none"
    >
      <source src={A(webm)} type='video/webm; codecs="vp9"' />
      <source src={A(mp4)} type='video/mp4' />
    </video>
  );
}

/* هيرو: نسبة عملاقة + دايرة زرقا + صورة الطالبة الحقيقية + الاسم */
export function HeroArt() {
  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="relative">
        {/* هالة */}
        <div className="absolute inset-0 -m-10 rounded-full bg-[#2072e0]/25 blur-3xl" />
        {/* حلقة مدار رفيعة حول الدايرة */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[128%] aspect-square rounded-full border border-white/10 pointer-events-none" />

        {/* النسبة العملاقة فوق الدايرة */}
        <div className="absolute -top-10 sm:-top-14 inset-x-0 z-20 text-center pointer-events-none" dir="ltr">
          <span className="font-black text-white leading-none text-[4.2rem] sm:text-[6.5rem] lg:text-[7.5rem] drop-shadow-[0_6px_24px_rgba(0,0,0,.55)]">
            99.9%
          </span>
        </div>

        {/* الدايرة */}
        <div className="relative mt-12 sm:mt-16 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] lg:w-[460px] lg:h-[460px] rounded-full overflow-hidden shadow-2xl shadow-[#2072e0]/40 border border-white/10 bg-[#2072e0]">
          <img
            src={A("st-leen-clean.webp")}
            alt="لين حربات — الأولى على الكويت"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* تدرج سفلي لقراءة الاسم */}
          <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
          {/* الاسم والترتيب */}
          <div className="absolute bottom-5 sm:bottom-7 inset-x-0 text-center px-6">
            <div className="font-black text-lg sm:text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.6)]">
              لين حربات
            </div>
            <div className="text-xs sm:text-sm text-white/85 font-bold mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,.6)]">
              الأولى على الكويت - علمي
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* البطيخة المتحركة — فيديو UULA الأصلي */
export function WatermelonArt({ size = 200 }: { size?: number }) {
  return <AlphaVideo webm="watermelon.webm" mp4="watermelon.mp4" size={size * 1.4} label="ادرس وأنت مرتاح" />;
}

/* كتاب المذكرات المتحرك — فيديو UULA الأصلي */
export function BookQrArt({ size = 260 }: { size?: number }) {
  return <AlphaVideo webm="book.webm" mp4="book.mp4" size={size * 1.15} label="مذكرات شاملة" />;
}

/* اللابتوب المتحرك — فيديو UULA الأصلي */
export function LaptopArt({ size = 280 }: { size?: number }) {
  return <AlphaVideo webm="laptop.webm" mp4="laptop.mp4" size={size * 1.15} label="فيديوهات شرح مميزة" />;
}

/* الاختبارات الذكية — صورة UULA الأصلية */
export function QuizArt({ size = 260 }: { size?: number }) {
  return (
    <img
      src={A("smart-tests.png")}
      width={size * 1.15}
      alt="اختبارات ذكية"
      loading="lazy"
      className="drop-shadow-2xl"
    />
  );
}

/* شات المعلمين — صورة UULA الأصلية */
export function ChatArt({ size = 260 }: { size?: number }) {
  return (
    <img
      src={A("teachers-chat.png")}
      width={size * 1.15}
      alt="نخبة المعلمين معاك"
      loading="lazy"
      className="drop-shadow-2xl"
    />
  );
}

/* الباقات — صورة UULA الأصلية */
export function BoxArt({ size = 240 }: { size?: number }) {
  return (
    <img
      src={A("packages.png")}
      width={size * 1.3}
      alt="باقات علا"
      loading="lazy"
      className="drop-shadow-2xl"
    />
  );
}
