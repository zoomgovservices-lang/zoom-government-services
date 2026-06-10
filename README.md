# ZOOM Government Services

Marketing and service-catalogue website for **[zoomgovernmentservices.com](https://zoomgovernmentservices.com)** —
a private government-services provider for the **United Arab Emirates**. ZOOM
prepares, submits, and follows up government applications (visas, Emirates ID,
business setup, labour/MOHRE, attestation, medical, tax/VAT and more) on behalf of
individuals and companies.

> **Positioning note:** ZOOM is a *private service provider*, not a government
> department. The site references real UAE systems (Amer, Tasheel, GDRFA, ICP,
> MOHRE, DET, DHA, MOHAP, FTA, MOFA, RTA) by name but displays no official
> accreditation it does not hold.

---

## ✨ Highlights

- **Searchable, filterable service catalogue** — find any service by keyword or category.
- **Comparison tool** — put up to three services side by side (price, turnaround, authority, inclusions).
- **Cost estimator** — tick the services you need and get an itemised, ranged estimate.
- **Boarding-pass pricing cards** — packages presented as perforated boarding passes with reference codes.
- **Transparent indicative pricing** — every service carries a price, clearly flagged as indicative until your real rate card is loaded.
- **Distinctive brand system** — a "navigation & discovery" aesthetic built from the ZOOM logo (globe-blue, magnifier-green, near-navy ink).
- **Animated, mobile-first UI** — hero status-tracker, scroll reveals, animated counters, sticky condensing header.
- **Validated contact form** with a secure PHP mail handler and deep-linking from every tool.
- **Built to grow** — testimonials and case studies have finished, empty-state UI ready to populate.
- **CI/CD ready** — push to `main` lints the site and deploys to GoDaddy/cPanel over FTPS.

See [`docs/COMPETITIVE-ANALYSIS.md`](docs/COMPETITIVE-ANALYSIS.md) for how this
compares to (and exceeds) the reference competitor.

---

## 🗂 Repository structure

```
zoom-government-services/
├─ public/                     # Everything that gets deployed to the web root
│  ├─ index.html               # Home
│  ├─ services.html            # Catalogue (search + filter)
│  ├─ pricing.html             # Packages + cost estimator
│  ├─ compare.html             # Comparison tool
│  ├─ about.html               # Who we are / approach / process
│  ├─ contact.html             # Contact + enquiry form
│  ├─ contact.php              # Secure mail handler for the form
│  ├─ robots.txt · sitemap.xml
│  ├─ assets/                  # Logo (SVG), favicons
│  ├─ css/styles.css           # Full design system
│  ├─ js/                      # main, icons, and one script per page
│  └─ data/services.js         # ← SINGLE SOURCE OF TRUTH for all content
├─ docs/
│  ├─ COMPETITIVE-ANALYSIS.md
│  └─ CONTENT-GUIDE.md         # How to edit content / add testimonials / swap logo
├─ .github/workflows/deploy.yml  # CI/CD: lint + deploy to GoDaddy via FTPS
├─ .htmlhintrc · package.json    # Linting & scripts
├─ .gitignore · .env.example
├─ README.md
└─ SETUP.md                    # Deployment, secrets, local dev, manual deploy
```

---

## 🚀 Quick start (local preview)

No build step. The content layer is a plain script (not `fetch`), so the pages even
work when opened directly from disk — but a tiny local server is recommended:

```bash
# Option 1 — Python (built in on most systems)
cd public && python3 -m http.server 8080
# then open http://localhost:8080

# Option 2 — Node
npm install        # one-time, for the linter
npm run serve      # serves ./public via "npx serve"
```

> The contact form posts to `contact.php`, which needs PHP (i.e. the real host or a
> local PHP server). When PHP isn't available, the form **gracefully falls back to a
> pre-filled `mailto:` link**, so the page still works locally.

### Lint locally (same checks CI runs)
```bash
npm install
npm run lint:html   # HTMLHint over public/**/*.html
npm run lint:js     # node --check over public/js/*.js and data/services.js
```

---

## 🧩 Tech stack

- **Frontend:** hand-written HTML5, modern CSS (custom properties, grid/flexbox), vanilla JS (no framework, no bundler).
- **Fonts:** Bricolage Grotesque (display), Hanken Grotesk (body), DM Mono (labels) via Google Fonts.
- **Form backend:** a single, dependency-free PHP handler (`contact.php`).
- **CI/CD:** GitHub Actions → HTMLHint + `node --check` + `php -l`, then FTPS deploy.
- **Hosting:** GoDaddy shared hosting / cPanel.

---

## ✏️ Editing content

All copy, services, packages, pricing, testimonials and case studies live in
**`public/data/services.js`**. Read [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md)
for step-by-step instructions — no JavaScript knowledge required.

---

## 🎨 About the logo

The wordmark on the site is a faithful **SVG recreation** of the supplied ZOOM logo
(magnifying-glass "O" with a green rim, blue globe "O", airplane and arcing trail to
the "M"). It is crisp at every size and themed to the brand palette. To swap in your
own original file instead, see *"Swapping in the real logo"* in the Content Guide.

---

## 🌐 Deployment

Pushing to the `main` branch automatically lints and deploys the contents of
`public/` to your GoDaddy web root via FTPS. Full instructions — including how to
create scoped cPanel FTP credentials and add the four GitHub secrets — are in
**[`SETUP.md`](SETUP.md)**.

---

## 📌 Notes & roadmap

- **Pricing** is indicative until you load your real rate card (one flag flips it).
- **Testimonials / case studies** appear automatically once added to the data file.
- **Arabic / RTL** is a documented future enhancement (the layout is LTR English today).
- Replace all `// TODO` contact details in `services.js` before going live.
