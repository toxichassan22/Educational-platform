"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, Icon, Btn, Modal, Badge } from "@/components/ui";
import { unitsOfSubject, lessonsOfUnit, questionsOfLesson } from "@/lib/data";

export default function CurriculumTab() {
  const { db, addSubject, deleteSubject, addUnit, addLesson, deleteLesson } = useStore();
  const [stageId, setStageId] = useState("high");
  const [gradeId, setGradeId] = useState("g10");
  const [subjectId, setSubjectId] = useState<string | null>(null);

  const [addSubOpen, setAddSubOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [subTeacher, setSubTeacher] = useState("");
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [unitTitle, setUnitTitle] = useState("");
  const [addLessonOpen, setAddLessonOpen] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDur, setLessonDur] = useState(10);

  const grades = db.grades.filter((g) => g.stageId === stageId);
  const subjects = db.subjects.filter((s) => s.gradeId === gradeId);
  const subject = db.subjects.find((s) => s.id === subjectId);
  const units = subject ? unitsOfSubject(db, subject.id) : [];

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      {/* اختيار المرحلة/الصف/المادة */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-4 border border-[#2b3547]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-white text-sm">الهيكل الدراسي</h3>
            <Btn className="!py-1.5 !px-3 text-xs" onClick={() => setAddSubOpen(true)}><Icon name="plus" size={13} /> مادة</Btn>
          </div>

          <div className="flex gap-1.5 mb-3">
            {db.stages.map((s) => (
              <button key={s.id} onClick={() => { setStageId(s.id); const g = db.grades.find(x => x.stageId === s.id)!; setGradeId(g.id); setSubjectId(null); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${stageId === s.id ? "bg-[#2072e0] text-white" : "bg-[#1a2130] text-[#9297a6]"}`}>
                {s.name.replace("المرحلة ", "")}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {grades.map((g) => (
              <button key={g.id} onClick={() => { setGradeId(g.id); setSubjectId(null); }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${gradeId === g.id ? "bg-[#2072e0] text-white" : "bg-[#1a2130] text-[#9297a6]"}`}>
                {g.name.replace("الصف ", "")}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {subjects.map((s) => {
              const uCount = unitsOfSubject(db, s.id).length;
              const lCount = unitsOfSubject(db, s.id).reduce((n, u) => n + lessonsOfUnit(db, u.id).length, 0);
              return (
                <div key={s.id} onClick={() => setSubjectId(s.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${subjectId === s.id ? "border-[#2072e0] bg-[#2072e0]/10" : "border-[#2b3547] hover:border-[#2072e0]/40"}`}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15`, color: s.color }}>
                    <Icon name={s.icon} size={17} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-white">{s.name}</div>
                    <div className="text-[10px] text-[#9297a6]">{uCount} وحدات · {lCount} درسًا · {s.teacher}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteSubject(s.id); if (subjectId === s.id) setSubjectId(null); }}
                    className="p-1.5 rounded-lg text-[#5f6370] hover:bg-red-500/15 hover:text-red-400"><Icon name="trash" size={15} /></button>
                </div>
              );
            })}
            {subjects.length === 0 && <p className="text-xs text-[#9297a6] text-center py-4">لا مواد — أضف أول مادة</p>}
          </div>
        </Card>
      </div>

      {/* الوحدات والدروس */}
      <div className="lg:col-span-3">
        <Card className="p-4 border border-[#2b3547] min-h-[300px]">
          {!subject ? (
            <div className="h-full flex flex-col items-center justify-center text-[#5f6370] py-16">
              <Icon name="grid" size={40} />
              <p className="text-sm mt-3 text-[#9297a6]">اختر مادة لعرض وحداتها ودروسها</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${subject.color}15`, color: subject.color }}><Icon name={subject.icon} size={14} /></span>
                  محتوى «{subject.name}»
                </h3>
                <Btn className="!py-1.5 !px-3 text-xs" onClick={() => setAddUnitOpen(true)}><Icon name="plus" size={13} /> وحدة</Btn>
              </div>
              <div className="space-y-3">
                {units.map((u) => (
                  <div key={u.id} className="border border-[#2b3547] rounded-xl overflow-hidden">
                    <div className="bg-[#1a2130] px-4 py-2.5 flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{u.title}</span>
                      <Btn variant="ghost" className="!py-1 !px-2.5 text-xs" onClick={() => setAddLessonOpen(u.id)}>
                        <Icon name="plus" size={13} /> درس
                      </Btn>
                    </div>
                    {lessonsOfUnit(db, u.id).map((l) => (
                      <div key={l.id} className="flex items-center gap-3 px-4 py-2.5 border-t border-white/[0.07]">
                        <Icon name="video" size={15} className="text-[#5f6370]" />
                        <span className="flex-1 text-sm text-white/90">{l.title}</span>
                        <span className="text-[10px] text-[#9297a6]">{l.durationMin}د</span>
                        <Badge tone="blue">{questionsOfLesson(db, l.id).length} سؤال</Badge>
                        <button onClick={() => deleteLesson(l.id)} className="p-1 rounded-lg text-[#5f6370] hover:bg-red-500/15 hover:text-red-400"><Icon name="trash" size={14} /></button>
                      </div>
                    ))}
                  </div>
                ))}
                {units.length === 0 && <p className="text-xs text-[#9297a6] text-center py-8">لا وحدات بعد</p>}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* إضافة مادة */}
      <Modal open={addSubOpen} onClose={() => setAddSubOpen(false)} title="إضافة مادة جديدة">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-[#9297a6] block mb-1">اسم المادة</label>
            <input value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="مثال: الجيولوجيا"
              className="w-full border border-[#2b3547] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2072e0]" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#9297a6] block mb-1">المعلم</label>
            <input value={subTeacher} onChange={(e) => setSubTeacher(e.target.value)} placeholder="أ. الاسم"
              className="w-full border border-[#2b3547] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2072e0]" />
          </div>
          <div className="text-xs text-[#9297a6] bg-[#1a2130] rounded-lg p-2">
            ستُضاف إلى: <b>{db.grades.find(g => g.id === gradeId)?.name}</b>
          </div>
          <Btn className="w-full" onClick={() => { if (subName.trim()) { addSubject(gradeId, subName.trim(), subTeacher.trim() || "فريق المنصة"); setSubName(""); setSubTeacher(""); setAddSubOpen(false); } }}>
            إضافة المادة
          </Btn>
        </div>
      </Modal>

      {/* إضافة وحدة */}
      <Modal open={addUnitOpen} onClose={() => setAddUnitOpen(false)} title="إضافة وحدة جديدة">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-[#9297a6] block mb-1">اسم الوحدة</label>
            <input value={unitTitle} onChange={(e) => setUnitTitle(e.target.value)} placeholder="مثال: التفاضل والتكامل"
              className="w-full border border-[#2b3547] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2072e0]" />
          </div>
          <div className="text-xs text-[#9297a6] bg-[#1a2130] rounded-lg p-2">
            ستُضاف إلى: <b>{subject?.name}</b> — وتظهر للطالب فورًا ويمكنك إضافة دروسها مباشرة.
          </div>
          <Btn className="w-full" onClick={() => { if (unitTitle.trim() && subject) { addUnit(subject.id, unitTitle.trim()); setUnitTitle(""); setAddUnitOpen(false); } }}>
            إضافة الوحدة
          </Btn>
        </div>
      </Modal>

      {/* إضافة درس */}
      <Modal open={!!addLessonOpen} onClose={() => setAddLessonOpen(null)} title="إضافة درس جديد">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-[#9297a6] block mb-1">عنوان الدرس</label>
            <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="مثال: قانون نيوتن الأول"
              className="w-full border border-[#2b3547] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2072e0]" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#9297a6] block mb-1">المدة (دقائق)</label>
            <input type="number" value={lessonDur} onChange={(e) => setLessonDur(+e.target.value)} dir="ltr"
              className="w-full border border-[#2b3547] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2072e0] text-left" />
          </div>
          <div className="text-xs text-[#9297a6] bg-[#1a2130] rounded-lg p-2">
            في النسخة الكاملة: رفع فيديو + مذكرة PDF + إرفاق اختبار — هنا نضيف درسًا تجريبيًا يظهر فورًا للطالب.
          </div>
          <Btn className="w-full" onClick={() => { if (lessonTitle.trim() && addLessonOpen) { addLesson(addLessonOpen, lessonTitle.trim(), lessonDur); setLessonTitle(""); setAddLessonOpen(null); } }}>
            إضافة الدرس
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
