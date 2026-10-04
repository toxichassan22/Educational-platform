"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { QC } from "@/lib/theme-q";
import { QPill } from "./QShell";
import type { Subject } from "@/lib/data";

export type SubjectCardState = "locked" | "trial" | "subscribed";

export function SubjectRail({
  subjects,
  hrefOf,
  artOf,
  stateOf,
  title = "موادي",
}: {
  subjects: Subject[];
  hrefOf: (s: Subject) => string;
  artOf: (s: Subject) => string | null;
  stateOf: (s: Subject) => SubjectCardState;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    setPage((p) => Math.max(0, p + dir));
  };

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[17px] font-extrabold" style={{ color: QC.ink }}>
          {title}
        </h3>
      </div>

      <div className="relative">
        <RailBtn side="right" onClick={() => scrollBy(1)} />
        <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-1">
          {subjects.map((s) => {
            const st = stateOf(s);
            const art = artOf(s);
            return (
              <Link
                key={s.id}
                href={hrefOf(s)}
                className="shrink-0 w-[168px] sm:w-[184px] snap-start rounded-xl border overflow-hidden bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ borderColor: QC.line }}
              >
                <div className="relative h-[132px] grid place-items-center overflow-hidden" style={{ background: QC.bgSoft }}>
                  {art ? (
                    <img src={art} alt={s.name} className="w-full h-full object-contain p-3" />
                  ) : (
                    <span className="text-[13px] font-bold" style={{ color: QC.faint }}>
                      {s.name}
                    </span>
                  )}
                  {st === "locked" && (
                    <div className="absolute inset-0 grid place-items-center" style={{ background: "rgba(255,255,255,.72)" }}>
                      <QPill tone="locked">
                        <LockGlyph />
                        مقفل
                      </QPill>
                    </div>
                  )}
                  {st === "trial" && (
                    <span className="absolute top-2 left-2">
                      <QPill tone="trial">تجريبي</QPill>
                    </span>
                  )}
                  {st === "subscribed" && (
                    <span className="absolute top-2 left-2">
                      <QPill tone="ok">
                        <CheckGlyph />
                        مشترك
                      </QPill>
                    </span>
                  )}
                </div>
                <div className="px-3 py-2.5 text-center">
                  <div className="text-[13px] font-bold leading-tight" style={{ color: QC.ink }}>
                    {s.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <RailBtn side="left" onClick={() => scrollBy(-1)} />
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{ width: i === page % 3 ? 18 : 6, background: i === page % 3 ? QC.brand : QC.lineSoft }}
          />
        ))}
      </div>
    </section>
  );
}

function RailBtn({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={side === "right" ? "السابق" : "التالي"}
      className="absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full grid place-items-center border bg-white shadow-md transition hover:scale-105"
      style={{ borderColor: QC.line, color: QC.muted, ...(side === "right" ? { right: -12 } : { left: -12 }) }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: side === "left" ? "scaleX(-1)" : undefined }}
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

function LockGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
