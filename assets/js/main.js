/* Site behaviour: dark-mode toggle, mobile nav, fast page switching, Abs/Bib toggles, copy BibTeX, read-progress. */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---- dark mode (choice persisted; initial theme is set inline in <head> to avoid flashing) ---- */
  var toggle = document.getElementById("light-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.classList.add("transition");
      window.setTimeout(function () { root.classList.remove("transition"); }, 500);
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: theme still switches */ }
      toggle.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  /* Pages opened in the background (prerender / back-forward cache) re-read the saved theme when shown,
     so a theme switched on another page is never stale. */
  var syncTheme = function () {
    var t = null;
    try { t = localStorage.getItem("theme"); } catch (e) {}
    root.setAttribute("data-theme", t === "light" ? "light" : "dark");
  };
  document.addEventListener("prerenderingchange", syncTheme);
  window.addEventListener("pageshow", function (e) { if (e.persisted) syncTheme(); });

  /* ---- fast page switching for browsers without speculation rules (Firefox): prefetch the other pages ---- */
  var supportsSpec = HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules");
  if (!supportsSpec) {
    var prefetch = function () {
      document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
        if (a.getAttribute("aria-current") === "page") return;
        var l = document.createElement("link");
        l.rel = "prefetch";
        l.href = a.href;
        document.head.appendChild(l);
      });
    };
    if ("requestIdleCallback" in window) requestIdleCallback(prefetch, { timeout: 2000 });
    else window.setTimeout(prefetch, 1200);
  }

  /* ---- mobile navigation ---- */
  var toggler = document.querySelector(".nav-toggler");
  var links = document.querySelector(".nav-links");
  if (toggler && links) {
    toggler.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggler.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- project thumbnails: if a GIF is missing, show the neutral placeholder instead of a broken image ---- */
  document.querySelectorAll(".project-thumb img").forEach(function (img) {
    var swap = function () {
      var ph = document.createElement("span");
      ph.className = "ph";
      ph.textContent = "GIF coming soon";
      img.replaceWith(ph);
    };
    if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener("error", swap);
  });

  /* ---- Abs / Bib expanders on the publications page ---- */
  document.querySelectorAll("[data-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      var li = btn.closest("li");
      var target = li && li.querySelector("." + btn.getAttribute("data-toggle"));
      if (!target) return;
      // close the sibling panel (only one of Abs/Bib open at a time, like al-folio)
      li.querySelectorAll(".hidden.open").forEach(function (p) {
        if (p !== target) p.classList.remove("open");
      });
      li.querySelectorAll("[data-toggle]").forEach(function (b) {
        if (b !== btn) b.setAttribute("aria-expanded", "false");
      });
      var open = target.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---- copy BibTeX ---- */
  document.querySelectorAll(".copy-bib").forEach(function (b) {
    b.addEventListener("click", function () {
      var code = b.parentElement.querySelector("code");
      if (!code || !navigator.clipboard) return;
      navigator.clipboard.writeText(code.textContent.trim()).then(function () {
        b.textContent = "Copied";
        window.setTimeout(function () { b.textContent = "Copy"; }, 1400);
      });
    });
  });

  /* ---- thin reading-progress line under the navbar ---- */
  var bar = document.querySelector(".progress-bar");
  if (bar) {
    var onScroll = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
