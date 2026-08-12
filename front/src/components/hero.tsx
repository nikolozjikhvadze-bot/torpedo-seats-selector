import { CalendarDays, Clock, MapPin } from "lucide-react";
import { upcomingMatch } from "@/lib/stadium-config";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden text-primary-foreground"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,.5)_46px_48px)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-foreground/70">
          {upcomingMatch.competition}
        </p>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              {upcomingMatch.home}
              <span className="mx-3 text-primary-foreground/50">vs</span>
              <br className="hidden sm:block" />
              {upcomingMatch.away}
            </h1>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/85">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" /> {upcomingMatch.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4" /> {upcomingMatch.time}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4" /> {upcomingMatch.venue}
              </span>
            </div>
          </div>

          <a
            href="#stadium"
            className="inline-flex w-full items-center justify-center rounded-xl bg-background px-8 py-4 font-display text-base font-extrabold uppercase tracking-wide text-primary shadow-elevated transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Buy Tickets
          </a>
        </div>
      </div>
    </section>
  );
}
