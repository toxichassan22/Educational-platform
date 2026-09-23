import React from "react";

/* ============================================================
   رسومات اللاندينج — SVG أصلية مرسومة يدويًا (مطابقة لفيجما)
   ============================================================ */

/* هيرو: دايرة زرقا + صورة طالب متفوق + 99.9% + اسم */
export function HeroArt() {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        {/* هالة */}
        <div className="absolute inset-0 -m-10 rounded-full bg-[#2072e0]/25 blur-3xl" />
        {/* الدايرة */}
        <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden shadow-2xl shadow-[#2072e0]/40 border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
            alt="طالب متفوق من منصة تفوق"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* لمعة علوية */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
        </div>
        {/* نسبة التفوق فوق الدايرة */}
        <div className="absolute -bottom-5 inset-x-0 text-center">
          <span className="font-black text-5xl sm:text-6xl text-white drop-shadow-[0_4px_16px_rgba(0,0,0,.5)]" dir="ltr">
            99.9%
          </span>
        </div>
      </div>
      {/* اسم الطالب */}
      <div className="mt-10 text-center">
        <div className="font-black text-lg text-white">أحمد الكندري</div>
        <div className="text-sm text-white/60 font-bold mt-1">الأول على الكويتيين - علمي</div>
      </div>
    </div>
  );
}

/* بطيخة مرسومة — قشرة خضرا + لب أحمر + بزر */
export function WatermelonArt({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 220 160" width={size} height={size * 0.72} className="drop-shadow-2xl">
      {/* نص بطيخة */}
      <g transform="translate(30,10)">
        <path d="M0 40a80 80 0 0 0 160 0z" fill="#1d7a3f" />
        <path d="M8 40a72 72 0 0 0 144 0z" fill="#eaf7e0" />
        <path d="M16 40a64 64 0 0 0 128 0z" fill="#e5484d" />
        {[38, 62, 86, 110, 134].map((x, i) => (
          <ellipse key={i} cx={x} cy={52 + (i % 2) * 14} rx="3.4" ry="5" fill="#2b2b2b" transform={`rotate(${(x - 86) / 4} ${x} 60)`} />
        ))}
      </g>
      {/* شريحة */}
      <g transform="translate(140,72) rotate(18)">
        <path d="M0 0a34 34 0 0 0 68 0z" fill="#1d7a3f" />
        <path d="M4 0a30 30 0 0 0 60 0z" fill="#eaf7e0" />
        <path d="M8 0a26 26 0 0 0 52 0z" fill="#f0616a" />
        <ellipse cx="24" cy="10" rx="2.4" ry="3.6" fill="#2b2b2b" />
        <ellipse cx="42" cy="12" rx="2.4" ry="3.6" fill="#2b2b2b" />
      </g>
    </svg>
  );
}

/* كتاب مفتوح + موبايل QR */
export function BookQrArt({ size = 260 }: { size?: number }) {
  return (
    <svg viewBox="0 0 300 200" width={size} height={size * 0.66} className="drop-shadow-2xl">
      {/* الكتاب */}
      <g transform="translate(20,30)">
        <path d="M10 20c30-10 60-10 90 0v130c-30-10-60-10-90 0z" fill="#f4f1e8" stroke="#d8d2c0" strokeWidth="2" />
        <path d="M190 20c-30-10-60-10-90 0v130c30-10 60-10 90 0z" fill="#fbf9f2" stroke="#d8d2c0" strokeWidth="2" transform="translate(-90,0) translate(90,0)" />
        <path d="M190 20c-30-10-60-10-90 0v130c30-10 60-10 90 0z" fill="#fbf9f2" stroke="#d8d2c0" strokeWidth="2" />
        {/* سطور */}
        {[0, 1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <rect x="26" y={40 + i * 22} width="58" height="6" rx="3" fill="#c9c2ac" />
            <rect x="116" y={40 + i * 22} width="58" height="6" rx="3" fill="#d8d2c0" />
          </React.Fragment>
        ))}
        {/* ماركر */}
        <rect x="60" y="88" width="80" height="10" rx="5" fill="#f5b329" opacity=".6" transform="rotate(-3 100 93)" />
      </g>
      {/* موبايل بـ QR */}
      <g transform="translate(206,58)">
        <rect width="74" height="120" rx="12" fill="#1a2333" stroke="#3a4761" strokeWidth="2" />
        <rect x="8" y="12" width="58" height="80" rx="6" fill="#fff" />
        {/* QR pattern */}
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) =>
            (r * 3 + c * 7) % 4 !== 0 ? <rect key={r + "-" + c} x={14 + c * 12} y={18 + r * 12} width="9" height="9" rx="1" fill="#1a2333" /> : null
          )
        )}
        <rect x="14" y="18" width="12" height="12" rx="2" fill="none" stroke="#1a2333" strokeWidth="2.4" />
        <rect x="50" y="18" width="12" height="12" rx="2" fill="none" stroke="#1a2333" strokeWidth="2.4" />
        <rect x="14" y="62" width="12" height="12" rx="2" fill="none" stroke="#1a2333" strokeWidth="2.4" />
        <rect x="28" y="102" width="18" height="4" rx="2" fill="#3a4761" />
      </g>
    </svg>
  );
}

