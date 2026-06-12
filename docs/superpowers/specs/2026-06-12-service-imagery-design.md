# Design: Service-related imagery

**Date:** 2026-06-12
**Goal:** The site is icon-only and feels flat. Add real UAE photography tied to each
service area to make it feel professional and trustworthy.

## Decisions (approved with user)

- **Source:** Free, commercial-use stock photos (Unsplash License — no attribution
  required), **downloaded into `public/assets/img/`** so the site stays self-contained
  (no hotlinking / runtime dependency).
- **Style:** Real UAE / business photography (Dubai skyline, documents, offices, etc.).
- **Card treatment:** Photo banner across the top of each category card, with the
  existing icon badge overlapping the banner (keeps the icon system, adds imagery).
- **Scope:** Homepage (3 placements below) **plus** the Services catalogue page cards.

## Placements

1. **Category cards** (`#catGrid` on `index.html`, and the catalogue cards on
   `services.html`): one relevant photo per category.
   - visas → passport/airport · emirates-id → ID/biometrics · business → Dubai business
     district · labour → workplace · pro → documents/stamping · attestation →
     certificates · medical → clinic · tax → finance/accounting · trademark → legal/IP ·
     banking → bank.
2. **"Who we are" panel** (`.about-visual` on `index.html`): replace the logo-on-color
   panel with a strong Dubai/UAE professional photo; keep the floating "20+ years" badge.
3. **Hero**: a subtle, brand-tinted UAE skyline faintly behind the existing status-tracker
   card.

## Implementation approach

- Add an `image:` field to each entry in `categories` in `data/services.js`
  (single-source-of-truth pattern). Value = filename under `assets/img/`.
- `js/home.js` and `js/services.js` (page) render the banner when `cat.image` exists;
  cards without an image fall back to the current icon-only layout (graceful).
- `css/styles.css`: add `.cat-card` banner styles (fixed-ratio, `object-fit: cover`,
  icon badge overlap), about-panel photo, and hero background image (brand-tinted,
  respects the existing layout; hidden/faded on small screens to keep text legible).
- All images: ~1000px wide JPEGs, `loading="lazy"` (except hero/above-the-fold),
  descriptive `alt` text, escaped via `Z.esc` where injected.

## Non-goals

- No CMS / image upload UI. No external image service at runtime. No new npm deps.
- Not touching pricing/compare/contact page layouts beyond what already exists.
