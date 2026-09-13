# Felix Seitzer Portfolio

Static bilingual portfolio for GitHub Pages.

## Pages
- `index.html` / `de/index.html`
- `projects.html` / `de/projects.html`
- `watchlist.html` / `de/watchlist.html`
- `reading-list.html` / `de/reading-list.html`
- `blog.html` / `de/blog.html`
- `contact.html` / `de/contact.html`
- `posts/understanding-and-deep-abstractions.html` — full English essay, linked from both blog indexes

## Tech
- Plain HTML, CSS, and JavaScript
- No build step
- Relative paths for GitHub Pages project-site deployment

## Design and local preview

- `design.css` provides the shared responsive design; `terminal.css` retains the original stylesheet for reference.
- `geometry.js` draws an original animated wireframe on the homepage. It supports a pause button, reduced-motion preferences, and pauses in background tabs.
- `theme.js` provides the light/dark switch and expandable project details.
- Run `python -m http.server 8765 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:8765/`.
- Previewing the site does not commit, push, or deploy anything.

## Essay

The HTML article was converted from the final August 2026 LaTeX manuscript, preserving the body, appendix, four figures, two footnotes, and 29 cited sources. Figures are in `images/positioning/`; captions retain their original source attribution. Citations link to the bibliography, whose entries link to the original sources. The German blog index labels the essay as English.

## Notes
- `.nojekyll` is kept so the site is served as-is.
- CV files are intentionally kept outside this public repo.
- The site is designed to work under `felix561.github.io/Felix_S/`.
