# Design System: Spotify Web Player

## 1. Visual Theme & Atmosphere

Spotify Web Player presents a dark, immersive, media-first interface built around rapid browsing and instant recognition of music content. The experience feels more like a native entertainment application than a traditional marketing website.

- Overall feeling: Observed: cinematic, modern, high-energy, and highly brand-recognizable through dark surfaces plus green accent.
- Visual density: Observed: moderately dense; the shell packs navigation, search, and multiple content rails into a compact viewport without feeling cluttered.
- Brand posture: Observed: mainstream, confident, entertainment-led, and utility-focused for repeat listening.
- Signature motifs: Observed: near-black backgrounds, white text, Spotify green accent, pill-shaped controls, square album art, circular artist imagery.

### Key Characteristics

- Dark-first, app-like environment
- Image-led browsing through repeated content rails
- High-contrast typography with minimal decoration
- Rounded controls against mostly flat, rectilinear content framing

## 2. Color Palette & Roles

| Role | Semantic Name | Value | Usage |
| --- | --- | --- | --- |
| Primary action | Spotify Green | #1ED760 | Brand accent, active highlights, positive emphasis, and key moments of interaction |
| Accent | Pure White | #FFFFFF | High-contrast CTA fills, text, logo rendering, and strong emphasis |
| Surface | Deep Charcoal | #121212 | Primary application background and dark shell foundation |
| Text | Pure White | #FFFFFF | Primary text on dark backgrounds |
| Border | Carbon Surface | #1F1F1F | Tonal separation for controls and recessed surfaces |

### Primary

- Observed: Spotify Green `#1ED760` is the clearest brand color and should be used sparingly for emphasis rather than flooding large surfaces.
- Observed: Deep Charcoal `#121212` defines the default app canvas and establishes the immersive dark mode.

### Interactive

- Observed: Inputs use `#1F1F1F` with white text and a fully rounded silhouette.
- Evidence note: Firecrawl captured link color `#0000EE`, but the product UI is likely visually restyled away from default browser-blue links; treat `#0000EE` as low-confidence for polished interface links.

### Neutral Scale

- Observed: Deep Charcoal `#121212` for the global background
- Observed: Carbon Surface `#1F1F1F` for search/input-style controls
- Observed: Muted Gray `#B3B3B3` for lower-emphasis button text and likely secondary text
- Observed: Warm Neutral `#9D968E` as a subdued secondary brand neutral
- Observed: Pure White `#FFFFFF` for primary text and high-contrast UI elements

### Surface & Overlay

- Observed: Base surface is `#121212`, with darker or slightly lighter tonal panels used to separate navigation and controls.
- Reasonable inference: Overlays and hover states likely rely on tonal brightening rather than translucent color washes or heavy shadows.

### Theme Modes

The captured evidence supports a dark-first system only.

#### Light Mode

- Background: Not evidenced
- Surface: Not evidenced
- Text: Not evidenced
- Accent: Not evidenced
- Notes: No light theme support was provided in the source evidence. Do not assume a parallel light palette unless separately verified.

#### Dark Mode

- Background: `#121212`
- Surface: `#1F1F1F`
- Text: `#FFFFFF`
- Accent: `#1ED760`
- Notes: This is the primary observed theme mode and should be treated as canonical for recreation.

### Shadows & Depth

- Observed: Buttons and inputs use no shadow.
- Reasonable inference: Cards rely on tonal contrast, spacing, and imagery rather than elevation effects.
- Reasonable inference: Focus should remain high-contrast and accessible, but exact ring color was not captured.

## 3. Typography Rules

Spotify’s typography is functional, compact, and built for scanning. The system favors readable UI text over expressive editorial type, with branding carried more by the font family and the dark/green palette than by oversized headlines.

### Font Family

- Primary: `SpotifyMixUI`, `CircularSp-Arab`, `CircularSp-Hebr`, `CircularSp-Cyrl`, `CircularSp-Grek`, `CircularSp-Deva`, `Helvetica Neue`, `helvetica`, `arial`, `Hiragino Sans`, `Hiragino Kaku Gothic ProN`, `Meiryo`, `MS Gothic`
- Monospace: Not evidenced
- OpenType Features: Not evidenced

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Hero headline | Spotify/Circular stack | Not evidenced | Not evidenced | Not evidenced | Not evidenced | The sampled page is interface-led rather than hero-led |
| Section heading | Spotify/Circular stack | 24px | Reasonable inference: 700 | Reasonable inference: tight to standard | Normal | Closest observed heading scale from Firecrawl typography |
| Body | Spotify/Circular stack | 14px | Reasonable inference: 400–500 | Reasonable inference: comfortable UI line height | Normal | Used for navigation, metadata, and dense browsing text |
| Label / Eyebrow | Spotify/Circular stack | 16px | Reasonable inference: 600–700 | Standard | Normal | Firecrawl captured `h1` at 16px, likely representing interface labels more than marketing headers |
| Caption / Meta | Spotify/Circular stack | Reasonable inference: 12–14px | Reasonable inference: 400–500 | Standard | Normal | Artist labels, supporting metadata, and card subtext |

