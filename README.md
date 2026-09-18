# The Espresso Media — Landing Page

A single-page, scroll-driven marketing site for **The Espresso Media**, a performance-creative studio based in Ahmedabad. Built with **React + Vite**, no UI framework or CSS library — every visual effect is hand-rolled with inline styles, a small global stylesheet, and a `requestAnimationFrame` scroll loop.

## Live features

- **Hero parallax** — the hero artwork and headline drift and fade at different rates as you scroll past them.
- **Kinetic wordmarks** — the "Capabilities" and "Work made to perform" marquee headlines slide horizontally, tied directly to scroll position (not a fixed-duration animation).
- **Capabilities row reveals** — each service row's rule, copy, and numeral animate in with a counter-drifting offset as it enters view.
- **Pinned approach ledger** — a scroll-pinned, 4-stage "how we work" section that steps through each stage as you scroll, with a progress rail that fills and reverses cleanly.
- **Marquee tickers** — three output rows and two footer strips scroll continuously at different speeds/directions using CSS keyframe animations.
- **Scroll-reveal** — sections fade/rise into view via an IntersectionObserver-style scroll check (toggle with the `revealOnScroll` prop).

All of this is driven by a single scroll listener in [`src/App.jsx`](./src/App.jsx) that reads element positions each animation frame and applies transforms/opacity directly — no animation library.

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Plain CSS (`src/index.css`) for keyframes, resets, and hover/active states — everything else is inline styles

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

### Other scripts

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint       # oxlint
```

## Project structure

```
├── index.html          # HTML shell, fonts (Fontshare + Google Fonts)
├── public/
│   ├── espresso-campaign.png   # hero artwork
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx         # React entry point
│   ├── App.jsx           # the entire page: markup, scroll logic, derived styles
│   └── index.css         # keyframes, resets, hover/active states, reduced-motion rules
├── vite.config.js
└── package.json
```

## Component props

The root `<App />` component accepts a few props that control motion:

| Prop | Default | Description |
|---|---|---|
| `revealOnScroll` | `true` | When `false`, all `[data-reveal]` sections render fully visible immediately instead of animating in on scroll. |
| `showTicker` | `true` | Toggles the two hero marquee ticker strips. |
| `tickerSeconds` | `22` | Duration (in seconds) of one full ticker loop; the footer/output tickers scale off this value. |

## Accessibility

- Respects `prefers-reduced-motion`: animations and transitions are effectively disabled and reveal-on-scroll content renders immediately.
- Decorative elements (gradients, noise overlay, marquee duplicates) are marked `aria-hidden`.
- The hero image has descriptive alt text; navigation and interactive elements use semantic markup.

## Notes

- This is a from-scratch React port of an original single-file HTML/CSS/JS design — visual output, copy, and motion values are intentionally preserved to match the source design.
- No backend: the newsletter form and contact links are presentational/`mailto:` only.
