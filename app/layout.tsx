import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const alexandria = Alexandria({
  variable: "--font-sans",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "تفوّق — منصة تعليمية لطلاب الكويت",
  description: "مذكرات شاملة، فيديوهات شرح، اختبارات ذكية وتقارير أداء — كل ما يحتاجه الطالب في مكان واحد",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${alexandria.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
