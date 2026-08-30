"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import styles from "../console.module.css";

function markerIcon() {
  return L.divIcon({
    html: `<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;background:var(--d-accent);border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -18],
  });
}

export function CustomerLocationMap({ lat, lng, name, accountNumber }: { lat: number; lng: number; name: string; accountNumber: string }) {
  return (
    <div className={styles.leafletWrap} style={{ height: 340 }}>
      <MapContainer center={[lat, lng]} zoom={16} style={{ width: "100%", height: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]} icon={markerIcon()}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {accountNumber}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
