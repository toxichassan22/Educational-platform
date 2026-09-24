"use client";

import React, { useState } from "react";
import { ENode, TYPE_LABEL, num, str, styleRecord } from "./model";

export type DropPos = "before" | "after" | "inside";

export interface DndPayload {
  kind: "new" | "move";
  type?: string;
  id?: string;
}

interface CanvasProps {
  root: ENode;
  selectedId: string | null;
  preview: boolean;
  onSelect: (id: string | null) => void;
  onMove: (payload: DndPayload, targetId: string, pos: DropPos) => void;
  onEditText: (id: string, text: string, field?: string) => void;
  onProp: (id: string, key: string, value: string | number | boolean) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function readDnd(e: React.DragEvent): DndPayload | null {
  const raw = e.dataTransfer.getData("application/x-editor");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DndPayload;
  } catch {
    return null;
  }
}

function dropPosFromEvent(e: React.DragEvent, el: HTMLElement, container: boolean): DropPos | null {
  if (!readDnd(e)) return null;
  const rect = el.getBoundingClientRect();
  const y = e.clientY - rect.top;
  if (container) {
    if (y > rect.height * 0.7 && y > 48) return "inside";
    if (y < 18) return "before";
    if (y > rect.height - 18) return "after";
    return "inside";
  }
  return y < rect.height / 2 ? "before" : "after";
}

function InlineText({
  node,
  editing,
  onEditText,
  as: Tag = "span",
  field = "text",
}: {
  node: ENode;
  editing: boolean;
  onEditText: (id: string, text: string, field?: string) => void;
  as?: React.ElementType;
  field?: string;
}) {
  const text = str(node.props[field]);
  if (!editing) return <Tag>{text}</Tag>;
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      className="outline-none focus:bg-white/10 rounded px-1 min-w-[2ch]"
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        onEditText(node.id, e.currentTarget.innerText, field);
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
    >
      {text}
    </Tag>
  );
}

const CLICK = (onSelect: (id: string) => void, id: string, preview: boolean) =>
  preview
    ? undefined
    : (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
      };

const DRAG = (id: string) => (e: React.DragEvent) => {
  e.dataTransfer.setData("application/x-editor", JSON.stringify({ kind: "move", id }));
  e.dataTransfer.effectAllowed = "move";
};

