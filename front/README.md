# Torpedo Tickets Hub

Create a modern ticket-selling website UI for FC Torpedo Kutaisi (Ramaz Shengelia Stadium, Georgia — total capacity 14,700 seats).

GENERAL LAYOUT:

- Standard header with: club logo (left), navigation links (Home, Matches, Stadium, Contact), and "Sign Up" / "Login" buttons (right).

- Hero section below the header showing an upcoming match banner (team names, date, time, "Buy Tickets" CTA button).

MAIN FEATURE — INTERACTIVE STADIUM SEAT SELECTOR:

Build a two-step interactive virtual stadium map for selecting seats, based on this sector layout config (structure the data as an editable array so I can fine-tune it later):

STADIUM STRUCTURE (total ~14,700 seats across 34 numbered sectors, arranged around the perimeter of an oval/rectangular stadium bowl):

- Sectors 1–13: opposite/away stand (long side, one long edge of the pitch)

- Sectors 14–18: short side stand (one end behind the goal, corner area)

- Sectors 19–33: MAIN stand (long side, opposite the away stand) — this is the primary/central tribune, sector 26 is roughly in the middle of this stand

- Sectors 34–36: other short side stand (opposite end behind the other goal)

- Each sector has ~400-450 seats, arranged in ~15-18 rows x ~25-30 seats per row (generate this programmatically from a config, don't hardcode each seat manually)

- Sectors closer to the main stand (19-33) and center pitch should be priced higher (Category 1); short-side/corner and away-stand sectors priced lower (Category 2-3)

Do NOT hardcode arbitrary numbers elsewhere — define a `stadiumLayout` config object/array with: sector id/number, stand name, row count, seats per row, price category, and SVG position, and generate the visual sectors and seat grids from this config so it's easy for me to edit later with fully accurate data.

STEP 1 — Sector selection:

- Show a schematic oval/bowl-shaped top-down view of the stadium with all 34 sectors arranged around the perimeter in their correct numbered positions (as described above).

- Each sector is a clickable shape (SVG path or styled segment).

- On hover, the sector highlights slightly.

- On click, the selected sector changes color (highlighted/darker), other sectors dim slightly.

- Display the sector number, stand name, and price category near the selected sector.

STEP 2 — Seat selection within the sector:

- After a sector is selected, show a detailed seat grid for that sector (rows × seats), generated from the sector's config.

- Available seats: light color. Sold/unavailable seats: gray, non-clickable. Selected seat(s): highlighted in accent color with a checkmark/border.

- Allow selecting multiple seats.

- Show a running summary sidebar/panel: selected sector number, selected seats (row + seat number), price per seat, total price, "Proceed to Checkout" button.

- Include a "Back to sector view" button.

STYLE:

- Clean, modern sports/ticketing platform aesthetic.

- Use Torpedo Kutaisi's colors (blue and white) as the primary theme.

- Fully responsive design.

Please generate the front-end UI with realistic placeholder data, keeping the sector/seat structure clearly editable in the code (a single config object).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8085e137-e82c-48a0-8a8e-8aa8e7b14c0f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
