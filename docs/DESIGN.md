---
name: ph1l74.dev
description: Personal portfolio of Filat Astakhov — dark editorial aesthetic, Swiss Brutalist grid, precise typographic hierarchy.
colors:
  bg:              "oklch(5.5% 0.006 27)"
  surface:         "oklch(8.5% 0.005 27)"
  surface-raised:  "oklch(12% 0.005 27)"
  border:          "oklch(14.5% 0.005 27)"
  border-hover:    "oklch(22% 0.005 27)"
  text:            "oklch(92% 0.012 75)"
  text-secondary:  "oklch(56% 0.008 65)"
  text-ghost:      "oklch(22% 0.005 27)"
  text-trace:      "oklch(16% 0.005 27)"
  accent:          "oklch(44% 0.202 27)"
  accent-dim:      "oklch(44% 0.202 27 / 0.12)"
  accent-tint:     "oklch(44% 0.202 27 / 0.05)"
typography:
  display:
    fontFamily: "'Big Shoulders Display', Impact, sans-serif"
    fontSize: "clamp(5rem, 14.5vw, 17rem)"
    fontWeight: 900
    lineHeight: 0.85
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Syne', 'Helvetica Neue', sans-serif"
    fontSize: "clamp(3.5rem, 8vw, 8rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.028em"
  title:
    fontFamily: "'Syne', 'Helvetica Neue', sans-serif"
    fontSize: "clamp(1.6rem, 3.8vw, 3.2rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.022em"
  body:
    fontFamily: "'Bricolage Grotesque', 'Helvetica Neue', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "'JetBrains Mono', 'Courier New', monospace"
    fontSize: "0.52rem"
    fontWeight: 400
    letterSpacing: "0.20em"
rounded:
  none: "0px"
spacing:
  header-h: "4.25rem"
  page-px: "clamp(1.5rem, 4vw, 4.5rem)"
  section-py: "5rem"
components:
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.5rem"
  tag-hover:
    textColor: "{colors.text}"
  nav-link:
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.none}"
    padding: "0.75rem 0"
  nav-link-hover:
    textColor: "{colors.text}"
  project-item:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "2.5rem 0"
  project-item-hover:
    backgroundColor: "{colors.accent-tint}"
---

# Design System: ph1l74.dev

## 1. Overview

**Creative North Star: "The Architect's Brief"**

This is a portfolio that presents itself as a professional document rather than a showreel. Every surface is earned through deliberate removal: no decorative elements, no padding copy, no signalling of effort. The visual language says confidence without stating it. A prospective employer or client opens this site and reads craft in the grid before they read a word.

The aesthetic is Dark Editorial meets Swiss Brutalism: warm darkness tinted imperceptibly toward crimson, mechanical mono labels, enormous display type that commands space without apologising, and a single deep-red accent used so sparingly that each appearance carries weight. The LiquidEther background simulation adds one layer of atmospheric depth — present but never distracting.

The system explicitly rejects the template instinct. No gradient text, no glassmorphism panels, no identical project cards, no purple-on-white "developer portfolio" aesthetic. If a design decision could be described as "standard developer portfolio", it does not belong here.

**Key Characteristics:**
- Sharp square corners everywhere (border-radius: 0)
- OKLCH colour space throughout; neutrals tinted toward hue 27 (red-orange) even at near-black
- Three-family type system: Big Shoulders Display (display), Syne (headings), JetBrains Mono (labels); Bricolage Grotesque as body text
- Single crimson accent (`oklch(44% 0.202 27)`) used with extreme restraint
- Fluid spacing via `clamp()` — never fixed breakpoint jumps
- Expo ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) for all transitions

## 2. Colors: The Ember Palette

All neutrals are OKLCH with chroma 0.005–0.012 at hue 27, giving the darkness a barely-perceptible warmth — the difference between a dark room and a cold room.

### Primary
- **Deep Crimson** (`oklch(44% 0.202 27)`): The sole saturated accent. Used on active nav underlines, eyebrow lines, hover indicators, tag borders on highlight, and the status pulse dot. Never on body text. Never as a background fill. Its rarity makes it meaningful.

