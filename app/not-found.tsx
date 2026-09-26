import Link from "next/link";
import { Icon, Logo } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen hero-mesh flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#2072e0]/20 blur-3xl animate-orb" />
      <div className="relative text-center max-w-md">
        <div className="flex justify-center mb-8"><Logo size={48} light /></div>
        <div className="text-8xl font-black text-white/10 mb-2">404</div>
        <h1 className="text-2xl font-black text-white mb-2">الصفحة غير موجودة</h1>
        <p className="text-white/50 text-sm mb-8">الرابط اللي فتحته غير صحيح أو الصفحة اتنقلت</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="bg-gold-500 hover:bg-gold-600 text-night-950 px-8 py-3.5 rounded-2xl font-black text-sm transition-colors flex items-center gap-2">
            <Icon name="home" size={16} /> الرئيسية
          </Link>
          <Link href="/login" className="border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
