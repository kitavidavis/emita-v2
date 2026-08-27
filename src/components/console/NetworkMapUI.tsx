"use client";

import { useState } from "react";
import styles from "./console.module.css";
import { CONTEXT_MENU_ACTIONS } from "@/lib/content/geomap";
import { TECHNICIANS } from "@/lib/content/tasks";
import type { DrawnFeature, ToolMode } from "./NetworkMap";

const TOOL_ICONS: Record<string, string> = {
  pan: "M8 2v5M8 9v5M2 8h5M9 8h5", // simple crosshair for "pan/select cursor"
  point: "M8 2a4 4 0 100 8 4 4 0 000-8z",
  line: "M2.5 13.5l11-11",
  polygon: "M8 2L14 6.5L11.5 14H4.5L2 6.5Z",
  circle: "M8 2.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z",
  "measure-distance": "M2 12L12 2M4 10l1.4-1.4M6.6 12.6L8 11.2M9.2 9.4l1.4-1.4",
  "measure-area": "M2 3h12v10H2zM2 13L14 3",
  select: "M2 2l4.5 11L8 8.5 12.5 7 2 2z",
  trash: "M3.5 4.5h9M6 4.5V2.5h4v2M4.5 4.5l.8 9h5.4l.8-9",
};

function ToolIcon({ name }: { name: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={TOOL_ICONS[name] ?? TOOL_ICONS.pan} />
    </svg>
  );
}

const TOOLS: { mode: ToolMode; label: string }[] = [
  { mode: "pan", label: "Pan / select (default)" },
  { mode: "point", label: "Draw point" },
  { mode: "line", label: "Draw line" },
  { mode: "polygon", label: "Draw polygon" },
  { mode: "circle", label: "Draw circle" },
];

const ANALYSIS_TOOLS: { mode: ToolMode; label: string }[] = [
  { mode: "measure-distance", label: "Measure distance" },
  { mode: "measure-area", label: "Measure area" },
  { mode: "select", label: "Select customers in an area" },
];

export function DrawToolbar({ mode, onSetMode, onClearAll, hasFeatures }: {
  mode: ToolMode;
  onSetMode: (m: ToolMode) => void;
  onClearAll: () => void;
  hasFeatures: boolean;
}) {
  return (
    <div className={styles.gisToolbar}>
      {TOOLS.map((t) => (
        <button
          key={t.mode}
          type="button"
          title={t.label}
          className={`${styles.gisToolBtn} ${mode === t.mode ? styles.gisToolBtnActive : ""}`}
          onClick={() => onSetMode(t.mode)}
        >
          <ToolIcon name={t.mode} />
        </button>
      ))}
      <div className={styles.gisToolDivider} />
      {ANALYSIS_TOOLS.map((t) => (
        <button
          key={t.mode}
          type="button"
          title={t.label}
          className={`${styles.gisToolBtn} ${mode === t.mode ? styles.gisToolBtnActive : ""}`}
          onClick={() => onSetMode(t.mode)}
        >
          <ToolIcon name={t.mode} />
        </button>
      ))}
      <div className={styles.gisToolDivider} />
      <button type="button" title="Clear all drawn shapes" disabled={!hasFeatures} className={styles.gisToolBtn} onClick={onClearAll} style={{ opacity: hasFeatures ? 1 : 0.4 }}>
        <ToolIcon name="trash" />
      </button>
    </div>
  );
}

export function DrawActionBar({ mode, canFinish, onFinish, onCancel }: { mode: ToolMode; canFinish: boolean; onFinish: () => void; onCancel: () => void }) {
  if (mode === "pan") return null;
  const label =
    mode === "point" ? "Click the map to drop a point — Done when you're finished"
      : mode === "circle" ? "Click to set the center, move to size it, click again to finish"
      : mode === "select" ? "Click to trace an area, then finish to select customers inside it"
      : mode === "measure-area" ? "Click to trace an area to measure"
      : mode === "measure-distance" ? "Click points along the route to measure"
      : "Click to add points, then finish the shape";

  return (
    <div className={styles.gisActionBar}>
      <span>{label}</span>
      {mode !== "point" && mode !== "circle" && (
        <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ padding: "5px 12px", fontSize: 11.5 }} disabled={!canFinish} onClick={onFinish}>
          Finish
        </button>
      )}
      <button type="button" className={styles.dBtn} style={{ padding: "5px 12px", fontSize: 11.5 }} onClick={onCancel}>
        {mode === "point" ? "Done" : "Cancel"}
      </button>
    </div>
  );
}

export function MeasureBadge({ text }: { text: string }) {
  return <div className={styles.gisMeasureBadge}>{text}</div>;
}