### Neutral
- **Near-Black Ember** (`oklch(5.5% 0.006 27)`): Page background. Not pure black — tinted toward warmth.
- **Dark Surface** (`oklch(8.5% 0.005 27)`): Card/panel background, one layer above page.
- **Raised Surface** (`oklch(12% 0.005 27)`): Second elevation layer.
- **Hairline Border** (`oklch(14.5% 0.005 27)`): Dividers, borders at rest.
- **Interactive Border** (`oklch(22% 0.005 27)`): Borders on hover; ghost text on display elements.
- **Warm Off-White** (`oklch(92% 0.012 75)`): Primary text. Slightly warm at hue 75 — not stark white.
- **Muted Sand** (`oklch(56% 0.008 65)`): Secondary text, labels, metadata.
- **Ghost** (`oklch(22% 0.005 27)`): Ghost decorative characters (large background letterforms).
- **Trace** (`oklch(16% 0.005 27)`): Near-invisible decorative strokes.

### Named Rules
**The One Accent Rule.** Deep Crimson appears on ≤5% of any screen. It marks a single directional element — an underline, a pulse dot, an active state. The moment it appears on two competing elements, it loses all weight. Never use it as a fill, a gradient endpoint, or body copy colour.

**The Warm Darkness Rule.** No pure black (`#000`) and no CSS `black`. Every background value must carry chroma ≥ 0.005 at hue 27. Cold greys read as absent design intent; warm dark reads as a considered atmosphere.

## 3. Typography: The Three-Voice System

**Display Font:** Big Shoulders Display (900 weight only, with Impact and sans-serif fallbacks)
**Heading Font:** Syne (700–800, with Helvetica Neue and sans-serif fallbacks)
**Label/Mono Font:** JetBrains Mono (400–500, with Courier New and monospace fallbacks)
**Body Font:** Bricolage Grotesque (variable, with Helvetica Neue and sans-serif fallbacks)

**Character:** Big Shoulders Display provides the heavy mechanical impact of a 1970s industrial typeface — compressed, uppercase, confident. Syne delivers editorial weight at heading scale. JetBrains Mono anchors metadata and navigation in a precise technical register. Bricolage Grotesque carries body copy with humanist warmth that softens the overall severity.

### Hierarchy

- **Display** (900 weight, `clamp(5rem, 14.5vw, 17rem)`, line-height 0.85, tracking −0.03em, uppercase): Hero name and project titles. Always uppercase. Occupies the viewport assertively. Used exclusively on hero sections.
- **Headline** (Syne 800, `clamp(3.5rem, 8vw, 8rem)`, line-height 0.86, tracking −0.028em, uppercase): Page titles (PROJECTS, ABOUT, CONTACT). One per page.
- **Title** (Syne 700, `clamp(1.6rem, 3.8vw, 3.2rem)`, line-height 1.05, tracking −0.022em): Project names in list view. Section titles in sidebar.
- **Body** (Bricolage Grotesque 400, 0.95rem, line-height 1.9): All prose — bios, project descriptions, contact copy. Max line length 66ch.
- **Label** (JetBrains Mono 400, 0.50–0.68rem, tracking 0.16–0.22em, uppercase): Navigation items, metadata tags, section labels, eyebrow text, year/category annotations. Always uppercase. Always mono.

### Named Rules
**The Three Voice Rule.** Each font family has exactly one role. Big Shoulders Display is for display headings only. Syne is for editorial headings only. JetBrains Mono is for labels, metadata, and navigation only. Bricolage Grotesque is for body copy only. Mixing roles produces noise.

**The Uppercase Restraint Rule.** Uppercase is reserved for labels (JetBrains Mono, small scale) and display type (Big Shoulders, large scale). Body copy, descriptions, and long-form text are sentence case. ALL-CAPS body copy is prohibited.

## 4. Elevation

This system is flat by doctrine. No box shadows anywhere. Depth is conveyed entirely through tonal layering: `bg` → `surface` → `surface-raised`, each a perceptible step lighter. Borders serve as structural dividers, not decorative frames.

The fixed header achieves separation via `backdrop-filter: blur(18px)` with a semi-transparent background (`oklch(5.5% 0.006 27 / 0.94)`) — this is the single glass-like treatment in the system, used functionally (legibility over the LiquidEther background) rather than decoratively.

### Named Rules
**The No-Shadow Rule.** Box shadows are prohibited at every surface level. If depth is needed, shift to a lighter tonal step. If separation is needed, use a 1px border at `{colors.border}`. Shadows carry connotations of soft consumer UI that conflict with the system's precision.

**The Glass-Once Rule.** `backdrop-filter: blur()` appears only on the site header. Any other element using this treatment is a design error.

## 5. Components

