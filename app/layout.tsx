import type { Metadata } from "next";
import { Tajawal, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const tajawal = Tajawal({
  // ‎--font-body وليس --font-sans: الاسم الأخير تحوزه Tailwind عبر @theme في
  // globals.css، والتصادم كان يجعل body يقع على خط احتياطي بدل Tajawal.
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
});

// خط واجهة TheQ — يبقى محصورًا في نطاق صفحات الطالب/ولي الأمر (AppShell
// يستخدم النسخة Q) عبر --font-q. اللاندينج والدخول يفضلوا على Tajawal.
const kufi = Noto_Kufi_Arabic({
  variable: "--font-q",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "تفوّق — منصة تعليمية لطلاب الكويت",
  description: "مذكرات شاملة، فيديوهات شرح، اختبارات ذكية وتقارير أداء — كل ما يحتاجه الطالب في مكان واحد",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" className={`${tajawal.variable} ${kufi.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
