"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DB, seedDB, User, Attempt, Subject, Unit, Lesson, Question, Package, Payment } from "./data";

const LS_DB = "tafawwug-db-v1";
const LS_SESSION = "tafawwug-session-v1";

interface Store {
  ready: boolean;
  db: DB;
  me: User | null;
  login: (userId: string) => void;
  logout: () => void;
  addAttempt: (a: Omit<Attempt, "id" | "date">) => void;
  resetDemo: () => void;
  // ==== إدارة الأدمن ====
  addSubject: (gradeId: string, name: string, teacher: string) => void;
  deleteSubject: (subjectId: string) => void;
  addLesson: (unitId: string, title: string, durationMin: number) => void;
  deleteLesson: (lessonId: string) => void;
  addQuestion: (q: Omit<Question, "id">) => void;
  deleteQuestion: (questionId: string) => void;
  addPackage: (p: Omit<Package, "id">) => void;
  deletePackage: (packageId: string) => void;
  addDiscountCode: (code: string, pct: number) => void;
  deleteDiscountCode: (code: string) => void;
  toggleUser: (userId: string) => void;
  recordPayment: (p: Omit<Payment, "id" | "date" | "status">) => void;
  subscribe: (userId: string, packageId: string, method: Payment["method"], amount: number) => void;
}

const Ctx = createContext<Store | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(() => seedDB());
  const [me, setMe] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // تحميل الحالة من localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_DB);
      if (raw) setDb(JSON.parse(raw));
      const sess = localStorage.getItem(LS_SESSION);
      if (sess && raw) {
        const parsed: DB = JSON.parse(raw);
        setMe(parsed.users.find((u) => u.id === sess) ?? null);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // حفظ تلقائي
  useEffect(() => {
    if (ready) localStorage.setItem(LS_DB, JSON.stringify(db));
  }, [db, ready]);

  const value = useMemo<Store>(() => ({
    ready, db, me,

    login: (userId) => {
      const u = db.users.find((x) => x.id === userId) ?? null;
      setMe(u);
      localStorage.setItem(LS_SESSION, userId);
    },
    logout: () => {
      setMe(null);
      localStorage.removeItem(LS_SESSION);
    },
    addAttempt: (a) => {
      setDb((d) => ({
        ...d,
        attempts: [...d.attempts, { ...a, id: `at-${uid()}`, date: new Date().toISOString().slice(0, 10) }],
      }));
    },
    resetDemo: () => {
      const fresh = seedDB();
      setDb(fresh);
      localStorage.setItem(LS_DB, JSON.stringify(fresh));
    },

    addSubject: (gradeId, name, teacher) =>
      setDb((d) => ({
        ...d,
        subjects: [...d.subjects, { id: `${gradeId}-${name}-${uid()}`, name, gradeId, teacher, color: "#0891b2", icon: "book" }],
      })),
    deleteSubject: (subjectId) =>
      setDb((d) => {
        const unitIds = d.units.filter((u) => u.subjectId === subjectId).map((u) => u.id);
        const lessonIds = d.lessons.filter((l) => unitIds.includes(l.unitId)).map((l) => l.id);
        return {
          ...d,
          subjects: d.subjects.filter((s) => s.id !== subjectId),
          units: d.units.filter((u) => u.subjectId !== subjectId),
          lessons: d.lessons.filter((l) => !lessonIds.includes(l.id)),
          questions: d.questions.filter((q) => !lessonIds.includes(q.lessonId)),
        };
      }),
    addLesson: (unitId, title, durationMin) =>
      setDb((d) => ({
        ...d,
        lessons: [...d.lessons, {
          id: `l-${uid()}`, unitId, title, durationMin,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          note: [{ heading: `مذكرة ${title}`, body: "محتوى المذكرة التجريبي — يمكن تحريره من لوحة الإدارة." }],
        }],
      })),
    deleteLesson: (lessonId) =>
      setDb((d) => ({
        ...d,
        lessons: d.lessons.filter((l) => l.id !== lessonId),
        questions: d.questions.filter((q) => q.lessonId !== lessonId),
      })),
    addQuestion: (q) =>
      setDb((d) => ({ ...d, questions: [...d.questions, { ...q, id: `q-${uid()}` }] })),
    deleteQuestion: (questionId) =>
      setDb((d) => ({ ...d, questions: d.questions.filter((q) => q.id !== questionId) })),
    addPackage: (p) =>
      setDb((d) => ({ ...d, packages: [...d.packages, { ...p, id: `pkg-${uid()}` }] })),
    deletePackage: (packageId) =>
      setDb((d) => ({ ...d, packages: d.packages.filter((p) => p.id !== packageId) })),
    addDiscountCode: (code, pct) =>
      setDb((d) => ({ ...d, discountCodes: [...d.discountCodes.filter((c) => c.code !== code), { code, pct }] })),
    deleteDiscountCode: (code) =>
      setDb((d) => ({ ...d, discountCodes: d.discountCodes.filter((c) => c.code !== code) })),
    toggleUser: (userId) =>
      setDb((d) => ({ ...d, users: d.users.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)) })),
    recordPayment: (p) =>
      setDb((d) => ({
        ...d,
        payments: [{ ...p, id: `pay-${uid()}`, date: new Date().toISOString().slice(0, 10), status: "success" }, ...d.payments],
      })),
    subscribe: (userId, packageId, method, amount) => {
      const pkg = db.packages.find((p) => p.id === packageId);
      const start = new Date();
      const endDate = new Date(start.getTime() + (pkg?.scope === "all" ? 365 : 30) * 86400000);
      setDb((d) => ({
        ...d,
        subscriptions: [
          ...d.subscriptions.map((s) => (s.userId === userId ? { ...s, status: "expired" as const } : s)),
          { id: `sub-${uid()}`, userId, packageId, startDate: start.toISOString().slice(0, 10), endDate: endDate.toISOString().slice(0, 10), status: "active" as const },
        ],
        payments: [{
          id: `pay-${uid()}`, userId, packageName: pkg?.name ?? "باقة",
          amountKwd: amount, method, date: start.toISOString().slice(0, 10), status: "success" as const,
        }, ...d.payments],
      }));
    },
  }), [ready, db, me]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
