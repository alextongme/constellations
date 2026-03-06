# Constellations — Revamp Architecture Document

## Overview

This document captures the architecture decisions, design system choices, and technical tradeoffs made during the revamp of the Constellations project from a 2020-era learning exercise into a polished, production-grade portfolio piece.

## Before: The Original (June 2020)

The original project was built as a Three.js learning exercise over 3 days. It worked, but carried the hallmarks of a first pass:

### Tooling
- **Webpack 4** with 3 config files (`webpack.common.js`, `webpack.dev.js`, `webpack.prod.js`)
- **node-sass** (deprecated, C++ binding dependency)
- **Babel** with preset-env and optional chaining plugin
- 15+ devDependencies for a single-page app
- Committed `dist/` folder to the repo (manual build-then-push workflow)

### Code Quality
- **`three.js`** (220 lines): monolithic file with all scene logic — planets, stars, asteroids, camera, animation loop, disposal
- **`scroll.js`** (217 lines): a copy of three.js with ~95% of the code commented out — an abandoned experiment that was never cleaned up
- **`canvas.js`** (37 lines): an unused class for a canvas example, never imported anywhere
- **`index.js`**: imported scroll.js (commented out), empty `main()` function
- No ES module structure, no separation of concerns

### HTML/CSS
- Bare HTML shell with inline nav instructions
- Raw image tags for social icons (`angellist.png`, `github.png`, etc.)
- BEM-ish CSS with hardcoded values, no variables
- No responsive design, no meta viewport handling beyond the basics

### Deployment
- Manual: run `npm run webpack:build`, then `git add/commit/push`
- GitHub Pages served from committed `dist/` on master

## After: The Revamp

### Tooling — Webpack to Vite

**Decision**: Replace Webpack 4 + Babel + node-sass + postcss with Vite.

**Why**: Vite provides native ES module dev server, zero-config production bundling, and handles CSS/assets out of the box. For a vanilla JS + Three.js project, Webpack's complexity was pure overhead.

**Tradeoffs considered**:
- **Keep Webpack, upgrade to 5?** — Still requires loader config boilerplate. Not worth the migration effort for what Vite gives us for free.
- **Parcel?** — Viable, but Vite has better ecosystem momentum and Three.js community adoption.
- **No bundler (importmaps)?** — Three.js npm imports make this impractical without a CDN shim.

**Result**:
- 3 config files → 1 (`vite.config.js`, 7 lines)
- 15+ devDependencies → 1 (`vite`)
- Build time: sub-second

### Code Architecture

**Decision**: Delete dead code, refactor into clean ES modules.

**Files removed**:
- `scroll.js` — 217 lines of commented-out dead code
- `canvas.js` — unused class, never imported
- `composer.json`, `index.php` — PHP artifacts from an earlier iteration
- `sources.txt` — reference links (moved to README)
- `postcss.config.js`, `webpack.*.js` — replaced by Vite

**New structure**:
```
src/
  main.js          — Entry point (4 lines)
  scripts/
    scene.js       — Three.js scene setup, animation loop, resize handling
  styles/
    main.css       — All styles with CSS custom properties
```

**Key refactoring decisions**:
- **Single scene module** rather than splitting into `stars.js`, `planets.js`, etc. — the scene is tightly coupled by nature (shared `scene`, `camera`, `renderer`). Over-modularizing would create artificial boundaries and prop-drilling. One focused module with clear sections is the right level of abstraction for this scope.
- **`import.meta.url` for assets** instead of string paths — Vite resolves these at build time, enabling content hashing and proper asset pipeline.
- **BufferGeometry API** — the old code used `geometry.vertices` (removed in Three.js r125+). Refactored to use `BufferGeometry` position attributes for asteroid vertex displacement.

### Frontend Design — Observatory HUD

**Concept**: The UI is a translucent heads-up display layered over the 3D scene, evoking a space station viewport or planetarium instrument panel.

**Design system**:
- **Typography**: Cormorant Garamond (display) + Instrument Sans (body). The serif display font provides gravitas and elegance; the geometric sans handles functional UI text. Both are distinctive without being distracting.
- **Color**: Near-black background (`#020208`), cool white text (`#e8e8f0`), blue-violet accent (`rgba(120, 140, 255, 0.6)`). Minimal palette, maximum contrast.
- **Layout**: Full-viewport with fixed HUD overlay. `pointer-events: none` on the HUD container lets Three.js orbit controls work through the overlay, with `pointer-events: auto` selectively re-enabled on interactive elements.
- **Effects**: Scanline overlay (repeating gradient), subtle grid (masked with radial gradient), corner brackets, crosshair, pulsing status indicator. These details create the "instrument" feel without overwhelming the scene.
- **Animation**: Staggered entrance sequence — canvas first, then HUD fades in, nav slides down, hero reveals, corners and crosshair appear last. Creates a "system boot" feeling.

**Tradeoffs**:
- **No framework (React, Vue, etc.)** — This is a single-view app with zero interactivity beyond Three.js controls. A framework would add bundle weight and complexity for no benefit.
- **CSS-only animations** — No GSAP dependency for the overlay (removed from production dependencies). GSAP's power isn't needed for simple entrance animations.
- **SVG icons inline** — No icon library dependency. Two social icons don't justify a package.

### Deployment — GitHub Pages via Actions

**Decision**: GitHub Pages with a GitHub Actions CI/CD pipeline.

**Why not Vercel or Render?**
- This is a static site — no SSR, no API routes, no server logic.
- GitHub Pages is free, zero-config for static hosting, and the deployment lives alongside the code.
- Portfolio diversity: using Vercel for frontend apps, Render for full-stack, and GitHub Pages for static visualizations shows deliberate tool selection rather than defaulting to one platform.

**Pipeline**:
- Push to `master` triggers build
- Vite builds to `dist/`
- `actions/upload-pages-artifact` + `actions/deploy-pages` handle deployment
- Concurrency group prevents overlapping deploys

**Tradeoff**: GitHub Pages doesn't support server-side redirects or edge functions. Not relevant for this project, but worth noting.

### What Was Kept

Not everything was thrown away:
- **The Three.js scene concept** — stars, asteroids, textured moon, blood moon, wireframe planet. The original creative vision was solid.
- **OrbitControls** — the right interaction model for a space exploration visualization.
- **Texture assets** — moon.png, mars.jpg, asteroid.jpeg. These were well-chosen.
- **favicon.ico** — moved to public root.

## Security

- Secret scanning and push protection enabled on the GitHub repository
- `.gitignore` updated to exclude `dist/`, `node_modules/`, `.DS_Store`
- No secrets, API keys, or credentials in the codebase
- All dependencies are actively maintained (Three.js, Vite, GSAP)

## Metrics

| Metric | Before | After |
|--------|--------|-------|
| Config files | 5 | 1 |
| devDependencies | 15 | 1 |
| Dead code files | 3 | 0 |
| Lines of commented-out code | ~200 | 0 |
| Build toolchain | Webpack 4 + Babel + node-sass + PostCSS | Vite |
| Deployment | Manual build + commit dist/ | Auto CI/CD on push |
| Bundle size (JS, gzipped) | ~130KB (unoptimized) | ~124KB |
| Responsive | No | Yes |
| Accessibility | None | Semantic HTML, aria-labels, contrast |
