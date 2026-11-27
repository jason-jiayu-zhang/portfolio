---
name: Jason Jiayu Zhang Portfolio
description: A portfolio read as a descent, from a periwinkle summit through darkening altitude strata to the valley floor, with cream square mats laid on each band.
colors:
  peri: "#95a0da"
  peri-deep: "#4d5584"
  ground: "#3d4268"
  ground-deep: "#2f3456"
  night: "#1c2035"
  action: "#38406a"
  cream: "#eeebe2"
  sand: "#cfccbb"
  tan: "#a39d7b"
  mist: "#c9cce6"
  paper: "#e4e1d4"
  body-text: "#e9e6d9"
  peri-shade: "#646d9c"
  terrain-far: "#838dc8"
  terrain-shoulder-lit: "#a9afd8"
  terrain-shoulder-shade: "#5d669a"
  snow-shade: "#b9bde0"
  shore-far: "#353a60"
typography:
  wordmark-hero:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.4rem, 8.4vw, 8.5rem)"
    fontWeight: 900
    lineHeight: 0.84
    letterSpacing: "-0.035em"
  wordmark-section:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 9vw, 7.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  wordmark-camp:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 6.6vw, 5.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  wordmark-camp-long:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.4vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  wordmark-floor:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.6rem, 13vw, 10rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 2.2vw, 1.9rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  lead-large:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.375
  body-large:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  meta:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  tile-title:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    lineHeight: 1.25
  readout:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  readout-compact:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  label-menu:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    letterSpacing: "0.12em"
  label:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.14em"
  label-stop:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 500
    letterSpacing: "0.12em"
  label-mark:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    letterSpacing: "0.12em"
  label-unit:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 500
    letterSpacing: "0.14em"
rounded:
  none: "0px"
spacing:
  mat-pad: "8px"
  mat-pad-md: "10px"
  gutter: "20px"
  gutter-md: "32px"
  gutter-lg-right: "48px"
  rail-clearance: "176px"
  studio-step: "96px"
  switchback: "112px"
  switchback-md: "160px"
  band-end: "128px"
  band-end-md: "192px"
  band-max: "1120px"
  band-max-lg: "1360px"
components:
  band-sky:
    backgroundColor: "{colors.peri}"
    textColor: "{colors.night}"
  band-alpine:
    backgroundColor: "{colors.peri-deep}"
    textColor: "{colors.cream}"
  band-treeline:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.cream}"
  band-lake:
    backgroundColor: "{colors.ground-deep}"
    textColor: "{colors.cream}"
  band-valley:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cream}"
  mat:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.night}"
    rounded: "{rounded.none}"
    padding: "{spacing.mat-pad}"
  altimeter-rail:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.action}"
    rounded: "{rounded.none}"
    width: "132px"
    padding: "16px 16px 20px"
  altimeter-bar:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.action}"
    rounded: "{rounded.none}"
    height: "56px"
    padding: "0 4px 0 12px"
  exit-bar:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.action}"
    rounded: "{rounded.none}"
    padding: "4px"
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "44px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.night}"
  button-mat:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.action}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "44px"
    padding: "0 20px"
  button-mat-hover:
    backgroundColor: "#ffffff"
  chip-badge:
    backgroundColor: "{colors.tan}"
    textColor: "{colors.night}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  camp-marker:
    backgroundColor: "{colors.peri-deep}"
    textColor: "{colors.paper}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  studio-piece:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.action}"
    rounded: "{rounded.none}"
    padding: "{spacing.mat-pad}"
  callout:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.night}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
  nav-bar:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.action}"
    height: "56px"
    padding: "0 24px"
---

# Design System: Jason Jiayu Zhang Portfolio

## Overview

**Creative North Star: "The Range at Dusk"**

The site is a mountain at dusk, and scrolling the home page is the walk down it. The page is a stack of flat altitude strata that get darker as you descend: periwinkle sky at the summit, alpine indigo for the work camps, dusk indigo at the treeline, deep indigo at the lake, near-black on the valley floor. A freshly drawn silhouette marks every boundary: a broken ridge, a conifer line, a flat shore, rolling swells. Cream square mats sit on each band like paper laid on the slope. A cream altimeter fixed to the left edge reads the height in metres and counts down to zero at the floor.

