"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "./ui";
import { DB, User, lessonById, packageById, userById } from "@/lib/data";

interface Notif {
  id: string;
  icon: string;
  color: string;
  text: string;
  ts: number;
}

const DAY = 86400000;

export function whenLabel(ts: number) {
  const today = new Date().toISOString().slice(0, 10);
  const diff = Math.round((Date.parse(today) - ts) / DAY);
  if (diff <= 0) return "اليوم";
  if (diff === 1) return "أمس";
  if (diff < 7) return `قبل ${diff} أيام`;
  if (diff < 30) return `قبل ${Math.floor(diff / 7)} أسبوع`;
  return new Date(ts).toISOString().slice(0, 10);
}

export function buildNotifs(db: DB, me: User): Notif[] {
  const out: Notif[] = [];
  const ts = (d: string) => Date.parse(d);

  if (me.role === "student") {
    // نتائج اختباراتي
    [...db.attempts.filter((a) => a.userId === me.id)]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 4)
      .forEach((a) => {
        const l = lessonById(db, a.lessonId);
        const pct = Math.round((a.score / a.total) * 100);
        out.push({
          id: `att-${a.id}`,
          icon: pct >= 80 ? "trophy" : "target",
          color: pct >= 80 ? "#059669" : pct >= 50 ? "#d97706" : "#e11d48",
          text: `أديت اختبار «${l?.title ?? "درس"}» — نتيجتك ${pct}%`,
          ts: ts(a.date),
        });
      });
    // اشتراكي
    const sub = db.subscriptions.find((s) => s.userId === me.id && s.status === "active");
    if (sub) {
      const days = Math.max(0, Math.ceil((ts(sub.endDate) - Date.now()) / DAY));
      if (days <= 30) {
        out.push({
          id: `sub-${sub.id}`, icon: "wallet", color: "#d97706",
          text: `اشتراكك في «${packageById(db, sub.packageId)?.name}» ينتهي خلال ${days} يومًا`,
          ts: ts(sub.startDate) + DAY,
        });
      }
    } else {
      out.push({ id: "no-sub", icon: "gem", color: "#f59e0b", text: "الدروس المجانية متاحة لك — اشترك لفتح كل المنهج", ts: Date.now() - DAY });
    }
    // مدفوعاتي
    db.payments.filter((p) => p.userId === me.id).slice(0, 2).forEach((p) => {
      out.push({
        id: `pay-${p.id}`, icon: p.status === "success" ? "check" : "x",
        color: p.status === "success" ? "#059669" : "#e11d48",
        text: p.status === "success" ? `تم تأكيد دفعتك — ${p.packageName} (${p.amountKwd} د.ك)` : `تعذّرت عملية الدفع — ${p.packageName}`,
        ts: ts(p.date),
      });
    });
  }

  if (me.role === "parent") {
    const kids = (me.childrenIds ?? []).map((id) => userById(db, id)).filter(Boolean) as User[];
    // نتائج الأبناء
    kids.flatMap((k) =>
      db.attempts.filter((a) => a.userId === k.id).map((a) => ({ k, a }))
    ).sort((x, y) => y.a.date.localeCompare(x.a.date)).slice(0, 4)
      .forEach(({ k, a }) => {
        const l = lessonById(db, a.lessonId);
        const pct = Math.round((a.score / a.total) * 100);
        out.push({
          id: `att-${a.id}`,
          icon: pct >= 80 ? "trophy" : "target",
          color: pct >= 80 ? "#059669" : pct >= 50 ? "#d97706" : "#e11d48",
          text: `${k.name.split(" ")[0]} حصل على ${pct}% في «${l?.title ?? "درس"}»`,
          ts: ts(a.date),
        });
      });
    // اشتراكات الأبناء
    kids.forEach((k) => {
      const sub = db.subscriptions.find((s) => s.userId === k.id && s.status === "active");
      if (sub) {
        const days = Math.max(0, Math.ceil((ts(sub.endDate) - Date.now()) / DAY));
        if (days <= 30) out.push({ id: `sub-${sub.id}`, icon: "wallet", color: "#d97706", text: `اشتراك ${k.name.split(" ")[0]} ينتهي خلال ${days} يومًا`, ts: ts(sub.startDate) + DAY });
      } else {
        out.push({ id: `nosub-${k.id}`, icon: "wallet", color: "#94a3b8", text: `${k.name.split(" ")[0]} بدون اشتراك — الدروس المجانية فقط متاحة`, ts: Date.now() - DAY });
      }
    });
    // مدفوعات الأبناء
    kids.flatMap((k) => db.payments.filter((p) => p.userId === k.id).map((p) => ({ k, p })))
      .sort((x, y) => y.p.date.localeCompare(x.p.date)).slice(0, 2)
      .forEach(({ k, p }) => {
        out.push({
          id: `pay-${p.id}`, icon: p.status === "success" ? "check" : "x",
          color: p.status === "success" ? "#059669" : "#e11d48",
          text: p.status === "success"
            ? `تم تفعيل «${p.packageName}» لـ ${k.name.split(" ")[0]} — ${p.amountKwd} د.ك عبر ${p.method}`
            : `تعذّرت عملية الدفع لـ ${k.name.split(" ")[0]} — ${p.packageName}`,
          ts: ts(p.date),
        });
      });
  }

  if (me.role === "admin") {
    // آخر المدفوعات
    db.payments.slice(0, 4).forEach((p) => {
      const u = userById(db, p.userId);
      out.push({
        id: `pay-${p.id}`,
        icon: p.status === "success" ? "wallet" : p.status === "failed" ? "x" : "clock",
        color: p.status === "success" ? "#059669" : p.status === "failed" ? "#e11d48" : "#d97706",
        text: p.status === "success"
          ? `دفعة جديدة — ${u?.name ?? "مستخدم"} · ${p.amountKwd} د.ك · ${p.method}`
          : `دفعة ${p.status === "failed" ? "فاشلة" : "معلقة"} — ${u?.name ?? "مستخدم"} · ${p.amountKwd} د.ك`,
        ts: ts(p.date),
      });
    });
    // نشاط الطلاب اليوم
    const today = new Date().toISOString().slice(0, 10);
    const todayAttempts = db.attempts.filter((a) => a.date === today).length;
    if (todayAttempts > 0) out.push({ id: "today-att", icon: "target", color: "#0891b2", text: `${todayAttempts} اختبارات أُديت اليوم على المنصة`, ts: Date.now() });
  }

  return out.sort((a, b) => b.ts - a.ts).slice(0, 7);
}

