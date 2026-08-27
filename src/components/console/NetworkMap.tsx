"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  CircleMarker,
  Marker,
  Polyline,
  Polygon,
  Circle,
  Popup,
  ScaleControl,
  useMap,
  useMapEvent,
} from "react-leaflet";
import styles from "./console.module.css";
import { CONDITION_META } from "@/lib/content/assets";
import {
  NEIGHBORHOODS,
  MAP_CENTER,
  CUSTOMER_POINTS,
  SUPPLY_POINTS,
  ASSET_POINTS,
  MAINS,
  type NetStatus,
} from "@/lib/content/geomap";
import {
  DrawToolbar,
  DrawActionBar,
  MeasureBadge,
  CreatedLayersPanel,
  SelectionPanel,
  ContextMenu,
  WorkOrderModal,
  BatchMessageModal,
  ConfirmModal,
} from "./NetworkMapUI";

export type ToolMode = "pan" | "point" | "line" | "polygon" | "circle" | "measure-distance" | "measure-area" | "select";

export type DrawnFeature =
  | { id: string; kind: "point"; name: string; lat: number; lng: number }
  | { id: string; kind: "line"; name: string; points: [number, number][] }
  | { id: string; kind: "polygon"; name: string; points: [number, number][] }
  | { id: string; kind: "circle"; name: string; center: [number, number]; radiusM: number };

const STATUS_COLOR: Record<NetStatus, string> = {
  connected: "var(--d-ok)",
  disconnected: "var(--d-bad)",
  archived: "var(--d-mut)",
};

const STATUS_LABEL: Record<NetStatus, string> = {
  connected: "Connected",
  disconnected: "Disconnected",
  archived: "Archived",
};

const CLUSTER_ZOOM = 16;
const DRAW_COLOR = "#e8a33d"; // distinct from status colors and the accent, so drawn shapes never get mistaken for data

function clusterIcon(count: number, dominant: NetStatus) {
  const size = Math.min(58, 30 + Math.sqrt(count) * 4.5);
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:color-mix(in srgb, ${STATUS_COLOR[dominant]} 35%, transparent);border:2px solid ${STATUS_COLOR[dominant]};display:flex;align-items:center;justify-content:center;font-family:ui-monospace,Menlo,monospace;font-weight:700;color:#fff;font-size:13px;text-shadow:0 1px 2px rgba(0,0,0,0.6);">${count}</div>`,
    className: "",
    iconSize: [size, size],
  });
}

function supplyIcon() {
  return L.divIcon({
    html: `<div style="width:16px;height:16px;border-radius:50%;background:var(--d-panel);border:2.5px solid var(--d-cyan);display:flex;align-items:center;justify-content:center;"><div style="width:5px;height:5px;border-radius:50%;background:var(--d-cyan);"></div></div>`,
    className: "",
    iconSize: [16, 16],
  });
}

function assetIcon(color: string) {
  return L.divIcon({
    html: `<div style="width:11px;height:11px;background:${color};transform:rotate(45deg);border:1.5px solid var(--d-panel);"></div>`,
    className: "",
    iconSize: [11, 11],
  });
}

function drawnPointIcon() {
  return L.divIcon({
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${DRAW_COLOR};border:2px solid #fff;box-shadow:0 0 0 1px ${DRAW_COLOR};"></div>`,
    className: "",
    iconSize: [12, 12],
  });
}

function selectionRingIcon() {
  return L.divIcon({
    html: `<div style="width:16px;height:16px;border-radius:50%;border:2px dashed var(--d-accent);"></div>`,
    className: "",
    iconSize: [16, 16],
  });
}