The density is airy and slow: landscape-scale Satoshi caps for the name and each band title, one product per camp, 96px steps in the Studio stand, wide band endings (128 to 192px). Detail is small and exact: tabular metres, tracked caps on the instrument, a dashed trail between camps. Motion is small too. A flag flutters on the summit, the altimeter marker slides, studio pieces lift a little on hover. Nothing moves under reduced motion except the reading itself.

The build rejects the stacked header, hero and card-row page, the earlier one-peak-per-project card stack, and the old dark-gold tech portfolio. Flat vector terrain is the only illustration language. There are no icon tiles, no mascots and no stock imagery.

**Key Characteristics:**
- Five flat strata darken strictly downward; each band carries its own drawn top edge.
- Cream square mats with a soft fall shadow carry every image and instrument.
- Satoshi 900 caps at landscape scale, Satoshi 400 for reading.
- Altitude is the navigation: a live metres readout and five named stops.
- Square corners everywhere.

## Colors

A restrained dusk palette. Five indigo strata from light to dark, one cream surface, sand and tan for warm accents, and one interactive indigo.

### Primary
- **Action Indigo** (#38406a): ink on cream instruments and the fill of the "Let's talk" button. The only interactive fill.

### Secondary
- **Sand** (#cfccbb): band wordmarks on the alpine and valley bands ("Work", camp names, "Let's talk"), Studio placeholder fill at 50%, the trail-marker pictogram, summary links in About.
- **Tan** (#a39d7b): the badge chip under a camp ("Shipped").
- **Periwinkle Shade** (#646d9c): the shade face of the summit and the scrollbar thumb.

### Strata (the descent)
- **Sky Periwinkle** (#95a0da): summit band. Also the focus outline on dark bands.
- **Alpine Indigo** (#4d5584): work band and the ridge edge. On cream it is the small secondary ink (metres unit, years, stop altitudes).
- **Treeline Dusk** (#3d4268): Studio band and the conifer edge.
- **Lake Indigo** (#2f3456): About band and the shore edge.
- **Camp Indigo** (#262a48, `STRATA.camp`): Base Camp band and the meadow edge, a step between Lake and Valley.
- **Valley Night** (#1c2035): Contact band, footer and the swell edge; ink on the sky band and on cream; the hover fill of the primary button.

### Terrain
The summit is drawn from cool tints of the sky: far range (#838dc8), shoulder lit (#a9afd8) and shade (#5d669a), lit face in Mist, shade face in Periwinkle Shade, snow in Cream on the lit side and (#b9bde0) on the shade side. The shore's far hills are (#353a60), and its ripple lines are Mist at 30% opacity. The flag is cream on a night pole.

### Neutral
- **Cream** (#eeebe2): every mat, rail, bar and button-mat; band titles on the treeline and lake bands; reading emphasis on dark bands.
- **Mist** (#c9cce6): secondary text on dark bands (intros, periods, footer caption) and rule lines at 20%.
- **Paper** (#e4e1d4): reading text on dark bands in the descent; Camp fact keys at 80%.
- **Body Warm White** (#e9e6d9): the document's default body color.

### Named Rules
**The Descent Rule.** Strata only darken going down: sky, alpine, treeline, lake, valley. A band never sits lighter than the one above it, and each stratum is used for one band.
**The Paper-on-Dusk Rule.** On the sky band, text is Night. On every darker band, text is cream, sand, mist or paper. On cream, text is Action Indigo, Night or Alpine Indigo. Never put indigo text on a dark band or cream text on cream.
**The One Action Rule.** Action Indigo is the single interactive fill. The primary ask is "Let's talk"; a second accent would split it.

## Typography

**Display Font:** Satoshi (with ui-sans-serif, system-ui, sans-serif), loaded from Fontshare at 400, 500, 700 and 900.
**Body Font:** Satoshi, same stack.

**Character:** One family at two extremes. Black-weight caps at landscape scale name the summit and each band; regular weight carries the reading. Hierarchy comes from weight and scale, not from a second face.

### Hierarchy
- **Wordmark** (900, uppercase, -0.035em, 0.84 to 0.9 line-height): the hero name in Night on the sky (`wordmark-hero`); band titles "Work", "Studio", "About" (`wordmark-section`); camp names in sand, with a smaller step for names over nine characters (`wordmark-camp`, `wordmark-camp-long`); "Let's talk" on the valley floor (`wordmark-floor`).
- **Lead** (700, 1.15): the hero tagline (`lead`) and the About opening line (`lead-large`).
- **Headline** (700, 1.5rem mobile to 1.875rem from `md`): About sub-sections ("What I believe", "Where I have worked").
- **Title** (700, 1.125rem to 1.25rem): belief headings, role lines, off-the-clock headings.
- **Body** (400): reading text at 1.125rem (`body-large`) for intros and camp subtitles, 1rem (`body`) elsewhere. Prose runs 34 to 68ch.
- **Meta and small** (400, 0.95rem and 0.875rem): camp fact lists, periods, trail markers, footer.
- **Readout** (900, tabular): the altimeter figure, 1.7rem on the rail and 1.05rem in the mobile bar.
- **Labels** (uppercase, tracked): a fixed set of instrument steps. 0.8rem/500/0.12em for mobile menu items; 0.75rem/700/0.14em for buttons and badges (`label`); 0.72rem/500/0.12em for rail stops, bold for the current one (`label-stop`); 0.7rem/700/0.12em for the "JJZ" mark; 0.68rem/500/0.14em for the "metres" unit (`label-unit`). The 0.68rem step is the floor and is used only for unit words next to a readout.
- **Tile title** (700, 0.85rem): Studio piece names, with the year at 0.75rem tabular in Alpine Indigo.

### Named Rules
**The Landscape-Scale Rule.** Wordmarks are the only oversized type, and each one names a place on the descent. Body copy never exceeds title size.
**The Tabular Figures Rule.** Metres, years and periods use tabular numerals. Altitudes use en-US grouping ("4,200 m"), the readout rounds to 5 m, and camps step down 300 m from 3,400 m.

## Layout

The home page is one full-width column of bands. Each band holds a centred `band-inner` box: 1120px max with 20px gutters on mobile and 32px from `md`. At `lg` it widens to 1360px with a 176px left inset (rail clearance) and 48px on the right, so nothing sits under the fixed altimeter. Breakpoints are Tailwind defaults (640, 768, 1024).

Order down the page: the summit band (min 600px, 80svh), Work with camps, Studio at the treeline, About at the lake, Contact and the footer on the valley floor. Each band's z-index rises going down (10, 20, 30, 35), so each drawn edge overlaps the band above. The work band pulls up 13svh from `md` so its ridge and the top of the first camp show in the first viewport. Bands end with 128px of padding, 192px from `md` (Work 160 and 224px).

Camps use a 12-column grid at `lg`: a 7-column mat and a 5-column fact block that swap sides on every second camp. A switchback 112px tall (160px from `md`) separates camps. The Studio stand has two columns below `lg` and three at `lg`. Each column ends 96px below the one to its left, and its top padding is computed from the column's image ratios so the bottoms step evenly. About splits 5fr / 7fr from `md`. Anchor targets clear the mobile bar with an 80px scroll margin, 24px at `lg`.

**The Rail Clearance Rule.** At `lg` every band's content starts at 176px from the left edge. A new band uses `band-inner`; it never places content under the rail.

## Elevation & Depth

Depth comes from the stacking of strata and from soft shadows under cream. Each band's silhouette overlaps the band above. Mats cast one soft fall shadow: a 1px inner highlight plus a long, blurred, negatively spread drop. The second screen of a camp is pinned over the corner of the first, 40px below it and 24px outside it. The only reflection on the home page is at the lake, under the About portrait.

### Shadow Vocabulary
- **Mat** (`box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 40px -18px rgba(18,20,40,0.55)`): every mat, rail, bar and button-mat.
- **Studio lift** (`box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset, 0 26px 44px -18px rgba(10,12,30,0.7)`): a studio piece on hover, together with a 4px rise.

### Named Rules
**The Soft Mat Rule.** Shadows are wide, blurred and negatively spread, and they fall straight down. Never a hard offset or a coloured shadow.

## Shapes

Square. No border-radius on any band, mat, button, chip, piece or image; the scrollbar thumb is the only rounded element. Rectangles (mats, bars, chips) sit against angular or organic silhouettes: a ridge of straight segments and sharp turns, two-tier conifers on a rolling base, a dead-straight waterline under low hills, long cubic swells. The silhouettes come from seeded walks in `src/descent/terrain.ts`, so they render the same every time. Images are cropped inside their mat at 16:10 (camps), 4:3 (second screens) and 4:5 (portrait). Studio pieces cycle through 4:5, 4:3, 1:1, 3:4 and 5:4.

**The Drawn Edge Rule.** Every band boundary is a silhouette drawn in the lower band's colour, sitting on top of that band and rising into the one above. Ridge edges are 40 to 80px tall; the others are 64 to 150px. A boundary is never a plain horizontal cut, except the shore, where the straight waterline is the point.

## Components

### Altimeter (signature)
A precise cream instrument; the page's navigation. At `lg` it is a 132px rail fixed at the left edge and centred vertically. It holds the JJZ bar mark, a readout in Night with a "metres" unit, and a 248px scale. On the scale a 1px Action line carries five stops (Summit 4,200, Work 3,600, Studio 1,900, About 1,100, Contact 300), each placed at its altitude, with an Action triangle marker that slides to the current height (0.6s ease-out). The current stop is bold Night with a longer tick and `aria-current="location"`. Bands and camps carry `data-alt`. The reading interpolates between marks along a line that eases from the top of the viewport to 40% down, and reaches 0 at the bottom. Below `lg` the rail becomes a 56px cream bar inset 12px from the top: mark, compact readout with the current stop name, "Let's talk", and a 44px menu toggle that opens a cream panel listing the stops with their altitudes, plus Resume.

### Exit bar
A cream bar fixed top right at `lg` with 4px padding. It holds Resume (a text link in Action with an underline on hover) and the primary "Let's talk" button. Both stay in reach at every altitude.

### Buttons
- **Shape:** square (0px), 44px minimum height.
- **Primary ("Let's talk"):** Action fill, cream label text, 16px side padding; the fill goes to Night on hover.
- **Mat button ("Read the case study", "Open resume"):** a cream mat with an Action label and an arrow, 20px side padding; the fill goes to white on hover.
- **Text link:** cream, bold or regular, 1px underline offset 0.35 to 0.4em, white on hover. Focus is a 2px outline offset 3px, Periwinkle on dark bands and Night on cream.

### Camp
One shipped project at its altitude. A cream mat (8px padding, 10px from `md`) holds a 16:10 screen, and a second 4:3 screen at 38% width is pinned over its lower outer corner from `md`. Beside it: the slug as a sand wordmark, a cream subtitle, a Role / When / Team fact list (keys in paper at 80%, values in cream), an optional tan badge, then the mat button and a "Visit" text link. Camps alternate sides.

### Switchback
A trail between two camps: a dashed cream line (55% opacity, 1.5px, dash 2 7) that runs down, crosses diagonally to the other side and runs down again. Below `lg` it is a straight dashed line at the left. At the turn sits a camp marker, an Alpine Indigo tag in small tabular paper text with a sand tent pictogram: "Camp at 3,100 m".

### Studio stand
Studio pieces at the treeline, arranged as a stand of trees rather than a grid. Each piece is a cream mat with 8px padding, its image at its own aspect ratio, and a caption row with the bold Action title and the tabular year in Alpine Indigo. On hover it rises 4px and takes the Studio lift shadow while the image scales to 1.04.

### Lake reflection
Under the About portrait mat, a 6 to 10rem window holds the same mat flipped vertically. It is displaced by a fractal-noise ripple filter, shown at 45% opacity, banded by 2px stripes of Lake Indigo every 8px, and faded out with a top-to-bottom mask. A 1px cream line at 50% marks the waterline. It is decorative and `aria-hidden`.

### Base Camp (700 m)
The band between the lake and the valley. Its meadow edge flattens where one A-frame tent stands, in Camp Indigo with a sand-lit doorway. Section headings are themed (Ascents, Side Trails, The Climber, Base Camp, Rope up), while the altimeter, menu and Let's talk buttons keep plain labels.
- **Shelf:** the books as flat palette spines (sand, alpine, cream, mist, tan, periwinkle, action), with vertical titles and two faint bands. They stand behind a sand and tan ledge lip, and the book being read leans -7deg at the end of the row. Hovering, focusing or tapping a spine raises it 10px from behind the lip and names it in the caption below (title, author, category, and a tan "Reading now" badge). This is the band's only motion, and it is off under reduced motion.
- **Game routes:** one row per game, split by 1px mist/20 rules. The left side holds only the title, the genre in sand, and what is played (agents, characters or classes). The right side is a trail-map elevation profile of the game's own ladder (Valorant's nine tiers, Endfield's levels 1 to 60, Soul's Remnant's leaderboard percentile). The climbed stretch is filled in Alpine Indigo with a 2px sand edge; the route ahead is a dashed mist line up to a drawn summit. A cream pole and sand flag (the summit flag's flutter, off under reduced motion) stand at the current standing, under a cream chip that names it. Tick labels sit below a 1px rule, and minor ticks hide on phones. The chart is `aria-hidden`; a visually hidden figcaption states the standing in words.

### Summit
The first viewport: one snow-capped peak right of centre with a shoulder and a far range, drawn in the terrain tints and anchored bottom-right (`xMaxYMax slice`). A cream flag on a night pole flutters at the apex (3.2s ease-in-out, alternating), and the flag stops under reduced motion. The name, tagline and proof line sit on the open sky to its left.

### Chips
- **Badge:** Tan fill, Night text, 0.75rem bold uppercase at 0.12em, 6px 12px, square.

### Pages off the mountain
Field Notes (`/notes`, `/notes/:slug`), studio pieces and the 404 page share the home chrome through `Header`: the same action row fixed top right on desktop (`TopActions`, which adds the JJZ mark off home), and below `lg` the same 56px cream bar inset 12px from the top, naming the page where home shows the altitude. They end like home, with the Rope up band and the valley floor (`Contact`, `FloorFooter`). Case-study callouts alternate cream and sand blocks (16px 20px padding, Night text), and case-study content reveals rise 28px over 0.9s with ease-out, off under reduced motion.

### Page transitions
Moving between pages is a climb or a descent. Each route has an altitude (`src/utils/descent.ts`: home 4,200, case studies 3,600, studio 1,900, notes 700), and links between home and the notes use View Transitions. Going down, the page you leave rises 6vh and clears in the first half of a 0.34s ease-in, and the arrival rises 14vh into place over 0.56s on the ease-out curve after a 0.12s beat, so the two never double-expose. Climbing back runs the same motion downward. Pages at one height cross-fade (0.14s out, 0.24s in). The action row, the phone bar and the altimeter are named out of the page snapshot and hold still. Under reduced motion every page change is a short cross-fade with no travel. Browsers without View Transitions change pages instantly.

## Do's and Don'ts

### Do:
- **Do** give each new band its own stratum in descending order, its own drawn top edge from `terrain.ts`, and a `data-alt` mark the altimeter can read.
- **Do** put images, instruments and secondary buttons on cream mats with the Mat shadow.
- **Do** use `band-inner` so content clears the 176px rail at `lg`.
- **Do** write altitudes and years in tabular numerals, with "m" and en-US grouping.
- **Do** keep "Let's talk" and Resume reachable at every altitude.
- **Do** give every motion a reduced-motion fallback. The flag stops, and transitions and hover transforms switch off.
- **Do** keep every corner square.

### Don't:
- **Don't** put a lighter band below a darker one, or reuse a stratum for a second band.
- **Don't** separate bands with a straight horizontal cut (the shore's waterline excepted).
- **Don't** use a white or paper-light page ground. The lightest field is the sky periwinkle.
- **Don't** use gold, bright accent colours or gradients on text.
- **Don't** use hard offset or coloured shadows.
- **Don't** set a grid of same-size thumbnail cards for work or studio pieces.
- **Don't** add icon tiles, mascots or stock imagery.
- **Don't** set label type below 0.68rem.
