"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Icon, Logo, Btn, KuwaitFlag } from "@/components/ui";

const HOME: Record<string, string> = { student: "/student", parent: "/parent", admin: "/admin" };

const DEMO_ACCOUNTS = [
  { userId: "s1", role: "student", label: "دخول كطالب", sub: "أحمد الكندري — الصف العاشر · مشترك", icon: "gamepad", color: "#2072e0" },
  { userId: "s2", role: "student", label: "دخول كطالبة", sub: "سارة الكندري — الصف السابع · بدون اشتراك", icon: "star", color: "#8e5cf0" },
  { userId: "p1", role: "parent", label: "دخول كولي أمر", sub: "خالد الكندري — متابعة أحمد وسارة", icon: "users", color: "#33bf6b" },
  { userId: "a1", role: "admin", label: "دخول كمدير", sub: "لوحة التحكم الكاملة", icon: "settings", color: "#f5b329" },
];

const GRADE_OPTIONS = [
  "الصف الرابع — ابتدائي", "الصف الخامس — ابتدائي", "الصف السادس — ابتدائي",
  "الصف السابع — متوسط", "الصف الثامن — متوسط", "الصف التاسع — متوسط",
  "الصف العاشر — ثانوي", "الصف الحادي عشر — ثانوي", "الصف الثاني عشر — ثانوي",
];

type Step = "login" | "otp" | "register";

const inputCls =
  "w-full bg-[#1a2130] border border-[#2b3547] rounded-2xl px-4 h-[58px] text-base text-white placeholder:text-[#99a8bd]/60 outline-none focus:border-[#2072e0] transition-colors";

function PhoneRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-3" dir="ltr">
      <div className="flex items-center justify-center gap-2 bg-[#1a2130] border border-[#2b3547] rounded-2xl h-[58px] px-4 shrink-0">
        <KuwaitFlag w={22} />
        <span className="font-bold text-white" dir="ltr">+965</span>
        <Icon name="down" size={10} className="text-[#8e99ab]" />
      </div>
      <input value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
        type="tel" inputMode="numeric" placeholder="رقم الهاتف" dir="ltr"
        className={`${inputCls} text-left`} />
    </div>
  );
}

