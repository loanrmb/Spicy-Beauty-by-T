# CLAUDE.md — Spicy Beauty by T.

Guidance for Claude Code when working in this repository.

## Project overview

Professional website for **Spicy Beauty by T.**, a solo esthéticienne business run by
Tiphaine Logelin in Valenciennes (59300), France. Services: nail care (semi-permanent,
gainage sur ongle naturel, capsules/extensions gel, manucure, pédicure) and épilations
(maillot simple/brésilien/intégral, aisselles, demi-jambes, cuisses, jambes complètes).

The business does **not** offer "pose américaine" — never reintroduce this term or
service anywhere in the codebase.

- Live site: https://www.spicybeautybyt.com (canonical domain: `www.` prefix)
- Instagram: @spicybeautyyy — booking via SMS or Instagram DM only, no phone calls
- Exact street address is intentionally withheld from all public content
  ("Valenciennes · 59300" only) — never add it, even in code comments or test data

## Stack (canonical — do not deviate)

- **Vanilla HTML / CSS / JS.** No Next.js, no `app/` directory, no `page.jsx`,
  no `next.config.js`, no build step for the main site.
- Deployment: GitHub → Vercel, auto-deploy on push to main.
- Routing/redirects: `vercel.json` (clean URLs, 301 redirects).
- Sitemap: `generate-sitemap.js`, regenerated via GitHub Actions on every push.
- Fonts: Helvetica Neue (primary, `--hv`), Pacifico (brand accent only, `--sc`).
- Design tokens live in `style.css` `:root` — reuse these vars in any new page,
  don't hardcode colors.

## Design aesthetic

Premium dark, Tesla/Apple-inspired: large thin Helvetica typography, dark backgrounds
(`#0D0D0D` / `#111`), rose accent (`--rose: #ffd3fa`, `--rose-pale`, `--rose-dark`),
minimal decoration, generous whitespace. Any new page (including the loyalty/admin
pages below) should visually match this, not look like a bolted-on tool.

## Copy rules

- Always **"je"**, never "on" / "nous" — the site speaks as Tiphaine, a solo business.
- Blog articles: ~400 words, headlines phrased as questions/search queries, no images,
  CTA buttons only, linked from footer only (not in main nav).

## Known gotchas (learned the hard way)

- **Git auth**: PAT must be embedded directly in the remote URL
  (`https://loanrmb:TOKEN@github.com/...`). PAT needs both `repo` and `workflow` scopes
  for GitHub Actions files. Exit code 128 on Actions → add
  `permissions: contents: write` to the workflow YAML.
- **iOS Safari image bugs**: files that look like `.jpg` but don't display are often
  HEIC files renamed with the wrong extension — re-export as genuine JPEG.
- **Gallery/carousel images**: use `object-fit: cover` for portrait photos and
  `loading="eager"` for iOS Safari compatibility.
- Legal: Mentions Légales page is noindex + excluded from sitemap. No cookie banner
  (no GA4/Meta Pixel installed). No CGV (vitrine site, no online transactions) —
  this changes once the loyalty program stores personal client data, see below.

---

## In progress: NFC loyalty / referral program

Tiphaine currently runs a physical carte de fidélité + parrainage program (paper
cards, stamped by hand). We're digitizing it with NFC stickers stuck onto the
existing paper cards, without changing the cards' physical design.

### Concept

- Each client's physical card gets a small transparent NFC sticker (NTAG213) on the
  back, programmed with a unique URL: `spicybeautybyt.com/carte/{unique_id}`.
- **Same URL, two views**, determined by session — not by the card:
  - **Tiphaine's phone** (has an authenticated admin session) → tapping any card opens
    the **admin view** for that client: identity, stamp count, visit history, "ajouter
    un tampon" button, prestations done.
  - **A client's own phone** (no admin session) → tapping her own card opens a
    **read-only client view**: her progress, what's left until the next reward, her
    referral link/code.
- Tiphaine also gets the site installed as a PWA on her phone's home screen
  (`Ajouter à l'écran d'accueil`) for quick access to the admin dashboard outside of
  NFC taps (client history, monthly stats).
- The admin dashboard also needs to answer business questions beyond the loyalty
  program itself: which prestations are most requested, average time between visits,
  clients close to a reward, clients who haven't booked in a while, referral-driven
  new clients this month.

### Why a visit/services log, not just a stamp counter

To support the stats above, visits need to be logged individually with which
prestation(s) were performed, not just incremented as a raw counter.

### Data model (Supabase)

Loan is creating the Supabase project separately. Planned tables:

- `clients` — id (= the NFC unique code), nom, telephone, date_creation,
  code_parrainage, parrainee_par (nullable FK to another client)
- `services` — id, nom, categorie (ongles / epilation), prix
- `visites` — id, client_id, date, tampon_ajoute (bool)
- `visite_services` — visite_id, service_id (join table — a visit can include several
  prestations)

### App structure (planned, same repo/Vercel project as the main site)

```
/carte/index.html        → client/admin card view (JS branches on session)
/admin/                  → manifest.json + icons for PWA install
/api/client.js           → read/write a client record
/api/visite.js           → log a visit + add a stamp
/api/stats.js            → aggregate queries for the admin dashboard
```

- Serverless functions live under `/api/` — Vercel picks these up automatically for
  any project, no framework migration needed.
- Session: Tiphaine logs in once on her phone; a persistent admin session (cookie)
  is what distinguishes the admin view from the client view — same URL, same origin
  requirement, which is also why this stays on `www.spicybeautybyt.com` rather than a
  separate domain or Vercel project.

### Security / compliance — must not skip

- **Supabase service-role key stays server-side only**, inside `/api/*` functions, set
  as a Vercel environment variable (`SUPABASE_SERVICE_KEY`). Never expose it in any
  file shipped to the browser, never commit it to the repo.
- `/carte/*` and `/admin/*` must be **noindex** and excluded from `generate-sitemap.js`,
  same pattern as `mentions-legales.html`.
- NFC unique IDs must be **random, non-sequential** (not `001`, `002`...) so one
  client's URL can't be guessed from another's.
- This program stores personal client data (nom, téléphone, visit history) — revisit
  the "no CGV needed" note above; this may need a short data-handling notice even
  though it's not a transaction-based CGV.

### Hardware side (Loan handles physically, not code)

- Transparent NTAG213 stickers, stuck on the back of existing paper cards, away from
  any metallic ink/foil.
- Programmed and locked via the NFC Tools app (no code involved) — unique code per
  card, matched against `clients.id`.
- Test batch of 10 before ordering 100+.

### Supabase project

- Project name: `spicy-beauty-loyalty`
- URL: `https://zbeqkhzkbljjhsgsreas.supabase.co`
- Anon (public) key — safe to reference in client-side code:
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZXFraHprYmxqamhzZ3NyZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NDU1MzIsImV4cCI6MjA5OTAyMTUzMn0.9X_fER-ln18jYMjexvaRDU63ngWEHHyj8Hbpqsp70UY`
- Service-role key: **never in this file, never in the repo.** Set only as the
  `SUPABASE_SERVICE_KEY` environment variable in Vercel, used exclusively inside
  `/api/*` serverless functions.
- RLS is enabled on all four tables with **no policies defined** (deny-by-default for
  the anon key). All reads/writes go through `/api/*` using the service-role key,
  which bypasses RLS by design — this is intentional and expected, not a bug to fix.

### Current step

Building the software side (Supabase schema, `/carte` and `/admin` pages, `/api`
functions) ahead of the physical stickers arriving, using test/dummy client records.
Loan is creating the Supabase project in parallel.
