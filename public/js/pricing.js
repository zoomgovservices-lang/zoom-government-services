/* =============================================================================
   ZOOM Government Services — Pricing & Estimator (pricing.html)
   -----------------------------------------------------------------------------
   Two features driven entirely by window.ZOOM_DATA:
     1. Curated packages rendered as "boarding-pass" cards.
     2. A service selector: tick the services you need by category, then jump
        to the contact form with the selection pre-filled (?services=…) for an
        exact, itemised quote — fully stateless. No prices are shown.

   ?add=<serviceId> on load pre-selects a service (used by the catalogue's
   "Add to quote" buttons) and opens + scrolls to its category.
   ============================================================================= */
(function () {
  "use strict";
  var Z = window.ZGS; if (!Z) return;

  /* ----------------------------------------------------------------------- *
   *  1. Packages (boarding-pass cards)
   * ----------------------------------------------------------------------- */
  var pkgGrid = Z.qs("#pkgGrid");
  if (pkgGrid) {
    pkgGrid.innerHTML = (Z.DATA.packages || []).map(function (p, i) {
      var featured = p.popular ? " featured" : "";
      var accent = p.accent === "green" ? " acc-green" : " acc-blue";
      var flag = p.popular ? '<span class="pkg-flag">Most popular</span>' : "";

      var incl = (p.includes || []).map(function (x) {
        return "<li>" + Z.ICON("check") + "<span>" + Z.esc(x) + "</span></li>";
      }).join("");
      var excl = (p.excludes || []).map(function (x) {
        return "<li>" + Z.ICON("x") + "<span>" + Z.esc(x) + "</span></li>";
      }).join("");
      var exclBlock = excl
        ? '<div class="pkg-body" style="padding-top:0"><div class="grp-lbl">Not included</div><ul class="pkg-incl pkg-excl">' + excl + "</ul></div>"
        : "";

      return (
        '<article class="pkg' + featured + accent + ' reveal" data-delay="' + (i % 3) + '">' +
          flag +
          '<div class="pkg-head">' +
            '<div class="pkg-ref">' + Z.esc(p.ref || "") + "</div>" +
            '<div class="pkg-name">' + Z.esc(p.name) + "</div>" +
            '<div class="pkg-variant">' + Z.esc(p.variant || "") + "</div>" +
          "</div>" +
          '<div class="pkg-price">' +
            '<span class="price-req">Price on request</span>' +
          "</div>" +
          '<div class="pkg-perf"></div>' +
          '<div class="pkg-body">' +
            '<div class="grp-lbl">What\'s included</div>' +
            '<ul class="pkg-incl">' + incl + "</ul>" +
          "</div>" +
          exclBlock +
          '<div class="pkg-foot">' +
            '<a class="btn btn-dark btn-block" href="contact.html?package=' + encodeURIComponent(p.ref || p.name) +
              '">Request this package</a>' +
          "</div>" +
        "</article>"
      );
    }).join("");
    Z.qsa(".reveal", pkgGrid).forEach(function (el) { el.classList.add("in"); });
  }

  /* ----------------------------------------------------------------------- *
   *  2. Cost estimator
   * ----------------------------------------------------------------------- */
  var estPanel = Z.qs("#estPanel");
  if (!estPanel) return;

  var selectedEl = Z.qs("#estSelected");
  var rangeEl = Z.qs("#estRange");
  var quoteBtn = Z.qs("#estQuote");

  var selected = new Set();

  // Every service in a category is selectable for a quote request.
  function servicesFor(catId) {
    return (Z.DATA.services || []).filter(function (s) {
      return s.cat === catId;
    });
  }

  function buildPanel() {
    estPanel.innerHTML = (Z.DATA.categories || []).map(function (cat) {
      var svcs = servicesFor(cat.id);
      if (!svcs.length) return "";
      var rows = svcs.map(function (s) {
        return (
          '<div class="est-opt">' +
            '<input type="checkbox" class="chk" id="est-' + Z.esc(s.id) + '" value="' + Z.esc(s.id) + '">' +
            '<label for="est-' + Z.esc(s.id) + '">' + Z.esc(s.name) + "</label>" +
          "</div>"
        );
      }).join("");
      return (
        '<details class="est-cat" data-cat="' + Z.esc(cat.id) + '">' +
          "<summary>" + Z.esc(cat.name) +
            '<span class="chev">' + Z.ICON("chevron-down") + "</span>" +
          "</summary>" +
          '<div class="est-cat-body">' + rows + "</div>" +
        "</details>"
      );
    }).join("");

    Z.qsa(".chk", estPanel).forEach(function (chk) {
      chk.addEventListener("change", function () {
        if (chk.checked) selected.add(chk.value); else selected.delete(chk.value);
        renderSummary();
      });
    });
  }

  function renderSummary() {
    var items = Array.prototype.slice.call(selected).map(Z.serviceById).filter(Boolean);

    if (!items.length) {
      selectedEl.innerHTML = '<div class="est-empty">No services selected yet. Tick the services you need on the left.</div>';
    } else {
      selectedEl.innerHTML = items.map(function (s) {
        return '<div class="row"><span>' + Z.esc(s.name) + "</span></div>";
      }).join("");
    }

    if (rangeEl) {
      rangeEl.textContent = items.length
        ? "We'll send an exact, itemised quote for these " + items.length + " service" + (items.length === 1 ? "" : "s") + ", including government fees."
        : "Tick the services you need, then request your free quote.";
    }

    // Carry the selection to the contact form for an exact quote.
    if (quoteBtn) {
      var ids = Array.prototype.slice.call(selected);
      quoteBtn.href = "contact.html" + (ids.length ? "?services=" + encodeURIComponent(ids.join(",")) : "");
    }
  }

  buildPanel();
  renderSummary();

  /* ---- ?add= deep link from the catalogue -------------------------------- */
  var add = new URLSearchParams(location.search).get("add");
  if (add) {
    var chk = Z.qs("#est-" + (window.CSS && CSS.escape ? CSS.escape(add) : add));
    if (chk) {
      chk.checked = true;
      selected.add(add);
      renderSummary();
      var det = chk.closest(".est-cat");
      if (det) det.open = true;
      // Scroll the estimator into view after layout settles.
      setTimeout(function () {
        var anchor = Z.qs("#estimator") || estPanel;
        anchor.scrollIntoView({ behavior: Z.reduceMotion ? "auto" : "smooth", block: "start" });
      }, 120);
    }
  }
})();
