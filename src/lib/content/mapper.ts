// Inventory Mapper: field technicians capture draft customers and draft infrastructure
// (pipeline runs, tanks, valves) with coordinates, offline-first, syncing when back in signal.
// Nothing here is live in the customer or asset registry yet — a reviewer checks each draft for
// duplicates and correctness, then merges it in (or rejects it). This is a staging concept the
// backend doesn't have yet — see the note on DRAFT_STAGING_GAP.

export type DraftCustomer = {
  id: string;
  name: string;
  phone: string;
  zoneGuess: string;
  hasCoordinates: boolean;
  capturedBy: string;
  capturedAt: string;
  possibleDuplicateOf?: string; // an existing account number this might already be
  notes?: string;
};

export const DRAFT_CUSTOMERS: DraftCustomer[] = [
  { id: "dc-41", name: "Wanambisi Provision Store", phone: "+254701 229 884", zoneGuess: "Sio Port road", hasCoordinates: true, capturedBy: "P. Wekesa", capturedAt: "Today, 09:40" },
  { id: "dc-40", name: "N. Situma", phone: "+254733 004 129", zoneGuess: "Elugulu North", hasCoordinates: true, capturedBy: "G. Atieno", capturedAt: "Today, 08:55", possibleDuplicateOf: "BW-000174" },
  { id: "dc-39", name: "Bwaliro Furniture Works", phone: "+254712 660 771", zoneGuess: "Bwaliro Central", hasCoordinates: true, capturedBy: "J. Odhiambo", capturedAt: "Yesterday, 16:20" },
  { id: "dc-38", name: "C. Wekesa", phone: "+254798 331 042", zoneGuess: "Market", hasCoordinates: false, capturedBy: "G. Atieno", capturedAt: "Yesterday, 11:05", notes: "GPS failed indoors — needs a revisit" },
];

export type DraftAsset = {
  id: string;
  name: string;
  kind: "Pipeline" | "Tank" | "Valve" | "Booster";
  geometryType: "point" | "line";
  zoneGuess: string;
  capturedBy: string;
  capturedAt: string;
  notes?: string;
};

export const DRAFT_ASSETS: DraftAsset[] = [
  { id: "da-22", name: "New main — Sio extension", kind: "Pipeline", geometryType: "line", zoneGuess: "Sio Port road", capturedBy: "J. Odhiambo", capturedAt: "Yesterday, 15:40", notes: "Laid alongside the new plots, 340m" },
  { id: "da-21", name: "Elugulu North booster", kind: "Booster", geometryType: "point", zoneGuess: "Elugulu North", capturedBy: "P. Wekesa", capturedAt: "2 days ago" },
  { id: "da-20", name: "Valve — Market junction", kind: "Valve", geometryType: "point", zoneGuess: "Market", capturedBy: "G. Atieno", capturedAt: "3 days ago" },
];

export const MAPPER_STATS = {
  pendingCustomers: DRAFT_CUSTOMERS.length,
  pendingAssets: DRAFT_ASSETS.length,
  possibleDuplicates: DRAFT_CUSTOMERS.filter((c) => c.possibleDuplicateOf).length,
  missingCoordinates: DRAFT_CUSTOMERS.filter((c) => !c.hasCoordinates).length,
};