export default function LoginPage() {
  const { login, resetDemo } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<Step>("login");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resetDone, setResetDone] = useState(false);
  const [err, setErr] = useState("");
  const [countdown, setCountdown] = useState(29);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const quick = (userId: string, role: string) => {
    if (login(userId)) router.push(HOME[role]);
    else setErr("هذا الحساب موقوف — تواصل مع إدارة المنصة");
  };

  useEffect(() => {
    if (step !== "otp" || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCountdown(29);
    setStep("otp");
    setTimeout(() => otpRefs.current[0]?.focus(), 80);
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setOtp((o) => o.map((x, j) => (j === i ? d : x)));
    if (d && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    quick("s1", "student");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1217] relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#2072e0]/15 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#8e5cf0]/15 blur-3xl" />

      <div className="max-w-6xl mx-auto w-full px-4 pt-6 relative">
        <Link href="/"><Logo size={38} light /></Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10 relative">
        <div className="w-full max-w-md">
          <div className="bg-[#161c29] border border-[#2b3547] rounded-[2rem] p-7 sm:p-8 animate-fade-up shadow-2xl shadow-black/40">

            {/* ===== شاشة الدخول ===== */}
            {step === "login" && (
              <>
                <div className="text-center mb-7">
                  <div className="flex justify-center mb-5"><Logo size={52} light /></div>
                  <h1 className="text-[26px] sm:text-3xl font-black text-white mb-2">حياك الله في تفوّق</h1>
                  <p className="text-[#99a8bd] text-sm">سجّل دخولك برقم هاتفك وابدأ رحلة التفوق</p>
                </div>

                <form onSubmit={submitLogin} className="space-y-4">
                  <PhoneRow value={phone} onChange={setPhone} />
                  {err && <div className="text-xs font-bold text-rose-300 bg-rose-500/15 border border-rose-400/30 rounded-xl px-3.5 py-2.5">{err}</div>}
                  <button type="submit"
                    className="w-full h-[58px] rounded-full font-black text-lg text-white bg-[#2072e0] hover:bg-[#1b63c4] shadow-lg shadow-[#2072e0]/25 transition-all active:scale-[.98]">
                    انطلق
                  </button>
                </form>

                <button onClick={() => setStep("register")}
                  className="w-full text-center mt-5 text-sm font-bold text-[#73a7f2] hover:text-[#4a9bf5] transition-colors">
                  لسه معندكش حساب؟ أنشئ حساب جديد
                </button>
              </>
            )}

            {/* ===== رمز التحقق ===== */}
            {step === "otp" && (
              <>
                <div className="text-center mb-7">
                  <div className="flex justify-center mb-5"><Logo size={52} light /></div>
                  <h1 className="text-[26px] sm:text-3xl font-black text-white mb-2">أدخل رمز التحقق</h1>
                  <p className="text-[#99a8bd] text-sm">أرسلنا رمزًا مكوّنًا من 4 أرقام إلى <span dir="ltr">+965 ••• •• {phone.slice(-2) || "99"}</span></p>
                </div>

                <form onSubmit={submitOtp} className="space-y-5">
                  <div className="flex gap-3 justify-center" dir="ltr">
                    {otp.map((d, i) => (
                      <input key={i} ref={(el) => { otpRefs.current[i] = el; }}
                        value={d} onChange={(e) => setDigit(i, e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                        type="tel" inputMode="numeric" maxLength={1}
                        className={`w-16 h-[76px] sm:w-[72px] rounded-2xl bg-[#1a2130] border text-center text-3xl font-black text-white outline-none transition-all ${
                          i === otp.findIndex((x) => !x) || (i === 3 && otp.every(Boolean))
                            ? "border-[#2072e0] ring-2 ring-[#2072e0]/30"
                            : "border-[#2b3547] focus:border-[#2072e0]"}`} />
                    ))}
                  </div>
                  {err && <div className="text-xs font-bold text-rose-300 bg-rose-500/15 border border-rose-400/30 rounded-xl px-3.5 py-2.5">{err}</div>}
                  <button type="submit"
                    className="w-full h-[58px] rounded-full font-black text-lg text-white bg-[#2072e0] hover:bg-[#1b63c4] shadow-lg shadow-[#2072e0]/25 transition-all active:scale-[.98]">
                    تأكيد
                  </button>
                </form>

                <div className="flex items-center justify-between mt-5 text-sm">
                  <button onClick={() => setStep("login")} className="font-bold text-[#99a8bd] hover:text-white transition-colors">‹ رجوع</button>
                  <button onClick={() => setCountdown(29)} disabled={countdown > 0}
                    className="font-bold text-[#99a8bd] disabled:opacity-60 transition-colors">
                    ما وصلك الرمز؟ إعادة الإرسال {countdown > 0 && <span dir="ltr">(00:{String(countdown).padStart(2, "0")})</span>}
                  </button>
                </div>
              </>
            )}

            {/* ===== حساب جديد ===== */}
            {step === "register" && (
              <>
                <div className="text-center mb-7">
                  <h1 className="text-[26px] sm:text-3xl font-black text-white mb-2">أنشئ حسابك الجديد</h1>
                  <p className="text-[#99a8bd] text-sm">دقيقة واحدة وتكون جاهز للتفوق</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); quick("s1", "student"); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#99a8bd] mb-2">اسم الطالب الكامل</label>
                    <input placeholder="مثال: أحمد الكندري" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#99a8bd] mb-2">رقم الهاتف</label>
                    <PhoneRow value={phone} onChange={setPhone} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#99a8bd] mb-2">الصف الدراسي</label>
                    <div className="relative">
                      <select className={`${inputCls} appearance-none pl-11 text-white/85`} defaultValue="">
                        <option value="" disabled className="text-slate-800">اختر صفك</option>
                        {GRADE_OPTIONS.map((g) => <option key={g} className="text-slate-800">{g}</option>)}
                      </select>
                      <Icon name="down" size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e99ab] pointer-events-none" />
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full h-[58px] rounded-full font-black text-lg text-white bg-[#2072e0] hover:bg-[#1b63c4] shadow-lg shadow-[#2072e0]/25 transition-all active:scale-[.98]">
                    سجّل وابدأ
                  </button>
                </form>

                <button onClick={() => setStep("login")}
                  className="w-full text-center mt-5 text-sm font-bold text-[#73a7f2] hover:text-[#4a9bf5] transition-colors">
                  عندك حساب؟ سجّل دخولك
                </button>
              </>
            )}

            {/* ===== حسابات الديمو ===== */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#2b3547]" />
              <span className="text-xs text-[#99a8bd]/70 font-bold">أو جرّب الديمو</span>
              <div className="flex-1 h-px bg-[#2b3547]" />
            </div>

            <div className="space-y-2.5">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.userId} onClick={() => quick(a.userId, a.role)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#1a2130] border border-[#2b3547] hover:border-[#2072e0]/60 hover:bg-[#1f2837] transition-all text-right group">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white" style={{ background: a.color }}>
                    <Icon name={a.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-white">{a.label}</div>
                    <div className="text-[11px] text-[#99a8bd]/70">{a.sub}</div>
                  </div>
                  <Icon name="back" size={16} className="text-[#99a8bd]/40 group-hover:text-[#4a9bf5] group-hover:-translate-x-0.5 transition-all rotate-180" />
                </button>
              ))}
            </div>

            <button
              onClick={() => { resetDemo(); setResetDone(true); setTimeout(() => setResetDone(false), 2500); }}
              className="w-full mt-4 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#99a8bd]/60 hover:text-[#99a8bd] transition-colors py-1">
              <Icon name="refresh" size={12} /> {resetDone ? "تمت إعادة تعيين بيانات الديمو ✓" : "إعادة تعيين بيانات الديمو"}
            </button>
          </div>

          <p className="text-center text-xs text-[#99a8bd]/50 mt-5">بالتسجيل أنت توافق على شروط الاستخدام وسياسة الخصوصية</p>
        </div>
      </div>
    </div>
  );
}