### Principles

- Observed: Favor compact, highly legible UI typography over display-driven type.
- Observed: Keep text contrast high against the dark background.
- Reasonable inference: Use weight changes and spacing rhythm more than color variety to create hierarchy.

## 4. Component Stylings

### Buttons and Links

- Primary CTA: Observed: pill-shaped controls with very large radii. Firecrawl captured a black pill button `#000000` with muted text `#B3B3B3`, but this appears context-specific rather than a universal CTA style.
- Secondary CTA: Observed: a white pill button `#FFFFFF` with black text `#000000`, likely used for sign-up or auth emphasis in the top chrome.
- Text links: Observed: navigation and media metadata are heavily link-based; links likely inherit white or muted tones in the polished UI rather than browser default blue.
- Hover and active feel: Reasonable inference: subtle tonal lift, stronger text contrast, and green accent for selected or actively playing states.

### Cards and Containers

- Surface style: Observed: image-forward cards dominate, especially album, artist, and radio modules.
- Radius: Observed: cards appear visually flatter than controls; imagery is square for albums and circular for artists.
- Border: Observed/inferred: minimal visible borders; separation comes from spacing and tone.
- Shadow or elevation: Observed: no explicit shadow on sampled controls; cards likely stay mostly flat.
- Internal spacing: Observed/inferred: compact and rhythmic, likely multiples of the 6px base unit.

### Inputs and Interactive Controls

- Input treatment: Observed: `#1F1F1F` background, `#FFFFFF` text, no shadow, fully rounded `500px` radius.
- Focus behavior: Reasonable inference: strong accessible contrast rather than decorative glow.
- Selection states: Reasonable inference: Spotify Green `#1ED760` marks active, selected, or playing-related emphasis.

### Navigation

- Structure: Observed: app shell with Spotify logo, search prompt, utility links, install action, auth actions, and content sections beneath.
- Background treatment: Observed: dark chrome on dark background with tonal separation.
- Link style: Observed: compact text links, utility-first, likely medium-weight and tightly spaced.
- Sticky or scroll behavior: Reasonable inference: navigation is persistent or semi-persistent to support browsing and playback context.

### Image Treatment

- Screenshot treatment: Observed: cover art and artist imagery are the primary content visuals.
- Photography or illustration style: Observed: real album covers, artist photos, and branded radio art; no decorative illustration system was evidenced.
- Border and radius treatment: Observed: album covers are square; artist imagery is circular; edges are clean without ornamental framing.

### Distinctive Components

- Horizontal recommendation rails with repeated card modules
- Pill-shaped search/input control embedded into navigation
- Mixed-shape media imagery system: square albums, circular artists, branded playlist/radio covers

## 5. Layout Principles

### Spacing System

- Base unit: 6px
- Repeated spacing values: 6px, 12px, 18px, 24px, 36px, and larger multiples as sections expand

### Grid & Container

- Grid logic: Observed: application shell with stacked content sections, each containing repeated card layouts or horizontal rails
- Max content width: Not evidenced
- Section spacing: Observed/inferred: consistent vertical separation between major content groups such as Trending songs, Popular artists, and Popular albums and singles

### Whitespace Philosophy

- Whitespace philosophy: Compact but not cramped; whitespace is used to separate modules rather than create airy editorial layouts.
- Alignment tendencies: Strong left alignment for headings, metadata, and navigation labels
- Content width behavior: Reasonable inference: shell uses a full-width application canvas with bounded content lanes and gutters

### Border Radius Scale

- Micro: 0px
- Standard: 0px to minimal rounding for non-control surfaces
- Large: 50% / circular treatment for artist imagery
- Pill: 500px to 9999px for inputs and buttons

## 6. Depth & Elevation

| Level | Treatment | Use |
| --- | --- | --- |
| Flat | `#121212` and adjacent tonal surfaces, no shadow | Main app background, most panels, media browsing areas |
| Ring | Tonal separation via `#1F1F1F` or contrast edge | Inputs and recessed controls |
| Card | Mostly flat, image-led blocks with spacing-defined grouping | Albums, artists, playlists, radio items |
| Focus | Not directly evidenced; likely high-contrast outline or tonal emphasis | Keyboard navigation and accessible interaction states |

### Depth Principles

- Surface hierarchy: Observed: depth is created primarily through dark tonal layering, not shadow stacks.
- Shadow language: Observed: effectively absent in sampled button/input components.
- Blur, glass, or overlay behavior: Not evidenced.
- When depth is used versus avoided: Use depth sparingly for interaction clarity; avoid floating-card aesthetics that conflict with Spotify’s flatter app-shell feel.

## 7. Do's and Don'ts

### Do

