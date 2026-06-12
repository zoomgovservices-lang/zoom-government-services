# Content Guide — editing the ZOOM website

Almost everything visible on the site is driven by **one file**:

```
public/data/services.js
```

It sets a single global object, `window.ZOOM_DATA`. You do **not** need to know
JavaScript to edit it — just follow the existing patterns and keep the commas and
quotes intact. No build step is required: save the file, refresh the page.

> Tip: after editing, run `npm run lint:js` (or `node --check public/data/services.js`)
> to confirm there are no syntax errors before deploying.

---

## 1. Company details (phone, email, address, social)

Find the `meta` block at the top of `services.js`. Replace every value marked with
a `// TODO` comment:

```js
meta: {
  phone:    "+971 4 000 0000",          // <- your real phone
  whatsapp: "+971500000000",            // <- digits only, no spaces/plus is fine
  email:    "hello@zoomgovermentservices.com",
  address:  "Sheikh Zayed Road, Dubai, United Arab Emirates",
  hours:    "Sun–Thu, 8:00 AM – 8:00 PM",
  social: {
    instagram: "https://instagram.com/yourhandle",
    facebook:  "https://facebook.com/yourpage",
    linkedin:  "https://linkedin.com/company/...",
    x:         "https://x.com/yourhandle"
  }
}
```

These values flow automatically to the header, footer, contact page, and the
floating WhatsApp button. **Leave a social URL blank (`""`) to hide that icon.**

---

## 2. Pricing: indicative → confirmed

All prices ship as **indicative** placeholders. Two things control this:

1. Per-service / per-package `price` numbers (in AED).
2. The global flag `meta.pricingStatus`.

To go live with real prices:
- Replace the `price` numbers with your confirmed rates.
- Once they are all real, change `pricingStatus: "indicative"` to
  `pricingStatus: "confirmed"`. (The "indicative" disclaimers shown around the
  site are tied to this flag.)

For a service that is always custom-quoted, set `price: 0` and add a
`priceNote: "Quoted per case"` — the UI will show the note instead of a number
and the estimator will skip it.

---

## 3. Editing services

Each entry in the `services` array looks like this:

```js
{
  id: "golden-visa",                 // unique, lowercase, no spaces (used in URLs)
  cat: "visas",                      // must match a category id
  name: "Golden Visa (10-year)",
  authority: "ICP · GDRFA",
  price: 5129,                       // indicative AED
  turnaround: "2–4 weeks",
  summary: "Long-term residence for eligible investors, talents and professionals.",
  includes: [                        // bullet list shown on the card
    "Eligibility assessment",
    "Application & submission",
    "Status follow-up"
  ],
  popular: true                      // optional — adds a highlight badge
}
```

- **To add a service:** copy an existing block, give it a unique `id`, and place it
  inside `services: [ ... ]`. Make sure `cat` matches one of the `categories` ids.
- **To remove one:** delete its block (and the trailing comma).
- **To re-order:** services display in array order within each category.

### Categories
The `categories` array controls the filter chips and the homepage category grid.
Each needs `id`, `name`, `icon`, `authority`, `blurb`. The `icon` value must be one
of the names defined in `public/js/icons.js` (e.g. `passport`, `building`,
`briefcase`, `globe`, `health`, `calculator`, `shield`, `bank`, `stamp`, `id`).

---

## 4. Editing packages (boarding-pass cards)

Entries in the `packages` array power the pricing page bundles:

```js
{
  id: "golden-pkg",
  name: "Golden Visa Package",
  variant: "Investor / Talent",
  ref: "ZGS-GOLD",          // shown as the boarding-pass reference code
  price: 5129,
  popular: true,
  accent: "green",          // "green" or "blue" — card highlight colour
  includes: ["...", "..."],
  excludes: ["..."]         // optional
}
```

---

## 5. Adding testimonials (when ready)

The site already has finished styling and an empty-state for testimonials. To make
them appear, add objects to the `testimonials` array:

```js
testimonials: [
  {
    quote: "They handled our whole team's visas without a single trip to a typing centre.",
    name: "A. Rahman",
    role: "Operations Lead, Acme FZ-LLC"
  }
],
```

As soon as the array is non-empty, the testimonial section renders the cards
automatically (the "coming soon" empty-state disappears).

---

## 6. Adding case studies (when ready)

Same pattern, using the `caseStudies` array:

```js
caseStudies: [
  {
    title: "50-employee free-zone setup in 3 weeks",
    summary: "End-to-end licensing, establishment card and staff visas for a tech firm relocating to Dubai.",
    result: "All visas issued ahead of the client's launch date."
  }
],
```

---

## 7. Swapping in the real logo

The logo currently on the site is a faithful **SVG recreation** of the ZOOM
wordmark (magnifying-glass "O", globe "O", airplane + trail). You have two options:

**Option A — keep using the crisp SVG (recommended).**
Nothing to do; it scales perfectly at any size.

**Option B — use your own raster/vector file.**
1. Drop your file into `public/assets/` (e.g. `logo.png` or `logo.svg`).
2. In each HTML page, update the header logo reference:
   ```html
   <img src="assets/logo.svg" alt="ZOOM Government Services" ... >
   ```
   Change `assets/logo.svg` to your filename. There is one logo `<img>` in the
   header of each of the 6 pages, and one in the footer (it is colour-inverted via
   a CSS filter for the dark footer — if you supply a light-on-dark version, you may
   want to remove that filter in `public/css/styles.css`, class `.footer-brand img`).
3. Favicons live at `public/assets/favicon-32.png`, `favicon-180.png`,
   `favicon-512.png` — regenerate these from your mark if it changes.

---

## 8. Filling the accreditations placeholder

`about.html` has a clearly-marked placeholder where the client's real licences and
accreditations should go (trade licence number, authority registrations, etc.).
Replace the empty-state block there with your actual credentials when available.
**Do not add accreditation logos you are not entitled to display.**

---

## 9. Things you do NOT need to touch

- `public/js/*.js` — rendering logic; it reads from `services.js`.
- `public/css/styles.css` — the design system.
- `.github/workflows/deploy.yml` — CI/CD (see `SETUP.md`).

If you change a category `id` or service `id`, just make sure any internal
deep-links still line up — but in normal content editing you will rarely need to.