/** Standard ray-casting point-in-polygon test. */
function pointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Shoelace formula over an equirectangular approximation — accurate enough at utility-service-area scale (a few km across). */
function polygonAreaM2(points: [number, number][]): number {
  if (points.length < 3) return 0;
  const R = 6371000;
  const latRad = (points.reduce((s, p) => s + p[0], 0) / points.length) * (Math.PI / 180);
  const xy = points.map(([lat, lng]) => [lng * (Math.PI / 180) * R * Math.cos(latRad), lat * (Math.PI / 180) * R]);
  let area = 0;
  for (let i = 0; i < xy.length; i++) {
    const [x1, y1] = xy[i];
    const [x2, y2] = xy[(i + 1) % xy.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

function formatArea(m2: number) {
  return m2 >= 10000 ? `${(m2 / 10000).toFixed(2)} ha` : `${Math.round(m2)} m²`;
}

function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}

function totalDistance(points: [number, number][]): number {
  let d = 0;
  for (let i = 1; i < points.length; i++) {
    d += L.latLng(points[i - 1]).distanceTo(L.latLng(points[i]));
  }
  return d;
}

/** Tracks zoom for both the customer clustering threshold and the selection-highlight layer, without duplicating a listener. */
function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMap();
  useMapEvent("zoomend", () => onZoom(map.getZoom()));
  return null;
}

function CustomerLayer({ zoom, selectedIds }: { zoom: number; selectedIds: string[] | null }) {
  if (zoom < CLUSTER_ZOOM) {
    return (
      <>
        {NEIGHBORHOODS.map((n) => {
          const pts = CUSTOMER_POINTS.filter((p) => p.neighborhood === n.name);
          const disconnected = pts.filter((p) => p.status === "disconnected").length;
          const dominant: NetStatus = disconnected > pts.length * 0.3 ? "disconnected" : "connected";
          return (
            <Marker key={n.name} position={[n.lat, n.lng]} icon={clusterIcon(pts.length, dominant)}>
              <Popup>
                <strong>{n.name}</strong>
                <br />
                {pts.length} customers · zoom in for individual pins
              </Popup>
            </Marker>
          );
        })}
      </>
    );
  }

  return (
    <>
      {CUSTOMER_POINTS.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={6}
          pathOptions={{ color: STATUS_COLOR[p.status], fillColor: STATUS_COLOR[p.status], fillOpacity: 0.85, weight: 1.5 }}
        >
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.accountNumber} · {p.neighborhood}
            <br />
            <span style={{ color: STATUS_COLOR[p.status] }}>{STATUS_LABEL[p.status]}</span>
          </Popup>
        </CircleMarker>
      ))}
      {selectedIds?.map((id) => {
        const p = CUSTOMER_POINTS.find((c) => c.id === id);
        return p ? <Marker key={`sel-${id}`} position={[p.lat, p.lng]} icon={selectionRingIcon()} interactive={false} /> : null;
      })}
    </>
  );
}

/** Handles all map clicks/mousemoves for whichever tool is active — the one place drawing state actually changes. */
function DrawingController({
  mode,
  onAddPoint,
  onCursorMove,
}: {
  mode: ToolMode;
  onAddPoint: (p: [number, number]) => void;
  onCursorMove: (p: [number, number]) => void;
}) {
  const map = useMap();
  const isMultiPoint = mode === "line" || mode === "polygon" || mode === "select" || mode === "measure-distance" || mode === "measure-area";

  // Side effects (enabling/disabling a Leaflet handler) belong in an effect, not directly in the
  // render body — Leaflet's enable()/disable() are idempotent, but running them during render is
  // still the wrong place for it.
  useEffect(() => {
    if (isMultiPoint) {
      map.doubleClickZoom.disable();
    } else {
      map.doubleClickZoom.enable();
    }
  }, [isMultiPoint, map]);

  useMapEvent("click", (e) => {
    if (mode === "pan") return;
    onAddPoint([e.latlng.lat, e.latlng.lng]);
  });
  useMapEvent("mousemove", (e) => onCursorMove([e.latlng.lat, e.latlng.lng]));

  return null;
}