export function CreatedLayersPanel({ features, onToggle, onDelete, onSave, onClose }: {
  features: (DrawnFeature & { visible: boolean })[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className={styles.gisPanel}>
      <div className={styles.gisPanelHead}>
        <span>Created layers ({features.length})</span>
        <button type="button" className={styles.gisIconBtn} onClick={onClose} aria-label="Close">×</button>
      </div>
      <div className={styles.gisPanelList}>
        {features.length === 0 && <div className={styles.gisPanelEmpty}>Nothing drawn yet — use the toolbar on the left.</div>}
        {features.map((f) => (
          <div key={f.id} className={styles.gisPanelRow}>
            <button type="button" className={styles.gisIconBtn} onClick={() => onToggle(f.id)} title={f.visible ? "Hide" : "Show"}>
              {f.visible ? "👁" : "—"}
            </button>
            <span style={{ flex: 1, minWidth: 0, color: "var(--d-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
            <span style={{ fontSize: 10, color: "var(--d-ink-3)", textTransform: "uppercase", flex: "none" }}>{f.kind}</span>
            <button type="button" className={styles.gisIconBtn} onClick={() => onDelete(f.id)} title="Delete">✕</button>
          </div>
        ))}
      </div>
      {features.length > 0 && (
        <div className={styles.gisPanelFoot}>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} style={{ flex: 1 }} onClick={onSave}>Save created layers</button>
        </div>
      )}
    </div>
  );
}

export function SelectionPanel({ count, connected, disconnected, archived, onBatchMessage, onWorkOrder, onExport, onClose }: {
  count: number;
  connected: number;
  disconnected: number;
  archived: number;
  onBatchMessage: () => void;
  onWorkOrder: () => void;
  onExport: () => void;
  onClose: () => void;
}) {
  return (
    <div className={styles.gisPanel}>
      <div className={styles.gisPanelHead}>
        <span>{count} customers selected</span>
        <button type="button" className={styles.gisIconBtn} onClick={onClose} aria-label="Close">×</button>
      </div>
      <div className={styles.gisPanelList}>
        <div className={styles.gisPanelRow}><span style={{ color: "var(--d-ok)" }}>●</span><span style={{ flex: 1 }}>Connected</span><span className={styles.mono}>{connected}</span></div>
        <div className={styles.gisPanelRow}><span style={{ color: "var(--d-bad)" }}>●</span><span style={{ flex: 1 }}>Disconnected</span><span className={styles.mono}>{disconnected}</span></div>
        <div className={styles.gisPanelRow}><span style={{ color: "var(--d-mut)" }}>●</span><span style={{ flex: 1 }}>Archived</span><span className={styles.mono}>{archived}</span></div>
      </div>
      <div className={styles.gisPanelFoot} style={{ flexDirection: "column", alignItems: "stretch" }}>
        <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={onBatchMessage}>Send batch message</button>
        <button type="button" className={styles.dBtn} onClick={onWorkOrder}>Create work order</button>
        <button type="button" className={styles.dBtn} onClick={onExport}>Clip &amp; export selection</button>
      </div>
    </div>
  );
}

export function ContextMenu({ x, y, lat, lng, onAction }: { x: number; y: number; lat: number; lng: number; onAction: (key: string) => void }) {
  return (
    <div className={styles.leafletCtxMenu} style={{ left: x, top: y }}>
      <div className={styles.leafletCtxHead}>{lat.toFixed(4)}°, {lng.toFixed(4)}°</div>
      {CONTEXT_MENU_ACTIONS.map((a) => (
        <button key={a.key} type="button" className={styles.leafletCtxItem} title={a.note} onClick={() => onAction(a.key)}>
          {a.label}
        </button>
      ))}
    </div>
  );
}

export function WorkOrderModal({ context, onClose }: { context: { note: string }; onClose: () => void }) {
  const [priority, setPriority] = useState("Medium");
  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <div className={styles.gisModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.gisModalHead}>
          Create work order
          <button type="button" className={styles.gisIconBtn} onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className={styles.gisModalBody}>
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--d-ink-3)" }}>{context.note}</p>
          <label className={styles.gisField}><span>Title</span><input type="text" placeholder="e.g. Investigate low pressure" /></label>
          <div style={{ display: "flex", gap: 14 }}>
            <label className={styles.gisField} style={{ flex: 1 }}>
              <span>Type</span>
              <select><option>Meter read</option><option>Repair</option><option>Inspection</option><option>Reconnection</option></select>
            </label>
            <label className={styles.gisField} style={{ flex: 1 }}>
              <span>Priority</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select>
            </label>
          </div>
          <label className={styles.gisField}>
            <span>Assign to</span>
            <select>{TECHNICIANS.map((t) => <option key={t}>{t}</option>)}</select>
          </label>
          <label className={styles.gisField}><span>Notes</span><textarea placeholder="Anything the technician should know" /></label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={onClose}>Create work order</button>
        </div>
      </div>
    </div>
  );
}

export function BatchMessageModal({ context, onClose }: { context: { note: string }; onClose: () => void }) {
  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <div className={styles.gisModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.gisModalHead}>
          Send batch message
          <button type="button" className={styles.gisIconBtn} onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className={styles.gisModalBody}>
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--d-ink-3)" }}>{context.note} — delivered through Notifications, using each customer&apos;s registered contact.</p>
          <label className={styles.gisField}>
            <span>Channel</span>
            <select><option>SMS</option><option>Email</option></select>
          </label>
          <label className={styles.gisField}><span>Message</span><textarea placeholder="e.g. Planned maintenance in your area tomorrow 9am–1pm." /></label>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={styles.dBtn} onClick={onClose}>Cancel</button>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={onClose}>Send</button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({ title, body, onClose }: { title: string; body: string; onClose: () => void }) {
  return (
    <div className={styles.gisModalOverlay} onClick={onClose}>
      <div className={styles.gisModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.gisModalHead}>
          {title}
          <button type="button" className={styles.gisIconBtn} onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className={styles.gisModalBody}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--d-ink-2)", lineHeight: 1.55 }}>{body}</p>
        </div>
        <div className={styles.gisModalFoot}>
          <button type="button" className={`${styles.dBtn} ${styles.dBtnPrimary}`} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