function NodeView(props: {
  node: ENode;
  depth: number;
  canvas: CanvasProps;
  dragOverId: string | null;
  dropPos: DropPos | null;
  setDragOver: (id: string | null, pos: DropPos | null) => void;
}) {
  const { node, canvas, dragOverId, dropPos, setDragOver } = props;
  const { selectedId, preview, onSelect, onMove, onEditText, onDelete, onDuplicate } = canvas;
  const selected = selectedId === node.id;
  const chrome = !preview && selected;
  const style = styleRecord(node) as React.CSSProperties;
  const kids = node.children ?? [];
  const isPage = node.type === "page";
  const containerTypes = ["page", "section", "container", "card", "nav", "footer", "ctaBanner"];
  const container = containerTypes.includes(node.type) && !isPage;

  const editableText =
    !preview &&
    selected &&
    ["heading", "text", "button", "badge"].includes(node.type);

  const handleDragOver = (e: React.DragEvent) => {
    if (preview) return;
    if (!readDnd(e)) return;
    e.preventDefault();
    e.stopPropagation();
    const pos = dropPosFromEvent(e, e.currentTarget as HTMLElement, container || isPage);
    if (pos) {
      e.dataTransfer.dropEffect = "copy";
      setDragOver(node.id, pos);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    if (preview) return;
    const payload = readDnd(e);
    if (!payload) return;
    e.preventDefault();
    e.stopPropagation();
    const pos = dropPosFromEvent(e, e.currentTarget as HTMLElement, container || isPage) ?? "after";
    onMove(payload, node.id, pos === "inside" && !container && !isPage ? "after" : pos);
    setDragOver(null, null);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    if (dragOverId === node.id) setDragOver(null, null);
  };

  const ring =
    dragOverId === node.id && dropPos
      ? dropPos === "before"
        ? "shadow-[inset_0_3px_0_0_#3b82f6]"
        : dropPos === "after"
          ? "shadow-[inset_0_-3px_0_0_#3b82f6]"
          : "ring-2 ring-[#3b82f6]"
      : "";
  const selRing = chrome ? "ring-2 ring-[#3b82f6]" : "";

  const wrapDnd = {
    draggable: !preview && !editableText,
    onDragStart: DRAG(node.id),
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    onClick: CLICK(onSelect, node.id, preview),
  };

  let inner: React.ReactNode = null;

  switch (node.type) {
    case "page":
    case "section":
    case "container":
    case "card":
    case "ctaBanner": {
      const body =
        kids.length === 0 && !preview ? (
          <div className="w-full min-h-[64px] border border-dashed border-white/20 rounded-xl flex items-center justify-center text-white/40 text-sm">
            اسحب عنصرًا هنا
          </div>
        ) : (
          kids.map((c) => (
            <NodeView
              key={c.id}
              node={c}
              depth={props.depth + 1}
              canvas={canvas}
              dragOverId={dragOverId}
              dropPos={dropPos}
              setDragOver={setDragOver}
            />
          ))
        );
      const Tag = node.type === "section" ? "section" : "div";
      const merged: React.CSSProperties = { ...style };
      if (!merged.display && !isPage) {
        merged.display = "flex";
        merged.flexDirection = merged.flexDirection || "column";
      }
      if (isPage) {
        merged.display = merged.display || "flex";
        merged.flexDirection = merged.flexDirection || "column";
        merged.minHeight = merged.minHeight || "100vh";
      }
      // grid: ensure children stretch
      if (merged.display === "grid") {
        // ok
      }
      inner = (
        <Tag style={merged} className={`${ring} ${selRing}`} {...(isPage ? {} : wrapDnd)}>
          {body}
        </Tag>
      );
      break;
    }

    case "nav": {
      const links = str(node.props.links)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      inner = (
        <nav
          style={{
            ...style,
            paddingLeft: num(node.props.px, 40),
            paddingRight: num(node.props.px, 40),
          }}
          className={`${ring} ${selRing} relative z-10`}
          {...wrapDnd}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 900, letterSpacing: 5, fontSize: 22, color: str(node.props.color, "#fff") }}>
              {str(node.props.brand, "UULA")}
            </span>
            <span style={{ color: "#3b82f6", fontWeight: 900, fontSize: 18 }}>◆</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {links.map((l) => (
              <a
                key={l}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  color: l === links[0] ? "#fff" : "#c8d0e0",
                  textDecoration: "none",
                  fontWeight: l === links[0] ? 800 : 600,
                  fontSize: 15,
                }}
              >
                {l}
              </a>
            ))}
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              border: "2px solid #2563eb",
              color: "#93c5fd",
              borderRadius: 999,
              padding: "10px 28px",
              fontWeight: 800,
              textDecoration: "none",
              fontSize: 15,
              background: "rgba(37,99,235,.08)",
            }}
          >
            {str(node.props.cta, "ادخل")}
          </a>
        </nav>
      );
      break;
    }

    case "footer": {
      const links = str(node.props.links)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      inner = (
        <footer style={style} className={`${ring} ${selRing}`} {...wrapDnd}>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            {links.map((l) => (
              <a key={l} href="#" onClick={(e) => e.preventDefault()} style={{ color: str(node.props.color, "#6b7589"), textDecoration: "none", fontSize: 14 }}>
                {l}
              </a>
            ))}
          </div>
          <p style={{ margin: 0, textAlign: "center", color: str(node.props.color, "#6b7589"), fontSize: num(node.props.fontSize, 13) }}>
            {str(node.props.text)}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 18, opacity: 0.55, fontSize: 12 }}>
            <span>🍎 Apple Pay</span>
            <span>💳 KNET</span>
          </div>
        </footer>
      );
      break;
    }

    case "heading": {
      const tag = str(node.props.tag, "h2");
      const H = (["h1", "h2", "h3", "h4", "p"].includes(tag) ? tag : "h2") as React.ElementType;
      inner = (
        <H style={{ ...style, margin: 0 }} className={`${ring} ${selRing} rounded`} {...wrapDnd} draggable={!preview && !editableText}>
          <InlineText node={node} editing={!!editableText} onEditText={onEditText} />
        </H>
      );
      break;
    }

    case "text":
      inner = (
        <p style={{ ...style, margin: 0 }} className={`${ring} ${selRing} rounded whitespace-pre-line`} {...wrapDnd} draggable={!preview && !editableText}>
          <InlineText node={node} editing={!!editableText} onEditText={onEditText} />
        </p>
      );
      break;

    case "button":
      inner = (
        <a
          href={preview ? str(node.props.href, "#") : undefined}
          style={{
            ...style,
            display: "inline-block",
            textDecoration: "none",
            padding: `${num(node.props.p, 14)}px ${num(node.props.pxBtn, 28)}px`,
            whiteSpace: "nowrap",
            cursor: preview ? "pointer" : "move",
          }}
          className={`${ring} ${selRing} font-extrabold`}
          onClick={
            preview
              ? undefined
              : (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(node.id);
                }
          }
          draggable={!preview && !editableText}
          onDragStart={DRAG(node.id)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <InlineText node={node} editing={!!editableText} onEditText={onEditText} as="span" />
        </a>
      );
      break;

    case "badge":
      inner = (
        <span
          style={{
            ...style,
            display: "inline-block",
            padding: `${num(node.props.p, 8)}px ${num(node.props.px, 16)}px`,
          }}
          className={`${ring} ${selRing}`}
          {...wrapDnd}
          draggable={!preview && !editableText}
        >
          <InlineText node={node} editing={!!editableText} onEditText={onEditText} as="span" />
        </span>
      );
      break;

    case "image":
      inner = (
        // eslint-disable-next-line @next/next/no-img-element -- editor allows arbitrary user URLs
        <img
          src={str(node.props.src)}
          alt={str(node.props.alt)}
          style={style}
          className={`${ring} ${selRing} block`}
          onClick={CLICK(onSelect, node.id, preview)}
          draggable={!preview}
          onDragStart={DRAG(node.id)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.opacity = "0.25";
          }}
        />
      );
      break;

    case "spacer":
      inner = (
        <div
          style={{ height: num(node.props.h, 32), width: str(node.props.w, "auto") }}
          className={`${ring} ${chrome ? "ring-1 ring-dashed ring-[#3b82f6]/60" : ""}`}
          {...wrapDnd}
        />
      );
      break;

    case "decor":
      inner = (
        <span
          style={{
            ...style,
            position: "absolute",
            pointerEvents: "none",
            lineHeight: 1,
            userSelect: "none",
          }}
          className={`${ring} ${chrome ? "ring-2 ring-[#3b82f6]" : ""} ${chrome ? "pointer-events-auto" : ""}`}
          onClick={chrome ? CLICK(onSelect, node.id, preview) : undefined}
          draggable={!preview}
          onDragStart={DRAG(node.id)}
        >
          {str(node.props.content, "✦")}
        </span>
      );
      break;

    case "statCircle":
      inner = (
        <div
          style={{
            ...style,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            flexShrink: 0,
          }}
          className={`${ring} ${selRing}`}
          {...wrapDnd}
        >
          <div
            style={{
              fontSize: num(node.props.fontSize, 72),
              fontWeight: 900,
              color: str(node.props.color, "#fff"),
              lineHeight: 1.1,
              textShadow: "0 8px 30px rgba(0,0,0,.5)",
            }}
          >
            {str(node.props.value, "100%")}
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 10, maxWidth: 200, lineHeight: 1.5 }}>
            {str(node.props.label)}
          </div>
        </div>
      );
      break;

    case "gradeCard":
      inner = (
        <a
          href={preview ? "#" : undefined}
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontWeight: 900,
            fontSize: num(node.props.fontSize, 88),
            position: "relative",
            overflow: "hidden",
            background: "transparent",
            color: "transparent",
          }}
          className={`${ring} ${selRing}`}
          onClick={
            preview
              ? undefined
              : (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(node.id);
                }
          }
          draggable={!preview}
          onDragStart={DRAG(node.id)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: num(node.props.radius, 28),
              background: str(node.props.bg, "linear-gradient(160deg,#141c33,#0e1528)"),
              border: str(node.props.border, "1px solid rgba(255,255,255,.05)"),
              zIndex: 0,
            }}
          />
          <span
            style={{
              position: "relative",
              zIndex: 1,
              background: `linear-gradient(180deg, ${str(node.props.color2, "#93c5fd")} 0%, ${str(node.props.color, "#2563eb")} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              textShadow: "none",
              filter: `drop-shadow(0 14px 28px ${str(node.props.color, "#2563eb")}55)`,
              lineHeight: 1,
            }}
          >
            {str(node.props.num)}
          </span>
        </a>
      );
      break;

    case "studentCard":
      inner = (
        <article
          style={{ ...style, overflow: "hidden" }}
          className={`${ring} ${selRing}`}
          {...wrapDnd}
        >
          <div style={{ position: "relative" }}>
            {str(node.props.img) ? (
              // eslint-disable-next-line @next/next/no-img-element -- editor allows arbitrary user URLs
              <img
                src={str(node.props.img)}
                alt={str(node.props.name)}
                style={{
                  width: "100%",
                  aspectRatio: "5/6",
                  objectFit: "cover",
                  display: "block",
                  borderTopLeftRadius: num(node.props.radius, 20),
                  borderTopRightRadius: num(node.props.radius, 20),
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.15";
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "5/6",
                  background: "linear-gradient(160deg,#1e293b,#0f172a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 64,
                  fontWeight: 900,
                  color: str(node.props.accent, "#34d399"),
                }}
              >
                {str(node.props.name, "?").slice(0, 1)}
              </div>
            )}
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 12,
                fontSize: 36,
                fontWeight: 900,
                color: str(node.props.accent, "#34d399"),
                textShadow: "0 4px 20px rgba(0,0,0,.6)",
              }}
            >
              %{str(node.props.score)}
            </div>
          </div>
          <div style={{ padding: `12px ${num(node.props.p, 14)}px ${num(node.props.p, 14)}px` }}>
            <div style={{ fontWeight: 900, fontSize: 15, color: str(node.props.color, "#fff") }}>
              {str(node.props.name)}
            </div>
            <div style={{ fontSize: 13, color: "#8b95a9", marginTop: 4 }}>{str(node.props.meta)}</div>
          </div>
        </article>
      );
      break;

    case "feature":
      inner = (
        <div style={style} className={`${ring} ${selRing} rounded`} {...wrapDnd}>
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: num(node.props.fontSize, 34),
              fontWeight: 900,
              color: str(node.props.titleColor, "#fff"),
              textAlign: str(node.props.align, "right") as React.CSSProperties["textAlign"],
            }}
          >
            {str(node.props.title)}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: num(node.props.descSize, 17),
              lineHeight: 1.85,
              color: str(node.props.descColor, "#8b95a9"),
              textAlign: str(node.props.align, "right") as React.CSSProperties["textAlign"],
            }}
          >
            {str(node.props.desc)}
          </p>
        </div>
      );
      break;

    case "award":
      inner = (
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 140, ...style }}
          className={`${ring} ${selRing} rounded`}
          {...wrapDnd}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(160deg,#1a2340,#121a30)",
              border: "1px solid rgba(255,255,255,.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            {str(node.props.icon, "🏆")}
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: str(node.props.color, "#e2e8f0"), textAlign: "center" }}>
            {str(node.props.title)}
          </div>
          <div style={{ fontSize: 12, color: "#6b7589", textAlign: "center" }}>{str(node.props.desc)}</div>
        </div>
      );
      break;

    case "teacherCard":
      inner = (
        <article style={{ ...style, overflow: "hidden" }} className={`${ring} ${selRing}`} {...wrapDnd}>
          {/* eslint-disable-next-line @next/next/no-img-element -- editor allows arbitrary user URLs */}
          <img
            src={str(node.props.img)}
            alt={str(node.props.name)}
            style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
            }}
          />
          <div style={{ padding: "18px 20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontWeight: 900, fontSize: 18, color: str(node.props.color, "#fff") }}>
                {str(node.props.name)}
              </span>
              <span
                style={{
                  background: "rgba(139,92,246,.18)",
                  color: "#a78bfa",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                {str(node.props.subject)}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[str(node.props.years), str(node.props.students)].filter(Boolean).map((t) => (
                <span
                  key={t}
                  style={{
                    background: "rgba(59,130,246,.12)",
                    color: "#60a5fa",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "5px 10px",
                    borderRadius: 999,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </article>
      );
      break;

    case "testimonial":
      inner = (
        <blockquote style={{ ...style, margin: 0 }} className={`${ring} ${selRing}`} {...wrapDnd}>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.9,
              color: str(node.props.color, "#cbd5e1"),
            }}
          >
            {str(node.props.quote)}
          </p>
          <footer style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 14,
                color: "#fff",
              }}
            >
              {str(node.props.name, "?").slice(0, 1)}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#fff" }}>{str(node.props.name)}</div>
              <div style={{ fontSize: 12, color: "#6b7589" }}>{str(node.props.meta)}</div>
            </div>
          </footer>
        </blockquote>
      );
      break;

    case "ctaBanner":
      inner = (
        <div style={style} className={`${ring} ${selRing}`} {...wrapDnd}>
          {kids.length === 0 && !preview ? (
            <div className="w-full min-h-[80px] border border-dashed border-blue-400/40 rounded-xl flex items-center justify-center text-blue-300/70 text-sm">
              اسحب محتوى البانر هنا
            </div>
          ) : (
            kids.map((c) => (
              <NodeView
                key={c.id}
                node={c}
                depth={props.depth + 1}
                canvas={canvas}
                dragOverId={dragOverId}
                dropPos={dropPos}
                setDragOver={setDragOver}
              />
            ))
          )}
        </div>
      );
      break;

    case "yearTabs": {
      const years = str(node.props.years)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const active = str(node.props.active, years[0] ?? "");
      inner = (
        <div style={style} className={`${ring} ${selRing}`} {...wrapDnd}>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={(e) => {
                if (preview) return;
                e.stopPropagation();
                onSelect(node.id);
                // update active via prop callback stored on canvas
                canvas.onProp(node.id, "active", y);
              }}
              style={{
                background: y === active ? "#2563eb" : "rgba(255,255,255,.06)",
                color: y === active ? "#fff" : "#94a3b8",
                border: y === active ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,.1)",
                borderRadius: 999,
                padding: "8px 20px",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {y}
            </button>
          ))}
        </div>
      );
      break;
    }

    case "logoStrip": {
      const items = str(node.props.items)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const icons: Record<string, string> = {
        "App Store": "App Store",
        "Google Play": "Google Play",
        "Apple Pay": " Apple Pay",
        KNET: "💳 KNET",
      };
      inner = (
        <div style={style} className={`${ring} ${selRing}`} {...wrapDnd}>
          {items.map((it) => (
            <span
              key={it}
              style={{
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                color: str(node.props.color, "#6b7589"),
                background: "rgba(255,255,255,.03)",
              }}
            >
              {icons[it] ?? it}
            </span>
          ))}
        </div>
      );
      break;
    }

    default:
      inner = null;
  }

  if (isPage) return <>{inner}</>;

  return (
    <div className="relative group/node" data-node-id={node.id} data-type={node.type}>
      {inner}
      {!preview && selected && (
        <div className="absolute -top-7 right-0 z-30 flex items-center gap-1 text-[11px]">
          <span className="bg-[#3b82f6] text-white px-2 py-0.5 rounded-t font-bold">
            {TYPE_LABEL[node.type]}
          </span>
          <button
            type="button"
            className="bg-[#1e293b] text-white px-2 py-0.5 rounded-t hover:bg-[#334155]"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(node.id);
            }}
          >
            نسخ
          </button>
          <button
            type="button"
            className="bg-[#7f1d1d] text-white px-2 py-0.5 rounded-t hover:bg-[#991b1b]"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
          >
            حذف
          </button>
        </div>
      )}
      {!preview && !selected && (
        <div className="absolute inset-0 pointer-events-none group-hover/node:ring-1 group-hover/node:ring-white/25 rounded" />
      )}
    </div>
  );
}

export default function Canvas(props: CanvasProps) {
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropPos, setDropPos] = useState<DropPos | null>(null);

  const setDragOver = (id: string | null, pos: DropPos | null) => {
    setDragOverId(id);
    setDropPos(pos);
  };

  return (
    <div
      className="min-h-full bg-[#070b16]"
      onClick={() => props.onSelect(null)}
      onDragOver={(e) => {
        if (props.preview) return;
        if (readDnd(e)) e.preventDefault();
      }}
      onDrop={(e) => {
        if (props.preview) return;
        const payload = readDnd(e);
        if (!payload) return;
        if (e.target === e.currentTarget) {
          e.preventDefault();
          props.onMove(payload, props.root.id, "inside");
          setDragOver(null, null);
        }
      }}
    >
      <NodeView
        node={props.root}
        depth={0}
        canvas={props}
        dragOverId={dragOverId}
        dropPos={dropPos}
        setDragOver={setDragOver}
      />
    </div>
  );
}