export function NetworkMap() {
  const [mode, setMode] = useState<ToolMode>("pan");
  const [zoom, setZoom] = useState(14);
  const [draftPoints, setDraftPoints] = useState<[number, number][]>([]);
  const [draftCircle, setDraftCircle] = useState<{ center: [number, number]; radiusM: number } | null>(null);
  const [cursor, setCursor] = useState<[number, number] | null>(null);
  const [features, setFeatures] = useState<(DrawnFeature & { visible: boolean })[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number; lat: number; lng: number } | null>(null);
  const [legendOpen, setLegendOpen] = useState(true);
  const [workOrder, setWorkOrder] = useState<{ note: string } | null>(null);
  const [batchMessage, setBatchMessage] = useState<{ note: string } | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; body: string } | null>(null);
  const idRef = useRef(0);
  const nextId = () => `f-${++idRef.current}`;

  function resetDrawState() {
    setDraftPoints([]);
    setDraftCircle(null);
  }

  function handleSetMode(next: ToolMode) {
    resetDrawState();
    setMode(next);
  }

  function handleAddPoint(p: [number, number]) {
    if (mode === "point") {
      setFeatures((f) => [...f, { id: nextId(), kind: "point", name: `Point ${f.length + 1}`, lat: p[0], lng: p[1], visible: true }]);
      return;
    }
    if (mode === "circle") {
      if (!draftCircle) {
        setDraftCircle({ center: p, radiusM: 0 });
      } else {
        setFeatures((f) => [...f, { id: nextId(), kind: "circle", name: `Circle ${f.length + 1}`, center: draftCircle.center, radiusM: draftCircle.radiusM, visible: true }]);
        resetDrawState();
        setMode("pan");
      }
      return;
    }
    setDraftPoints((pts) => [...pts, p]);
  }

  function handleCursorMove(p: [number, number]) {
    setCursor(p);
    if (mode === "circle" && draftCircle) {
      setDraftCircle((dc) => (dc ? { ...dc, radiusM: L.latLng(dc.center).distanceTo(L.latLng(p)) } : dc));
    }
  }

  function handleFinish() {
    if (mode === "line" && draftPoints.length >= 2) {
      setFeatures((f) => [...f, { id: nextId(), kind: "line", name: `Line ${f.length + 1}`, points: draftPoints, visible: true }]);
    } else if (mode === "polygon" && draftPoints.length >= 3) {
      setFeatures((f) => [...f, { id: nextId(), kind: "polygon", name: `Polygon ${f.length + 1}`, points: draftPoints, visible: true }]);
    } else if (mode === "select" && draftPoints.length >= 3) {
      const inside = CUSTOMER_POINTS.filter((p) => pointInPolygon([p.lat, p.lng], draftPoints)).map((p) => p.id);
      setSelectedIds(inside);
      setShowLayersPanel(false);
      setShowSelectionPanel(true);
    } else if (mode === "measure-distance" && draftPoints.length >= 2) {
      setConfirm({ title: "Distance measured", body: `Total route distance: ${formatDistance(totalDistance(draftPoints))}, across ${draftPoints.length} points.` });
    } else if (mode === "measure-area" && draftPoints.length >= 3) {
      setConfirm({ title: "Area measured", body: `Enclosed area: ${formatArea(polygonAreaM2(draftPoints))}.` });
    }
    resetDrawState();
    setMode("pan");
  }

  function handleCancel() {
    resetDrawState();
    setMode("pan");
  }

  const selectedStats = selectedIds
    ? {
        count: selectedIds.length,
        connected: selectedIds.filter((id) => CUSTOMER_POINTS.find((p) => p.id === id)?.status === "connected").length,
        disconnected: selectedIds.filter((id) => CUSTOMER_POINTS.find((p) => p.id === id)?.status === "disconnected").length,
        archived: selectedIds.filter((id) => CUSTOMER_POINTS.find((p) => p.id === id)?.status === "archived").length,
      }
    : null;

  const previewLinePoints = draftPoints.length > 0 && cursor && mode !== "point" ? [...draftPoints, cursor] : draftPoints;
  const measureLabel =
    mode === "measure-distance" && draftPoints.length > 0
      ? `Distance: ${formatDistance(totalDistance(cursor ? [...draftPoints, cursor] : draftPoints))}`
      : mode === "measure-area" && draftPoints.length >= 3
        ? `Area: ${formatArea(polygonAreaM2(draftPoints))}`
        : null;

  function contextAction(key: string) {
    if (!menu) return;
    const locNote = `Near ${menu.lat.toFixed(4)}°, ${menu.lng.toFixed(4)}°.`;
    if (key === "workorder") setWorkOrder({ note: locNote });
    else if (key === "batch") setBatchMessage({ note: "Sending to every customer currently in view." });
    else if (key === "summary") {
      const nearest = NEIGHBORHOODS.reduce((best, n) => {
        const d = L.latLng([n.lat, n.lng]).distanceTo(L.latLng([menu.lat, menu.lng]));
        return d < best.d ? { n, d } : best;
      }, { n: NEIGHBORHOODS[0], d: Infinity });
      const pts = CUSTOMER_POINTS.filter((p) => p.neighborhood === nearest.n.name);
      const disc = pts.filter((p) => p.status === "disconnected").length;
      setConfirm({ title: `Summary — near ${nearest.n.name}`, body: `${pts.length} customers in this neighborhood, ${disc} disconnected. ${locNote}` });
    } else if (key === "export-customers") setConfirm({ title: "Clip & export customers", body: `Registry export queued, clipped to the current map view. ${locNote}` });
    else if (key === "export-pipes") setConfirm({ title: "Clip & export pipeline networks", body: `Network & Assets geometry export queued, clipped to the current map view. ${locNote}` });
    setMenu(null);
  }

  return (
    <div className={styles.leafletWrap}>
      <MapContainer center={MAP_CENTER} zoom={14} minZoom={12} maxZoom={19} zoomControl scrollWheelZoom style={{ width: "100%", height: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite (Esri)">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              maxNativeZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Streets (OSM)">
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Customers">
            <LayerGroup>
              <CustomerLayer zoom={zoom} selectedIds={selectedIds} />
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Pipeline network">
            <LayerGroup>
              {MAINS.map((m) => (
                <Polyline key={m.name} positions={m.points} pathOptions={{ color: "#ffffff", weight: 3, opacity: 0.75 }} />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Supply / bulk points">
            <LayerGroup>
              {SUPPLY_POINTS.map((s) => (
                <Marker key={s.name} position={[s.lat, s.lng]} icon={supplyIcon()}>
                  <Popup><strong>{s.name}</strong><br />Bulk supply point</Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Assets">
            <LayerGroup>
              {ASSET_POINTS.map((a) => (
                <Marker key={a.name} position={[a.lat, a.lng]} icon={assetIcon(`var(--d-${CONDITION_META[a.condition].tone})`)}>
                  <Popup><strong>{a.name}</strong><br />{a.kind} · {CONDITION_META[a.condition].label} condition</Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {/* User-drawn features */}
        {features.filter((f) => f.visible).map((f) => {
          if (f.kind === "point") return <Marker key={f.id} position={[f.lat, f.lng]} icon={drawnPointIcon()}><Popup>{f.name}</Popup></Marker>;
          if (f.kind === "line") return <Polyline key={f.id} positions={f.points} pathOptions={{ color: DRAW_COLOR, weight: 3 }}><Popup>{f.name}</Popup></Polyline>;
          if (f.kind === "polygon") return <Polygon key={f.id} positions={f.points} pathOptions={{ color: DRAW_COLOR, fillOpacity: 0.15 }}><Popup>{f.name}</Popup></Polygon>;
          return <Circle key={f.id} center={f.center} radius={f.radiusM} pathOptions={{ color: DRAW_COLOR, fillOpacity: 0.1 }}><Popup>{f.name}</Popup></Circle>;
        })}

        {/* Live preview of whatever's currently being drawn */}
        {(mode === "line" || mode === "polygon" || mode === "select" || mode === "measure-distance" || mode === "measure-area") && previewLinePoints.length > 1 && (
          <Polyline positions={previewLinePoints} pathOptions={{ color: mode === "select" ? "var(--d-accent)" : DRAW_COLOR, weight: 2, dashArray: "6 6" }} />
        )}
        {mode === "polygon" && previewLinePoints.length > 2 && (
          <Polygon positions={previewLinePoints} pathOptions={{ color: DRAW_COLOR, fillOpacity: 0.08, dashArray: "6 6" }} />
        )}
        {(mode === "select" || mode === "measure-area") && previewLinePoints.length > 2 && (
          <Polygon positions={previewLinePoints} pathOptions={{ color: "var(--d-accent)", fillOpacity: 0.08, dashArray: "6 6" }} />
        )}
        {mode === "circle" && draftCircle && (
          <Circle center={draftCircle.center} radius={draftCircle.radiusM} pathOptions={{ color: DRAW_COLOR, fillOpacity: 0.08, dashArray: "6 6" }} />
        )}

        <ScaleControl position="bottomleft" imperial={false} />
        <ZoomWatcher onZoom={setZoom} />
        <DrawingController mode={mode} onAddPoint={handleAddPoint} onCursorMove={handleCursorMove} />
        <MapClickCloser onClick={() => setMenu(null)} />
        <MapContextMenuOpener onOpen={(x, y, lat, lng) => setMenu({ x, y, lat, lng })} />
      </MapContainer>

      <DrawToolbar mode={mode} onSetMode={handleSetMode} onClearAll={() => setFeatures([])} hasFeatures={features.length > 0} />
      <DrawActionBar
        mode={mode}
        canFinish={mode === "line" || mode === "measure-distance" ? draftPoints.length >= 2 : draftPoints.length >= 3}
        onFinish={handleFinish}
        onCancel={handleCancel}
      />
      {measureLabel && <MeasureBadge text={measureLabel} />}

      <div className={styles.gisLayersToggle}>
        <button
          type="button"
          className={styles.dBtn}
          style={{ padding: "6px 12px", fontSize: 12, background: "var(--d-panel)" }}
          onClick={() => setShowLayersPanel((v) => { const next = !v; if (next) setShowSelectionPanel(false); return next; })}
        >
          Created layers {features.length > 0 ? `(${features.length})` : ""}
        </button>
      </div>

      {/* Mutually exclusive — both panels dock at the same spot, so only one shows at a time */}
      {showLayersPanel && (
        <CreatedLayersPanel
          features={features}
          onToggle={(id) => setFeatures((fs) => fs.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)))}
          onDelete={(id) => setFeatures((fs) => fs.filter((f) => f.id !== id))}
          onSave={() => setConfirm({ title: "Saved", body: "These shapes are queued as draft assets/customers for review in Inventory Mapper — nothing is live in the registry until a reviewer merges them." })}
          onClose={() => setShowLayersPanel(false)}
        />
      )}

      {!showLayersPanel && showSelectionPanel && selectedStats && (
        <SelectionPanel
          {...selectedStats}
          onBatchMessage={() => setBatchMessage({ note: `Sending to the ${selectedStats.count} selected customers.` })}
          onWorkOrder={() => setWorkOrder({ note: `For the ${selectedStats.count} selected customers.` })}
          onExport={() => setConfirm({ title: "Clip & export selection", body: `Registry export queued for the ${selectedStats.count} customers inside the drawn area.` })}
          onClose={() => { setShowSelectionPanel(false); setSelectedIds(null); }}
        />
      )}

      {menu && <ContextMenu x={menu.x} y={menu.y} lat={menu.lat} lng={menu.lng} onAction={contextAction} />}

      <div className={styles.leafletLegend}>
        <button type="button" className={styles.leafletLegendHead} onClick={() => setLegendOpen((v) => !v)}>
          Legend
          <span style={{ transform: legendOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>⌄</span>
        </button>
        {legendOpen && (
          <div className={styles.leafletLegendBody}>
            <span className={styles.leafletLegendItem}><span className={styles.leafletLegendSwatch} style={{ background: "var(--d-ok)" }} />Connected customer</span>
            <span className={styles.leafletLegendItem}><span className={styles.leafletLegendSwatch} style={{ background: "var(--d-bad)" }} />Disconnected</span>
            <span className={styles.leafletLegendItem}><span className={styles.leafletLegendSwatch} style={{ background: "var(--d-mut)" }} />Archived</span>
            <span className={styles.leafletLegendItem}><span className={styles.leafletLegendSwatch} style={{ background: "transparent", border: "2px solid var(--d-cyan)" }} />Supply / bulk point</span>
            <span className={styles.leafletLegendItem}><span className={styles.leafletLegendSwatch} style={{ background: DRAW_COLOR, borderRadius: 2 }} />Drawn shape</span>
            <span style={{ fontSize: 10.5, color: "var(--d-ink-3)", marginTop: 2 }}>Zoom in past street level to see individual customers instead of area clusters.</span>
          </div>
        )}
      </div>

      {workOrder && <WorkOrderModal context={workOrder} onClose={() => setWorkOrder(null)} />}
      {batchMessage && <BatchMessageModal context={batchMessage} onClose={() => setBatchMessage(null)} />}
      {confirm && <ConfirmModal title={confirm.title} body={confirm.body} onClose={() => setConfirm(null)} />}
    </div>
  );
}

function MapClickCloser({ onClick }: { onClick: () => void }) {
  useMapEvent("click", onClick);
  return null;
}

function MapContextMenuOpener({ onOpen }: { onOpen: (x: number, y: number, lat: number, lng: number) => void }) {
  useMapEvent("contextmenu", (e) => {
    e.originalEvent.preventDefault();
    onOpen(e.containerPoint.x, e.containerPoint.y, e.latlng.lat, e.latlng.lng);
  });
  return null;
}
