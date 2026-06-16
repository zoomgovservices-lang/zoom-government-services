/* =============================================================================
   ZOOM Government Services — Comparison Tool (compare.html)
   -----------------------------------------------------------------------------
   Pick up to three services from grouped dropdowns and compare them
   side-by-side: price, turnaround, authority, category and what's included.
   Stateless; ?add=<serviceId> pre-fills the first empty slot (used by the
   catalogue's compare buttons).
   ============================================================================= */
(function () {
  "use strict";
  var Z = window.ZGS; if (!Z) return;
  var picker = Z.qs("#cmpPicker");
  var result = Z.qs("#cmpResult");
  if (!picker || !result) return;

  var SLOTS = 3;
  var chosen = [null, null, null];

  /* ---- Options grouped by category --------------------------------------- */
  function optionsHTML(selectedId) {
    var html = '<option value="">Select a service…</option>';
    (Z.DATA.categories || []).forEach(function (cat) {
      var svcs = (Z.DATA.services || []).filter(function (s) { return s.cat === cat.id; });
      if (!svcs.length) return;
      html += '<optgroup label="' + Z.esc(cat.name) + '">';
      svcs.forEach(function (s) {
        var sel = s.id === selectedId ? " selected" : "";
        html += '<option value="' + Z.esc(s.id) + '"' + sel + ">" + Z.esc(s.name) + "</option>";
      });
      html += "</optgroup>";
    });
    return html;
  }

  function buildPicker() {
    var slots = "";
    for (var i = 0; i < SLOTS; i++) {
      var filled = chosen[i] ? " filled" : "";
      slots +=
        '<div class="cmp-slot' + filled + '" data-slot="' + i + '">' +
          '<span class="slot-lbl">Service ' + (i + 1) + "</span>" +
          '<select data-slot="' + i + '">' + optionsHTML(chosen[i]) + "</select>" +
        "</div>";
    }
    picker.innerHTML = slots;
    Z.qsa("select", picker).forEach(function (sel) {
      sel.addEventListener("change", function () {
        var i = parseInt(sel.getAttribute("data-slot"), 10);
        chosen[i] = sel.value || null;
        sel.closest(".cmp-slot").classList.toggle("filled", !!sel.value);
        renderTable();
      });
    });
  }

  /* ---- Comparison table -------------------------------------------------- */
  function cell(svc) {
    return svc ? "<th>" + Z.esc(svc.name) + "</th>" : '<th class="muted" style="font-weight:500">—</th>';
  }

  function rowAcross(label, fn) {
    var tds = chosen.map(function (id) {
      var svc = id ? Z.serviceById(id) : null;
      return "<td>" + (svc ? fn(svc) : '<span class="muted">—</span>') + "</td>";
    }).join("");
    return "<tr><th>" + Z.esc(label) + "</th>" + tds + "</tr>";
  }

  function renderTable() {
    var any = chosen.some(Boolean);
    if (!any) {
      result.innerHTML =
        '<div class="cmp-empty">' + Z.ICON("scale", { size: 34 }) +
        '<h3 style="margin-top:14px">Choose services to compare</h3>' +
        "<p>Select up to three services above to see their prices, timelines and inclusions side by side.</p></div>";
      return;
    }

    var head = "<thead><tr><th>Compare</th>" + chosen.map(function (id) {
      return cell(id ? Z.serviceById(id) : null);
    }).join("") + "</tr></thead>";

    var body = "<tbody>" +
      rowAcross("Price", function (s) {
        return '<span class="cmp-price">Price on request</span>';
      }) +
      rowAcross("Turnaround", function (s) { return Z.esc(s.turnaround || "—"); }) +
      rowAcross("Authority", function (s) { return Z.esc(s.authority || "—"); }) +
      rowAcross("Category", function (s) { var c = Z.categoryById(s.cat); return Z.esc(c ? c.name : "—"); }) +
      rowAcross("What's included", function (s) {
        var items = (s.includes || []).map(function (i) {
          return "<li>" + Z.ICON("check") + "<span>" + Z.esc(i) + "</span></li>";
        }).join("");
        return '<ul class="mini-list">' + items + "</ul>";
      }) +
      rowAcross("", function (s) {
        return '<a class="btn btn-primary btn-sm" href="contact.html?service=' + encodeURIComponent(s.id) + '">Request</a>';
      }) +
      "</tbody>";

    result.innerHTML = '<div class="cmp-table-wrap"><table class="cmp-table">' + head + body + "</table></div>";
  }

  buildPicker();
  renderTable();

  /* ---- ?add= deep link --------------------------------------------------- */
  var add = new URLSearchParams(location.search).get("add");
  if (add && Z.serviceById(add)) {
    var slot = chosen.indexOf(null);
    if (slot !== -1) {
      chosen[slot] = add;
      buildPicker();
      renderTable();
    }
  }
})();
