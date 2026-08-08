import { useMemo, useState } from "react";
import { Ticket, Trash2 } from "lucide-react";
import { StadiumMap } from "./stadium-map";
import { SeatGrid } from "./seat-grid";
import {
  CATEGORY_LABELS,
  CATEGORY_PRICES,
  CURRENCY,
  STANDS,
  sectorById,
  sectorPrice,
  stadiumLayout,
  totalCapacity,
  upcomingMatch,
} from "@/lib/stadium-config";

export function TicketPicker() {
  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [seats, setSeats] = useState<string[]>([]);

  const sector = selectedSector !== null ? sectorById(selectedSector) : undefined;
  const selectedSet = useMemo(() => new Set(seats), [seats]);
  const price = sector ? sectorPrice(sector) : 0;
  const total = seats.length * price;

  const toggle = (id: string) =>
    setSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const pickSector = (id: number) => {
    setSelectedSector(id);
    setSeats([]);
  };

  return (
    <section id="stadium" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {sector ? "Step 2 — Choose your seats" : "Step 1 — Choose your sector"}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Ramaz Shengelia Stadium
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {stadiumLayout.length} sectors · {totalCapacity.toLocaleString()} seats
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
          {([1, 2, 3] as const).map((c) => (
            <span key={c} className="inline-flex items-center gap-2">
              <span
                className="size-3.5 rounded-[4px]"
                style={{ background: `var(--cat-${c})` }}
              />
              {CATEGORY_LABELS[c]} · {CURRENCY}
              {CATEGORY_PRICES[c]}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-3xl border border-border bg-card p-3 shadow-elevated sm:p-5">
          {sector ? (
            <SeatGrid
              sector={sector}
              selected={selectedSet}
              onToggle={toggle}
              onBack={() => setSelectedSector(null)}
            />
          ) : (
            <StadiumMap
              selectedId={selectedSector}
              hoveredId={hovered}
              onHover={setHovered}
              onSelect={pickSector}
            />
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-elevated lg:sticky lg:top-24">
          <div className="flex items-center gap-2 text-primary">
            <Ticket className="size-5" />
            <h3 className="font-display text-lg font-extrabold text-foreground">
              Your order
            </h3>
          </div>

          <div className="mt-4 space-y-1 border-b border-border pb-4 text-sm">
            <p className="font-semibold text-foreground">
              {upcomingMatch.home} vs {upcomingMatch.away}
            </p>
            <p className="text-muted-foreground">
              {upcomingMatch.date} · {upcomingMatch.time}
            </p>
          </div>

          {!sector ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Pick a sector on the map to see available seats.
            </p>
          ) : (
            <>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Sector" value={`#${sector.id}`} />
                <Row label="Stand" value={STANDS[sector.stand].short} />
                <Row label="Category" value={CATEGORY_LABELS[sector.category]} />
                <Row
                  label="Price per seat"
                  value={`${CURRENCY}${price.toFixed(2)}`}
                />
              </dl>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Selected seats ({seats.length})
                </p>
                {seats.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No seats selected yet.
                  </p>
                ) : (
                  <ul className="mt-2 max-h-52 space-y-1.5 overflow-y-auto pr-1">
                    {seats.map((id) => {
                      const [, row, num] = id.split("-");
                      return (
                        <li
                          key={id}
                          className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm"
                        >
                          <span className="font-medium text-foreground">
                            Row {row} · Seat {num}
                          </span>
                          <button
                            onClick={() => toggle(id)}
                            aria-label={`Remove row ${row} seat ${num}`}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <span className="font-display text-2xl font-extrabold text-foreground">
                  {CURRENCY}
                  {total.toFixed(2)}
                </span>
              </div>

              <button
                disabled={seats.length === 0}
                className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-elevated transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}
