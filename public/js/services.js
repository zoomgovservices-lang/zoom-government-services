/* =============================================================================
   ZOOM Government Services — Services Catalogue (services.html)
   -----------------------------------------------------------------------------
   Renders every service from window.ZOOM_DATA as a card, with:
     • Category filter chips (built from the data)
     • Live text search over name / summary / authority
     • Deep-link buttons to the estimator and comparison tool (stateless,
       via URL params — no browser storage needed)

   Reads ?cat=<id> on load so other pages can deep-link to a filtered view.
   ============================================================================= */
(function () {
  "use strict";
  var Z = window.ZGS; if (!Z) return;
  var grid = Z.qs("#svcGrid");
  if (!grid) return; // not on the catalogue page

  var chipsWrap = Z.qs("#svcChips");
  var searchInput = Z.qs("#svcSearch");
  var countEl = Z.qs("#svcCount");

  var state = { cat: "all", q: "" };

  // Honour ?cat= deep link.
  var params = new URLSearchParams(location.search);
  if (params.get("cat") && Z.categoryById(params.get("cat"))) {
    state.cat = params.get("cat");
  }

  /* ---- Build category chips --------------------------------------------- */
  function renderChips() {
    var cats = [{ id: "all", name: "All services" }].concat(Z.DATA.categories || []);
    chipsWrap.innerHTML = cats.map(function (c) {
      var active = c.id === state.cat ? " active" : "";
      return '<button class="chip' + active + '" data-cat="' + Z.esc(c.id) + '">' + Z.esc(c.name) + "</button>";
    }).join("");
    Z.qsa(".chip", chipsWrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.cat = btn.getAttribute("data-cat");
        renderChips();
        renderCards();
      });
    });
  }

  /* ---- Build one service card ------------------------------------------- */
  function cardHTML(svc) {
    var cat = Z.categoryById(svc.cat) || {};
    var popular = svc.popular ? '<span class="svc-popular">Popular</span>' : "";
    var includes = (svc.includes || []).slice(0, 5).map(function (i) {
      return "<li>" + Z.ICON("check") + "<span>" + Z.esc(i) + "</span></li>";
    }).join("");

    var turn = svc.turnaround
      ? '<div class="svc-turn"><span class="lbl">Turnaround</span>' + Z.esc(svc.turnaround) + "</div>"
      : "";

    return (
      '<article class="svc-card reveal" data-id="' + Z.esc(svc.id) + '" data-cat="' + Z.esc(svc.cat) + '">' +
        '<div class="svc-head">' +
          "<h3>" + Z.esc(svc.name) + "</h3>" + popular +
        "</div>" +
        '<div class="svc-auth">' + Z.esc(svc.authority || cat.authority || "") + "</div>" +
        "<p>" + Z.esc(svc.summary || "") + "</p>" +
        '<ul class="svc-includes">' + includes + "</ul>" +
        '<div class="svc-meta">' +
          '<div class="svc-price">' + Z.priceHTML(svc) + "</div>" +
          turn +
        "</div>" +
        '<div class="svc-actions">' +
          '<a class="btn btn-primary btn-sm svc-add" href="pricing.html?add=' + encodeURIComponent(svc.id) + '">' +
            Z.ICON("calculator") + "Add to quote</a>" +
          '<a class="btn btn-ghost btn-sm" href="compare.html?add=' + encodeURIComponent(svc.id) + '" title="Compare this service">' +
            Z.ICON("scale") + "</a>" +
        "</div>" +
      "</article>"
    );
  }

  /* ---- Filter + render --------------------------------------------------- */
  function matches(svc) {
    if (state.cat !== "all" && svc.cat !== state.cat) return false;
    if (state.q) {
      var hay = (svc.name + " " + (svc.summary || "") + " " + (svc.authority || "")).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function renderCards() {
    var list = (Z.DATA.services || []).filter(matches);
    if (!list.length) {
      grid.innerHTML =
        '<div class="no-results">' + Z.ICON("search", { size: 30 }) +
        "<h3 style=\"margin-top:14px\">No services match your search</h3>" +
        "<p>Try a different keyword or clear the filters.</p></div>";
    } else {
      grid.innerHTML = list.map(cardHTML).join("");
    }
    if (countEl) {
      countEl.textContent = list.length + (list.length === 1 ? " service" : " services");
    }
    // Newly inserted .reveal cards become visible immediately (already in view).
    Z.qsa(".reveal", grid).forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Search input ------------------------------------------------------ */
  if (searchInput) {
    var t;
    searchInput.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        state.q = searchInput.value.trim().toLowerCase();
        renderCards();
      }, 120);
    });
  }

  renderChips();
  renderCards();
})();
