"use client";

import Link from "next/link";
import { Icon, Logo, KuwaitFlag } from "@/components/ui";

const STEPS = [
  { icon: "user", title: "أنشئ حسابًا لابنك", desc: "دقيقة واحدة برقم الهاتف — يختار صفه الدراسي من المكتبة." },
  { icon: "gem", title: "اشترك في باقة مرحلته", desc: "اشتراك واحد يفتح كل المواد — أو باقة مادة واحدة للتركيز." },
  { icon: "chart", title: "تابع تقدمه لحظة بلحظة", desc: "درجات الاختبارات ومعدل كل مادة ووقت الدراسة في لوحتك." },
];

const FEATURES = [
  {
    icon: "chart",
    title: "تقارير أداء واضحة",
    desc: "معدل كل مادة، نقاط القوة والضعف، ومقارنة التقدم بين المحاولات — بدون تخمين.",
  },
  {
    icon: "bell",
    title: "إشعارات تهمّك",
    desc: "تنبيه عند نزول نتيجة اختبار، قرب انتهاء الاشتراك، أو تراجع في مستوى أحد الأبناء.",
  },
  {
    icon: "wallet",
    title: "ادفع من لوحتك",
    desc: "جدّد اشتراك أي ابن أو اشترِ باقة جديدة مباشرة — KNET وVisa وMastercard.",
  },
  {
    icon: "shield",
    title: "محتوى آمن ومنضبط",
    desc: "مذكرات وفيديوهات واختبارات مطابقة للمنهج الكويتي، مع ضوابط استخدام مناسبة للطلاب.",
  },
  {
    icon: "users",
    title: "أكثر من ابن؟ لا مشكلة",
    desc: "تبويب لكل ابن بحساب واحد — تتابع الجميع من مكان واحد دون تشتت.",
  },
  {
    icon: "lock",
    title: "خصوصية محفوظة",
    desc: "بيانات أبنائك تُستخدم لتحسين تعلمهم فقط — لا بيع للبيانات ولا إعلانات مزعجة.",
  },
];

const FAQ = [
  {
    q: "كيف أعرف مستوى ابني الحقيقي؟",
    a: "من لوحة ولي الأمر: نتائج كل اختبار، نسبة الإتقان لكل درس، وخطة المراجعة المقترحة من أخطائه.",
  },
  {
    q: "هل أقدر أغيّر الباقة لاحقًا؟",
    a: "نعم — ترقية أو تغيير نطاق الاشتراك من صفحة الاشتراك في لوحتك، والباقي يُحتسب تلقائيًا.",
  },
  {
    q: "ماذا لو انتهى الاشتراك؟",
    a: "يظهر قفل على المحتوى المدفوع مع خيار التجديد الفوري. الدروس المجانية تبقى متاحة دائمًا للتجربة.",
  },
  {
    q: "هل الدعم متوفر بالعربية؟",
    a: "نعم — فريق كويتي يرد عبر المحادثة الأونلاين وواتساب خلال دقائق في أوقات العمل.",
  },
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
        {/* الهيرو */}
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-black px-4 py-1.5 rounded-full bg-[#2072e0]/15 text-[#4a9bf5] border border-[#2072e0]/30 mb-4">
            لأولياء الأمور
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">تابع مستوى أبنائك لحظة بلحظة</h1>
          <p className="text-[#9297a6] font-bold max-w-xl mx-auto">
            درجاتهم وتقدمهم ونشاطهم — وتدفع لهم الاشتراك من نفس اللوحة. بلا مفاجآت قبل الامتحان.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <Link href="/login" className="bg-[#2072e0] hover:bg-[#1b63c4] text-white font-black text-sm px-9 py-3.5 rounded-full transition-colors">ادخل كولي أمر</Link>
            <Link href="/bundles" className="border border-[#2b3547] font-bold text-sm px-9 py-3.5 rounded-full hover:border-[#2072e0]/60 transition-colors">شوف العروض</Link>
          </div>
        </div>

        {/* الخطوات */}
        <div className="grid sm:grid-cols-3 gap-4 mb-14">
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

        {/* المزايا */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">كل اللي تحتاجه لمتابعة ابنك</h2>
          <p className="text-[#9297a6] font-bold">أدوات عملية — مو حمّل بيانات.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-[#161c29] border border-[#2b3547] rounded-[22px] p-6 hover:border-[#2072e0]/50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-[#2072e0]/15 text-[#4a9bf5] flex items-center justify-center mb-4">
                <Icon name={f.icon} size={20} />
              </div>
              <h3 className="font-black mb-1.5">{f.title}</h3>
              <p className="text-sm text-[#9297a6] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* الأسئلة */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black">أسئلة يسألها الآباء</h2>
        </div>
        <div className="space-y-3 max-w-2xl mx-auto mb-14">
          {FAQ.map((item) => (
            <div key={item.q} className="bg-[#161c29] border border-[#2b3547] rounded-[20px] p-5">
              <div className="font-black text-sm mb-1.5">{item.q}</div>
              <p className="text-sm text-[#9297a6] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        {/* CTA ختامي */}
        <div className="text-center bg-[#161c29] border border-[#2b3547] rounded-[28px] p-10">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">جاهز تبدأ مع ابنك؟</h2>
          <p className="text-[#9297a6] font-bold mb-6">أول درس مجانًا — وباقة المرحلة تفتح كل المواد.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/login" className="bg-[#2072e0] hover:bg-[#1b63c4] text-white font-black text-sm px-9 py-3.5 rounded-full transition-colors">ادخل كولي أمر</Link>
            <Link href="/contact" className="border border-[#2b3547] font-bold text-sm px-9 py-3.5 rounded-full hover:border-[#2072e0]/60 transition-colors">تواصل معنا</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