/* لابتوب بشاشة بلاير */
export function LaptopArt({ size = 280 }: { size?: number }) {
  return (
    <svg viewBox="0 0 320 210" width={size} height={size * 0.66} className="drop-shadow-2xl">
      {/* شاشة */}
      <rect x="40" y="14" width="240" height="150" rx="10" fill="#141c2c" stroke="#3a4761" strokeWidth="2" />
      <rect x="52" y="26" width="216" height="126" rx="6" fill="#0b1120" />
      {/* بلاير */}
      <circle cx="160" cy="80" r="24" fill="#2072e0" />
      <path d="M153 70l18 10-18 10z" fill="#fff" />
      <rect x="70" y="118" width="180" height="5" rx="2.5" fill="#2a3550" />
      <rect x="70" y="118" width="104" height="5" rx="2.5" fill="#2072e0" />
      <circle cx="174" cy="120.5" r="5" fill="#fff" />
      <rect x="70" y="132" width="60" height="8" rx="4" fill="#2a3550" />
      <rect x="200" y="132" width="50" height="8" rx="4" fill="#2a3550" />
      {/* قاعدة اللابتوب */}
      <path d="M20 164h280l14 24a8 8 0 0 1-8 10H14a8 8 0 0 1-8-10z" fill="#232f47" />
      <rect x="130" y="172" width="60" height="6" rx="3" fill="#141c2c" />
      {/* شمس وقمر وسحابة جانبية */}
      <circle cx="34" cy="46" r="12" fill="#f5b329" />
      <circle cx="292" cy="42" r="10" fill="#8ea6cc" />
      <circle cx="298" cy="38" r="8" fill="#0f1217" opacity="0" />
      <g fill="#33415e">
        <ellipse cx="36" cy="150" rx="18" ry="9" />
        <ellipse cx="288" cy="140" rx="16" ry="8" />
      </g>
    </svg>
  );
}

/* تابلت كويز + موبايل نتيجة */
export function QuizArt({ size = 260 }: { size?: number }) {
  return (
    <svg viewBox="0 0 300 200" width={size} height={size * 0.66} className="drop-shadow-2xl">
      {/* تابلت */}
      <rect x="20" y="24" width="180" height="140" rx="14" fill="#1a2333" stroke="#3a4761" strokeWidth="2" />
      <rect x="32" y="36" width="156" height="116" rx="8" fill="#0f1626" />
      <rect x="44" y="48" width="90" height="10" rx="5" fill="#3a4761" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="44" y={70 + i * 26} width="132" height="18" rx="9" fill={i === 1 ? "#16375e" : "#1c2740"} stroke={i === 1 ? "#2072e0" : "#2a3550"} />
          <circle cx={56} cy={79 + i * 26} r="5" fill="none" stroke={i === 1 ? "#2072e0" : "#3a4761"} strokeWidth="2" />
          {i === 1 && <circle cx="56" cy="79" r="2.6" fill="#2072e0" />}
          <rect x="68" y={75 + i * 26} width={70 - i * 14} height="7" rx="3.5" fill="#3a4761" />
        </g>
      ))}
      {/* موبايل بنتيجة */}
      <g transform="translate(204,60)">
        <rect width="76" height="130" rx="12" fill="#1a2333" stroke="#3a4761" strokeWidth="2" />
        <rect x="8" y="10" width="60" height="110" rx="6" fill="#0f1626" />
        <circle cx="38" cy="46" r="20" fill="#123322" />
        <path d="M29 46l6 6 13-13" stroke="#33c48d" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <rect x="20" y="76" width="36" height="7" rx="3.5" fill="#33c48d" />
        <rect x="16" y="90" width="44" height="6" rx="3" fill="#2a3550" />
        <rect x="24" y="102" width="28" height="6" rx="3" fill="#2a3550" />
      </g>
      {/* كونفيتي */}
      {[["#f5b329", 16, 20], ["#33c48d", 270, 26], ["#2072e0", 240, 14], ["#e5484d", 60, 8]].map(([c, x, y], i) => (
        <rect key={i} x={x as number} y={y as number} width="10" height="4" rx="2" fill={c as string} transform={`rotate(${i * 40} ${x as number} ${y as number})`} />
      ))}
    </svg>
  );
}

