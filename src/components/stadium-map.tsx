import {
  CATEGORY_LABELS,
  CATEGORY_PRICES,
  CURRENCY,
  PITCH,
  STANDS,
  sectorCapacity,
  stadiumLayout,
  type SectorConfig,
} from "@/lib/stadium-config";
import { cn } from "@/lib/utils";

interface Props {
  selectedId: number | null;
  hoveredId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number) => void;
}

const catFill: Record<number, string> = {
  1: "fill-[var(--cat-1)]",
  2: "fill-[var(--cat-2)]",
  3: "fill-[var(--cat-3)]",
};

export function StadiumMap({ selectedId, hoveredId, onHover, onSelect }: Props) {
  const active = selectedId ?? hoveredId;
  const activeSector = stadiumLayout.find((s) => s.id === active) ?? null;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 1000 640"
        className="w-full select-none"
        role="group"
        aria-label="Stadium sector map"
      >
        <rect x="0" y="0" width="1000" height="640" rx="48" className="fill-secondary" />

        {/* Pitch */}
        <g>
          <rect
            x={PITCH.x}
            y={PITCH.y}
            width={PITCH.width}
            height={PITCH.height}
            rx="10"
            className="fill-[var(--pitch)]"
          />
          <g className="stroke-[var(--pitch-line)]" strokeWidth="2" fill="none">
            <rect
              x={PITCH.x + 14}
              y={PITCH.y + 14}
              width={PITCH.width - 28}
              height={PITCH.height - 28}
              rx="4"
            />
            <line
              x1={PITCH.x + PITCH.width / 2}
              y1={PITCH.y + 14}
              x2={PITCH.x + PITCH.width / 2}
              y2={PITCH.y + PITCH.height - 14}
            />
            <circle
              cx={PITCH.x + PITCH.width / 2}
              cy={PITCH.y + PITCH.height / 2}
              r="42"
            />
            <rect
              x={PITCH.x + 14}
              y={PITCH.y + PITCH.height / 2 - 58}
              width="60"
              height="116"
            />
            <rect
              x={PITCH.x + PITCH.width - 74}
              y={PITCH.y + PITCH.height / 2 - 58}
              width="60"
              height="116"
            />
          </g>
        </g>

        {/* Sectors */}
        {stadiumLayout.map((s) => {
          const isSelected = selectedId === s.id;
          const dimmed = selectedId !== null && !isSelected;
          const cx = s.svg.x + s.svg.width / 2;
          const cy = s.svg.y + s.svg.height / 2;
          return (
            <g
              key={s.id}
              tabIndex={0}
              role="button"
              aria-label={`Sector ${s.id}, ${STANDS[s.stand].name}, ${CATEGORY_LABELS[s.category]}`}
              aria-pressed={isSelected}
              className="cursor-pointer outline-none focus-visible:opacity-100"
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(s.id)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(s.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(s.id);
                }
              }}
            >
              <rect
                x={s.svg.x}
                y={s.svg.y}
                width={s.svg.width}
                height={s.svg.height}
                rx="7"
                className={cn(
                  "transition-all duration-200",
                  isSelected ? "fill-primary" : catFill[s.category],
                  dimmed && "opacity-35",
                  !isSelected && !dimmed && "hover:opacity-80",
                )}
                stroke="var(--color-background)"
                strokeWidth={isSelected ? 3 : 1.5}
              />
              <text
                x={cx}
                y={cy}
                transform={
                  s.labelRotate ? `rotate(${s.labelRotate} ${cx} ${cy})` : undefined
                }
                textAnchor="middle"
                dominantBaseline="central"
                className={cn(
                  "pointer-events-none font-semibold",
                  isSelected ? "fill-primary-foreground" : "fill-[var(--sector-label)]",
                  dimmed && "opacity-50",
                )}
                fontSize="20"
              >
                {s.id}
              </text>
            </g>
          );
        })}

        {/* Stand names */}
        <text x="500" y="30" textAnchor="middle" className="fill-muted-foreground" fontSize="16" letterSpacing="4">
          AWAY STAND
        </text>
        <text x="500" y="618" textAnchor="middle" className="fill-muted-foreground" fontSize="16" letterSpacing="4">
          MAIN STAND
        </text>
      </svg>

      {activeSector && <SectorTooltip sector={activeSector} />}
    </div>
  );
}

function SectorTooltip({ sector }: { sector: SectorConfig }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card/95 p-4 text-center shadow-elevated backdrop-blur">
      <p className="font-display text-2xl font-extrabold text-foreground">
        Sector {sector.id}
      </p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {STANDS[sector.stand].name}
      </p>
      <p className="mt-3 text-sm font-semibold text-primary">
        {CATEGORY_LABELS[sector.category]} · {CURRENCY}
        {CATEGORY_PRICES[sector.category]}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {sectorCapacity(sector)} seats · {sector.rows} rows
      </p>
    </div>
  );
}
