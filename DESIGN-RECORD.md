# Design record

Check this before changing anything visual. Source of rules: landing-page-design skill (Part B).

## Approved
- **Font:** Manrope only (self hosted). Weights 400, 500, 600. No italics, nothing above 700.
- **Text styles:** only the named classes in `assets/css/styles.css` (`heading-*`, `title-*`, `body-*`, `button-*`, `caption-*`). Responsive headings (`hero-title`, `section-title`, `tagline-text`) step between named scale sizes.
- **Colors:** background `#F5F3EE`, surface `#FFFFFF`, ink `#141414`, muted text `#5A5852`, line `#DFDBD2`, accent `#7A4E12`, accent soft `#EFE7DA`, dark sections `#181818`, footer `#000000`. Error `#A32A1C`, success `#1F5A3A`.
- **Spacing:** only 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px (`--s-*` tokens).
- **Radius:** Tailwind steps only. Cards 16, form and hero sheet 24, inputs and buttons 8, nav pill full.
- **Buttons:** padding 8 / 12, radius 8. Primary = ink fill, white text. Secondary = white fill, line border. Hover = color shift, active = scale 0.98, focus = 2px accent ring.
- **Primary CTA label:** "Request a quotation" everywhere. Partner form keeps "Send partnership enquiry".
- **Motion:** `cubic-bezier(0.22, 1, 0.36, 1)`, transform and opacity only, reduced motion respected.
- **Icons:** Phosphor regular (self hosted subset).
- **Messaging:** hero headline, subheadline, benefits, three steps and FAQs as approved on 16 Nov 2026.

## Rejected
- Background gradients, glows, decorative shapes (gradient allowed on hero heading text only).
- Stock or AI product photos; any photo that is not the real business.
- Testimonials, ratings, client logos, brand names, years in business, delivery promises, statistics: none until the owner supplies them.
- Showing disabled or "to be added" contact buttons on the live site. Unconfigured contact routes are hidden instead.
- Repeating the same bordered card grid for every section. Cards are reserved for clickable or grouped items (segments, forms, FAQ, contact).
- Varying the primary CTA wording ("Get quote", "Request a quote", "Send a requirement").
- A second typeface or an uppercase tracked eyebrow style.

## Change log
- Audit pass 1: hero and CTA system, about, product categories, benefits, how it works.