/* شات معلمين — فقاعات + أفاتار */
export function ChatArt({ size = 260 }: { size?: number }) {
  return (
    <svg viewBox="0 0 300 200" width={size} height={size * 0.66} className="drop-shadow-2xl">
      {/* نافذة شات */}
      <rect x="40" y="16" width="220" height="168" rx="18" fill="#141c2c" stroke="#3a4761" strokeWidth="2" />
      {/* هيدر */}
      <rect x="40" y="16" width="220" height="34" rx="18" fill="#1c2740" />
      <circle cx="66" cy="33" r="10" fill="#d4a373" />
      <circle cx="66" cy="33" r="10" fill="none" stroke="#33c48d" strokeWidth="2" />
      <rect x="84" y="26" width="70" height="7" rx="3.5" fill="#8ea6cc" />
      <rect x="84" y="37" width="44" height="5" rx="2.5" fill="#3a4761" />
      {/* فقاعة معلم */}
      <rect x="56" y="62" width="130" height="34" rx="12" fill="#22304c" />
      <rect x="68" y="72" width="100" height="6" rx="3" fill="#5b7099" />
      <rect x="68" y="83" width="70" height="6" rx="3" fill="#5b7099" />
      {/* فقاعة طالب */}
      <rect x="114" y="104" width="130" height="34" rx="12" fill="#2072e0" />
      <rect x="126" y="114" width="100" height="6" rx="3" fill="#bcd6f7" />
      <rect x="150" y="125" width="76" height="6" rx="3" fill="#bcd6f7" />
      {/* تايبينغ */}
      <rect x="56" y="148" width="56" height="24" rx="12" fill="#22304c" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={72 + i * 14} cy="160" r="3" fill="#5b7099" />
      ))}
    </svg>
  );
}

/* بوكس باقات مفتوح بأيقونات طالعة + تاج خصم */
export function BoxArt({ size = 240 }: { size?: number }) {
  return (
    <svg viewBox="0 0 260 210" width={size} height={size * 0.8} className="drop-shadow-2xl">
      {/* أيقونات طالعة */}
      <g>
        <circle cx="70" cy="42" r="16" fill="#22304c" />
        <path d="M64 42h12M70 36v12" stroke="#4a9bf5" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="130" cy="28" r="16" fill="#22304c" />
        <path d="M123 28l5 5 9-9" stroke="#33c48d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="190" cy="46" r="16" fill="#22304c" />
        <path d="M184 40l6 6 6-6v12h-12z" stroke="#f5b329" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
      {/* أغطية البوكس المفتوحة */}
      <path d="M52 96L20 74l44-14 34 20z" fill="#c98a4b" />
      <path d="M208 96l32-22-44-14-34 20z" fill="#b87a3d" />
      {/* جسم البوكس */}
      <path d="M52 96h156v72a10 10 0 0 1-10 10H62a10 10 0 0 1-10-10z" fill="#a9713a" />
      <path d="M52 96h156v14H52z" fill="#8f5e2e" />
      <rect x="118" y="96" width="24" height="82" fill="#f5d9a8" opacity=".55" />
      {/* تاج خصم */}
      <g transform="translate(196,120) rotate(12)">
        <rect x="-6" y="-20" width="76" height="34" rx="8" fill="#f5b329" />
        <text x="32" y="3" textAnchor="middle" fontSize="15" fontWeight="900" fill="#3d2b00">خصم 80%</text>
      </g>
    </svg>
  );
}
