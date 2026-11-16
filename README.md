# Bahubali Enterprise website

Static landing page for Bahubali Enterprise (hardware and building materials, Bijoynagar, Assam). Plain HTML, CSS and JavaScript with no build step.

## Files

| File | Purpose |
|---|---|
| `index.html` | The landing page |
| `privacy.html`, `terms.html` | Legal pages (starting drafts, please review) |
| `404.html` | Branded not found page |
| `assets/js/config.js` | **Your contact details and form settings. Edit this first.** |
| `assets/js/main.js` | Navigation, forms, WhatsApp links, animations |
| `assets/js/store3d.js` | Interactive 3D storefront in the hero (CSS 3D, no library) |
| `assets/css/styles.css` | All styles |
| `assets/fonts`, `assets/img` | Self hosted Manrope and Phosphor icon fonts, favicon, share image |

## Before going live

Open `assets/js/config.js` and fill in:

1. `phone`: enables every Call button (`tel:` links)
2. `whatsapp`: enables every WhatsApp button with a pre-filled message
3. `email`, `address`, `hours`: shown in the contact section
4. `web3formsKey`: free key from web3forms.com so forms are emailed to you. Without it, forms hand the enquiry to WhatsApp.
5. `mapEmbed`: in Google Maps choose Share, Embed a map, and paste the `src` URL so the pin is exact.

Until `phone` and `whatsapp` are set, those buttons appear disabled.

## Photos

`assets/img/photos/` holds nine AI generated illustrative category photos, each cropped to remove the generator watermark and saved as WebP at 800 and 1600px. They show generic materials, not the Bahubali premises or stock. To replace one, overwrite `NAME-800.webp` and `NAME-1600.webp` with a 3:2 image of the same name. Real photos of your own stock or premises will build more trust than generated ones.

## 3D storefront

The hero shows the real Bahubali Enterprises storefront as a 3D model visitors can turn by dragging (mouse or touch) or with the arrow keys. It is built in `assets/js/store3d.js` from layers cut out of the storefront photo in `assets/img/store/`: the stand off lettering, the 12 category boards, the signboard box, the Assamese banner and the shop front. It uses CSS 3D transforms, so it adds about 10 KB of script and no 3D library. It pauses when off screen, stops its idle sway for visitors who prefer reduced motion, and falls back to the flat photo on browsers without 3D support. A sharper, higher resolution storefront photo would make the model crisper.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy

Any static host works. Publish directory is the repository root, with no build command.

- **Netlify**: Add new site, Import from Git, pick this repository, leave build command empty, publish directory `.`
- **Vercel**: New project, import this repository, framework preset "Other", no build command
- **GitHub Pages**: Settings, Pages, deploy from branch, root folder

After connecting a domain, set `og:image` in `index.html` to the full URL of `assets/img/og-image.png` and add the site link to the Google Business Profile.
