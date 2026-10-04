"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import QShell, { QPageHead, QBtn, QModal } from "@/components/q/QShell";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/ui";
import { subjectById, activeSub, gradeOf } from "@/lib/data";
import { QC, Q_FEATURE_ART, qSubjectArt } from "@/lib/theme-q";

export default function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const subjectId = decodeURIComponent(id);
  const { db, me } = useStore();
  const [askOpen, setAskOpen] = useState(false);
  const subject = subjectById(db, subjectId);

  if (!subject) {
    return (
      <QShell role="student">
        <div className="text-center py-20 font-bold" style={{ color: QC.muted }}>
          المادة غير موجودة
        </div>
      </QShell>
    );
  }

  const grade = gradeOf(db, subject.gradeId);
  const sub = me ? activeSub(db, me.id) : null;
  const art = qSubjectArt(subject);
  const base = `/student/subject/${encodeURIComponent(subject.id)}`;

  const tools = [
    {
      key: "lectures",
      title: "الشرح",
      sub: "شاهد دروسك",
      art: Q_FEATURE_ART.lectures,
      href: `${base}/lectures`,
      badge: sub ? null : ("trial" as const),
    },
    {
      key: "exams",
      title: "الأسئلة",
      sub: "اختبر معلوماتك",
      art: Q_FEATURE_ART.exams,
      href: `${base}/exams`,
      badge: sub ? null : ("trial" as const),
    },
    {
      key: "notes",
      title: "حقيبة تفوّق",
      sub: "ملفات المادة PDF",
      art: Q_FEATURE_ART.notes,
      href: `${base}/notes`,
      badge: sub ? null : ("locked" as const),
    },
    {
      key: "stats",
      title: "الإحصائيات",
      sub: "تابع تقدمك",
      art: Q_FEATURE_ART.statistics,
      href: `${base}/statistics`,
      badge: null,
    },
    {
      key: "ask",
      title: "اسأل تفوّق",
      sub: "يجاوب على كل شيء",
      art: Q_FEATURE_ART.ask,
      onClick: () => setAskOpen(true),
      badge: sub ? null : ("locked" as const),
    },
  ];

  return (
    <QShell role="student">
      <QPageHead href="/student">{subject.name}</QPageHead>

      {/* ===== هيرو المادة الأزرق ===== */}
      <div
        className="relative overflow-hidden rounded-2xl px-6 sm:px-10 py-8 sm:py-10 text-white mb-6"
        style={{ background: `linear-gradient(135deg, ${QC.brand} 0%, #0057d8 60%, ${QC.brandDark} 100%)` }}
      >
        <div className="relative z-10">
          <h1 className="text-[26px] sm:text-[32px] font-extrabold">{subject.name}</h1>
          <p className="text-white/85 text-[13px] sm:text-[14px] font-semibold mt-2">
            استكشف جميع أدوات التعلّم المتاحة لـ {subject.name} ✨
          </p>
        </div>
        {art && (
          <img
            src={art}
            alt=""
            className="absolute left-4 sm:left-10 bottom-0 h-[90%] max-w-[40%] object-contain pointer-events-none"
          />
        )}
      </div>

      {/* ===== شبكة الأدوات ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.map((t) => {
          const inner = (
            <>
              {t.badge === "trial" && (
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-black" style={{ background: "#ecfdf5", color: "#047857" }}>
                  تجريبي
                </span>
              )}
              {t.badge === "locked" && (
                <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black" style={{ background: "#fff7ed", color: "#c2410c" }}>
                  <Icon name="lock" size={10} /> مقفل
                </span>
              )}
              <div className="h-[110px] grid place-items-center pt-2">
                <img src={t.art} alt={t.title} className="max-h-full max-w-[70%] object-contain" />
              </div>
              <div className="px-4 pb-4 pt-1">
                <div className="text-[15px] font-extrabold" style={{ color: QC.ink }}>
                  {t.title}
                </div>
                <div className="text-[11.5px] font-semibold mt-0.5" style={{ color: QC.muted }}>
                  {t.sub}
                </div>
                <div className="mt-2.5" style={{ color: QC.faint }}>
                  <Icon name="info" size={15} />
                </div>
              </div>
            </>
          );
          const cls = "relative rounded-xl border bg-white overflow-hidden text-right transition-all hover:-translate-y-0.5 hover:shadow-lg";
          const st = { borderColor: QC.line };
          return t.href ? (
            <Link key={t.key} href={t.href} className={cls} style={st}>
              {inner}
            </Link>
          ) : (
            <button key={t.key} onClick={t.onClick} className={cls} style={st}>
              {inner}
            </button>
          );
        })}
      </div>

      {/* ===== CTA الاشتراك المنقّط ===== */}
      {!sub && (
        <div
          className="mt-6 rounded-2xl border-2 border-dashed px-6 py-6 flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: QC.brandBorder, background: QC.brandSoft }}
        >
          <p className="text-[14px] font-bold max-w-2xl" style={{ color: QC.ink }}>
            اشترك الآن للاستفادة من جميع خدمات مادة {subject.name} ومميزات باقي المواد
          </p>
          <QBtn href="/student/subscription">اشترك الآن</QBtn>
        </div>
      )}

      {/* ===== اسأل The Q — شات بسيط ===== */}
      <QModal open={askOpen} onClose={() => setAskOpen(false)} title="اسأل تفوّق">
        <AskTheQ subjectName={subject.name} gradeName={grade?.name ?? ""} />
      </QModal>
    </QShell>
  );
}

function AskTheQ({ subjectName, gradeName }: { subjectName: string; gradeName: string }) {
  const [msgs, setMsgs] = useState<{ from: "me" | "q"; text: string }[]>([
    { from: "q", text: `أهلاً! أنا مساعد تفوّق الذكي في مادة ${subjectName} — اسألني أي سؤال في المنهج 👋` },
  ]);
  const [draft, setDraft] = useState("");
  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setMsgs((m) => [
      ...m,
      { from: "me", text: t },
      { from: "q", text: `سؤال حلو! دي إجابة تجريبية عن «${t}» — راجع درس «${subjectName}» في صفحة الشرح للشرح الكامل بالفيديو 📚` },
    ]);
    setDraft("");
  };
  return (
    <div>
      <div className="space-y-3 max-h-[45vh] overflow-y-auto pl-1 mb-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-start" : "justify-end"}`}>
            <div
              className="max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed"
              style={
                m.from === "me"
                  ? { background: QC.brand, color: "#fff", borderTopLeftRadius: 4 }
                  : { background: QC.surfaceSoft, color: QC.ink, borderTopRightRadius: 4 }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`اسأل عن أي حاجة في ${subjectName}…`}
          className="flex-1 border rounded-xl px-4 py-2.5 text-[13px] outline-none"
          style={{ borderColor: QC.line }}
        />
        <QBtn onClick={send} disabled={!draft.trim()}>
          <Icon name="send" size={15} />
        </QBtn>
      </div>
      <p className="text-[10px] mt-3 text-center" style={{ color: QC.faint }}>
        مساعد ذكي لمنهج {gradeName} — إجابات تجريبية
      </p>
    </div>
  );
}
