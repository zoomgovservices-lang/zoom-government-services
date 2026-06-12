/* =============================================================================
   ZOOM Government Services — Content Data (Single Source of Truth)
   -----------------------------------------------------------------------------
   This file powers the service catalogue, pricing page, cost estimator, and the
   comparison tool. Edit THIS file to update site content — no other files need
   to change. It is loaded as a plain script that sets `window.ZOOM_DATA`, so it
   works both when opening the files directly (file://) and on live hosting,
   with no server or CORS configuration required.

   PRICING NOTE
   ------------
   All prices below are INDICATIVE placeholders so the interface is complete and
   demonstrable. Government fees in the UAE change periodically and final pricing
   is confirmed per case. Replace `price` values with your confirmed rates and
   keep `pricingStatus: "indicative"` until your real rate card is loaded, then
   switch it to "confirmed". Currency is AED unless otherwise noted.
   ============================================================================= */

window.ZOOM_DATA = {
  /* ---- Global flags & company facts -------------------------------------- */
  meta: {
    brand: "ZOOM Government Services",
    domain: "zoomgovermentservices.com",
    currency: "AED",
    pricingStatus: "indicative", // "indicative" | "confirmed"
    market: "United Arab Emirates",
    tagline: "Government services, brought closer.",
    phone: "+971 6 520 7225",           // Call us — Ajman landline
    whatsapp: "+971521835277",          // WhatsApp on the mobile (digits only after +)
    email: "zoomgovservices@gmail.com",
    address: "Horizon Tower, D Block, Office 201, Ajman, United Arab Emirates",
    hours: "Mon–Fri, 10:00 AM – 6:00 PM",
    social: {
      instagram: "https://instagram.com/",   // TODO
      facebook: "https://facebook.com/",      // TODO
      linkedin: "https://linkedin.com/",      // TODO
      x: "https://x.com/"                     // TODO
    }
  },

  /* ---- Headline statistics (animated counters) --------------------------- */
  stats: [
    { value: 30,   suffix: "+",  label: "Government services handled" },
    { value: 9,    suffix: "",   label: "Authorities & systems covered" },
    { value: 7,    suffix: "",   label: "Emirates served" },
    { value: 24,   suffix: "h",  label: "Typical first response" }
  ],

  /* ---- Service categories ------------------------------------------------ */
  /* `icon` maps to an inline SVG defined in js/icons.js                       */
  /* `image` is a service-area photo (assets/img/cat-<id>.jpg); rendered as a   */
  /* card banner. Omit it and the card gracefully falls back to the icon only.  */
  categories: [
    { id: "visas",      name: "Visas & Immigration",     icon: "passport",  authority: "GDRFA · ICP · Amer",  image: "assets/img/cat-visas.jpg",       blurb: "Residence, family, employment, Golden & visit visas across all emirates." },
    { id: "emirates-id",name: "Emirates ID",             icon: "id",        authority: "ICP",                 image: "assets/img/cat-emirates-id.jpg", blurb: "Applications, typing, biometrics, renewals and replacements." },
    { id: "business",   name: "Business Setup & Licensing",icon: "building",authority: "DET · Free Zones",    image: "assets/img/cat-business.jpg",    blurb: "Mainland, free zone and offshore company formation and trade licences." },
    { id: "labour",     name: "Labour & MOHRE",          icon: "briefcase", authority: "MOHRE · Tasheel",     image: "assets/img/cat-labour.jpg",      blurb: "Work permits, labour contracts, establishment cards and WPS." },
    { id: "pro",        name: "PRO & Government Liaison", icon: "stamp",     authority: "Multi-authority",     image: "assets/img/cat-pro.jpg",         blurb: "Document clearing, submissions, Ejari and power-of-attorney." },
    { id: "attestation",name: "Attestation & Translation",icon: "globe",    authority: "MOFA · Embassies",    image: "assets/img/cat-attestation.jpg", blurb: "Certificate attestation, legalisation and legal translation in 50+ languages." },
    { id: "medical",    name: "Medical & Health",        icon: "health",    authority: "DHA · MOHAP · EHS",   image: "assets/img/cat-medical.jpg",     blurb: "Residency medical fitness, health cards and healthcare licensing." },
    { id: "tax",        name: "Tax, VAT & Accounting",   icon: "calculator",authority: "FTA",                 image: "assets/img/cat-tax.jpg",         blurb: "VAT and corporate-tax registration, returns and bookkeeping." },
    { id: "trademark",  name: "Trademark & IP",          icon: "shield",    authority: "Ministry of Economy", image: "assets/img/cat-trademark.jpg",   blurb: "Trademark registration, renewal and protection." },
    { id: "banking",    name: "Banking & Insurance",     icon: "bank",      authority: "Partner network",     image: "assets/img/cat-banking.jpg",     blurb: "Corporate bank-account assistance and business insurance." }
  ],

  /* ---- Services ---------------------------------------------------------- */
  /* turnaround is a human-readable estimate; price is indicative AED.         */
  services: [
    // Visas & Immigration
    { id: "res-visa-new",    cat: "visas", name: "Residence Visa — New",        authority: "GDRFA / Amer", price: 3200, turnaround: "5–10 working days", popular: true,
      summary: "End-to-end new residence visa: entry permit, status change, medical and stamping.",
      includes: ["Entry permit", "Status change", "Medical fitness test", "Emirates ID application", "Visa stamping"] },
    { id: "res-visa-renew",  cat: "visas", name: "Residence Visa — Renewal",    authority: "GDRFA / Amer", price: 2600, turnaround: "3–7 working days",
      summary: "Renew an existing residence visa before or after expiry.",
      includes: ["Medical fitness test", "Emirates ID renewal", "Visa stamping"] },
    { id: "family-visa",     cat: "visas", name: "Family / Dependent Visa",     authority: "GDRFA / Amer", price: 3400, turnaround: "5–10 working days", popular: true,
      summary: "Sponsor your spouse, children or parents for UAE residence.",
      includes: ["File opening", "Entry permit", "Status change", "Medical test", "Emirates ID", "Stamping"] },
    { id: "employment-visa", cat: "visas", name: "Employment Visa",             authority: "MOHRE / GDRFA", price: 4100, turnaround: "7–12 working days",
      summary: "Work permit and employment residence visa for new staff.",
      includes: ["Work permit / offer letter", "Entry permit", "Medical test", "Emirates ID", "Visa stamping"] },
    { id: "golden-visa",     cat: "visas", name: "Golden Visa (10-year)",       authority: "GDRFA / ICP",  price: 5100, turnaround: "7–15 working days", popular: true,
      summary: "Long-term residence for investors, talent, professionals and outstanding students.",
      includes: ["Eligibility review", "Application processing", "Medical test", "Emirates ID", "Cancellation of previous visa"] },
    { id: "green-visa",      cat: "visas", name: "Green Visa (5-year)",         authority: "GDRFA / ICP",  price: 4300, turnaround: "7–12 working days",
      summary: "Self-sponsored residence for skilled employees, freelancers and investors.",
      includes: ["Eligibility review", "Application processing", "Medical test", "Emirates ID"] },
    { id: "visit-visa",      cat: "visas", name: "Visit / Tourist Visa",        authority: "GDRFA / ICP",  price: 480,  turnaround: "2–4 working days",
      summary: "Short-term visit visas for tourism or family visits (30 / 60 / 90 days).",
      includes: ["Application processing", "Approval follow-up", "e-Visa delivery"] },
    { id: "visa-other-emirates", cat: "visas", name: "Residency — Other Emirates", authority: "ICP",      price: 3000, turnaround: "5–10 working days",
      summary: "Residence visas for Abu Dhabi, Sharjah, Ajman, Fujairah, RAK and UAQ.",
      includes: ["File opening", "Entry permit", "Medical test", "Emirates ID", "Stamping"] },

    // Emirates ID
    { id: "eid-apply",  cat: "emirates-id", name: "Emirates ID — Application & Typing", authority: "ICP", price: 380, turnaround: "2–5 working days",
      summary: "Complete Emirates ID application, typing and form submission.",
      includes: ["Form typing", "Application submission", "Status tracking"] },
    { id: "eid-biometrics", cat: "emirates-id", name: "Biometrics Appointment", authority: "ICP", price: 220, turnaround: "1–3 working days",
      summary: "Schedule and coordinate your biometrics (fingerprint & photo) appointment.",
      includes: ["Appointment booking", "Location guidance", "Reminders"] },
    { id: "eid-renew",  cat: "emirates-id", name: "Emirates ID — Renewal / Replacement", authority: "ICP", price: 360, turnaround: "2–5 working days",
      summary: "Renew an expiring Emirates ID or replace a lost or damaged card.",
      includes: ["Form typing", "Submission", "Replacement follow-up"] },

    // Business Setup & Licensing
    { id: "freezone-setup", cat: "business", name: "Free Zone Company Setup", authority: "Free Zones", price: 12500, turnaround: "5–10 working days", popular: true,
      summary: "100% ownership free-zone company with licence, visa allocation and bank-ready documents.",
      includes: ["Free-zone selection", "Trade name & approvals", "Licence issuance", "Establishment card", "Visa allocation guidance"] },
    { id: "mainland-setup", cat: "business", name: "Mainland Company Formation", authority: "DET", price: 14500, turnaround: "7–14 working days",
      summary: "Dubai mainland LLC or sole-establishment formation with full government processing.",
      includes: ["Trade name reservation", "Initial approval", "MOA drafting", "Licence issuance", "Establishment card"] },
    { id: "offshore-setup", cat: "business", name: "Offshore Company Setup", authority: "Free Zones", price: 9500, turnaround: "5–10 working days",
      summary: "Offshore company for holding, asset protection and international trade.",
      includes: ["Jurisdiction selection", "Document preparation", "Registration", "Registered agent coordination"] },
    { id: "trade-license-renew", cat: "business", name: "Trade Licence — Renewal", authority: "DET / Free Zones", price: 2200, turnaround: "2–5 working days",
      summary: "Renew an existing mainland or free-zone trade licence.",
      includes: ["Document review", "Fee settlement guidance", "Renewal submission"] },
    { id: "trade-name", cat: "business", name: "Trade Name & Initial Approval", authority: "DET", price: 900, turnaround: "1–3 working days",
      summary: "Reserve your company trade name and secure initial activity approval.",
      includes: ["Name reservation", "Activity selection", "Initial approval certificate"] },

    // Labour & MOHRE
    { id: "work-permit", cat: "labour", name: "Work Permit / Labour Card", authority: "MOHRE / Tasheel", price: 1200, turnaround: "3–7 working days",
      summary: "New MOHRE work permit and labour card issuance.",
      includes: ["Quota check", "Offer letter", "Work permit issuance", "Labour card"] },
    { id: "labour-contract", cat: "labour", name: "Labour Contract — Issue / Renew / Cancel", authority: "MOHRE / Tasheel", price: 650, turnaround: "2–5 working days",
      summary: "Issue, renew or cancel MOHRE labour contracts for your employees.",
      includes: ["Contract typing", "MOHRE submission", "Employee acknowledgement"] },
    { id: "establishment-card", cat: "labour", name: "Establishment / Immigration Card", authority: "MOHRE / GDRFA", price: 1100, turnaround: "3–6 working days",
      summary: "Open or renew your company's establishment immigration card.",
      includes: ["Document preparation", "Submission", "Card issuance"] },
    { id: "wps-setup", cat: "labour", name: "WPS (Wage Protection) Setup", authority: "MOHRE", price: 750, turnaround: "2–5 working days",
      summary: "Register your company for the Wage Protection System and configure payroll files.",
      includes: ["Bank/agent coordination", "WPS registration", "SIF file guidance"] },

    // PRO & Government Liaison
    { id: "pro-clearing", cat: "pro", name: "Document Clearing & Submission", authority: "Multi-authority", price: 350, turnaround: "1–3 working days",
      summary: "On-demand PRO runner service for collecting, submitting and clearing documents.",
      includes: ["Document pickup", "Authority submission", "Status updates"] },
    { id: "ejari", cat: "pro", name: "Ejari (Tenancy) Registration", authority: "RERA / Dubai Land Dept.", price: 320, turnaround: "Same – 2 working days",
      summary: "Register or renew your tenancy contract on Ejari.",
      includes: ["Document check", "Ejari registration", "Certificate delivery"] },
    { id: "poa", cat: "pro", name: "Power of Attorney Processing", authority: "Notary Public", price: 600, turnaround: "2–4 working days",
      summary: "Drafting, translation and notarisation of power-of-attorney documents.",
      includes: ["Drafting", "Legal translation", "Notary appointment"] },

    // Attestation & Translation
    { id: "attestation", cat: "attestation", name: "Certificate Attestation", authority: "MOFA / Embassy", price: 550, turnaround: "3–10 working days", popular: true,
      summary: "Attestation of educational, personal and commercial certificates.",
      includes: ["Notarisation", "MOFA attestation", "Embassy attestation (if required)"] },
    { id: "legalization", cat: "attestation", name: "Document Legalisation", authority: "MOFA", price: 480, turnaround: "3–8 working days",
      summary: "Legalisation of UAE and foreign documents for official use.",
      includes: ["Document review", "Legalisation processing", "Collection"] },
    { id: "translation", cat: "attestation", name: "Legal Translation (50+ languages)", authority: "Certified translators", price: 120, turnaround: "Same – 3 working days",
      summary: "Certified legal and corporate translation accepted by UAE authorities.",
      includes: ["Certified translation", "Stamp & certification", "Per-page pricing"] },

    // Medical & Health
    { id: "medical-fitness", cat: "medical", name: "Medical Fitness Test (Residency)", authority: "DHA / EHS", price: 320, turnaround: "1–3 working days",
      summary: "Residency medical fitness test booking, including urgent/VIP options.",
      includes: ["Appointment booking", "Result follow-up", "Urgent option available"] },
    { id: "health-card", cat: "medical", name: "Health Card & Insurance Assistance", authority: "DHA", price: 260, turnaround: "2–5 working days",
      summary: "Health card issuance and guidance on compliant medical insurance.",
      includes: ["Health card application", "Insurance options", "Submission"] },
    { id: "healthcare-license", cat: "medical", name: "Healthcare Professional Licensing", authority: "DHA / MOHAP", price: 1800, turnaround: "10–20 working days",
      summary: "Licensing and evaluation for doctors, nurses, pharmacists and clinics.",
      includes: ["Primary source verification guidance", "Assessment booking", "Application processing"] },

    // Tax, VAT & Accounting
    { id: "vat-registration", cat: "tax", name: "VAT Registration", authority: "FTA", price: 1200, turnaround: "3–10 working days",
      summary: "Federal Tax Authority VAT registration and TRN issuance support.",
      includes: ["Eligibility review", "FTA portal registration", "TRN follow-up"] },
    { id: "corporate-tax", cat: "tax", name: "Corporate Tax Registration", authority: "FTA", price: 1400, turnaround: "3–10 working days", popular: true,
      summary: "UAE corporate tax registration and compliance onboarding.",
      includes: ["Eligibility review", "Registration", "Filing calendar setup"] },
    { id: "bookkeeping", cat: "tax", name: "Bookkeeping & Accounting", authority: "—", price: 950, turnaround: "Monthly retainer",
      summary: "Monthly bookkeeping, management accounts and VAT-ready records.",
      includes: ["Monthly bookkeeping", "Management reports", "VAT-ready ledgers"] },
    { id: "vat-return", cat: "tax", name: "VAT Return Filing", authority: "FTA", price: 700, turnaround: "Per filing period",
      summary: "Preparation and submission of periodic VAT returns.",
      includes: ["Return preparation", "Review", "FTA submission"] },

    // Trademark & IP
    { id: "trademark-register", cat: "trademark", name: "Trademark Registration", authority: "Ministry of Economy", price: 6500, turnaround: "6–12 months (full cycle)",
      summary: "Search, filing and registration of a trademark in one class.",
      includes: ["Availability search", "Filing", "Publication", "Registration certificate"] },
    { id: "trademark-renew", cat: "trademark", name: "Trademark Renewal", authority: "Ministry of Economy", price: 5200, turnaround: "2–6 weeks",
      summary: "Renew an existing registered trademark for a further 10 years.",
      includes: ["Document review", "Renewal filing", "Updated certificate"] },

    // Banking & Insurance
    { id: "bank-account", cat: "banking", name: "Corporate Bank Account Assistance", authority: "Partner banks", price: 1500, turnaround: "1–4 weeks",
      summary: "Bank introductions and document preparation for corporate accounts.",
      includes: ["Bank matching", "Document preparation", "Application support"] },
    { id: "business-insurance", cat: "banking", name: "Business & Medical Insurance", authority: "Partner insurers", price: 0, turnaround: "1–5 working days",
      summary: "Compliant medical, property, motor and liability insurance via partners.",
      includes: ["Needs assessment", "Quote comparison", "Policy issuance"], priceNote: "Quoted per policy" }
  ],

  /* ---- Curated packages (bundles) — shown on Pricing page ---------------- */
  packages: [
    {
      id: "family-inside", name: "Family Visa", variant: "Inside Country", ref: "ZGS-FAM-IN",
      price: 5410, popular: false, accent: "blue",
      includes: ["Open file", "Entry permit", "Change status", "Emirates ID", "Medical test", "Visa stamping"],
      excludes: ["Health insurance"] },
    {
      id: "family-outside", name: "Family Visa", variant: "Outside Country", ref: "ZGS-FAM-OUT",
      price: 4988, popular: false, accent: "blue",
      includes: ["Open file", "Entry permit", "Emirates ID", "Medical test", "Visa application"],
      excludes: ["Health insurance"] },
    {
      id: "golden-pkg", name: "Golden Visa", variant: "10-Year Residence", ref: "ZGS-GOLD",
      price: 5129, popular: true, accent: "green",
      includes: ["Eligibility review", "Golden visa processing", "Medical test", "Emirates ID", "Cancellation of previous visa"],
      excludes: ["Medical insurance"] },
    {
      id: "employment-pkg", name: "Employment Visa", variant: "Per Employee", ref: "ZGS-EMP",
      price: 4600, popular: false, accent: "blue",
      includes: ["Work permit", "Entry permit", "Medical test", "Emirates ID", "Visa stamping"],
      excludes: ["Health insurance", "Government deposit"] },
    {
      id: "freezone-pkg", name: "Business Setup", variant: "Free Zone Starter", ref: "ZGS-FZ",
      price: 12500, popular: true, accent: "green",
      includes: ["Free-zone selection", "Trade name & approvals", "Trade licence", "Establishment card", "1 visa allocation"],
      excludes: ["Visa stamping costs", "Office lease"] },
    {
      id: "mainland-pkg", name: "Business Setup", variant: "Mainland Launch", ref: "ZGS-ML",
      price: 14500, popular: false, accent: "blue",
      includes: ["Trade name reservation", "Initial approval", "MOA drafting", "Trade licence", "Establishment card"],
      excludes: ["Visa stamping costs", "Office lease", "Local service agent fee"] }
  ],

  /* ---- "How it works" process ------------------------------------------- */
  process: [
    { step: 1, title: "Tell us what you need", text: "Share your goal through the inquiry form, WhatsApp or a quick call. No jargon required." },
    { step: 2, title: "Get a clear quote", text: "We confirm the exact documents, government fees and our fixed service fee — no surprises." },
    { step: 3, title: "We handle the government", text: "Our PRO team submits, follows up and clears your application across the relevant authorities." },
    { step: 4, title: "Track to completion", text: "You receive status updates and your final documents, delivered digitally or in person." }
  ],

  /* ---- Differentiators --------------------------------------------------- */
  values: [
    { icon: "search",   title: "Transparent from the start", text: "Government fees and our service fee, itemised before you commit." },
    { icon: "bolt",     title: "Fast, tracked processing",   text: "Clear turnaround estimates and live status updates on every file." },
    { icon: "globe",    title: "All of the UAE",             text: "Dubai and every emirate, across nine government authorities and systems." },
    { icon: "shield",   title: "Compliance-first",           text: "Done correctly the first time, in line with current UAE regulations." }
  ],

  /* ---- Service centers / locations --------------------------------------- */
  /* PLACEHOLDER branches — replace names, addresses, hours and the Google     */
  /* Maps links with your real centers. `primary: true` shows the "Head office"*/
  /* tag. Add or remove entries freely; the Locations grid renders from here.   */
  centers: [
    { name: "Ajman — Head Office", area: "Horizon Tower", primary: true,
      address: "Horizon Tower, D Block, Office 201, Ajman, United Arab Emirates",
      hours: "Mon–Fri · 10:00 AM – 6:00 PM",
      map: "https://www.google.com/maps/search/?api=1&query=Horizon+Tower+Ajman" }
  ],

  /* ---- FAQ --------------------------------------------------------------- */
  faq: [
    { q: "Are the prices on this site final?", a: "The prices shown are indicative so you can plan. Because UAE government fees change periodically and depend on your specific case, we confirm an exact, itemised quote before any work begins." },
    { q: "Do you cover emirates other than Dubai?", a: "Yes. We process services across all seven emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Fujairah, Ras Al Khaimah and Umm Al Quwain." },
    { q: "Is ZOOM a government department?", a: "No. ZOOM Government Services is a private service provider that prepares, submits and follows up your applications with the relevant UAE government authorities on your behalf." },
    { q: "What does your service fee include?", a: "Document preparation, typing where required, submission to the authority, follow-up, and status updates through to completion. Government fees are charged at cost and shown separately." },
    { q: "How do I get started?", a: "Send an inquiry through the contact form or WhatsApp with a short description of what you need. We will respond, typically within 24 hours, with the next steps and a quote." },
    { q: "Can you handle urgent or VIP applications?", a: "Many services offer an urgent track for an additional government or priority fee. Mention your deadline in your inquiry and we will advise on the fastest compliant route." }
  ],

  /* ---- Placeholders for content provided later --------------------------- */
  /* Leave these arrays empty until real content is supplied. The UI shows a   */
  /* tasteful "coming soon" state while they are empty, then renders cards as  */
  /* soon as entries are added — no code changes needed.                       */
  testimonials: [
    // { name: "", role: "", text: "", rating: 5 }
  ],
  caseStudies: [
    // { title: "", sector: "", summary: "", result: "", metric: "" }
  ]
};
