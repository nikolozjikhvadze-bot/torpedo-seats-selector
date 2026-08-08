import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { TicketPicker } from "@/components/ticket-picker";
import { upcomingMatch } from "@/lib/stadium-config";

const title = "FC Torpedo Kutaisi Tickets | Ramaz Shengelia Stadium";
const description =
  "Buy FC Torpedo Kutaisi match tickets online. Pick your sector on the interactive Ramaz Shengelia Stadium map and choose your exact seat.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <TicketPicker />
      </main>
      <footer
        id="contact"
        className="border-t border-border bg-secondary/60 py-10"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 text-sm text-muted-foreground sm:px-6">
          <p className="font-display font-extrabold uppercase tracking-widest text-foreground">
            FC Torpedo Kutaisi
          </p>
          <p>{upcomingMatch.venue} · tickets@torpedokutaisi.ge · +995 431 24 00 00</p>
          <p className="text-xs">© 2026 FC Torpedo Kutaisi. Demo ticketing interface.</p>
        </div>
      </footer>
    </div>
  );
}
