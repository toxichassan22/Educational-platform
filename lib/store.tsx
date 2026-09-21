"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DB, seedDB, User, Attempt, Subject, Unit, Lesson, Question, Package, Payment } from "./data";

const LS_DB = "tafawwug-db-v1";
const LS_SESSION = "tafawwug-session-v1";

interface Store {
  ready: boolean;
  db: DB;
  me: User | null;
  login: (userId: string) => boolean;
  logout: () => void;
  addAttempt: (a: Omit<Attempt, "id" | "date">) => void;
  resetDemo: () => void;
  saveLessonProgress: (lessonId: string, videoUrl: string, position: number) => void;
  addStudyNote: (lessonId: string, videoUrl: string, seconds: number, text: string) => void;
  removeStudyNote: (id: string) => void;
  storageError: string;
  // ==== إدارة الأدمن ====
  addSubject: (gradeId: string, name: string, teacher: string) => void;
  deleteSubject: (subjectId: string) => void;
  addUnit: (subjectId: string, title: string) => void;
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
  subscribe: (userId: string, packageId: string, method: Payment["method"], amount: number, subjectId?: string) => void;
}

const Ctx = createContext<Store | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(() => seedDB());
  const [me, setMe] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");

  // تحميل الحالة من localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_DB);
      if (raw) setDb(JSON.parse(raw));
      const sess = localStorage.getItem(LS_SESSION);
      if (sess && raw) {
        const parsed: DB = JSON.parse(raw);
        setMe(parsed.users.find((u) => u.id === sess && u.active) ?? null);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // مزامنة لحظية بين التابات: تعديلات الأدمن في تاب تظهر للطالب في تاب آخر فورًا
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_DB && e.newValue) {
        try { setDb(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // حفظ تلقائي
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(LS_DB, JSON.stringify(db));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- نتيجة كتابة خارجية؛ لا بديل عن إظهارها كحالة
      setStorageError("");
    } catch {
      setStorageError("تعذّر الحفظ على هذا المتصفح. قد تكون مساحة التخزين ممتلئة؛ لا تغلق الصفحة حتى تتمكن من حفظ تقدمك.");
    }
  }, [db, ready]);

  const value = useMemo<Store>(() => ({
    ready, db, me, storageError,
    saveLessonProgress: (lessonId, videoUrl, position) => {
      if (!me || me.role !== "student" || !Number.isFinite(position) || position < 0) return;
      setDb((d) => ({ ...d, lessonProgress: [
        ...(d.lessonProgress ?? []).filter((p) => p.userId !== me.id || p.lessonId !== lessonId),
        { userId: me.id, lessonId, videoUrl, position, updatedAt: new Date().toISOString() },
      ] }));
    },
    addStudyNote: (lessonId, videoUrl, seconds, text) => {
      const value = text.trim().slice(0, 500);
      if (!me || me.role !== "student" || !value || !Number.isFinite(seconds) || seconds < 0) return;
      setDb((d) => ({ ...d, studyNotes: [...(d.studyNotes ?? []), {
        id: `note-${uid()}`, userId: me.id, lessonId, videoUrl, seconds, text: value,
      }] }));
    },
    removeStudyNote: (id) => setDb((d) => ({ ...d, studyNotes: (d.studyNotes ?? []).filter((n) => n.id !== id || n.userId !== me?.id) })), 

    login: (userId) => {
      const u = db.users.find((x) => x.id === userId);
      if (!u || !u.active) return false;
      setMe(u);
      localStorage.setItem(LS_SESSION, userId);
      return true;
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
      setDb((d) => {
        const subjectId = `${gradeId}-${name}-${uid()}`;
        return {
          ...d,
          subjects: [...d.subjects, { id: subjectId, name, gradeId, teacher, color: "#0891b2", icon: "book" }],
          // وحدة افتراضية عشان الأدمن يقدر يضيف دروسًا فورًا
          units: [...d.units, { id: `u-${uid()}`, subjectId, title: "الوحدة الأولى", order: 0 }],
        };
      }),
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
    addUnit: (subjectId, title) =>
      setDb((d) => ({
        ...d,
        units: [...d.units, { id: `u-${uid()}`, subjectId, title, order: d.units.filter((u) => u.subjectId === subjectId).length }],
      })),
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
    subscribe: (userId, packageId, method, amount, subjectId) => {
      const pkg = db.packages.find((p) => p.id === packageId);
      const start = new Date();
      const endDate = new Date(start.getTime() + (pkg?.scope === "all" ? 365 : 30) * 86400000);
      setDb((d) => ({
        ...d,
        subscriptions: [
          ...d.subscriptions.map((s) => (s.userId === userId ? { ...s, status: "expired" as const } : s)),
          { id: `sub-${uid()}`, userId, packageId, subjectId, startDate: start.toISOString().slice(0, 10), endDate: endDate.toISOString().slice(0, 10), status: "active" as const },
        ],
        payments: [{
          id: `pay-${uid()}`, userId, packageName: pkg?.name ?? "باقة",
          amountKwd: amount, method, date: start.toISOString().slice(0, 10), status: "success" as const,
        }, ...d.payments],
      }));
    },
  }), [ready, db, me, storageError]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
