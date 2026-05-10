---
name: bikewatch-99-design
description: Use this skill to generate well-branded interfaces and assets for BIKEWATCH '99, an HTML game with a Game Boy DMG + early-web GeoCities aesthetic. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick start
1. `colors_and_type.css` — link this stylesheet first; everything else depends on its tokens.
2. `assets/icons/*.svg` — 16×16 pixel icons. Recolor with `fill="currentColor"` via CSS.
3. `assets/logo.svg` / `logo-square.svg` — the wordmark and badge. Never tilt or recolor.
4. `assets/scanlines.svg` + `assets/dither-*.svg` — depth & noise overlays. Use sparingly.
5. `ui_kits/game/` — pixel-perfect React recreations of the four core screens.

## Hard rules (do not break)
- No `border-radius`. Ever. Pixel corners only.
- No blurred shadows. Use `box-shadow: 4px 4px 0 0 var(--ink)` (block) or Win98 bevel pairs.
- No emoji. Use `assets/icons/*.svg` or ASCII (`<3`, `:)`, `★`).
- No smooth easing. `steps(n)` only. No `cubic-bezier`.
- No fonts other than Press Start 2P / VT323 / Silkscreen.
- Headlines ALL CAPS. Body sentence case. Stickers lowercase or yelling.
