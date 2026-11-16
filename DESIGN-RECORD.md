# Design record

Check this before changing anything visual. Base rules: landing-page-design skill (Part B). Direction: premium industrial corporate (graphite, stone, amber).

## Approved
- **Font:** Manrope only (self hosted). Weights 400, 500, 600. No italics, nothing above 700.
- **Text styles:** only the named classes in `assets/css/styles.css` (`heading-*`, `title-*`, `body-*`, `button-*`, `caption-*`). Responsive headings (`hero-title`, `section-title`, `tagline-text`) step between named scale sizes.
- **Colors:**
  - Light: background `#F5F3EE`, stone sections `#ECE8DF`, surface `#FFFFFF`, ink `#181818`, muted `#57544D`, hairlines `#D9D3C7`.
  - Dark (skill palette only): `#181818`, `#1F1F1F`, `#272727`, `#313131`, footer `#000000`; muted text on dark `#A9A49A`.
  - Accent: industrial amber `#D08A2E` for fills and accents on dark, hover `#E19B3F`; `#8A520F` for accent text on light.
  - States: error `#A32A1C` (light) / `#FF8A7A` (dark), success `#1F5A3A` / `#7FD1A0`.
- **Spacing:** only 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px (`--s-*` tokens); larger offsets are sums of tokens.
- **Radius:** small and square leaning. Buttons, inputs, tiles, panels 4px; header bar, form panels and mobile bar 8px; only process markers and FAQ toggles are round.
- **Buttons:** 8 / 12 padding, 40px min height; `btn-lg` 12 / 24 padding, 48px. Accent = amber fill with graphite text (primary action). Dark = graphite fill. Outline = ink border. Ghost dark = for dark surfaces. Arrow icon slides 4px on hover, active scale 0.98, 2px focus ring.
- **Primary CTA label:** "Request a quotation" everywhere. Secondary hero CTA: "Explore products". Links to the partner form: "Become a partner"; its submit: "Send partnership enquiry". Catalogue tiles: "Enquire".
- **Section rhythm:** light, stone and graphite sections alternate. Kicker line (24px amber rule + caption) above each section title. Lists separated with full width hairlines, never one sided card borders.
- **Motion:** `cubic-bezier(0.22, 1, 0.36, 1)`, transform and opacity only, reduced motion respected.
- **Icons:** Phosphor regular (self hosted subset).
- **Photography:** only realistic, licensed or owner supplied photos, listed in `SITE.photos` (config.js). Without a photo a category shows a graphite icon panel.
- **Messaging:** hero headline "Building better foundations. Supplying every requirement." with the approved supporting text; benefits, steps and FAQs as approved.

## Rejected
- Background gradients, glows, decorative shapes (gradient allowed on hero heading text only).
- AI or stock images presented as the real Bahubali premises, staff or stock; any image with text or logos.
- Testimonials, ratings, client logos, brand names, years in business, delivery promises, statistics: none until the owner supplies them.
- Disabled or "to be added" contact buttons. Unconfigured contact routes are hidden.
- Large rounded cards and pill buttons (generic SaaS look).
- Varying the primary CTA wording.
- Two full forms open back to back. The partner form stays closed until asked for.
- Repeating the hero headline in the final CTA. Check mark bullet lists inside cards.
- A second typeface or uppercase tracked labels.

## Change log
- Audit pass 1: hero and CTA system, about, product categories, benefits, how it works.
- Audit pass 2: who we serve, quote and partner forms, FAQ, contact, final CTA.
- Redesign: premium industrial direction. Graphite header bar, split hero with materials index, photo ready catalogue with two feature tiles, dark numbered benefits, process timeline, dark quotation form, amber final CTA, four column footer, sitemap.
