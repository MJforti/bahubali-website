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
