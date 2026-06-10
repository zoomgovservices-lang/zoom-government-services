/* =============================================================================
   ZOOM Government Services — Icon Set
   -----------------------------------------------------------------------------
   A small, dependency-free inline-SVG icon library. Every icon is a 24×24,
   stroke-based glyph that inherits `currentColor` and the size set in CSS, so
   icons recolour automatically inside buttons, cards and the dark footer.

   Usage:
     element.innerHTML = ICON("globe");        // returns an <svg> string
     ICON("globe", { size: 18 });              // optional size override (px)

   The category/value `icon` keys in data/services.js map directly to names
   defined here. If a name is missing, a neutral dot is returned so the layout
   never breaks.
   ============================================================================= */
(function () {
  "use strict";

  // Raw inner markup for each icon (paths only — the <svg> wrapper is added by ICON()).
  var PATHS = {
    /* --- Category icons --- */
    passport:
      '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 16h6"/>',
    id:
      '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M14 9h4M14 13h4M5.5 15.5c.6-1.4 4.4-1.4 5 0"/>',
    building:
      '<path d="M4 21h16M6 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16M14 21V9h3a1 1 0 0 1 1 1v11"/><path d="M9 7h2M9 11h2M9 15h2"/>',
    briefcase:
      '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
    stamp:
      '<path d="M9 3h6a2 2 0 0 1 2 2c0 1.5-1 2.2-1.5 3.2-.4.8-.5 1.8-.5 2.8h-7c0-1-.1-2-.5-2.8C7 7.2 6 6.5 6 5a2 2 0 0 1 2-2Z"/><path d="M5 14h14M4 20h16M6 17h12"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/>',
    health:
      '<path d="M12 21s-7-4.5-9.3-9C1.2 9.1 2.6 5.5 6 5.5c2 0 3 1.3 3.6 2.3.4-1 1.6-2.3 3.6-2.3 3.4 0 4.8 3.6 3.3 6.5C19 16.5 12 21 12 21Z"/><path d="M8.5 12h2l1-2 1.5 4 1-2h2" stroke-width="1.6"/>',
    calculator:
      '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4"/>',
    shield:
      '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4" stroke-width="1.8"/>',
    bank:
      '<path d="M3 9l9-5 9 5M4 9h16M5 9v9M9 9v9M15 9v9M19 9v9M3 20h18"/>',

    /* --- Value / feature icons --- */
    search:
      '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
    bolt:
      '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',

    /* --- UI / utility icons --- */
    check:
      '<path d="M5 12.5 10 17 19 7" stroke-width="2.2"/>',
    "check-circle":
      '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9" stroke-width="1.9"/>',
    x:
      '<path d="M6 6l12 12M18 6 6 18"/>',
    "x-circle":
      '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6" stroke-width="1.8"/>',
    minus:
      '<path d="M5 12h14"/>',
    plus:
      '<path d="M12 5v14M5 12h14"/>',
    "arrow-right":
      '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-up-right":
      '<path d="M7 17 17 7M8 7h9v9"/>',
    "chevron-down":
      '<path d="m6 9 6 6 6-6"/>',
    phone:
      '<path d="M5 4h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5V20a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    mail:
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    pin:
      '<path d="M12 21c4-4 7-7.2 7-11a7 7 0 1 0-14 0c0 3.8 3 7 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    clock:
      '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    chat:
      '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" stroke-width="2.2"/>',
    info:
      '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01" stroke-width="1.9"/>',
    star:
      '<path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.2l1-5.9L3.5 9.2l5.9-.8L12 3Z"/>',
    scale:
      '<path d="M12 3v18M7 21h10M5 7l14-2M5 7l-2.5 6a3 3 0 0 0 5 0L5 7Zm14-2-2.5 6a3 3 0 0 0 5 0L19 5Z"/>',
    quote:
      '<path d="M7 7H4v6h5V9c0-1.5 1-2.5 2.5-2.5M17 7h-3v6h5V9c0-1.5 1-2.5 2.5-2.5" transform="translate(-1 1)"/>',
    sparkles:
      '<path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z"/><path d="M5 16l.8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z" stroke-width="1.4"/>',
    folder:
      '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
    plane:
      '<path d="M12 3.5c.7 0 1.2.9 1.2 2.2v3.4l6.3 3.6v1.7l-6.3-1.9v3.5l1.8 1.3v1.3L12 19l-2.8.9v-1.3l1.8-1.3v-3.5L4.5 15.6v-1.7l6.3-3.6V5.7c0-1.3.5-2.2 1.2-2.2Z"/>',

    /* --- Brand / social icons (filled glyphs) --- */
    whatsapp:
      '<path fill="currentColor" stroke="none" d="M19.1 4.9A9.8 9.8 0 0 0 3.9 17.7L3 21l3.4-.9A9.8 9.8 0 1 0 19.1 4.9Zm-7 15.1c-1.5 0-3-.4-4.3-1.2l-.3-.2-2 .5.5-2-.2-.3a8.1 8.1 0 1 1 6.3 3.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.9.9-1.1 2.1-.4 3.4a10.9 10.9 0 0 0 4.9 4.7c2 .9 2.5.8 3 .7.7-.1 1.4-.6 1.6-1.2.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3Z"/>',
    instagram:
      '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>',
    facebook:
      '<path d="M14 8.5h2.5V5.2H14c-2 0-3.5 1.5-3.5 3.6v1.7H8v3.3h2.5V21h3.3v-7.2h2.5l.5-3.3h-3v-1.4c0-.4.3-.6.7-.6Z" fill="currentColor" stroke="none"/>',
    linkedin:
      '<rect x="3" y="3" width="18" height="18" rx="3"/><path fill="currentColor" stroke="none" d="M8 10.5v6H6v-6h2Zm-1-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Zm4 3.2v.9c.4-.6 1.1-1.1 2.2-1.1 1.7 0 2.8 1.1 2.8 3.2v3.1h-2v-2.8c0-.8-.3-1.4-1.1-1.4-.7 0-1.1.5-1.3 1-.1.2-.1.4-.1.7v2.5h-2v-6h1.9Z"/>',
    x:
      '<path d="M4 4l16 16M20 4 4 20" stroke-width="0" fill="none"/>',
    twitter:
      '<path fill="currentColor" stroke="none" d="M17.6 3h2.8l-6.1 7 7.2 9.5h-5.6l-4.4-5.8L6.1 19.5H3.3l6.5-7.4L3 3h5.8l4 5.3L17.6 3Zm-1 14.8h1.6L7.5 4.6H5.8l10.8 13.2Z"/>'
  };

  /**
   * Return an inline SVG string for the named icon.
   * @param {string} name  Icon key (see PATHS above).
   * @param {Object} [opts]
   * @param {number} [opts.size]   Pixel size (sets width & height). Defaults to CSS-controlled (no attrs).
   * @param {string} [opts.cls]    Optional class name(s) for the <svg>.
   * @returns {string} SVG markup.
   */
  function ICON(name, opts) {
    opts = opts || {};
    var inner = PATHS[name];
    if (!inner) {
      // Graceful fallback: a small neutral dot.
      inner = '<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>';
    }
    var sizeAttr = opts.size ? ' width="' + opts.size + '" height="' + opts.size + '"' : "";
    var clsAttr = opts.cls ? ' class="' + opts.cls + '"' : "";
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"' +
      sizeAttr +
      clsAttr +
      ' aria-hidden="true" focusable="false">' +
      inner +
      "</svg>"
    );
  }

  // Expose globally.
  window.ICON = ICON;
  window.ICON_NAMES = Object.keys(PATHS);
})();
