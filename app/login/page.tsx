"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Icon, Logo, Btn } from "@/components/ui";

const HOME: Record<string, string> = { student: "/student", parent: "/parent", admin: "/admin" };

const DEMO_ACCOUNTS = [
  { userId: "s1", role: "student", label: "دخول كطالب", sub: "أحمد الكندري — الصف العاشر · مشترك", icon: "gamepad", color: "#0891b2" },
  { userId: "s2", role: "student", label: "دخول كطالبة", sub: "سارة الكندري — الصف السابع · بدون اشتراك", icon: "star", color: "#e11d48" },
  { userId: "p1", role: "parent", label: "دخول كولي أمر", sub: "خالد الكندري — متابعة أحمد وسارة", icon: "users", color: "#6d28d9" },
  { userId: "a1", role: "admin", label: "دخول كمدير", sub: "لوحة التحكم الكاملة", icon: "settings", color: "#d97706" },
];

export default function LoginPage() {
  const { login, resetDemo } = useStore();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [resetDone, setResetDone] = useState(false);
  const [err, setErr] = useState("");

  const quick = (userId: string, role: string) => {
    if (login(userId)) router.push(HOME[role]);
    else setErr("هذا الحساب موقوف — تواصل مع إدارة المنصة");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    quick("s1", "student");
  };

  return (
    <div className="min-h-screen flex flex-col hero-mesh relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-primary-500/20 blur-3xl animate-orb" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-violet-600/20 blur-3xl animate-orb" style={{ animationDelay: "-5s" }} />

      <div className="max-w-6xl mx-auto w-full px-4 pt-6 relative">
        <Link href="/"><Logo size={38} light /></Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10 relative">
        <div className="w-full max-w-md">
          <div className="glass rounded-[2rem] p-7 animate-fade-up shadow-2xl shadow-black/30">
            <h1 className="text-2xl font-black text-white text-center mb-1">
              {mode === "login" ? "أهلاً بعودتك" : "أنشئ حسابك"}
            </h1>
            <p className="text-white/50 text-sm text-center mb-6">
              {mode === "login" ? "سجّل دخولك وكمّل رحلة التفوق" : "خطوتك الأولى نحو التفوق"}
            </p>

            <div className="flex bg-white/10 rounded-2xl p-1.5 mb-6">
              {(["login", "register"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === m ? "bg-white text-primary-800 shadow-lg" : "text-white/60 hover:text-white"}`}>
                  {m === "login" ? "تسجيل الدخول" : "حساب جديد"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-3">
              {mode === "register" && (
                <>
                  <input placeholder="الاسم الكامل" className="w-full bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-white placeholder:text-white/35 transition-colors" />
                  <select className="w-full bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-white/80">
                    <option className="text-slate-800">الصف العاشر — المرحلة الثانوية</option>
                    <option className="text-slate-800">الصف السابع — المرحلة المتوسطة</option>
                    <option className="text-slate-800">الصف الرابع — المرحلة الابتدائية</option>
                  </select>
                </>
              )}
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف" dir="ltr"
                className="w-full bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-white placeholder:text-white/35 text-left transition-colors" />
              <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="كلمة المرور" dir="ltr"
                className="w-full bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary-400 text-white placeholder:text-white/35 text-left transition-colors" />
              {mode === "login" && (
                <div className="text-left"><button type="button" className="text-xs text-primary-300 font-bold hover:underline">نسيت كلمة المرور؟</button></div>
              )}
              {err && <div className="text-xs font-bold text-rose-300 bg-rose-500/15 border border-rose-400/30 rounded-xl px-3.5 py-2.5">{err}</div>}
              <button type="submit"
                className="w-full py-3.5 rounded-full font-black text-white bg-[#1d72fe] hover:bg-[#1560e0] shadow-lg shadow-[#1d72fe]/30 transition-all active:scale-[.98]">
                {mode === "login" ? "دخول" : "إنشاء الحساب"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-xs text-white/40 font-bold">أو جرّب الديمو</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            <div className="space-y-2.5">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.userId} onClick={() => quick(a.userId, a.role)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-400/60 hover:bg-white/10 transition-all text-right group">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white" style={{ background: a.color }}>
                    <Icon name={a.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-white">{a.label}</div>
                    <div className="text-[11px] text-white/45">{a.sub}</div>
                  </div>
                  <Icon name="back" size={16} className="text-white/25 group-hover:text-primary-300 group-hover:-translate-x-0.5 transition-all rotate-180" />
                </button>
              ))}
            </div>

            <button
              onClick={() => { resetDemo(); setResetDone(true); setTimeout(() => setResetDone(false), 2500); }}
              className="w-full mt-4 flex items-center justify-center gap-1.5 text-[11px] font-bold text-white/35 hover:text-white/70 transition-colors py-1">
              <Icon name="refresh" size={12} /> {resetDone ? "تمت إعادة تعيين بيانات الديمو ✓" : "إعادة تعيين بيانات الديمو"}
            </button>
          </div>

          <p className="text-center text-xs text-white/30 mt-5">بالتسجيل أنت توافق على الشروط وسياسة الخصوصية</p>
        </div>
      </div>
    </div>
  );
}
