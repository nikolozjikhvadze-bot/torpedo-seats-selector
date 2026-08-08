import { useMemo } from "react";
import { ArrowLeft, Check } from "lucide-react";
import {
  CATEGORY_LABELS,
  STANDS,
  generateSeats,
  sectorPrice,
  CURRENCY,
  type SectorConfig,
} from "@/lib/stadium-config";
import { cn } from "@/lib/utils";

interface Props {
  sector: SectorConfig;
  selected: Set<string>;
  onToggle: (seatId: string) => void;
  onBack: () => void;
}

export function SeatGrid({ sector, selected, onToggle, onBack }: Props) {
  const rows = useMemo(() => generateSeats(sector), [sector]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-4" /> Back to sector view
        </button>
        <div className="text-right">
          <p className="font-display text-lg font-extrabold text-foreground">
            Sector {sector.id}
          </p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {STANDS[sector.stand].name} · {CATEGORY_LABELS[sector.category]} ·{" "}
            {CURRENCY}
            {sectorPrice(sector)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card p-4">
        <div className="mx-auto mb-5 h-1.5 w-2/3 rounded-full bg-[var(--pitch)]" />
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Pitch
        </p>

        <div className="overflow-x-auto pb-2">
          <div className="mx-auto w-max space-y-1.5">
            {rows.map((row) => (
              <div key={row[0]!.row} className="flex items-center gap-1.5">
                <span className="w-6 shrink-0 text-right text-[10px] font-semibold text-muted-foreground">
                  {row[0]!.row}
                </span>
                {row.map((seat) => {
                  const isSelected = selected.has(seat.id);
                  return (
                    <button
                      key={seat.id}
                      disabled={seat.sold}
                      onClick={() => onToggle(seat.id)}
                      title={`Row ${seat.row}, Seat ${seat.number}${seat.sold ? " — sold" : ""}`}
                      aria-label={`Row ${seat.row} seat ${seat.number}`}
                      aria-pressed={isSelected}
                      className={cn(
                        "grid size-5 place-items-center rounded-[4px] text-[8px] font-bold transition-all sm:size-6",
                        seat.sold
                          ? "cursor-not-allowed bg-muted text-muted-foreground/50"
                          : isSelected
                            ? "scale-110 bg-primary text-primary-foreground ring-2 ring-primary/40"
                            : "bg-[var(--seat-free)] text-transparent hover:bg-primary/30",
                      )}
                    >
                      {isSelected ? <Check className="size-3" /> : seat.number}
                    </button>
                  );
                })}
                <span className="w-6 shrink-0 text-[10px] font-semibold text-muted-foreground">
                  {row[0]!.row}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <Legend className="bg-[var(--seat-free)]" label="Available" />
          <Legend className="bg-primary" label="Selected" />
          <Legend className="bg-muted" label="Sold" />
        </div>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-3.5 rounded-[4px]", className)} />
      {label}
    </span>
  );
}
