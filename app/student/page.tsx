"use client";

import Link from "next/link";
import { useState } from "react";
import QShell, { QBtn, QCard, QPill } from "@/components/q/QShell";
import { SubjectRail } from "@/components/q/SubjectRail";
import { useStore } from "@/lib/store";
import {
  gradeOf,
  subjectsOfGrade,
  unitsOfSubject,
  lessonsOfUnit,
  attemptsOfUser,
  activeSub,
  canAccessLesson,
  type Subject,
} from "@/lib/data";
import { QC, qSubjectArt } from "@/lib/theme-q";
import { Icon } from "@/components/ui";

const QUICK = [
  { href: "/student/history", label: "سجل المشاهدة", sub: "ارجع لأي درس", icon: "clock" },
  { href: "/student/saved", label: "الدروس المحفوظة", sub: "احفظ للرجوع لاحقًا", icon: "star" },
  { href: "/student/notifications", label: "الإشعارات", sub: "محاضرات ونتائج", icon: "bell" },
  { href: "/student/reports", label: "تقاريري", sub: "مستواك بالتفصيل", icon: "chart" },
];

export default function StudentHome() {
  const { me, db } = useStore();
  const [gradeOpen, setGradeOpen] = useState(false);
  if (!me) return <QShell role="student">{null}</QShell>;

  const grade = gradeOf(db, me.gradeId);
  const subjects = subjectsOfGrade(db, me.gradeId);
  const sub = activeSub(db, me.id);
  const attempted = new Set(attemptsOfUser(db, me.id).map((a) => a.lessonId));

  const stateOf = (s: Subject) => {
    const lessons = unitsOfSubject(db, s.id).flatMap((u) => lessonsOfUnit(db, u.id));
    if (!lessons.length) return "locked" as const;
    const open = lessons.filter((l) => canAccessLesson(db, me.id, l)).length;
    if (open === 0) return "locked" as const;
    if (open === lessons.length) return "subscribed" as const;
    return "trial" as const;
  };

  return (
    <QShell role="student">
      <div className="space-y-7">
        {/* ===== كارت الصف ===== */}
        <QCard className="!p-0 overflow-hidden">
          <div className="px-5 py-4 flex items-start justify-between gap-4" style={{ background: QC.bgSoft }}>
            <div className="min-w-0 w-full">
              <button
                onClick={() => setGradeOpen((v) => !v)}
                className="inline-flex items-center gap-2 text-[19px] font-extrabold"
                style={{ color: QC.ink }}
              >
                {grade?.name ?? "اختر الصف"}
                <span
                  className="w-6 h-6 rounded-full grid place-items-center border"
                  style={{ borderColor: QC.lineSoft, background: "#fff" }}
                >
                  <Icon name="down" size={12} />
                </span>
              </button>
              <div className="text-[12px] mt-1" style={{ color: QC.muted }}>
                {grade ? stageAndTerm(db, me.gradeId) : "اختر صفك الدراسي"}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-lg text-[11px] font-bold" style={{ background: QC.brandSoft, color: QC.brandText }}>
                  المنهج المصري
                </span>
                <span className="px-3 py-1 rounded-lg text-[11px] font-bold" style={{ background: QC.brandSoft, color: QC.brandText }}>
                  المنهج الحكومي العام
                </span>
                {sub && (
                  <span className="px-3 py-1 rounded-lg text-[11px] font-bold" style={{ background: "#ecfdf5", color: "#047857" }}>
                    مشترك
                  </span>
                )}
              </div>
            </div>
          </div>

          {gradeOpen && (
            <div className="border-t px-5 py-4 grid gap-2 sm:grid-cols-3" style={{ borderColor: QC.line }}>
              {db.grades
                .filter((g) => g.id === me.gradeId)
                .concat(db.grades.filter((g) => g.id !== me.gradeId))
                .slice(0, 6)
                .map((g) => (
                  <Link
                    key={g.id}
                    href={`/grades/${encodeURIComponent(g.id)}`}
                    className="px-3 py-2 rounded-lg border text-[13px] font-semibold"
                    style={{ borderColor: QC.line, color: g.id === me.gradeId ? QC.brand : QC.body, background: g.id === me.gradeId ? QC.brandSoft : "#fff" }}
                  >
                    {g.name}
                  </Link>
                ))}
            </div>
          )}
        </QCard>

        {/* ===== بانر الاشتراك ===== */}
        {!sub && (
          <div
            className="relative overflow-hidden rounded-xl px-6 py-6 sm:px-8 sm:py-7 text-white"
            style={{ background: QC.brand }}
          >
            <div className="relative z-10 max-w-[70%] sm:max-w-[62%]">
              <h3 className="text-[17px] sm:text-[19px] font-extrabold leading-snug">
                هل تريد الوصول إلى جميع الميزات والواجبات؟
              </h3>
              <div className="mt-4">
                <QBtn href="/student/subscription" variant="primary" className="!bg-white !text-[#082770] !border-transparent">
                  اشترك
                </QBtn>
              </div>
            </div>
            <div className="hidden sm:block absolute -left-6 -bottom-8 w-56 h-56 opacity-90 pointer-events-none">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="120" cy="60" r="26" fill="#ffd166" />
                <rect x="24" y="104" width="150" height="16" rx="8" fill="#ffffff" opacity=".9" />
                <rect x="40" y="126" width="120" height="14" rx="7" fill="#ffffff" opacity=".65" />
                <rect x="58" y="146" width="86" height="12" rx="6" fill="#ffffff" opacity=".45" />
                <path d="M150 84l30-14-8 18 12 14-32 6z" fill="#ffd166" opacity=".9" />
              </svg>
            </div>
          </div>
        )}

        {/* ===== موادي ===== */}
        <SubjectRail
          subjects={subjects}
          hrefOf={(s) => `/student/subject/${encodeURIComponent(s.id)}`}
          artOf={(s) => qSubjectArt(s) || null}
          stateOf={stateOf}
        />

        {/* ===== إجراءات سريعة ===== */}
        <section>
          <h3 className="text-[17px] font-extrabold mb-3" style={{ color: QC.ink }}>
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="rounded-xl border bg-white p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: QC.line }}
              >
                <span
                  className="w-10 h-10 rounded-lg grid place-items-center shrink-0"
                  style={{ background: QC.brandSoft, color: QC.brand }}
                >
                  <Icon name={q.icon} size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold" style={{ color: QC.ink }}>
                    {q.label}
                  </span>
                  <span className="block text-[11px]" style={{ color: QC.muted }}>
                    {q.sub}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== متابعة التعلّم ===== */}
        <ContinueRow attempted={attempted} />
      </div>
    </QShell>
  );
}

