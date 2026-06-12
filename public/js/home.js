/* =============================================================================
   ZOOM Government Services — Home Page Sections (index.html)
   -----------------------------------------------------------------------------
   Renders the data-driven blocks on the landing page from window.ZOOM_DATA so
   content stays in one place: stats, category grid, "how it works", values,
   a packages preview, the FAQ accordion, and the testimonials / case-study
   areas (which show a tasteful empty state until real content is added).
   ============================================================================= */
(function () {
  "use strict";
  var Z = window.ZGS; if (!Z) return;

  /* ---- Stats ------------------------------------------------------------- */
  var statGrid = Z.qs("#statGrid");
  if (statGrid) {
    statGrid.innerHTML = (Z.DATA.stats || []).map(function (s, i) {
      return (
        '<div class="stat reveal" data-delay="' + i + '">' +
          '<div class="num" data-count="' + s.value + '" data-suffix="' + Z.esc(s.suffix || "") + '">0</div>' +
          '<div class="lbl">' + Z.esc(s.label) + "</div>" +
        "</div>"
      );
    }).join("");
  }

  /* ---- Category grid ----------------------------------------------------- */
  var catGrid = Z.qs("#catGrid");
  if (catGrid) {
    catGrid.innerHTML = (Z.DATA.categories || []).map(function (c, i) {
      var banner = c.image
        ? '<div class="cat-banner"><img src="' + Z.esc(c.image) + '" alt="' + Z.esc(c.name) + '" loading="lazy">' +
            '<span class="cat-ic" data-icon="' + Z.esc(c.icon) + '"></span></div>'
        : '<div class="cat-ic" data-icon="' + Z.esc(c.icon) + '"></div>';
      return (
        '<a class="cat-card' + (c.image ? " has-img" : "") + ' reveal" data-delay="' + (i % 4) + '" href="services.html?cat=' + encodeURIComponent(c.id) + '">' +
          banner +
          '<div class="cat-body">' +
            "<h3>" + Z.esc(c.name) + "</h3>" +
            '<div class="cat-auth">' + Z.esc(c.authority || "") + "</div>" +
            "<p>" + Z.esc(c.blurb || "") + "</p>" +
            '<span class="arrow-link">View services ' + Z.ICON("arrow-right") + "</span>" +
          "</div>" +
        "</a>"
      );
    }).join("");
  }

  /* ---- Process ----------------------------------------------------------- */
  var procList = Z.qs("#procList");
  if (procList) {
    procList.innerHTML = (Z.DATA.process || []).map(function (p, i) {
      return (
        '<div class="proc-step reveal" data-delay="' + i + '">' +
          '<div class="proc-num">' + p.step + "</div>" +
          "<h3>" + Z.esc(p.title) + "</h3>" +
          "<p>" + Z.esc(p.text) + "</p>" +
        "</div>"
      );
    }).join("");
  }

  /* ---- Values ------------------------------------------------------------ */
  var valueGrid = Z.qs("#valueGrid");
  if (valueGrid) {
    valueGrid.innerHTML = (Z.DATA.values || []).map(function (v, i) {
      return (
        '<div class="value reveal" data-delay="' + (i % 2) + '">' +
          '<div class="v-ic" data-icon="' + Z.esc(v.icon) + '"></div>' +
          "<div><h3>" + Z.esc(v.title) + "</h3><p>" + Z.esc(v.text) + "</p></div>" +
        "</div>"
      );
    }).join("");
  }

  /* ---- Service centers / locations --------------------------------------- */
  var centerGrid = Z.qs("#centerGrid");
  if (centerGrid) {
    var centers = Z.DATA.centers || [];
    var cards = centers.map(function (c, i) {
      var tag = c.primary
        ? '<span class="center-tag primary">Head office</span>'
        : '<span class="center-tag">Open now</span>';
      return (
        '<div class="center-card reveal" data-delay="' + (i % 3) + '">' +
          '<div class="center-head">' +
            tag +
            '<div class="center-pin" data-icon="pin"></div>' +
            '<div class="center-area">' + Z.esc(c.area || "") + "</div>" +
          "</div>" +
          '<div class="center-body">' +
            "<h3>" + Z.esc(c.name) + "</h3>" +
            '<p class="center-line"><span data-icon="pin"></span>' + Z.esc(c.address || "") + "</p>" +
            '<p class="center-line"><span data-icon="clock"></span>' + Z.esc(c.hours || "") + "</p>" +
            '<a class="btn btn-ghost btn-block" target="_blank" rel="noopener" href="' +
              encodeURI(c.map || "#") + '">Get directions ' + Z.ICON("arrow-up-right") + "</a>" +
          "</div>" +
        "</div>"
      );
    });

    // When there are only a few physical centers, add an "online / remote"
    // card so the row stays balanced and highlights that we work remotely.
    if (centers.length < 3) {
      cards.push(
        '<div class="center-card center-online reveal" data-delay="1">' +
          '<div class="center-body">' +
            '<div class="center-pin solid" data-icon="globe"></div>' +
            "<h3>Prefer to stay home?</h3>" +
            '<p>Most services can be handled entirely online — share your documents and we submit, follow up and deliver remotely, anywhere in the UAE.</p>' +
            '<a class="btn btn-primary btn-block" href="contact.html">Start online ' + Z.ICON("arrow-right") + "</a>" +
          "</div>" +
        "</div>"
      );
    }
    centerGrid.innerHTML = cards.join("");
  }

  /* ---- Packages preview (first three) ------------------------------------ */
  var pkgPreview = Z.qs("#pkgPreview");
  if (pkgPreview) {
    pkgPreview.innerHTML = (Z.DATA.packages || []).slice(0, 3).map(function (p, i) {
      var featured = p.popular ? " featured" : "";
      var accent = p.accent === "green" ? " acc-green" : " acc-blue";
      var flag = p.popular ? '<span class="pkg-flag">Most popular</span>' : "";
      var incl = (p.includes || []).slice(0, 5).map(function (x) {
        return "<li>" + Z.ICON("check") + "<span>" + Z.esc(x) + "</span></li>";
      }).join("");
      return (
        '<article class="pkg' + featured + accent + ' reveal" data-delay="' + i + '">' +
          flag +
          '<div class="pkg-head">' +
            '<div class="pkg-ref">' + Z.esc(p.ref || "") + "</div>" +
            '<div class="pkg-name">' + Z.esc(p.name) + "</div>" +
            '<div class="pkg-variant">' + Z.esc(p.variant || "") + "</div>" +
          "</div>" +
          '<div class="pkg-price">' +
            '<span class="cur">' + Z.esc(Z.META.currency || "AED") + '</span>' +
            '<span class="amt">' + Z.money(p.price) + "</span>" +
            '<span class="note">indicative</span>' +
          "</div>" +
          '<div class="pkg-perf"></div>' +
          '<div class="pkg-body">' +
            '<div class="grp-lbl">What\'s included</div>' +
            '<ul class="pkg-incl">' + incl + "</ul>" +
          "</div>" +
          '<div class="pkg-foot"><a class="btn btn-dark btn-block" href="pricing.html">See full pricing</a></div>' +
        "</article>"
      );
    }).join("");
  }

  /* ---- FAQ --------------------------------------------------------------- */
  var faqList = Z.qs("#faqList");
  if (faqList) {
    faqList.innerHTML = (Z.DATA.faq || []).map(function (f) {
      return (
        '<details class="faq-item reveal">' +
          "<summary>" + Z.esc(f.q) + '<span class="pm" aria-hidden="true"></span></summary>' +
          '<div class="faq-body"><p>' + Z.esc(f.a) + "</p></div>" +
        "</details>"
      );
    }).join("");
  }

  /* ---- Testimonials (empty state until provided) ------------------------- */
  var tWrap = Z.qs("#testimonials");
  if (tWrap) {
    var ts = Z.DATA.testimonials || [];
    if (!ts.length) {
      tWrap.innerHTML =
        '<div class="empty-state reveal">' +
          '<div class="es-ic" data-icon="quote"></div>' +
          "<h3>Client stories coming soon</h3>" +
          "<p>We're gathering feedback from the businesses and families we've helped. Real reviews will appear here shortly.</p>" +
        "</div>";
    } else {
      tWrap.classList.add("grid-cards", "cols-3");
      tWrap.innerHTML = ts.map(function (t) {
        var initials = (t.name || "?").split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
        return (
          '<div class="tcard reveal">' +
            '<div class="quote-mark">\u201C</div>' +
            "<p>" + Z.esc(t.text) + "</p>" +
            '<div class="who"><div class="av">' + Z.esc(initials) + "</div>" +
              '<div><div class="nm">' + Z.esc(t.name) + '</div><div class="rl">' + Z.esc(t.role || "") + "</div></div>" +
            "</div>" +
          "</div>"
        );
      }).join("");
    }
  }

  /* ---- Case studies (empty state until provided) ------------------------- */
  var csWrap = Z.qs("#caseStudies");
  if (csWrap) {
    var cs = Z.DATA.caseStudies || [];
    if (!cs.length) {
      csWrap.innerHTML =
        '<div class="empty-state reveal">' +
          '<div class="es-ic" data-icon="folder"></div>' +
          "<h3>Case studies on the way</h3>" +
          "<p>Detailed examples of complex visa, setup and attestation cases we've completed will be published here soon.</p>" +
        "</div>";
    } else {
      csWrap.classList.add("grid-cards", "cols-3");
      csWrap.innerHTML = cs.map(function (c) {
        return (
          '<div class="cat-card reveal">' +
            '<div class="cat-auth">' + Z.esc(c.sector || "") + "</div>" +
            "<h3>" + Z.esc(c.title) + "</h3><p>" + Z.esc(c.summary || "") + "</p>" +
            (c.metric ? '<div class="stat" style="margin-top:16px;border:0;padding:0"><div class="num" style="font-size:1.8rem">' + Z.esc(c.metric) + '</div><div class="lbl">' + Z.esc(c.result || "") + "</div></div>" : "") +
          "</div>"
        );
      }).join("");
    }
  }

  // Re-fill any data-icon placeholders created above, then reveal in-view items.
  if (window.ICON) {
    Z.qsa("[data-icon]").forEach(function (el) {
      if (!el.firstChild) el.innerHTML = window.ICON(el.getAttribute("data-icon"));
    });
  }
})();
