/* =============================================================================
   ZOOM Government Services — Contact Form (contact.html)
   -----------------------------------------------------------------------------
   • Pre-fills the enquiry from deep links:
        ?service=<id>            (single service, e.g. from Compare)
        ?services=<id,id,id>     (multiple, from the estimator)
        ?package=<ref|name>      (a curated package)
   • Client-side validation with inline errors + honeypot anti-spam.
   • Submits via fetch() to FormSubmit (free email relay → business inbox) and
     shows a success / error banner.
   • Degrades gracefully: if the relay is unreachable, it offers a mailto:
     fallback so no enquiry is ever lost.
   ============================================================================= */
(function () {
  "use strict";
  var Z = window.ZGS; if (!Z) return;
  var form = Z.qs("#contactForm");
  if (!form) return;

  var statusEl = Z.qs("#formStatus");
  var serviceSelect = Z.qs("#cf-service");
  var messageEl = Z.qs("#cf-message");

  /* ---- Populate the service dropdown from data --------------------------- */
  if (serviceSelect) {
    var opts = '<option value="">General enquiry</option>';
    (Z.DATA.categories || []).forEach(function (cat) {
      var svcs = (Z.DATA.services || []).filter(function (s) { return s.cat === cat.id; });
      if (!svcs.length) return;
      opts += '<optgroup label="' + Z.esc(cat.name) + '">';
      svcs.forEach(function (s) {
        opts += '<option value="' + Z.esc(s.name) + '">' + Z.esc(s.name) + "</option>";
      });
      opts += "</optgroup>";
    });
    serviceSelect.innerHTML = opts;
  }

  /* ---- Prefill from URL params ------------------------------------------- */
  (function prefill() {
    var p = new URLSearchParams(location.search);
    var lines = [];

    var pkg = p.get("package");
    if (pkg) {
      lines.push("I'm interested in the " + pkg + " package.");
    }

    var single = p.get("service");
    if (single) {
      var s = Z.serviceById(single);
      if (s) {
        if (serviceSelect) serviceSelect.value = s.name;
        lines.push("I'd like to enquire about: " + s.name + ".");
      }
    }

    var many = p.get("services");
    if (many) {
      var names = many.split(",").map(function (id) {
        var svc = Z.serviceById(id.trim());
        return svc ? svc.name : null;
      }).filter(Boolean);
      if (names.length) {
        lines.push("I'd like a quote for the following services:");
        names.forEach(function (n) { lines.push("• " + n); });
      }
    }

    if (lines.length && messageEl && !messageEl.value) {
      messageEl.value = lines.join("\n");
    }
  })();

  /* ---- Validation -------------------------------------------------------- */
  function setError(field, on) {
    var wrap = field.closest(".field");
    if (wrap) wrap.classList.toggle("invalid", !!on);
  }
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function validate() {
    var ok = true;
    var name = Z.qs("#cf-name");
    var email = Z.qs("#cf-email");
    var msg = Z.qs("#cf-message");

    if (!name.value.trim()) { setError(name, true); ok = false; } else setError(name, false);
    if (!validEmail(email.value.trim())) { setError(email, true); ok = false; } else setError(email, false);
    if (!msg.value.trim()) { setError(msg, true); ok = false; } else setError(msg, false);
    return ok;
  }
  // Clear an error as soon as the user fixes the field.
  Z.qsa("input, textarea, select", form).forEach(function (el) {
    el.addEventListener("input", function () { setError(el, false); });
  });

  function showStatus(kind, html) {
    if (!statusEl) return;
    statusEl.className = "form-status show " + kind;
    statusEl.innerHTML = html;
    statusEl.scrollIntoView({ behavior: Z.reduceMotion ? "auto" : "smooth", block: "center" });
  }

  function mailtoFallback(data) {
    var subject = "Website enquiry — " + (data.service || "General");
    var body =
      "Name: " + data.name + "\n" +
      "Email: " + data.email + "\n" +
      "Phone: " + (data.phone || "—") + "\n" +
      "Service: " + (data.service || "General enquiry") + "\n\n" +
      data.message;
    return "mailto:" + (Z.META.email || "") +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  /* ---- Submit ------------------------------------------------------------ */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot: real users never fill this hidden field.
    var hp = Z.qs("#cf-company");
    if (hp && hp.value) { showStatus("ok", "Thank you — your message has been received."); form.reset(); return; }

    if (!validate()) {
      showStatus("bad", "Please complete the highlighted fields and try again.");
      return;
    }

    var data = {
      name: Z.qs("#cf-name").value.trim(),
      email: Z.qs("#cf-email").value.trim(),
      phone: (Z.qs("#cf-phone") || {}).value ? Z.qs("#cf-phone").value.trim() : "",
      service: serviceSelect ? serviceSelect.value : "",
      message: messageEl.value.trim(),
      company: "" // honeypot, always empty here
    };

    var btn = Z.qs('button[type="submit"]', form);
    var label = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }

    // FormSubmit (free email relay) — delivers straight to the business inbox.
    var payload = {
      name: data.name,
      email: data.email,          // becomes the Reply-To, so you can reply to the customer
      phone: data.phone || "—",
      service: data.service || "General enquiry",
      message: data.message,
      _subject: "New website enquiry — " + (data.service || "General enquiry"),
      _template: "table",
      _captcha: "false"
    };

    fetch("https://formsubmit.co/ajax/zoomgovservices@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (res) {
        if (res && (res.success === "true" || res.success === true)) {
          showStatus("ok",
            "<strong>Thank you, " + Z.esc(data.name) + ".</strong> Your enquiry has been sent — " +
            "we typically reply within 24 hours.");
          form.reset();
        } else {
          throw new Error((res && res.message) || "send failed");
        }
      })
      .catch(function () {
        // Network / endpoint unavailable → offer alternatives, never lose the message.
        showStatus("bad",
          "We couldn't submit the form automatically. Please email us at " +
          '<a href="' + mailtoFallback(data) + '"><strong>' + Z.esc(Z.META.email || "") + "</strong></a>" +
          " or message us on WhatsApp — your details are ready to send.");
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
      });
  });
})();
