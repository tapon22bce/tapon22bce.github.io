# tapon22bce.github.io

Static academic site (no Jekyll build needed). Pages: About (`/`), Publications (`/publications/`), CV (`/cv/`).

- Icons are inline SVG (no icon-font downloads). Dark mode is the default.
- Page switches are near-instant: Chrome/Edge prerender the next page on hover (speculation rules),
  Firefox prefetches it, and Chrome/Edge/Safari cross-fade between pages.
- The CV page draws `assets/pdf/CV_TaponKumerRay.pdf` with PDF.js (`assets/js/cv.js`) — replace the PDF and the page updates itself.

## Deploy at https://tapon22bce.github.io/
1. On GitHub create a **public** repo named exactly `tapon22bce.github.io`.
2. Upload everything in this folder to the repo root (keep `.nojekyll`).
3. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`. Live in ~1 minute.

## Files to add
- Project GIFs → `assets/img/`: `ethos.gif`, `ctxagent.gif`, `xmacnet.gif`, `thirdeye.gif`
  (copy them from your `r-portfolio` repo). Missing GIFs automatically show a neutral "GIF coming soon" box.
  Best size: 420×262 px (2× of the 210 px thumbnail), under ~1.5 MB each, for sharp but fast loading.
- Already included: `temi_triage.gif`, `radiology.gif`.
- CV PDF → replace `assets/pdf/CV_TaponKumerRay.pdf` (keep the name).

## Where to edit
- News, projects, awards, writings: `index.html` (search for `TODO`).
- Abstracts / buttons / BibTeX: `publications/index.html` — each paper has `<!-- TODO: paste abstract -->`;
  extra buttons (DOI, Slides, Video, Code, Poster) are commented in place.
- Colours, sizes: `assets/css/main.css` (tokens at the top; same values as avaljotsingh.github.io).
- Email: `tapon.ray@plaksha.edu.in` is used in the top icons — search/replace if you prefer Gmail.

## Old site
`tapon22bce.github.io/r-portfolio/` keeps working. Optionally replace its `index.html` with a redirect:
`<meta http-equiv="refresh" content="0; url=https://tapon22bce.github.io/">`
