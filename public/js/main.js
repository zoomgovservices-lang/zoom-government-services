/* =============================================================================
   ZOOM Government Services — Shared Site Script
   -----------------------------------------------------------------------------
   Runs on every page. Responsibilities:
     • Sticky header condense on scroll + mobile menu toggle
     • Scroll-reveal animations (IntersectionObserver, respects reduced motion)
     • Animated stat counters
     • Hydrate contact details, social links, WhatsApp button and year from
       window.ZOOM_DATA so company info lives in ONE place (data/services.js)

   Page-specific rendering (catalogue, pricing, comparison, contact form) lives
   in its own file and reuses the small helpers exposed on window.ZGS below.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.ZOOM_DATA || {};
  var META = DATA.meta || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Tiny DOM / format helpers (shared) -------------------------------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // Format an AED amount with thousands separators. 0 → caller decides (POA etc.).
  function money(n) {
    return Number(n || 0).toLocaleString("en-AE");
  }

  // Escape user-facing strings before injecting as HTML.
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Build an element from an HTML string (returns the first child node).
  function fromHTML(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // Look up a service by id.
  function serviceById(id) {
    return (DATA.services || []).find(function (s) { return s.id === id; });
  }
  // Look up a category by id.
  function categoryById(id) {
    return (DATA.categories || []).find(function (c) { return c.id === id; });
  }

  // Render a price the consistent way across the site.
  // Returns { html } so callers can place it. Honors price 0 + priceNote.
  function priceHTML(svc) {
    if (!svc || (!svc.price && svc.price !== 0)) return '<span class="amt">On request</span>';
    if (svc.price === 0) {
      return '<span class="amt" style="font-size:1.1rem">' + esc(svc.priceNote || "On request") + "</span>";
    }
    return '<span class="amt">' + money(svc.price) + ' <small>' + esc(META.currency || "AED") + "</small></span>";
  }

  // Expose shared helpers for page scripts.
  window.ZGS = {
    DATA: DATA, META: META, reduceMotion: reduceMotion,
    qs: qs, qsa: qsa, money: money, esc: esc, fromHTML: fromHTML,
    serviceById: serviceById, categoryById: categoryById, priceHTML: priceHTML,
    ICON: window.ICON
  };

  /* ---- Header: condense on scroll + mobile menu -------------------------- */
  function initHeader() {
    var header = qs(".site-header");
    var toggle = qs(".nav-toggle");
    var links = qs(".nav-links");

    if (header) {
      var onScroll = function () {
        header.classList.toggle("scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = document.body.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      // Close the menu after navigating on mobile.
      qsa("a", links).forEach(function (a) {
        a.addEventListener("click", function () {
          document.body.classList.remove("menu-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ---- Scroll reveal ----------------------------------------------------- */
  function initReveal() {
    var items = qsa(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Animated counters ------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var dur = 1400, start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function initCounters() {
    var nums = qsa("[data-count]");
    if (!nums.length) return;
    if (!("IntersectionObserver" in window)) { nums.forEach(animateCount); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---- Hydrate company info from data ------------------------------------ */
  function waLink(text) {
    var num = (META.whatsapp || "").replace(/[^\d]/g, "");
    var base = "https://wa.me/" + num;
    return text ? base + "?text=" + encodeURIComponent(text) : base;
  }

  function hydrate() {
    // Elements opt in via data-bind="key" — keeps markup declarative.
    qsa("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      var val;
      switch (key) {
        case "phone": val = META.phone; break;
        case "phone-href": el.href = "tel:" + (META.phone || "").replace(/\s/g, ""); return;
        case "email": val = META.email; break;
        case "email-href": el.href = "mailto:" + (META.email || ""); return;
        case "whatsapp": val = META.whatsapp; break;
        case "whatsapp-href": el.href = waLink(el.getAttribute("data-msg") || ""); return;
        case "address": val = META.address; break;
        case "hours": val = META.hours; break;
        case "brand": val = META.brand; break;
        case "year": val = new Date().getFullYear(); break;
        default: return;
      }
      if (val != null) el.textContent = val;
    });

    // Social links (footer).
    var social = META.social || {};
    qsa("[data-social]").forEach(function (a) {
      var net = a.getAttribute("data-social");
      if (social[net]) { a.href = social[net]; }
      else { a.style.display = "none"; }
    });

    // Floating WhatsApp button.
    var wa = qs(".wa-float");
    if (wa) wa.href = waLink("Hello ZOOM, I'd like help with a government service.");
  }

  /* ---- Fill declarative icons ([data-icon="name"]) ----------------------- */
  function initIcons() {
    if (!window.ICON) return;
    qsa("[data-icon]").forEach(function (el) {
      el.innerHTML = window.ICON(el.getAttribute("data-icon"));
    });
  }

  /* ---- Boot -------------------------------------------------------------- */
  function init() {
    initIcons();
    initHeader();
    hydrate();
    initReveal();
    initCounters();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
