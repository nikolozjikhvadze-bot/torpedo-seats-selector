/**
 * ---------------------------------------------------------------------------
 * STADIUM CONFIG — Ramaz Shengelia Stadium (FC Torpedo Kutaisi)
 * ---------------------------------------------------------------------------
 * Everything visual + numeric is generated from `stadiumLayout` below.
 * Edit a sector's rows / seatsPerRow / category / svg box and both the
 * bowl map and the seat grid update automatically.
 */

export type PriceCategory = 1 | 2 | 3;

export type StandKey = "away" | "north" | "main" | "south";

export interface SectorConfig {
  /** Sector number as printed on the ticket */
  id: number;
  stand: StandKey;
  rows: number;
  seatsPerRow: number;
  category: PriceCategory;
  /** Position of the sector shape on the SVG bowl (viewBox 1000 x 640) */
  svg: { x: number; y: number; width: number; height: number };
  /** Rotation of the sector label, in degrees */
  labelRotate?: number | undefined;
}

export const STANDS: Record<StandKey, { name: string; short: string }> = {
  away: { name: "Away Stand", short: "Away" },
  north: { name: "North Stand (behind goal)", short: "North" },
  main: { name: "Main Stand", short: "Main" },
  south: { name: "South Stand (behind goal)", short: "South" },
};

export const CATEGORY_PRICES: Record<PriceCategory, number> = {
  1: 45,
  2: 28,
  3: 18,
};

export const CATEGORY_LABELS: Record<PriceCategory, string> = {
  1: "Category 1",
  2: "Category 2",
  3: "Category 3",
};

export const CURRENCY = "₾";

/* -------------------------------------------------------------------------
 * Geometry helpers — used only to lay out the default bowl. Tweak the numbers
 * in `stadiumLayout` directly if you want a hand-tuned position.
 * ---------------------------------------------------------------------- */

interface StripOptions {
  from: number;
  to: number;
  stand: StandKey;
  axis: "x" | "y";
  /** start / end along the axis */
  start: number;
  end: number;
  /** fixed cross-axis offset and thickness */
  cross: number;
  thickness: number;
  /** iterate numbers in reverse along the axis */
  reverse?: boolean;
  gap?: number;
  rows: (i: number, id: number) => number;
  seatsPerRow: (i: number, id: number) => number;
  category: (i: number, id: number) => PriceCategory;
  labelRotate?: number | undefined;
}

function strip(o: StripOptions): SectorConfig[] {
  const ids: number[] = [];
  for (let id = o.from; id <= o.to; id++) ids.push(id);
  const order = o.reverse ? [...ids].reverse() : ids;
  const gap = o.gap ?? 4;
  const span = (o.end - o.start) / order.length;

  return order.map((id, i) => {
    const pos = o.start + i * span;
    const size = span - gap;
    const svg =
      o.axis === "x"
        ? { x: pos + gap / 2, y: o.cross, width: size, height: o.thickness }
        : { x: o.cross, y: pos + gap / 2, width: o.thickness, height: size };
    return {
      id,
      stand: o.stand,
      rows: o.rows(i, id),
      seatsPerRow: o.seatsPerRow(i, id),
      category: o.category(i, id),
      svg,
      labelRotate: o.labelRotate,
    } satisfies SectorConfig;
  });
}

/** distance from the centre of a strip, normalised 0 (centre) → 1 (edge) */
const centrality = (i: number, count: number) =>
  Math.abs(i - (count - 1) / 2) / ((count - 1) / 2);

/* -------------------------------------------------------------------------
 * THE EDITABLE LAYOUT
 * ---------------------------------------------------------------------- */

export const stadiumLayout: SectorConfig[] = [
  // Sectors 1–13 — Away stand, long side (top edge), numbered left → right
  ...strip({
    from: 1,
    to: 13,
    stand: "away",
    axis: "x",
    start: 165,
    end: 855,
    cross: 55,
    thickness: 88,
    rows: () => 16,
    seatsPerRow: (i) => (centrality(i, 13) < 0.4 ? 27 : 25),
    category: (i) => (centrality(i, 13) < 0.4 ? 2 : 3),
  }),

  // Sectors 14–18 — North stand behind the goal (right end), top → bottom
  ...strip({
    from: 14,
    to: 18,
    stand: "north",
    axis: "y",
    start: 100,
    end: 545,
    cross: 870,
    thickness: 85,
    rows: () => 15,
    seatsPerRow: (i) => (centrality(i, 5) < 0.4 ? 28 : 26),
    category: (i) => (centrality(i, 5) < 0.4 ? 2 : 3),
    labelRotate: -90,
  }),

  // Sectors 19–33 — MAIN stand, long side (bottom edge). Numbered right → left
  // so that sector 26 sits in the centre of the tribune.
  ...strip({
    from: 19,
    to: 33,
    stand: "main",
    axis: "x",
    start: 120,
    end: 900,
    cross: 500,
    thickness: 90,
    reverse: true,
    rows: (i) => (centrality(i, 15) < 0.35 ? 18 : 16),
    seatsPerRow: (i) => (centrality(i, 15) < 0.35 ? 28 : 26),
    category: (i) => (centrality(i, 15) < 0.55 ? 1 : 2),
  }),

  // Sectors 34–36 — South stand behind the other goal (left end), bottom → top
  ...strip({
    from: 34,
    to: 36,
    stand: "south",
    axis: "y",
    start: 105,
    end: 540,
    cross: 48,
    thickness: 85,
    reverse: true,
    rows: () => 15,
    seatsPerRow: () => 27,
    category: (i) => (centrality(i, 3) < 0.4 ? 2 : 3),
    labelRotate: 90,
  }),
];

/** Pitch rectangle inside the bowl (SVG units) */
export const PITCH = { x: 205, y: 165, width: 590, height: 320 };

export const sectorById = (id: number) =>
  stadiumLayout.find((s) => s.id === id);

export const sectorCapacity = (s: SectorConfig) => s.rows * s.seatsPerRow;

export const sectorPrice = (s: SectorConfig) => CATEGORY_PRICES[s.category];

export const totalCapacity = stadiumLayout.reduce(
  (sum, s) => sum + sectorCapacity(s),
  0,
);

/* -------------------------------------------------------------------------
 * Seat generation — deterministic pseudo-random "sold" seats so the demo is
 * stable between renders and SSR/hydration.
 * ---------------------------------------------------------------------- */

export interface Seat {
  row: number;
  number: number;
  sold: boolean;
  id: string;
}

function hash(a: number, b: number, c: number) {
  let h = (a * 374761393 + b * 668265263 + c * 2246822519) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  h = (h * 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export function generateSeats(sector: SectorConfig): Seat[][] {
  const soldRate = sector.category === 1 ? 0.32 : 0.2;
  return Array.from({ length: sector.rows }, (_, r) =>
    Array.from({ length: sector.seatsPerRow }, (_, n) => ({
      row: r + 1,
      number: n + 1,
      sold: hash(sector.id, r + 1, n + 1) < soldRate,
      id: `${sector.id}-${r + 1}-${n + 1}`,
    })),
  );
}

/* -------------------------------------------------------------------------
 * Match data (placeholder)
 * ---------------------------------------------------------------------- */

export const upcomingMatch = {
  competition: "Erovnuli Liga · Round 21",
  home: "FC Torpedo Kutaisi",
  away: "FC Dinamo Tbilisi",
  date: "Saturday, 22 August 2026",
  time: "19:30",
  venue: "Ramaz Shengelia Stadium, Kutaisi",
};