function stageAndTerm(db: ReturnType<typeof useStore>["db"], gradeId?: string) {
  const g = db.grades.find((x) => x.id === gradeId);
  const st = db.stages.find((s) => s.id === g?.stageId);
  return [st?.name, "الفصل الأول"].filter(Boolean).join(" · ");
}

function ContinueRow({ attempted }: { attempted: Set<string> }) {
  const { me, db } = useStore();
  if (!me) return null;
  const subjects = subjectsOfGrade(db, me.gradeId);
  let next: { lesson: ReturnType<typeof lessonsOfUnit>[number]; subject: Subject } | null = null;
  outer: for (const s of subjects) {
    for (const u of unitsOfSubject(db, s.id)) {
      for (const l of lessonsOfUnit(db, u.id)) {
        if (!attempted.has(l.id) && canAccessLesson(db, me.id, l)) {
          next = { lesson: l, subject: s };
          break outer;
        }
      }
    }
  }

  return (
    <section>
      <h3 className="text-[17px] font-extrabold mb-3" style={{ color: QC.ink }}>
        متابعة التعلّم
      </h3>
      {next ? (
        <Link
          href={`/student/lesson/${encodeURIComponent(next.lesson.id)}`}
          className="rounded-xl border bg-white p-4 flex items-center justify-between gap-4 transition-all hover:shadow-md"
          style={{ borderColor: QC.line }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span
              className="w-11 h-11 rounded-lg grid place-items-center shrink-0"
              style={{ background: "#ecfdf5", color: QC.success }}
            >
              <Icon name="play" size={17} filled />
            </span>
            <div className="min-w-0">
              <div className="text-[14px] font-bold truncate" style={{ color: QC.ink }}>
                {next.lesson.title}
              </div>
              <div className="text-[11px] font-semibold" style={{ color: QC.brand }}>
                {next.subject.name}
              </div>
            </div>
          </div>
          <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: QC.muted }} dir="ltr">
            {next.lesson.durationMin}:00
          </span>
        </Link>
      ) : (
        <div className="rounded-xl border bg-white p-5 flex items-center gap-3" style={{ borderColor: QC.line }}>
          <QPill tone="ok">مكتمل</QPill>
          <span className="text-[13px]" style={{ color: QC.body }}>
            أنهيت كل الدروس المتاحة — تصفّح مواد صفك لتكمل.
          </span>
        </div>
      )}
    </section>
  );
}
