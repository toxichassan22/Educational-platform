"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Canvas, { DropPos, DndPayload } from "./Canvas";
import Palette, { Inspector } from "./panels";
import { defaultPages } from "./templates";
import { exportHtml } from "./toHtml";
import {
  ENode,
  PageDoc,
  TYPE_LABEL,
  clone,
  createNode,
  findNode,
  findParent,
  insertNode,
  remountIds,
  removeNode,
  uid,
} from "./model";

const LS_KEY = "tafawuq-editor-pages-v2";

function loadPages(): PageDoc[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PageDoc[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return defaultPages();
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Editor() {
  const [hydrated, setHydrated] = useState(false);
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [pageId, setPageId] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- localStorage only available on client after mount */
  useEffect(() => {
    const p = loadPages();
    setPages(p);
    setPageId(p[0]?.id ?? "");
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (hydrated && pages.length) localStorage.setItem(LS_KEY, JSON.stringify(pages));
  }, [pages, hydrated]);

  const page = useMemo(() => pages?.find((p) => p.id === pageId) ?? pages?.[0] ?? null, [pages, pageId]);
  const selected = useMemo(() => (page && selectedId ? findNode(page.root, selectedId) : null), [page, selectedId]);

  const patchRoot = useCallback(
    (fn: (root: ENode) => void) => {
      setPages((prev) => {
        if (!prev) return prev;
        return prev.map((p) => {
          if (p.id !== (page?.id ?? pageId)) return p;
          const next = clone(p);
          fn(next.root);
          return next;
        });
      });
    },
    [page?.id, pageId],
  );

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const onMove = useCallback(
    (payload: DndPayload, targetId: string, pos: DropPos) => {
      if (!page) return;
      patchRoot((root) => {
        let node: ENode;
        if (payload.kind === "new" && payload.type) {
          node = createNode(payload.type as ENode["type"]);
        } else if (payload.kind === "move" && payload.id) {
          if (payload.id === targetId) return;
          // prevent dropping into own descendant
          const moving = findNode(root, payload.id);
          if (moving && findNode(moving, targetId)) return;
          const removed = removeNode(root, payload.id);
          if (!removed) return;
          node = removed;
          // adjust target index if we removed before target — insertNode uses ids so OK
        } else return;
        insertNode(root, targetId, node, pos);
        setSelectedId(node.id);
      });
    },
    [page, patchRoot],
  );

  const onProp = useCallback(
    (key: string, value: string | number | boolean) => {
      if (!selectedId) return;
      patchRoot((root) => {
        const n = findNode(root, selectedId);
        if (n) n.props[key] = value;
      });
    },
    [selectedId, patchRoot],
  );

  const onEditText = useCallback(
    (id: string, text: string, field = "text") => {
      patchRoot((root) => {
        const n = findNode(root, id);
        if (n) n.props[field] = text;
      });
    },
    [patchRoot],
  );

  const onDelete = useCallback(
    (id: string) => {
      if (id === page?.root.id) return;
      patchRoot((root) => {
        removeNode(root, id);
      });
      setSelectedId(null);
    },
    [page?.root.id, patchRoot],
  );

  const onDuplicate = useCallback(
    (id: string) => {
      patchRoot((root) => {
        const orig = findNode(root, id);
        const parent = findParent(root, id);
        if (!orig || !parent) return;
        const copy = remountIds(clone(orig));
        const i = (parent.children ?? []).findIndex((c) => c.id === id);
        if (i >= 0 && parent.children) parent.children.splice(i + 1, 0, copy);
        setSelectedId(copy.id);
      });
    },
    [patchRoot],
  );

  const addFromPalette = (type: ENode["type"]) => {
    patchRoot((root) => {
      const node = createNode(type);
      const sel = selectedId ? findNode(root, selectedId) : null;
      const into = sel && ["page", "section", "container", "card", "nav", "footer"].includes(sel.type) ? sel.id : root.id;
      insertNode(root, into, node, "inside");
      setSelectedId(node.id);
    });
  };

  const resetPages = () => {
    if (!confirm("إعادة تعيين كل الصفحات للقوالب الأصلية؟")) return;
    const p = defaultPages();
    setPages(p);
    setPageId(p[0].id);
    setSelectedId(null);
    flash("تمت إعادة التعيين");
  };

  const doExportHtml = () => {
    if (!page) return;
    download(`${page.name}.html`, exportHtml(page), "text/html;charset=utf-8");
    flash("تم تصدير HTML");
  };

  const doExportJson = () => {
    if (!page) return;
    download(`${page.name}.json`, JSON.stringify(page, null, 2), "application/json");
    flash("تم تصدير JSON");
  };

  const doImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const doc = JSON.parse(text) as PageDoc;
      if (!doc?.root) throw new Error("bad");
      doc.id = uid();
      setPages((prev) => [...(prev ?? []), doc]);
      setPageId(doc.id);
      flash("تم الاستيراد");
    } catch {
      flash("فشل الاستيراد");
    }
  };

  if (!hydrated || !pages.length || !page) {
    return (
      <div className="min-h-screen bg-[#0f1217] text-white flex items-center justify-center">
        جارٍ تحميل المحرر…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f1217] text-white overflow-hidden" dir="rtl">
      {/* Toolbar */}
      <header className="h-12 shrink-0 border-b border-[#2b3547] bg-[#12161d] flex items-center gap-2 px-3 text-xs">
        <Link href="/" className="font-black text-blue-400 tracking-widest text-sm hover:underline">
          تفوّق
        </Link>
        <span className="text-slate-500">محرر الصفحات</span>
        <div className="w-px h-5 bg-[#2b3547] mx-1" />
        <div className="flex items-center gap-1 overflow-x-auto max-w-[360px]">
          {pages.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPageId(p.id);
                setSelectedId(null);
              }}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap border ${
                p.id === page.id
                  ? "border-blue-500 bg-blue-500/15 text-blue-300"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => {
            setPreview((v) => !v);
            setSelectedId(null);
          }}
          className={`px-3 py-1.5 rounded-md border ${
            preview ? "border-amber-400 text-amber-300 bg-amber-400/10" : "border-[#2b3547] text-slate-300 hover:bg-white/5"
          }`}
        >
          {preview ? "تحرير" : "معاينة"}
        </button>
        <button type="button" onClick={doExportHtml} className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 font-bold">
          تصدير HTML
        </button>
        <button
          type="button"
          onClick={doExportJson}
          className="px-3 py-1.5 rounded-md border border-[#2b3547] text-slate-300 hover:bg-white/5"
        >
          JSON
        </button>
        <label className="px-3 py-1.5 rounded-md border border-[#2b3547] text-slate-300 hover:bg-white/5 cursor-pointer">
          استيراد
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) doImportJson(f);
              e.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          onClick={resetPages}
          className="px-3 py-1.5 rounded-md border border-[#2b3547] text-slate-400 hover:bg-white/5"
        >
          إعادة تعيين
        </button>
        <Link href="/" className="px-2 text-slate-500 hover:text-white">
          ← الرئيسية
        </Link>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Palette */}
        {!preview && (
          <aside className="w-48 shrink-0 border-l border-[#2b3547] bg-[#12161d] overflow-y-auto p-3">
            <div className="mb-3">
              <div className="text-[11px] font-bold text-slate-500 mb-2">إضافة سريعة</div>
              <div className="flex flex-col gap-1.5">
                {(["heading", "text", "button", "image", "card", "section"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addFromPalette(t)}
                    className="text-right border border-slate-700 bg-slate-900 hover:border-blue-500 rounded-lg px-3 py-2 text-xs"
                  >
                    + {TYPE_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>
            <Palette />
          </aside>
        )}

        {/* Canvas */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className={`mx-auto ${preview ? "max-w-none" : "max-w-[1200px]"} p-0`}>
            <Canvas
              root={page.root}
              selectedId={selectedId}
              preview={preview}
              onSelect={setSelectedId}
              onMove={onMove}
              onEditText={onEditText}
              onProp={onProp}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          </div>
        </main>

        {/* Inspector */}
        {!preview && (
          <aside className="w-64 shrink-0 border-r border-[#2b3547] bg-[#12161d] overflow-y-auto p-3">
            <Inspector
              node={selected}
              onProp={onProp}
              onDelete={() => selectedId && onDelete(selectedId)}
              onDuplicate={() => selectedId && onDuplicate(selectedId)}
            />
          </aside>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
