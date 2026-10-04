"use client";

import Link from "next/link";
import { QC, qSubjectArt } from "@/lib/theme-q";
import { Icon } from "../ui";
import type { Lesson, Subject, Unit } from "@/lib/data";

/** رقم مشاهدات شكلي ثابت لكل درس (زي TheQ) */
export function lessonViews(id: string): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 997;
  return 40 + ((h * 37) % 900);
}

/**
 * كارت فيديو TheQ: ثمبنيل فيها قفل/بلاي، بيل المدة أسفلها،
 * عنوان أسود عريض + اسم الوحدة + عدد المشاهدات تحت.
 */
export function LessonCard({
  lesson,
  unit,
  subject,
  locked,
  done,
  href,
}: {
  lesson: Lesson;
  unit?: Unit | null;
  subject?: Subject | null;
  locked?: boolean;
  done?: boolean;
  href: string;
}) {
  const art = subject ? qSubjectArt(subject) : "";
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-white overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderColor: QC.line }}
    >
      {/* الثمبنيل */}
      <div className="relative h-37.5 grid place-items-center overflow-hidden" style={{ background: locked ? "#e8edf4" : QC.bgSoft }}>
        {art && !locked ? (
          <img src={art} alt={lesson.title} className="w-full h-full object-cover opacity-90 group-hover:scale-[1.03] transition-transform" />
        ) : (
          <div className="w-full h-full grid place-items-center" style={{ background: "linear-gradient(160deg,#eef2f7,#e2e8f0)" }}>
            {art && <img src={art} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" />}
          </div>
        )}

        {locked ? (
          <span className="relative z-10 w-11 h-11 rounded-full grid place-items-center bg-white/80 shadow" style={{ color: QC.faint }}>
            <Icon name="lock" size={19} />
          </span>
        ) : (
          <span className="relative z-10 w-11 h-11 rounded-full grid place-items-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: QC.brand }}>
            <Icon name="play" size={17} filled />
          </span>
        )}

        {/* بادج مميز */}
        {!locked && lesson.free && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black text-white shadow" style={{ background: QC.gold }}>
            ★ مميز
          </span>
        )}
        {done && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black text-white shadow" style={{ background: QC.success }}>
            <Icon name="check" size={10} /> مُنجز
          </span>
        )}

        {/* المدة أسفل الثمبنيل */}
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-black/55" dir="ltr">
          <Icon name="play" size={9} filled /> {lesson.durationMin}:00
        </span>
      </div>

      {/* النصوص */}
      <div className="px-3.5 py-3">
        <div className="text-[13.5px] font-bold leading-snug line-clamp-2 min-h-[38px]" style={{ color: locked ? QC.muted : QC.ink }}>
          {lesson.title}
        </div>
        {unit && (
          <div className="text-[11px] mt-1 truncate" style={{ color: QC.muted }}>
            {unit.title}
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold" style={{ color: QC.faint }}>
          <Icon name="eye" size={13} />
          <span dir="ltr">{lessonViews(lesson.id)}</span> مشاهدات
        </div>
      </div>
    </Link>
  );
}
