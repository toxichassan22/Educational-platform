"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Icon, Logo } from "@/components/ui";

const FEATURES = [
  { icon: "doc", title: "مذكرات شاملة", desc: "أقوى المذكرات تغطي منهجك بالكامل — عرض داخل المنصة وتحميل PDF", color: "#0891b2" },
  { icon: "video", title: "فيديوهات شرح مميزة", desc: "دروس مسجلة من نخبة المعلمين، تعيدها وقت ما تبي وبالسرعة اللي تناسبك", color: "#6d28d9" },
  { icon: "target", title: "اختبارات ذكية", desc: "اختبارات موقوتة بتصحيح تلقائي فوري تكشف نقاط ضعفك وتعالجها", color: "#e11d48" },
  { icon: "chart", title: "تقارير أداء دقيقة", desc: "إحصائيات فورية لمستواك في كل مادة ودرس — تعرف وين توصل أول بأول", color: "#059669" },
  { icon: "users", title: "متابعة ولي الأمر", desc: "لوحة خاصة لأهلك تتابع درجاتك وتقدمك لحظة بلحظة", color: "#d97706" },
  { icon: "flame", title: "نقاط وتحديات", desc: "اجمع XP مع كل درس واختبار، حافظ على سلسلتك اليومية، وتنافس للقمة", color: "#ea580c" },
];

const TICKER = ["الرياضيات", "الفيزياء", "الكيمياء", "الأحياء", "اللغة العربية", "اللغة الإنجليزية", "العلوم", "الدراسات الاجتماعية", "التربية الإسلامية"];

const STEPS = [
  { n: "١", t: "أنشئ حسابك", d: "سجّل خلال ثوانٍ وحدد صفك", icon: "user" },
  { n: "٢", t: "اختر مادتك", d: "منهجك منظم: وحدات ودروس ومذكرات", icon: "grid" },
  { n: "٣", t: "ادرس واختبر", d: "فيديو + مذكرة + اختبار ذكي", icon: "bolt" },
  { n: "٤", t: "تابع تقدمك", d: "تقارير تكشف قوتك وضعفك", icon: "trophy" },
];

const TESTIMONIALS = [
  { name: "أم عبدالله", role: "ولية أمر — الكويت", initial: "ع", color: "#6d28d9",
    text: "أخيرًا أعرف مستوى ولدي أول بأول — التقارير واضحة، والإشعارات توصلني بنتيجة كل اختبار لحظتها." },
  { name: "أحمد — صف عاشر", role: "طالب ثانوية", initial: "أ", color: "#0891b2",
    text: "الاختبارات الموقوتة ورّتني وين أضعف بالضبط، والستريك اليومي خلّى المذاكرة عادة ما أقدر أوقفها." },
  { name: "أ. فيصل العنزي", role: "معلم رياضيات", initial: "ف", color: "#059669",
    text: "المنصة نظمت المنهج بشكل يوفر عليّ ساعات — الطالب يلقى الفيديو والمذكرة والاختبار في مكان واحد." },
];

const FAQS = [
  { q: "هل المحتوى مطابق لمنهج الكويت؟", a: "نعم — المنهج منظم حسب المرحلة (ابتدائي/متوسط/ثانوي) ← الصف ← المادة ← الوحدة والدرس، ويُحدَّث باستمرار من لوحة الإدارة." },
  { q: "إيه الفرق بين الباقات؟", a: "باقة المادة تفتح مادة واحدة تختارها، باقة المرحلة تفتح كل مواد صفك، والباقة الذهبية تفتح المنصة كاملة لسنة كاملة." },
  { q: "هل يقدر ولي الأمر يتابع مستوى ابنه؟", a: "نعم — حساب خاص لولي الأمر يعرض معدل كل ابن، أداءه حسب المادة، آخر اختباراته، وإشعارات فورية بالنتائج وانتهاء الاشتراكات." },
  { q: "إيه طرق الدفع المتاحة؟", a: "KNET و Visa و Mastercard عبر بوابة دفع كويتية آمنة — مع دعم أكواد الخصم والتفعيل الفوري للمحتوى." },
  { q: "هل أقدر ألغي اشتراكي؟", a: "تقدر توقف التجديد في أي وقت — ويبقى المحتوى متاحًا لك لحد نهاية المدة المدفوعة." },
];

