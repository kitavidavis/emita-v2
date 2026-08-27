"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  CircleMarker,
  Marker,
  Polyline,
  Popup,
  ScaleControl,
  useMap,
  useMapEvent,
  useMapEvents,
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
  CONTEXT_MENU_ACTIONS,
  type NetStatus,
} from "@/lib/content/geomap";

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

/** Clusters into one marker per neighborhood below CLUSTER_ZOOM; individual pins above it. */
function CustomerLayer() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  const clusters = useMemo(() => {
    return NEIGHBORHOODS.map((n) => {
      const pts = CUSTOMER_POINTS.filter((p) => p.neighborhood === n.name);
      const disconnected = pts.filter((p) => p.status === "disconnected").length;
      const dominant: NetStatus = disconnected > pts.length * 0.3 ? "disconnected" : "connected";
      return { ...n, count: pts.length, dominant };
    });
  }, []);

  if (zoom < CLUSTER_ZOOM) {
    return (
      <>
        {clusters.map((c) => (
          <Marker key={c.name} position={[c.lat, c.lng]} icon={clusterIcon(c.count, c.dominant)}>
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {c.count} customers · double-click to zoom in
            </Popup>
          </Marker>
        ))}
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
    </>
  );
}

function ContextMenuLayer({ onOpen, onClose }: { onOpen: (x: number, y: number, lat: number, lng: number) => void; onClose: () => void }) {
  useMapEvent("contextmenu", (e) => {
    e.originalEvent.preventDefault();
    onOpen(e.containerPoint.x, e.containerPoint.y, e.latlng.lat, e.latlng.lng);
  });
  useMapEvent("click", onClose);
  return null;
}

export function NetworkMap() {
  const [legendOpen, setLegendOpen] = useState(true);
  const [menu, setMenu] = useState<{ x: number; y: number; lat: number; lng: number } | null>(null);

  function openMenu(x: number, y: number, lat: number, lng: number) {
    setMenu({ x, y, lat, lng });
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
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Customers">
            <LayerGroup>
              <CustomerLayer />
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
                  <Popup>
                    <strong>{s.name}</strong>
                    <br />
                    Bulk supply point
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Assets">
            <LayerGroup>
              {ASSET_POINTS.map((a) => (
                <Marker key={a.name} position={[a.lat, a.lng]} icon={assetIcon(`var(--d-${CONDITION_META[a.condition].tone === "ink" ? "ink" : CONDITION_META[a.condition].tone})`)}>
                  <Popup>
                    <strong>{a.name}</strong>
                    <br />
                    {a.kind} · {CONDITION_META[a.condition].label} condition
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <ScaleControl position="bottomleft" imperial={false} />
        <ContextMenuLayer onOpen={openMenu} onClose={() => setMenu(null)} />
      </MapContainer>

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
            <span className={styles.leafletLegendItem}><span className={styles.leafletLegendSwatch} style={{ background: "var(--d-ink-2)", borderRadius: 2, transform: "rotate(45deg)" }} />Asset (color = condition)</span>
            <span style={{ fontSize: 10.5, color: "var(--d-ink-3)", marginTop: 2 }}>Zoom in past street level to see individual customers instead of area clusters.</span>
          </div>
        )}
      </div>

      {menu && (
        <div className={styles.leafletCtxMenu} style={{ left: menu.x, top: menu.y }}>
          <div className={styles.leafletCtxHead}>{menu.lat.toFixed(4)}°, {menu.lng.toFixed(4)}°</div>
          {CONTEXT_MENU_ACTIONS.map((a) => (
            <button key={a.key} type="button" className={styles.leafletCtxItem} onClick={() => setMenu(null)} title={a.note}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
