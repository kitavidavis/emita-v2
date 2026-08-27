// Real, illustrative coordinates for the Leaflet-based Network Map — anchored near Busia, Kenya
// (matching the "Busia Water PoC" reference elsewhere in this app). Zone polygons are
// deliberately not modeled here — the network map groups customers into named neighborhoods for
// clustering/labeling only; boundary drawing is out of scope for this pass.

export type NetStatus = "connected" | "disconnected" | "archived";

export type Neighborhood = { name: string; lat: number; lng: number; customers: number };

export const NEIGHBORHOODS: Neighborhood[] = [
  { name: "Elugulu North", lat: 0.4928, lng: 34.1078, customers: 96 },
  { name: "Bwaliro Central", lat: 0.4869, lng: 34.1206, customers: 84 },
  { name: "Market", lat: 0.4832, lng: 34.1347, customers: 42 },
  { name: "Elugulu South", lat: 0.4741, lng: 34.1098, customers: 38 },
  { name: "Riverside", lat: 0.4718, lng: 34.1219, customers: 26 },
  { name: "Sio Port road", lat: 0.4697, lng: 34.1361, customers: 12 },
];

export const MAP_CENTER: [number, number] = [0.4798, 34.1218];

export type CustomerPoint = {
  id: string;
  lat: number;
  lng: number;
  status: NetStatus;
  name: string;
  accountNumber: string;
  neighborhood: string;
};

// Deterministic pseudo-random (sine hash) — Math.random() would render differently on the
// server than the client and break hydration; this gives a stable scatter every time instead.
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export const CUSTOMER_POINTS: CustomerPoint[] = NEIGHBORHOODS.flatMap((n, ni) => {
  const pts: CustomerPoint[] = [];
  for (let i = 0; i < n.customers; i++) {
    const sx = ni * 137 + i * 11.3;
    const sy = ni * 89 + i * 7.7;
    const lat = n.lat + (seeded(sx) - 0.5) * 0.011;
    const lng = n.lng + (seeded(sy) - 0.5) * 0.011;
    const r = seeded(sx + sy);
    // roughly matches the platform-wide status mix: ~8% disconnected, ~4% archived, rest connected
    const status: NetStatus = r > 0.96 ? "archived" : r > 0.88 ? "disconnected" : "connected";
    pts.push({
      id: `${n.name}-${i}`,
      lat,
      lng,
      status,
      name: `Customer ${ni * 100 + i + 1}`,
      accountNumber: `BW-${String(100000 + ni * 100 + i).slice(-6)}`,
      neighborhood: n.name,
    });
  }
  return pts;
});

export type SupplyPoint = { name: string; lat: number; lng: number };

export const SUPPLY_POINTS: SupplyPoint[] = [
  { name: "Borehole 1", lat: 0.4958, lng: 34.1035 },
  { name: "Borehole 2", lat: 0.4885, lng: 34.1245 },
  { name: "Tank A", lat: 0.4845, lng: 34.138 },
  { name: "Tank B", lat: 0.4715, lng: 34.1055 },
  { name: "Borehole 3", lat: 0.47, lng: 34.1235 },
  { name: "Booster B-01", lat: 0.468, lng: 34.139 },
];

export type AssetCondition = "good" | "fair" | "poor" | "critical";

export type AssetPoint = { name: string; kind: string; lat: number; lng: number; condition: AssetCondition };

export const ASSET_POINTS: AssetPoint[] = [
  { name: "Pump 2", kind: "Pump", lat: 0.49, lng: 34.106, condition: "poor" },
  { name: "Main MN-04", kind: "Main junction", lat: 0.484, lng: 34.1355, condition: "critical" },
  { name: "Valve V-12", kind: "Valve", lat: 0.486, lng: 34.1195, condition: "fair" },
  { name: "Valve V-07", kind: "Valve", lat: 0.4725, lng: 34.12, condition: "good" },
];

export const MAINS: { name: string; points: [number, number][] }[] = [
  { name: "Main A", points: [[0.4958, 34.1035], [0.4928, 34.1078], [0.4885, 34.1245], [0.4869, 34.1206]] },
  { name: "Main B", points: [[0.4869, 34.1206], [0.4845, 34.138], [0.4832, 34.1347]] },
  { name: "Main C", points: [[0.4741, 34.1098], [0.4715, 34.1055], [0.47, 34.1235], [0.4718, 34.1219]] },
];

export const CONTEXT_MENU_ACTIONS = [
  { key: "workorder", label: "Create Work Order", note: "Opens a meter_read_tasks / incident record for this location" },
  { key: "batch", label: "Send Batch Message", note: "Queues an SMS via Notifications to customers in view" },
  { key: "summary", label: "View Summary Details", note: "Zone-less summary: counts and status mix for this area" },
  { key: "export-customers", label: "Clip & Export Customers", note: "Registry export, bounded to the current map view" },
  { key: "export-pipes", label: "Clip & Export Pipeline Networks", note: "Network & Assets geometry export, bounded to view" },
] as const;
