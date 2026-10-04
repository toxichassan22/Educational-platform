"use client";

import React, { useState } from "react";
import QShell, { QPageHead, QCard, QEmpty } from "./QShell";
import { useStore } from "@/lib/store";
import { Icon } from "../ui";
import { buildNotifs, whenLabel } from "../NotifBell";
import { QC } from "@/lib/theme-q";

/** صفحة الإشعارات بنمط TheQ — تستخدم نفس buildNotifs */
export default function NotifPage({ role }: { role: "student" | "parent" }) {
  const { db, me } = useStore();
  const [cleared, setCleared] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  if (!me) return <QShell role={role}>{null}</QShell>;
  const all = buildNotifs(db, me);
  const notifs = cleared ? [] : all;

  return (
    <QShell role={role} title="الإشعارات">
      <div className="max-w-2xl">
        <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
          <QPageHead href={role === "student" ? "/student" : "/parent"}>الإشعارات</QPageHead>
          <div className="flex gap-2">
            <button
              onClick={() => setReadIds(new Set(notifs.map((n) => n.id)))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-bold transition-colors hover:bg-slate-50"
              style={{ background: QC.surfaceSoft, color: QC.body }}
            >
              <Icon name="check" size={13} /> تحديد الكل كمقروء
            </button>
            <button
              onClick={() => setCleared(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-bold transition-colors hover:bg-rose-50"
              style={{ background: QC.dangerSoft, color: QC.danger }}
            >
              <Icon name="trash" size={13} /> حذف الكل
            </button>
          </div>
        </div>

        <QCard pad={false} className="overflow-hidden">
          {notifs.length === 0 && <QEmpty title="لا توجد إشعارات" hint="كل شيء تمام — ارجع لدراستك" />}
          <div className="divide-y" style={{ borderColor: QC.line }}>
            {notifs.map((n) => {
              const read = readIds.has(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => setReadIds((s) => new Set(s).add(n.id))}
                  className="w-full flex items-start gap-3.5 px-5 py-4 text-right transition-colors hover:bg-slate-50"
                >
                  <span
                    className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                    style={{ background: read ? QC.surfaceSoft : `${n.color}18`, color: read ? QC.faint : n.color }}
                  >
                    <Icon name={n.icon} size={17} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-[13.5px] leading-relaxed ${read ? "font-semibold" : "font-extrabold"}`} style={{ color: QC.ink }}>
                      {n.text}
                    </span>
                    <span className="block text-[11px] mt-1 font-semibold" style={{ color: QC.faint }}>
                      {whenLabel(n.ts)}
                    </span>
                  </span>
                  {!read && <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: QC.brand }} />}
                </button>
              );
            })}
          </div>
        </QCard>
      </div>
    </QShell>
  );
}
