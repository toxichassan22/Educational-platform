"use client";

import React from "react";
import { ENode, NodeType, TYPE_LABEL, str, num } from "./model";

const GROUPS: { label: string; items: NodeType[] }[] = [
  { label: "بنية", items: ["section", "container", "card", "nav", "footer", "ctaBanner", "spacer"] },
  { label: "محتوى", items: ["heading", "text", "button", "image", "badge", "decor"] },
  {
    label: "مكوّنات جاهزة",
    items: ["gradeCard", "studentCard", "statCircle", "teacherCard", "testimonial", "feature", "award", "yearTabs", "logoStrip"],
  },
];

export default function Palette() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      {GROUPS.map((g) => (
        <div key={g.label}>
          <div className="text-[11px] font-bold text-slate-500 mb-2 tracking-wide">{g.label}</div>
          <div className="flex flex-col gap-1.5">
            {g.items.map((type) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "application/x-editor",
                    JSON.stringify({ kind: "new", type }),
                  );
                  e.dataTransfer.effectAllowed = "copy";
                }}
                className="cursor-grab active:cursor-grabbing border border-slate-700 bg-slate-900 hover:border-blue-500 hover:bg-slate-800 rounded-lg px-3 py-2 select-none transition-colors"
                title="اسحب إلى اللوحة أو انقر للإضافة"
              >
                {TYPE_LABEL[type]}
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800 pt-3">
        اسحب عنصرًا للوحة · اسحب داخل الصفحة لإعادة الترتيب · انقر عنصرًا ثم عدّل خصائصه يمينًا · انقر مرتين على النص لتعديله
      </p>
    </div>
  );
}

