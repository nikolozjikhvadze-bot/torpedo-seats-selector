import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Matches", href: "#matches" },
  { label: "Stadium", href: "#stadium" },
  { label: "Contact", href: "#contact" },
];

function Crest() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-elevated">
        <span className="font-display text-sm font-extrabold tracking-tight">TK</span>
      </div>
      <div className="leading-tight">
        <p className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-foreground">
          Torpedo
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Kutaisi
        </p>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#home" aria-label="FC Torpedo Kutaisi home">
          <Crest />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button className="rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
            Login
          </button>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elevated transition-colors hover:bg-primary/90">
            Sign Up
          </button>
        </div>

        <button
          className="grid size-10 place-items-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col p-3" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button className="rounded-md border border-border px-3 py-2 text-sm font-semibold">
                Login
              </button>
              <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