export default function Landing() {
  const { db } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-night-950">
      {/* الهيدر */}
      <header className="fixed top-0 inset-x-0 z-50 bg-night-950/70 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 h-[68px] flex items-center justify-between">
          <Logo size={38} light />
          <div className="hidden md:flex items-center gap-7 text-sm font-bold text-white/60">
            <a href="#features" className="hover:text-white transition-colors">المميزات</a>
            <a href="#how" className="hover:text-white transition-colors">كيف أبدأ</a>
            <a href="#packages" className="hover:text-white transition-colors">الباقات</a>
            <a href="#faq" className="hover:text-white transition-colors">الأسئلة الشائعة</a>
          </div>
          <Link href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
            دخول
          </Link>
        </div>
      </header>

      {/* البطل */}
      <section className="relative hero-mesh overflow-hidden pt-[68px]">
        {/* كرات ضوئية */}
        <div className="absolute top-24 -right-24 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl animate-orb" />
        <div className="absolute bottom-0 -left-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl animate-orb" style={{ animationDelay: "-4s" }} />
        <div className="absolute inset-0 grid-pattern opacity-40" />

        <div className="max-w-6xl mx-auto px-4 pt-14 pb-20 md:pt-20 md:pb-28 relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass text-primary-300 text-xs font-bold px-4 py-2 rounded-full mb-7">
              <Icon name="spark" size={14} /> منصة تعليمية متكاملة لمناهج الكويت
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.15] mb-6">
              ادرس <span className="text-gold-400">بذكاء</span>،<br />وتفوّق بثقة
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-9 max-w-lg">
              مذكرات شاملة، فيديوهات من نخبة المعلمين، اختبارات ذكية بتصحيح فوري،
              ونقاط XP تخلّي المذاكرة إدمان — لكل مراحل الكويت.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="group bg-gold-500 hover:bg-gold-600 text-night-950 px-8 py-4 rounded-2xl font-black text-lg transition-colors flex items-center gap-2">
                <Icon name="rocket" size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                ابدأ مجانًا الآن
              </Link>
              <Link href="/login" className="glass text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/15 transition-colors flex items-center gap-2">
                <Icon name="play" size={18} /> جرّب الديمو
              </Link>
            </div>

            {/* إحصائيات — حقيقية من قاعدة البيانات */}
            <div className="flex gap-8 mt-12">
              {[[`+${db.lessons.length}`, "درس وفيديو"], [`+${db.questions.length}`, "سؤال ذكي"], ["24/7", "متاح دائمًا"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl md:text-3xl font-black text-white">{v}</div>
                  <div className="text-white/40 text-xs mt-1 font-medium">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* بطاقات عائمة — محاكاة واجهة التطبيق */}
          <div className="relative hidden lg:block h-[460px]">
            {/* بطاقة الفيديو */}
            <div className="absolute top-2 right-0 w-72 glass rounded-3xl p-4 animate-float shadow-2xl">
              <div className="rounded-2xl aspect-video bg-primary-600/40 flex items-center justify-center mb-3 relative overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-primary-700 shadow-xl">
                  <Icon name="play" size={24} />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">12:34</div>
              </div>
              <div className="text-white font-bold text-sm">قانون نيوتن الثاني</div>
              <div className="text-white/50 text-xs">الفيزياء — الصف العاشر</div>
            </div>
            {/* بطاقة النتيجة */}
            <div className="absolute top-52 left-0 w-60 glass rounded-3xl p-5 animate-float-x shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center"><Icon name="trophy" size={22} /></div>
                <div><div className="text-white font-black text-2xl">94%</div><div className="text-white/50 text-[11px]">نتيجة الاختبار</div></div>
              </div>
              <div className="flex gap-1">{[1,1,1,1,0,1,1].map((v, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${v ? "bg-emerald-400" : "bg-white/15"}`} />)}</div>
            </div>
            {/* بطاقة الستريك */}
            <div className="absolute bottom-0 right-16 glass rounded-3xl px-5 py-4 flex items-center gap-3 animate-float shadow-2xl" style={{ animationDelay: "-2.5s" }}>
              <div className="text-orange-400 animate-flame"><Icon name="flame" size={30} /></div>
              <div><div className="text-white font-black text-xl">12 يوم</div><div className="text-white/50 text-[11px]">سلسلة مذاكرة</div></div>
            </div>
            {/* بطاقة XP */}
            <div className="absolute top-40 right-56 glass rounded-2xl px-4 py-3 flex items-center gap-2 animate-float-x shadow-xl" style={{ animationDelay: "-3.5s" }}>
              <Icon name="bolt" size={18} className="text-gold-400" />
              <span className="text-white font-black text-sm">+150 XP</span>
            </div>
          </div>
        </div>

        {/* شريط المواد المتحرك */}
        <div className="relative border-t border-white/8 bg-night-900/60 overflow-hidden py-4 ticker-mask" dir="ltr">
          <div className="flex animate-ticker w-max" style={{ direction: "ltr" }}>
            {[0, 1, 2, 3].map((k) => (
              <div key={k} className="flex items-center gap-10 pl-10">
                {TICKER.map((s) => (
                  <span key={s} className="glass text-white/70 text-sm font-bold px-7 py-2.5 rounded-full whitespace-nowrap flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400/70 shrink-0" />{s}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* المميزات */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-block bg-primary-100 text-primary-700 text-xs font-black px-4 py-1.5 rounded-full mb-4">ليش تفوّق؟</div>
          <h2 className="text-3xl md:text-4xl font-black text-primary-950 mb-3">كل ما تحتاجه للنجاح</h2>
          <p className="text-slate-500">تقنية تعليمية متكاملة مصممة للطالب وولي الأمر</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card-hover bg-white rounded-3xl p-7 border border-slate-100 shadow-sm animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${f.color}14`, color: f.color }}>
                <Icon name={f.icon} size={25} />
              </div>
              <h3 className="font-black text-primary-950 text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* كيف أبدأ */}
      <section id="how" className="py-20 hero-mesh relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">ابدأ رحلتك في 4 خطوات</h2>
            <p className="text-white/50">من التسجيل للتفوق — أقل من دقيقة</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <div key={s.n} className="glass rounded-3xl p-6 text-center relative overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="absolute -top-4 -left-4 text-7xl font-black text-white/5">{s.n}</div>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-600 text-white flex items-center justify-center mb-4">
                  <Icon name={s.icon} size={24} />
                </div>
                <h3 className="font-black text-white mb-1.5">{s.t}</h3>
                <p className="text-white/50 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الباقات */}
      <section id="packages" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-block bg-gold-400/15 text-gold-600 text-xs font-black px-4 py-1.5 rounded-full mb-4">وفّر لغاية 80%</div>
          <h2 className="text-3xl md:text-4xl font-black text-primary-950 mb-3">باقات تناسب الجميع</h2>
          <p className="text-slate-500">دفع آمن عبر KNET و Visa و Mastercard</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 max-w-5xl mx-auto items-stretch">
          {db.packages.map((p) => (
            <div key={p.id} className={`relative rounded-3xl p-7 flex flex-col transition-all ${
              p.popular
                ? "hero-mesh text-white shadow-2xl shadow-gold-500/20 scale-[1.04] border border-gold-400/40"
                : "bg-white border border-slate-100 card-hover"}`}>
              {p.popular && (
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  <div className="price-shine" />
                </div>
              )}
              {p.popular && (
                <div className="absolute -top-3.5 right-1/2 translate-x-1/2 bg-gold-500 text-night-950 text-xs font-black px-4 py-1.5 rounded-full shadow-lg shadow-gold-500/40">
                  الأكثر اشتراكًا
                </div>
              )}
              <h3 className={`font-black text-lg text-center ${p.popular ? "text-white" : "text-primary-950"}`}>{p.name}</h3>
              <div className="text-center my-5">
                <span className={`font-black ${p.popular ? "text-6xl text-gold-grad drop-shadow-[0_2px_14px_rgba(251,191,36,.35)]" : "text-5xl text-primary-800"}`}>{p.priceKwd}</span>
                <span className={`text-sm ${p.popular ? "text-white/60" : "text-slate-400"}`}> د.ك / {p.period}</span>
              </div>
              <ul className="space-y-2.5 mb-7 flex-1">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${p.popular ? "text-white/80" : "text-slate-600"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${p.popular ? "bg-emerald-400/20 text-emerald-300" : "bg-emerald-50 text-emerald-500"}`}>
                      <Icon name="check" size={12} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className={`block text-center py-3 rounded-2xl font-black text-sm transition-colors ${
                p.popular ? "bg-gold-500 hover:bg-gold-600 text-night-950" : "bg-primary-50 text-primary-700 hover:bg-primary-100"}`}>
                اشترك الآن
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* آراء المستخدمين */}
      <section className="py-20 hero-mesh relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-14">
            <div className="inline-block bg-white/10 text-gold-300 text-xs font-black px-4 py-1.5 rounded-full mb-4">قالوا عنّا</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">طلاب وأولياء أمور ومعلمون</h2>
            <p className="text-white/50">تجارب حقيقية من مستخدمي المنصة</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="glass rounded-3xl p-6 animate-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="flex gap-1 mb-4 text-gold-400">
                  {[0, 1, 2, 3, 4].map((s) => <Icon key={s} name="star" size={16} filled />)}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0" style={{ background: t.color }}>
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-black text-white text-sm">{t.name}</div>
                    <div className="text-white/45 text-[11px]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الأسئلة الشائعة */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-100 text-primary-700 text-xs font-black px-4 py-1.5 rounded-full mb-4">عندك سؤال؟</div>
          <h2 className="text-3xl md:text-4xl font-black text-primary-950 mb-3">الأسئلة الشائعة</h2>
          <p className="text-slate-500">كل ما يهمك عن المنصة والاشتراكات</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className={`bg-white rounded-2xl border transition-all ${open ? "border-primary-200 shadow-lg shadow-primary-900/5" : "border-slate-200"}`}>
                <button onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-right">
                  <span className={`font-black text-sm md:text-base ${open ? "text-primary-800" : "text-primary-950"}`}>{f.q}</span>
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${open ? "bg-primary-600 text-white rotate-180" : "bg-slate-100 text-slate-400"}`}>
                    <Icon name="down" size={15} />
                  </span>
                </button>
                {open && <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed animate-fade-up">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="hero-mesh rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full bg-primary-500/25 blur-3xl" />
          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gold-500 text-night-950 flex items-center justify-center mb-6 animate-float">
              <Icon name="rocket" size={30} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">جاهز تغيّر طريقة دراستك؟</h2>
            <p className="text-white/60 mb-9">انضم لآلاف الطلاب المتفوقين — أول درس مجاني</p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-night-950 px-10 py-4 rounded-2xl font-black text-lg transition-colors">
              <Icon name="bolt" size={20} /> أنشئ حسابك مجانًا
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8 py-8 bg-night-950">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={32} light />
          <div className="text-white/30 text-xs">تفوّق © جميع الحقوق محفوظة 2026 — نسخة تجريبية (Proof of Concept)</div>
        </div>
      </footer>
    </div>
  );
}
