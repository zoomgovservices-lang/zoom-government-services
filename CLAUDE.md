# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **static marketing + service-catalogue website** for ZOOM Government Services, a private UAE
government-services brokerage (visas, Emirates ID, business setup, attestation, tax, etc.).
There is **no framework, no bundler, and no build step** — hand-written HTML5, modern CSS, and
vanilla ES5-style JavaScript, plus a single dependency-free PHP contact handler. Everything that
ships lives in `public/` and is deployed verbatim.

> **Content/legal constraint:** ZOOM is positioned as a *private service provider, not a government
> department*. It names real UAE systems (Amer, Tasheel, GDRFA, ICP, MOHRE, DET, DHA, MOHAP, FTA,
> MOFA, RTA) but must not claim official accreditation it doesn't hold. Keep copy edits consistent
> with this.

## Commands

```bash
npm install            # one-time; installs the only devDependency (htmlhint)

# Local preview (no build) — pick one:
npm run dev            # python3 -m http.server 8080 --directory public
npm run serve          # npx serve public
cd public && php -S localhost:8080   # use THIS one to test contact.php (needs PHP)

# Lint / validate (these are exactly what CI runs):
npm run lint:html      # HTMLHint over public/**/*.html
npm run lint:js        # node --check over public/js/*.js and public/data/*.js
php -l public/contact.php
```

There is **no test framework** — "tests" means lint + syntax checks above.

**Windows gotcha:** `lint:js` is a bash `for` loop and will fail under cmd/PowerShell. On Windows,
run it through the Bash tool / Git Bash, or just `node --check <file>` each JS file individually.

## Architecture

### Single source of truth: `public/data/services.js`

All content — company info (`meta`), `stats`, `categories`, `services`, `packages`, `process`,
`values`, `faq`, `testimonials`, `caseStudies` — lives in this one file. It is loaded as a **plain
script that sets `window.ZOOM_DATA`** (deliberately *not* `fetch`/JSON), so the site works even when
opened from `file://` with no server or CORS setup. Editing content = editing this file only; no
other file changes. See `docs/CONTENT-GUIDE.md`.

### Fixed script load order (required on every page)

```html
<script src="data/services.js"></script>  <!-- sets window.ZOOM_DATA -->
<script src="js/icons.js"></script>       <!-- sets window.ICON     -->
<script src="js/main.js"></script>        <!-- builds window.ZGS, runs on every page -->
<script src="js/<page>.js"></script>      <!-- page-specific renderer -->
```

Data and icons must load before `main.js`; the page script loads last. Don't reorder.

### `js/main.js` — shared runtime (every page)

Builds the **`window.ZGS` namespace** that every page script depends on: `DATA`, `META`,
`reduceMotion`, and helpers `qs/qsa`, `money`, `esc`, `fromHTML`, `serviceById`, `categoryById`,
`priceHTML`, `ICON`. It also handles the sticky/condensing header, mobile menu, scroll-reveal
(`IntersectionObserver`, respects `prefers-reduced-motion`), animated counters, and **hydration**:
HTML declares `data-bind="phone|email|whatsapp-href|address|year|brand|…"`, `data-social="…"`, and
`data-icon="…"` attributes, and main.js fills them at runtime from `META` / the icon set. So company
details (phone, email, social, etc.) come from `META` — never hard-code them in markup.

### `js/icons.js` — `window.ICON(name, opts)`

Dependency-free inline-SVG library. The `icon` keys on categories/values in `services.js` map to
names here; missing names degrade to a neutral dot. `data-icon="name"` placeholders are auto-filled
by main.js (and re-filled by home.js for content it injects).

### Page scripts (`js/{home,services,pricing,compare,contact}.js`)

Each is an IIFE with `"use strict"` that starts with `var Z = window.ZGS; if (!Z) return;` and then
**bails early if its root element isn't on the page** (`var grid = Z.qs("#svcGrid"); if (!grid) return;`).
This makes each script safe regardless of which page loads it. `home.js` powers both `index.html` and
`about.html`. They render by building HTML strings and assigning `innerHTML`.

### Cross-page state = URL query params (stateless; no storage/cookies)

The tools deep-link to each other purely via the query string:

- `services.html?cat=<id>` — pre-filter the catalogue
- `pricing.html?add=<serviceId>` — pre-tick a service in the estimator (opens + scrolls to it)
- `compare.html?add=<serviceId>` — fill the first empty compare slot
- `contact.html?service=<id>` / `?services=<id,id,id>` / `?package=<ref>` — prefill the enquiry

Preserve this pattern when adding cross-tool navigation — there is no client-side store.

### Contact form

`js/contact.js` posts JSON to `contact.php` via `fetch()`. **Graceful degradation:** if the endpoint
is unreachable (e.g. local `file://` preview without PHP), it falls back to a pre-filled `mailto:`
so no enquiry is lost. `contact.php` is POST-only, accepts JSON or form-encoded, validates, strips
CR/LF from header fields (anti header-injection), uses a hidden `company` honeypot, and reads
`CONTACT_TO` / `CONTACT_FROM` env vars (set in cPanel, never committed). It sends via PHP `mail()`.

## Conventions

- **Match the existing ES5 style:** IIFE + `"use strict"`, `var`, function expressions. No
  arrow functions / `let` / `const` / classes in the page scripts. New JS must pass `node --check`
  and run in browsers directly (no transpile step).
- **Escape all data before injecting HTML.** Every dynamic value goes through `Z.esc(...)` (and
  `encodeURIComponent` for URL params) before being concatenated into an `innerHTML` string. Keep
  this when adding rendering.
- **No runtime dependencies.** `htmlhint` is the only devDependency; don't add npm packages that
  the shipped site would need.
- **Respect reduced motion** via `Z.reduceMotion` for any new animation.
- HTMLHint enforces `alt-require` and `title-require` — keep `alt`/`<title>` on new markup.
- **Empty-state pattern:** `testimonials` / `caseStudies` render a "coming soon" block while their
  arrays are empty and auto-render cards once populated — no code change needed to go live.
- **Pricing is indicative.** Prices in `services.js` are placeholders; `meta.pricingStatus`
  (`"indicative"` | `"confirmed"`) flips the framing once real rates are loaded. The estimator
  excludes `price: 0` ("on request") items and shows a ±8% range rounded to AED 10.
- Replace the `// TODO` values in `meta` (phone, whatsapp, email, address, social) before go-live.

## Deployment

`.github/workflows/deploy.yml` runs on push to `main` (and manual dispatch). Job `test`
(HTMLHint + `node --check` per JS file + `php -l`) gates job `deploy`, which uploads **only
`./public/`** to GoDaddy/cPanel over **FTPS** (incremental sync, never wipes remote). Requires four
GitHub secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR`. Full instructions
(including mail env vars and DNS) are in `SETUP.md`.
