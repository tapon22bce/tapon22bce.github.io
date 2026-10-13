/* CV viewer: draws every page of the CV PDF on the page with PDF.js (sharp on all screens, phones included),
   keeps the PDF's links clickable, and re-draws when the width changes.
   If PDF.js cannot load, it falls back to the browser's own PDF viewer. */
(function () {
  "use strict";
  var box = document.getElementById("cv-viewer");
  if (!box) return;
  var src = box.getAttribute("data-src");

  function fallback() {
    box.innerHTML = '<iframe class="cv-frame" src="' + src + '#view=FitH" title="CV (PDF)"></iframe>';
  }
  if (!window.pdfjsLib) { fallback(); return; }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = box.getAttribute("data-worker");

  var doc = null, drawnWidth = 0, busy = false;

  function drawPage(n, width) {
    return doc.getPage(n).then(function (page) {
      var base = page.getViewport({ scale: 1 });
      var css = page.getViewport({ scale: width / base.width });
      var dpr = Math.min(window.devicePixelRatio || 1, 3);
      var px = page.getViewport({ scale: (width / base.width) * dpr });

      var wrap = document.createElement("div");
      wrap.className = "cv-page";
      var canvas = document.createElement("canvas");
      canvas.width = Math.floor(px.width);
      canvas.height = Math.floor(px.height);
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "CV page " + n);
      wrap.appendChild(canvas);

      var painted = page.render({ canvasContext: canvas.getContext("2d"), viewport: px }).promise;
      var links = page.getAnnotations().then(function (anns) {
        anns.forEach(function (a) {
          var url = a.subtype === "Link" && (a.url || a.unsafeUrl);
          if (!url) return;
          var r = css.convertToViewportRectangle(a.rect);
          var el = document.createElement("a");
          el.className = "cv-link";
          el.href = url;
          if (!/^mailto:/i.test(url)) { el.target = "_blank"; el.rel = "noopener"; }
          el.setAttribute("aria-label", url);
          el.style.left = (Math.min(r[0], r[2]) / css.width) * 100 + "%";
          el.style.top = (Math.min(r[1], r[3]) / css.height) * 100 + "%";
          el.style.width = (Math.abs(r[2] - r[0]) / css.width) * 100 + "%";
          el.style.height = (Math.abs(r[3] - r[1]) / css.height) * 100 + "%";
          wrap.appendChild(el);
        });
      });
      return Promise.all([painted, links]).then(function () { return wrap; });
    });
  }

  function draw() {
    var width = box.clientWidth;
    if (!doc || busy || width < 50 || Math.abs(width - drawnWidth) < 2) return;
    busy = true;
    drawnWidth = width;
    var jobs = [];
    for (var n = 1; n <= doc.numPages; n++) jobs.push(drawPage(n, width));
    Promise.all(jobs).then(function (pages) {
      box.replaceChildren.apply(box, pages);
    }).catch(fallback).then(function () {
      busy = false;
      if (Math.abs(box.clientWidth - drawnWidth) >= 2) draw();   // width changed while drawing
    });
  }

  window.pdfjsLib.getDocument(src).promise.then(function (d) { doc = d; draw(); }).catch(fallback);

  var timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(draw, 200);
  });
})();
