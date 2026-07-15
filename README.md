# CareConnect Portal

Production-quality healthcare member portal scaffold built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui patterns. Includes Sitecore Edge GraphQL integration hooks, identity/event tracking placeholders, theming via CSS variables, and swappable mock personas.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Rebrand for another client

1. Edit `src/lib/config/brand.ts` — app name, logo text/path, feature flags, footer.
2. Update CSS tokens in `src/app/globals.css` (`:root` / `.dark`).
3. Replace `public/brand/logo.svg` (or point `logoImagePath` at your asset).
4. Set `NEXT_PUBLIC_APP_NAME` in `.env.local`.

## Outbound links (Read article, resources, etc.)

Edit **`src/lib/config/external-links.ts`** — one place for URLs to the client Sitecore/marketing site.

```typescript
site: { home: "https://rocklandtrust-azure.vercel.app/" },
defaults: { article: "...", resource: "..." },
articles: { r1: "https://...", r2: "..." },  // keys = recommendation ids
resources: { res1: "https://..." },
```

No component changes needed. External URLs open in a new tab.

## Point at your SitecoreAI environment

**Connection** (`.env.local`):

- `SITECORE_EDGE_ENDPOINT`
- `SITECORE_API_KEY` and/or `SITECORE_EDGE_CONTEXT_ID`

**Queries** (`src/lib/sitecore/queries/` — no env vars per slot):

1. Open the query file for your page/slot, e.g. `queries/home/promo.query.ts`
2. Edit `GQL_HOME_PROMO_QUERY` and/or `homePromoQueryVariables` (path, language, site)
3. See `src/lib/sitecore/queries/README.md` for adding new page partials

When Sitecore Edge promo content is unavailable, the welcome-page promotion shows **MOCK DATA**. Live Edge promos show **SITECORE(LIVE)**. Account and persona UI never show these labels.

## Mock personas

Edit `src/lib/mock-data/personas.ts`. Switch profiles from the header persona menu (patient, caregiver, power user).

## Tracking (Sitecore Unified Data Layer)

Uses `@sitecore-cloudsdk/core` and `@sitecore-cloudsdk/events` for browser-side tracking.

**Env** (`.env.local`):

- `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` — required for Cloud SDK
- `NEXT_PUBLIC_DEFAULT_SITE_NAME` — Sitecore site name (event prefix, e.g. `novacare/VIEW_MESSAGE`)
- `NEXT_PUBLIC_SITECORE_TRACKING_ENABLED` — set `false` to disable network calls
- `NEXT_PUBLIC_SITECORE_COOKIE_DOMAIN` — optional cookie domain

**Channel** is fixed to `PORTAL` in `src/lib/config/tracking-config.ts`.

**IDENTITY** events fire when a demo persona loads or is switched, using the `email` identifier provider (`alex.rivera@email.com`, etc.).

Switching (or creating) a demo user **resets the Sitecore guest session**: Cloud SDK queue is cleared, `sc_cid` / related cookies are deleted, and a new `browser_id` (`clientId`) is issued before the next IDENTITY. Do not expect mixed personas in one CDP session. `PERSONA_SWITCH` is not sent.

**No automatic page-view or impression events.** Custom events fire only on clicks:

- Hero: `VIEW_APPOINTMENTS`, `VIEW_MESSAGE`
- Promo CTA: `CLICKED_PROMO`
- Other CTAs / resources: `CLICKED_CTA`
- Message open: `OPEN_MESSAGE`
- Preference toggles: `PREFERENCE_UPDATE`

Event `type` format: `novacare/VIEW_MESSAGE` (must match `^[a-zA-Z0-9\-_./]{1,100}$`).

Verify payloads in DevTools → Network → filter `edge-platform.sitecorecloud.io`. To verify persona isolation, check that each profile gets a different `clientId` after a switch.

## Project structure

```
src/
  app/                  # App Router pages
  components/
    ui/                 # shadcn-style primitives
    layout/             # portal chrome
    content/            # Sitecore/mock content modules
    dashboard/          # home widgets
    persona/            # persona switcher + provider
  lib/
    config/             # brand + Edge connection env
    sitecore/
      queries/          # GQL_* documents + default variables (by page/slot)
      loaders/          # per-partial fetch + map + fallback
      execute-query.ts  # generic Edge executor
    tracking/           # identity + events
    mock-data/          # personas + Sitecore fallbacks
  types/
```

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start local development  |
| `npm run build` | Production build       |
| `npm run start` | Run production server  |
| `npm run lint`  | ESLint                 |