interface InspectorProps {
  node: ENode | null;
  onProp: (key: string, value: string | number | boolean) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode; hint?: boolean }) {
  return (
    <label className="flex flex-col gap-1 text-[11px] text-slate-400">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none w-full";

export function Inspector({ node, onProp, onDelete, onDuplicate }: InspectorProps) {
  if (!node) {
    return (
      <div className="text-xs text-slate-500 leading-relaxed">
        لا يوجد عنصر محدد.
        <br />
        انقر على أي عنصر في اللوحة لتحرير خصائصه.
      </div>
    );
  }

  const p = node.props;
  const textTypes: NodeType[] = ["heading", "text", "button", "badge", "footer"];
  const showText = textTypes.includes(node.type) || node.type === "feature" || node.type === "award" || node.type === "gradeCard" || node.type === "studentCard" || node.type === "nav";

  return (
    <div className="flex flex-col gap-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-blue-400">{TYPE_LABEL[node.type]}</span>
        <div className="flex gap-1">
          <button type="button" className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700" onClick={onDuplicate}>
            نسخ
          </button>
          <button type="button" className="px-2 py-1 rounded bg-red-900/60 hover:bg-red-800" onClick={onDelete}>
            حذف
          </button>
        </div>
      </div>

      {node.type === "heading" && (
        <Field label="مستوى العنوان">
          <select className={inputCls} value={str(p.tag, "h2")} onChange={(e) => onProp("tag", e.target.value)}>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="p">فقرة</option>
          </select>
        </Field>
      )}

      {showText && node.type !== "nav" && (
        <Field label={node.type === "heading" || node.type === "text" ? "النص" : "النص / القيمة"}>
          <textarea
            className={inputCls}
            rows={3}
            value={str(p.text ?? p.title ?? p.name ?? p.num ?? "")}
            onChange={(e) => {
              const key = p.text !== undefined ? "text" : p.title !== undefined ? "title" : p.name !== undefined ? "name" : p.num !== undefined ? "num" : "text";
              onProp(key, e.target.value);
            }}
          />
        </Field>
      )}

      {node.type === "feature" && (
        <>
          <Field label="الوصف">
            <textarea className={inputCls} rows={3} value={str(p.desc)} onChange={(e) => onProp("desc", e.target.value)} />
          </Field>
          <Field label="محاذاة">
            <select className={inputCls} value={str(p.align, "center")} onChange={(e) => onProp("align", e.target.value)}>
              <option value="right">يمين</option>
              <option value="center">وسط</option>
              <option value="left">يسار</option>
            </select>
          </Field>
        </>
      )}

      {node.type === "studentCard" && (
        <>
          <Field label="الاسم">
            <input className={inputCls} value={str(p.name)} onChange={(e) => onProp("name", e.target.value)} />
          </Field>
          <Field label="الوصف (الصف)">
            <input className={inputCls} value={str(p.meta)} onChange={(e) => onProp("meta", e.target.value)} />
          </Field>
          <Field label="النسبة">
            <input className={inputCls} value={str(p.score)} onChange={(e) => onProp("score", e.target.value)} />
          </Field>
          <Field label="رابط الصورة">
            <input className={inputCls} value={str(p.img)} onChange={(e) => onProp("img", e.target.value)} />
          </Field>
        </>
      )}

      {node.type === "image" && (
        <>
          <Field label="رابط الصورة">
            <input className={inputCls} value={str(p.src)} onChange={(e) => onProp("src", e.target.value)} />
          </Field>
          <Field label="نص بديل">
            <input className={inputCls} value={str(p.alt)} onChange={(e) => onProp("alt", e.target.value)} />
          </Field>
        </>
      )}

      {node.type === "button" && (
        <Field label="الرابط">
          <input className={inputCls} value={str(p.href, "#")} onChange={(e) => onProp("href", e.target.value)} />
        </Field>
      )}

      {node.type === "nav" && (
        <>
          <Field label="العلامة">
            <input className={inputCls} value={str(p.brand)} onChange={(e) => onProp("brand", e.target.value)} />
          </Field>
          <Field label="الروابط (بفاصلة)">
            <input className={inputCls} value={str(p.links)} onChange={(e) => onProp("links", e.target.value)} />
          </Field>
          <Field label="زر الدخول">
            <input className={inputCls} value={str(p.cta)} onChange={(e) => onProp("cta", e.target.value)} />
          </Field>
        </>
      )}

      {node.type === "footer" && (
        <>
          <Field label="النص">
            <input className={inputCls} value={str(p.text)} onChange={(e) => onProp("text", e.target.value)} />
          </Field>
          <Field label="الروابط (بفاصلة)">
            <input className={inputCls} value={str(p.links)} onChange={(e) => onProp("links", e.target.value)} />
          </Field>
        </>
      )}

      {node.type === "award" && (
        <>
          <Field label="العنوان">
            <input className={inputCls} value={str(p.title)} onChange={(e) => onProp("title", e.target.value)} />
          </Field>
          <Field label="الوصف">
            <input className={inputCls} value={str(p.desc)} onChange={(e) => onProp("desc", e.target.value)} />
          </Field>
          <Field label="الأيقونة">
            <input className={inputCls} value={str(p.icon, "🏆")} onChange={(e) => onProp("icon", e.target.value)} />
          </Field>
        </>
      )}

      {node.type === "spacer" && (
        <Field label="الارتفاع (px)">
          <input type="number" className={inputCls} value={num(p.h, 32)} onChange={(e) => onProp("h", Number(e.target.value))} />
        </Field>
      )}

      {node.type === "decor" && (
        <>
          <Field label="المحتوى (رمز/إيموجي)">
            <input className={inputCls} value={str(p.content, "✦")} onChange={(e) => onProp("content", e.target.value)} />
          </Field>
          <Field label="حجم">
            <input type="number" className={inputCls} value={num(p.fontSize, 48)} onChange={(e) => onProp("fontSize", Number(e.target.value))} />
          </Field>
        </>
      )}

      {node.type === "statCircle" && (
        <>
          <Field label="القيمة">
            <input className={inputCls} value={str(p.value, "100%")} onChange={(e) => onProp("value", e.target.value)} />
          </Field>
          <Field label="التسمية">
            <input className={inputCls} value={str(p.label)} onChange={(e) => onProp("label", e.target.value)} />
          </Field>
        </>
      )}

      {node.type === "teacherCard" && (
        <>
          <Field label="الاسم">
            <input className={inputCls} value={str(p.name)} onChange={(e) => onProp("name", e.target.value)} />
          </Field>
          <Field label="المادة">
            <input className={inputCls} value={str(p.subject)} onChange={(e) => onProp("subject", e.target.value)} />
          </Field>
          <Field label="الخبرة">
            <input className={inputCls} value={str(p.years)} onChange={(e) => onProp("years", e.target.value)} />
          </Field>
          <Field label="الرضا">
            <input className={inputCls} value={str(p.students)} onChange={(e) => onProp("students", e.target.value)} />
          </Field>
          <Field label="رابط الصورة">
            <input className={inputCls} value={str(p.img)} onChange={(e) => onProp("img", e.target.value)} />
          </Field>
        </>
      )}

      {node.type === "testimonial" && (
        <>
          <Field label="الاقتباس">
            <textarea className={inputCls} rows={4} value={str(p.quote)} onChange={(e) => onProp("quote", e.target.value)} />
          </Field>
          <Field label="الاسم">
            <input className={inputCls} value={str(p.name)} onChange={(e) => onProp("name", e.target.value)} />
          </Field>
          <Field label="الوصف">
            <input className={inputCls} value={str(p.meta)} onChange={(e) => onProp("meta", e.target.value)} />
          </Field>
        </>
      )}

      {node.type === "yearTabs" && (
        <>
          <Field label="السنوات (بفاصلة)">
            <input className={inputCls} value={str(p.years)} onChange={(e) => onProp("years", e.target.value)} />
          </Field>
          <Field label="النشطة">
            <input className={inputCls} value={str(p.active)} onChange={(e) => onProp("active", e.target.value)} />
          </Field>
        </>
      )}

      {node.type === "logoStrip" && (
        <Field label="العناصر (بفاصلة)">
          <input className={inputCls} value={str(p.items)} onChange={(e) => onProp("items", e.target.value)} />
        </Field>
      )}

      {/* layout / style */}
      <div className="border-t border-slate-800 pt-2 flex flex-col gap-2">
        <div className="text-[11px] font-bold text-slate-500">المظهر</div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="لون الخلفية">
            <input type="color" className={`${inputCls} h-8 p-1`} value={toHex(str(p.bg, "#000000"))} onChange={(e) => onProp("bg", e.target.value)} />
          </Field>
          <Field label="لون النص">
            <input type="color" className={`${inputCls} h-8 p-1`} value={toHex(str(p.color, "#ffffff"))} onChange={(e) => onProp("color", e.target.value)} />
          </Field>
          <Field label="نصف القطر">
            <input type="number" className={inputCls} value={num(p.radius, 0)} onChange={(e) => onProp("radius", Number(e.target.value))} />
          </Field>
          <Field label="حشو (p)">
            <input type="number" className={inputCls} value={num(p.p, num(p.pt, 0))} onChange={(e) => onProp("p", Number(e.target.value))} />
          </Field>
          {(node.type === "section" || node.type === "page" || node.type === "footer" || node.type === "nav") && (
            <>
              <Field label="حشو علوي">
                <input type="number" className={inputCls} value={num(p.pt, 0)} onChange={(e) => onProp("pt", Number(e.target.value))} />
              </Field>
              <Field label="حشو سفلي">
                <input type="number" className={inputCls} value={num(p.pb, 0)} onChange={(e) => onProp("pb", Number(e.target.value))} />
              </Field>
            </>
          )}
          {(node.type === "heading" || node.type === "text" || node.type === "gradeCard") && (
            <>
              <Field label="حجم الخط">
                <input type="number" className={inputCls} value={num(p.fontSize, 16)} onChange={(e) => onProp("fontSize", Number(e.target.value))} />
              </Field>
              <Field label="السماكة">
                <input type="number" className={inputCls} step={100} value={num(p.fontWeight, 400)} onChange={(e) => onProp("fontWeight", Number(e.target.value))} />
              </Field>
            </>
          )}
          {(node.type === "section" || node.type === "container" || node.type === "card" || node.type === "page") && (
            <>
              <Field label="الاتجاه">
                <select className={inputCls} value={str(p.flexDir, "column")} onChange={(e) => onProp("flexDir", e.target.value)}>
                  <option value="column">عمودي</option>
                  <option value="row">أفقي</option>
                </select>
              </Field>
              <Field label="أعمدة Grid">
                <input type="number" className={inputCls} min={1} max={12} value={num(p.gridCols, 0) || ""} placeholder="—" onChange={(e) => onProp("gridCols", Number(e.target.value) || 0)} />
              </Field>
              <Field label="المسافة (gap)">
                <input type="number" className={inputCls} value={num(p.gap, 16)} onChange={(e) => onProp("gap", Number(e.target.value))} />
              </Field>
              <Field label="أقصى عرض">
                <input className={inputCls} value={str(p.maxW, "")} placeholder="1120px" onChange={(e) => onProp("maxW", e.target.value)} />
              </Field>
            </>
          )}
          {node.type === "section" && (
            <Field label="خلفية متدرجة (CSS)">
              <input
                className={inputCls}
                dir="ltr"
                value={str(p.bg).startsWith("linear") || str(p.bg).startsWith("radial") ? str(p.bg) : ""}
                placeholder="linear-gradient(...)"
                onChange={(e) => onProp("bg", e.target.value)}
              />
            </Field>
          )}
        </div>
      </div>
    </div>
  );
}

function toHex(c: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  if (/^#[0-9a-fA-F]{3}$/.test(c)) {
    const r = c[1],
      g = c[2],
      b = c[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#000000";
}