- Use a dark-first foundation with strong white text contrast.
- Use Spotify Green `#1ED760` as a focused accent, not as the dominant page fill.
- Favor pill controls, media-led cards, and consistent, compact spacing.

### Don't

- Don’t introduce soft pastel palettes, bright multicolor gradients, or light-theme assumptions without evidence.
- Don’t rely on heavy shadows, glassmorphism, or layered floating panels.
- Don’t over-round every container; reserve strong rounding for controls and circular media types.

## 8. Responsive Behavior

### Breakpoints

The exact breakpoints were not provided in the Firecrawl evidence. The values below are reasonable implementation inferences for recreating the behavior.

| Name | Width | Key Changes |
| --- | --- | --- |
| Mobile | < 768px (inference) | Navigation compresses, content rails become narrower or more swipe-oriented, spacing tightens |
| Tablet | 768px–1023px (inference) | More cards visible per row, nav utility items partially expanded |
| Desktop | 1024px+ (inference) | Full app shell, broader content lanes, more simultaneous rails and utility links visible |

### Touch Targets

- Keep pill buttons and search controls large enough for easy tapping.
- Preserve clear spacing between adjacent media cards so album art remains individually tappable.

### Collapsing Strategy

- Desktop behavior: Persistent shell with visible utility links, search, and multiple cards per section row.
- Tablet behavior: Same structure with reduced card count per row and tighter gutters.
- Mobile behavior: Stack shell elements more aggressively and lean on horizontal scrolling content rails.
- Breakpoint-driven component changes: Search, auth actions, and utility links should collapse before content identity does.
- Touch target and spacing adjustments: Increase hit clarity even if text and gutters become more compact.

## 9. Agent Prompt Guide

### Quick Color Reference

- Primary CTA: `#FFFFFF` fill with `#000000` text for high-contrast auth-style pills; brand accent remains `#1ED760`
- Background: `#121212`
- Heading text: `#FFFFFF`
- Body text: `#B3B3B3` to `#FFFFFF` depending emphasis
- Border or ring: `#1F1F1F`
- Accent: `#1ED760`

### Quick Summary

Build the interface as a dark, immersive, music-first application shell.  
Use `#121212` as the main background and `#FFFFFF` for primary text.  
Reserve Spotify Green `#1ED760` for active or branded emphasis, not for broad surfaces.  
Favor pill-shaped search and auth controls with no shadow.  
Use compact typography in the Spotify/Circular-style font stack.  
Structure the page as stacked recommendation rails with image-led cards.  
Keep cards mostly flat and let spacing plus tonal contrast define hierarchy.

### Example Component Prompts

- Hero: Create a dark app-shell header for a music player with Spotify branding, a pill search control, utility links, and compact white typography on `#121212`.
- Card: Design a flat dark media card with square album art, white title text, muted metadata, tight spacing, and no visible shadow.
- Navigation: Build a persistent dark navigation bar with logo, search, utility links, and pill auth buttons using white, black, and Spotify green accents.
- Button or badge: Create a fully rounded pill button with high contrast, minimal styling, no shadow, and crisp UI typography.

### Ready-to-Use Prompt

Design a Spotify-like dark music web player interface using `#121212` backgrounds, `#FFFFFF` text, `#1F1F1F` control surfaces, and `#1ED760` accent highlights. Use compact Spotify/Circular-style typography, pill-shaped search and buttons, flat media cards, square album art, circular artist imagery, and a dense but clean app-shell layout with stacked recommendation rails.

### Iteration Guide

1. Start with tonal hierarchy and spacing before adding accent color.
2. Use green only for active emphasis after the dark/white foundation is working.
3. If the UI feels too soft or too elevated, remove shadows and simplify surfaces.

## Optional Appendix: Interaction Patterns

- Scroll behavior: Observed/inferred: vertical page flow with repeated content rails; horizontal scanning is central within media groups.
- Hover behavior: Reasonable inference: subtle brightness increase, stronger text contrast, and contextual affordances over cards.
- Click behavior: Observed: most content units are linkable, including titles, artists, albums, playlists, and navigation items.
- Animation tone: Reasonable inference: quick, restrained, utility-focused rather than playful or elastic.

## Optional Appendix: Content & Messaging Patterns

- Headline pattern: Observed: straightforward sectional labeling such as “Trending songs,” “Popular artists,” and “Popular albums and singles.”
- CTA language: Observed: short, direct utility actions like “Install App,” “Sign up,” “Log in,” and “Show all.”
- Trust signal pattern: Observed: brand familiarity, large content inventory, and recognized artists function as trust cues more than testimonial blocks.
- Voice and tone: Observed: modern, mainstream, confident, and task-oriented.

## Optional Appendix: Observed Pages

- `https://open.spotify.com/`: Provided the dark theme, nav structure, search prompt, auth actions, content-rail organization, and image-led card patterns for songs, artists, albums, and radio.