export default function NotifBell() {
  const { db, me } = useStore();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<number>(0);

  const key = me ? `tafawwug-notif-seen-${me.id}` : "";

  useEffect(() => {
    if (key) setSeen(Number(localStorage.getItem(key) ?? 0));
  }, [key]);

  if (!me) return null;

  const notifs = buildNotifs(db, me);
  const unread = notifs.filter((n) => n.ts > seen).length;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      const now = Date.now();
      localStorage.setItem(key, String(now));
      setSeen(now);
    }
  };

  return (
    <div className="relative">
      <button onClick={toggle} title="الإشعارات"
        className={`relative p-2.5 rounded-xl transition-colors ${open ? "bg-primary-50 text-primary-600" : "text-slate-400 hover:bg-slate-100 hover:text-primary-600"}`}>
        <Icon name="bell" size={19} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pop">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-12 z-50 w-[21rem] max-w-[85vw] bg-white rounded-2xl shadow-2xl shadow-night-900/20 border border-slate-100 overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
              <span className="font-black text-sm text-primary-950 flex items-center gap-2">
                <Icon name="bell" size={15} className="text-primary-600" /> الإشعارات
              </span>
              <span className="text-[10px] font-bold text-slate-400">{notifs.length} إشعار</span>
            </div>
            <div className="max-h-[22rem] overflow-y-auto">
              {notifs.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">لا إشعارات بعد</div>
              )}
              {notifs.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${n.color}15`, color: n.color }}>
                    <Icon name={n.icon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-primary-900 leading-relaxed">{n.text}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{whenLabel(n.ts)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
