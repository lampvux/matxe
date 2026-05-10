# BIKEWATCH '99 — Game UI Kit

A click-thru recreation of the game interface. Open `index.html` to play through it.

## Screens
- **Title** — start menu with marquee, blinking "PRESS START", and stickers
- **Watch HUD** — main game: bike on screen, vigilance meter, honk/alarm controls, panic bar
- **Game Over** — your bike was stolen; high score table; "TRY AGAIN"
- **Marketing site** — early-web style landing page

## Components (in `components.jsx`)
- `Frame` — pixel-bezel container (handles scanlines)
- `Button` — primary / secondary / danger
- `Sticker` — rotated callout with shadow
- `Marquee` — horizontal scrolling ticker
- `Meter` — labeled progress bar
- `Icon` — img wrapper for `assets/icons/*`
- `Bike` — animated bike sprite (pixel-stepped)
- `Thief` — animated thief approach sprite