### Navigation (Site Header)
Fixed, full-width, 4.25rem height. Background: `oklch(5.5% 0.006 27 / 0.94)` with 18px blur. Logo: JetBrains Mono, 0.68rem, tracking 0.22em, uppercase, muted (`{colors.text-secondary}`). Nav links: JetBrains Mono, 0.60rem, tracking 0.16em, uppercase, muted at rest. On hover: colour shifts to `{colors.text}` and a 1px `{colors.accent}` underline grows from left (scaleX 0 → 1, 0.28s expo-out). Active link shows underline at `{colors.text-ghost}`. Mobile (≤560px): hamburger toggles a full-width dropdown panel.

### Eyebrow Labels
JetBrains Mono, 0.56rem, tracking 0.22em, uppercase, `{colors.accent}`. Always followed by a 2.25rem hairline in `{colors.accent}` via `::after`. Used to introduce sections and categorise content. Not a heading — a classifier.

### Tags / Chips
Square corners (0px radius). 1px border at `{colors.border}`. JetBrains Mono, 0.55rem, tracking 0.1em, uppercase, `{colors.text-secondary}`. On hover: border shifts to `{colors.border-hover}`, text to `{colors.text}`. No background fill at any state. Used for technology stack labels and project categories.

### Project List Items
Full-width rows separated by 1px bottom border at `{colors.border}`. On hover: background becomes `{colors.accent-tint}`, translates right 0.6rem, and a 1px `{colors.accent}` left-edge indicator scales in vertically (scaleY 0→1 from top, 0.32s expo-out). Index number transitions to accent colour. Arrow indicator translates diagonally. No card containment — rows are table-like, not card-like.

### Project Detail Hero
Full-width section with large display title. Ghost letterform (first character of project title) positioned absolutely at far right, rendered as `{colors.text-trace}` stroke only (-webkit-text-stroke: 1px), scale `clamp(14rem, 30vw, 42rem)`. Creates atmospheric depth without visual competition. Overflows and clips at hero boundary.

### Back Navigation Strip
Thin border-bottom row (2.75rem height) above every interior page. Left: `← Section` in JetBrains Mono 0.56rem uppercase. Right: `YEAR — CATEGORY` metadata. Serves as persistent wayfinding without a breadcrumb component.

### Status Dot
6×6px circle, `{colors.accent}` fill. Pulses between opacity 1 and 0.35, scale 1 and 0.75, 2.4s ease-in-out infinite. Accompanies "Available for work" type labels. One instance per page maximum.

## 6. Do's and Don'ts

### Do:
- **Do** keep every corner square (border-radius: 0). The system's precision depends on this; a single rounded card breaks the grid voice.
- **Do** use `clamp()` for all spacing that should breathe at larger viewports. Fixed pixel spacing is a breakpoint problem waiting to happen.
- **Do** reserve `{colors.accent}` for a single directional or active signal per screen. One underline, one pulse dot, one active indicator — not all three simultaneously.
- **Do** set all label text in JetBrains Mono, uppercase, with tracking ≥ 0.16em. Labels that look like body copy break the hierarchy.
- **Do** use the expo ease-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`) for all transitions. Other curves will feel inconsistent with existing interactions.
- **Do** maintain WCAG AA contrast on all text — test against `{colors.bg}` and `{colors.surface}` separately, not just the lightest background.
- **Do** respect `prefers-reduced-motion`: wrap all transitions and animations in the global media query already in globals.css.
- **Do** left-align most content. Centred stacks read as templates; left-anchored grids with asymmetric tension read as designed.

### Don't:
- **Don't** use gradient text (`background-clip: text`). It is decorative, not meaningful, and directly conflicts with the precision aesthetic.
- **Don't** use glassmorphism (backdrop-filter + semi-transparent card backgrounds) as decoration. The header blur is the single permitted exception, used for legibility over the animated background.
- **Don't** build identical card grids where every project is a uniform rectangle with icon + text. The project list uses a table-row pattern deliberately — the uniformity of cards destroys individual identity.
- **Don't** add heavy intro animations that delay content. The LiquidEther background provides atmospheric motion; page content should be immediately accessible.
- **Don't** reach for purple, gradient-heavy, or neon palettes. The site exists to distinguish itself from AI-generated developer portfolios; those palettes are the reference anti-pattern.
- **Don't** use box-shadows on any surface. Elevation is expressed through tonal stepping, not shadow.
- **Don't** add a second accent colour. The single Deep Crimson accent is load-bearing; introducing a second colour dilutes both.
- **Don't** use `border-left` or `border-right` greater than 1px as a coloured stripe on cards or list items. The 1px left-edge accent on list item hover is a state indicator — it appears only on interaction, not at rest.
- **Don't** write copy that restates the heading. Every sentence must add information the heading did not carry.
