# SETUP & Deployment Guide

This guide walks through everything needed to run the ZOOM Government Services
website locally and deploy it to **GoDaddy hosting via cPanel**, with automated
deployment through **GitHub Actions**.

Sections:
1. [Prerequisites](#1-prerequisites)
2. [Local development](#2-local-development)
3. [GoDaddy / cPanel: get your FTP credentials](#3-godaddy--cpanel-get-your-ftp-credentials)
4. [Configure GitHub Secrets](#4-configure-github-secrets)
5. [How the CI/CD pipeline works](#5-how-the-cicd-pipeline-works)
6. [Manual deployment (no CI/CD)](#6-manual-deployment-no-cicd)
7. [Contact form email configuration](#7-contact-form-email-configuration)
8. [Pointing your domain (DNS)](#8-pointing-your-domain-dns)
9. [Security best practices](#9-security-best-practices)
10. [Going-live checklist](#10-going-live-checklist)
11. [Future enhancement: Arabic / RTL](#11-future-enhancement-arabic--rtl)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

- A **GoDaddy hosting plan with cPanel** (Linux/“cPanel” hosting — not a
  Website-Builder plan) and the domain `zoomgovernmentservices.com` available to
  point at it.
- A **GitHub account** and this repository pushed to it.
- For local work: **Node.js 18+** (for the linter / local server) and optionally
  **Python 3** or **PHP 8+**.
- An FTP client such as **FileZilla** (only needed for manual deployment).

---

## 2. Local development

There is no build step. Clone the repo, then preview `public/`:

```bash
git clone <your-repo-url>
cd zoom-government-services

# --- preview the static site (pick one) ---
cd public && python3 -m http.server 8080        # → http://localhost:8080
# or, from the repo root:
npm install && npm run serve                     # uses npx serve ./public
```

**About the contact form locally.** The form posts JSON to `contact.php`, which
needs a PHP runtime. If you don't have one, the form automatically falls back to a
pre-filled `mailto:` link, so the rest of the site works fine. To test the PHP
handler itself locally:

```bash
cd public && php -S localhost:8080      # serves the folder AND runs contact.php
```

**Run the same checks CI will run:**

```bash
npm install
npm run lint:html    # HTMLHint over public/**/*.html
npm run lint:js      # node --check over JS files
php -l public/contact.php   # if PHP is installed
```

---

## 3. GoDaddy / cPanel: get your FTP credentials

Deployment uses **FTPS** (FTP over TLS). Create a dedicated, scoped FTP account so
your main hosting password is never stored in CI.

1. Log in to GoDaddy → your hosting product → **cPanel Admin**.
2. In cPanel, open **Files → FTP Accounts**.
3. Create a new FTP account:
   - **Log In / Username:** e.g. `deploy@zoomgovernmentservices.com`
   - **Password:** generate a strong, unique password.
   - **Directory:** set it to your web root so the account is scoped there — for the
     primary domain this is usually `public_html`. (You can scope it tighter if you
     deploy to a subfolder.)
   - **Quota:** Unlimited (or as needed).
4. Note the connection details cPanel shows for the account:
   - **FTP server / host** — often your domain (`zoomgovernmentservices.com`) or a
     host like `ftp.zoomgovernmentservices.com` / a server hostname GoDaddy lists.
     If a plain hostname doesn't connect, try the server's hostname or IP from the
     cPanel sidebar (“General Information”).
   - **Username** — the full username you created (often includes `@yourdomain`).
   - **Port** — `21` for FTP/FTPS (explicit TLS). 

> **Web root:** For the **primary** domain, files go in `public_html/`. For an
> **addon/subdomain**, cPanel will have created a subfolder (e.g.
> `public_html/zoom/`); use that as your server directory instead.

---

## 4. Configure GitHub Secrets

The workflow reads four secrets. **Never commit these to the repo** — they live
only in GitHub.

In GitHub: **Repo → Settings → Secrets and variables → Actions → “New repository
secret”**, and add each of:

| Secret name | Value | Example |
|---|---|---|
| `FTP_SERVER` | Your FTP host from cPanel | `zoomgovernmentservices.com` |
| `FTP_USERNAME` | The scoped FTP account username | `deploy@zoomgovernmentservices.com` |
| `FTP_PASSWORD` | That account's password | *(the strong password you generated)* |
| `FTP_SERVER_DIR` | Target directory **with a trailing slash** | `/public_html/` |

Notes:
- `FTP_SERVER_DIR` **must end in a slash**. For the primary domain use
  `/public_html/`; for a subfolder use e.g. `/public_html/zoom/`.
- Do **not** include `ftp://` or a port in `FTP_SERVER` — just the hostname.

---

## 5. How the CI/CD pipeline works

The workflow file is **`.github/workflows/deploy.yml`**. It triggers on **push to
`main`** and can also be run manually from the Actions tab (**workflow_dispatch**).
A concurrency guard cancels superseded runs so two deploys never overlap.

It runs two jobs:

**Job 1 — `test` (validate):**
- checks out the code and sets up **Node 20**,
- `npm install` then **HTMLHint** over `public/**/*.html`,
- **`node --check`** on every file in `public/js/` (syntax validation),
- sets up **PHP 8.2** and runs **`php -l public/contact.php`** (lint).

**Job 2 — `deploy`:**
- `needs: test` — it only runs if validation passed,
- guarded by `if: github.ref == 'refs/heads/main'` so only `main` ever deploys,
- uses **`SamKirkland/FTP-Deploy-Action`** over **FTPS** (port 21) to upload the
  **`./public/`** directory to your `FTP_SERVER_DIR`,
- uploads only what changed (it keeps a small sync-state file on the server),
- excludes non-web files (`.git*`, `node_modules`, `.DS_Store`, source maps,
  `README.md`).

> `dangerous-clean-slate` is **off**, so the deploy will not wipe the remote
> directory — it syncs changes. If you ever need a from-scratch re-upload, do it
> manually (Section 6) or temporarily enable that option with care.

**Typical flow:** commit → push to `main` → watch **Actions** tab → on success the
site is live within a minute or two.

---

## 6. Manual deployment (no CI/CD)

You can deploy without GitHub at all — just upload the **contents of `public/`** to
your web root.

**Via cPanel File Manager:**
1. cPanel → **Files → File Manager → `public_html`**.
2. Upload everything **inside** `public/` (not the `public` folder itself) — i.e.
   `index.html`, the other pages, `contact.php`, `assets/`, `css/`, `js/`,
   `data/`, `robots.txt`, `sitemap.xml`.
3. Confirm `index.html` sits directly in `public_html/`.

**Via FileZilla (FTP/FTPS):**
1. File → Site Manager → New Site.
2. Protocol **FTP**, Encryption **“Require explicit FTP over TLS”**, Port `21`.
3. Enter the host / username / password from Section 3, connect.
4. Upload the contents of your local `public/` into the remote web root.

---

## 7. Contact form email configuration

`public/contact.php` sends submissions using PHP's `mail()`. It reads two optional
environment variables and falls back to sensible defaults:

| Variable | Purpose | Default |
|---|---|---|
| `CONTACT_TO` | Inbox that receives enquiries | `hello@zoomgovernmentservices.com` |
| `CONTACT_FROM` | From address on the notification email | `website@zoomgovernmentservices.com` |

**Set them on GoDaddy/cPanel** in one of these ways:

- **`.htaccess`** in your web root (simplest):
  ```apache
  SetEnv CONTACT_TO "hello@zoomgovernmentservices.com"
  SetEnv CONTACT_FROM "website@zoomgovernmentservices.com"
  ```
- or a **`.user.ini`** / **MultiPHP INI Editor** entry, depending on your plan.

**Deliverability tips:**
- Use a **From address on your own domain** (`@zoomgovernmentservices.com`), created
  in cPanel → **Email Accounts** — not a Gmail/Yahoo address. Sending “as” an
  external provider will likely be rejected or spam-filtered.
- Make sure your domain's **SPF** (and ideally **DKIM**) records exist so mail from
  the server is trusted.
- The handler sets the visitor's address as **Reply-To**, so you can reply directly.
- A hidden honeypot field silently absorbs basic spam bots.

> Prefer not to rely on `mail()`? You can later swap the body of `contact.php` for
> SMTP (e.g. PHPMailer) using a mailbox's SMTP credentials — but `mail()` is the
> zero-dependency default that works on standard cPanel hosting.

---

## 8. Pointing your domain (DNS)

If the domain is **registered at GoDaddy and on the same account** as the hosting,
it is usually linked automatically. Otherwise:

1. In cPanel “General Information”, note the server **IP address** (and/or the
   **nameservers** GoDaddy gives for the hosting plan).
2. At your domain registrar, either:
   - set the **nameservers** to the hosting nameservers, **or**
   - create an **A record** for `@` → the server IP, and a **CNAME** for `www` →
     `zoomgovernmentservices.com`.
3. Allow time for DNS propagation (minutes to a few hours).
4. Add an **SSL certificate** (GoDaddy/cPanel “AutoSSL” or Let's Encrypt) and force
   **HTTPS** so the site loads securely.

---

## 9. Security best practices

This project is built to keep credentials out of the codebase. Maintain that:

- **Never commit secrets.** `.env`, keys, and FTP details are git-ignored; real
  values belong in **GitHub Secrets** (CI) or **cPanel env vars** (mail). Use
  `.env.example` only as a template.
- **Use a scoped, dedicated FTP account** for deploys (Section 3), not your master
  cPanel login. Limit its directory to the web root.
- **Use FTPS** (explicit TLS) — the workflow already does. Avoid plain FTP.
- **Rotate the FTP password** periodically and immediately if it's ever exposed;
  update the `FTP_PASSWORD` secret when you do.
- **Least privilege on Actions:** the workflow declares `permissions: contents:
  read`. Keep it minimal.
- **Pin third-party actions** to a version (the deploy action is pinned). Review
  updates before bumping.
- **Force HTTPS** and keep an SSL cert active.
- **`contact.php`** already validates input, strips header-injection characters,
  enforces POST-only, and uses a honeypot — keep those protections if you edit it.

---

## 10. Going-live checklist

- [ ] Replace every `// TODO` value in `public/data/services.js` (phone, WhatsApp,
      email, address, social links).
- [ ] Load real prices and flip `pricingStatus` to `"confirmed"` when ready
      (see `docs/CONTENT-GUIDE.md`).
- [ ] Fill the **accreditations placeholder** on `about.html` with real licences.
- [ ] (Optional) Swap in the original logo file if you prefer it over the SVG.
- [ ] Set `CONTACT_TO` / `CONTACT_FROM` and create the domain mailbox(es).
- [ ] Add the four **GitHub Secrets**; run the workflow (push to `main`) and confirm
      the site updates.
- [ ] Submit a real test enquiry and confirm the email arrives.
- [ ] Confirm **SSL/HTTPS** is active and `http://` redirects to `https://`.
- [ ] Update `sitemap.xml` / `robots.txt` only if your final URLs differ.

---

## 11. Future enhancement: Arabic / RTL

The site is currently **English, left-to-right**. The structure is ready for a later
Arabic/RTL version. When you're ready:
- add `lang="ar" dir="rtl"` variants of the pages (or a language switch),
- the CSS uses logical spacing in most places, but audit any hard-coded
  left/right rules and mirror them,
- translate the strings in `public/data/services.js` (consider a parallel data file
  per language).

This was intentionally **not** built now, per the project scope.

---

## 12. Troubleshooting

**The Actions deploy fails to connect.**
- Double-check `FTP_SERVER` (hostname only, no `ftp://`/port). If your domain
  hostname doesn't connect, try the server hostname/IP from cPanel “General
  Information”.
- Confirm the FTP account exists and the password matches `FTP_PASSWORD`.
- Ensure `FTP_SERVER_DIR` ends with `/` and points at the right web root.

**Site deployed but shows a directory listing / 403.**
- Make sure `index.html` is in the web root itself, not inside a `public/`
  subfolder on the server. (You upload the *contents* of `public/`.)

**Contact form doesn't send email.**
- The host must run PHP and allow `mail()`. Set `CONTACT_TO`/`CONTACT_FROM`
  (Section 7) and use an on-domain From address.
- Check your spam folder; verify SPF/DKIM.
- Locally without PHP, the form falls back to `mailto:` by design.

**Logo looks wrong in the footer.**
- The footer applies a CSS filter to invert the logo for the dark background. If you
  supply a light-on-dark logo, remove that filter (`.footer-brand img` in
  `public/css/styles.css`).

**HTMLHint or `node --check` fails in CI.**
- Run `npm run lint:html` and `npm run lint:js` locally to see the exact file/line,
  fix, and push again.
