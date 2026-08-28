# Anh Ha Portfolio

A responsive personal portfolio focused on application development, data, cloud, security, and AI work.

## Highlights

- Consistent warm, minimal visual system across the hero, experience, projects, and contact sections.
- Motion.dev is loaded as an optional ES module and powers stronger, replayable viewport reveals, section handoff transitions, scroll-linked image parallax, and the experience timeline. Project cards use a layered mask reveal, 3D spring-settling media, and staggered details. Reveals reset after leaving the viewport and replay when you scroll back to them. Navigation, form handling, scroll progress, and image fallbacks remain functional if the animation CDN is unavailable.
- Technical skills are grouped into Languages, Web & APIs, and Data & Cloud.
- Six responsive project cards with optimized imagery and accessible interactions.
- Reduced-motion, high-contrast, keyboard-focus, and responsive-navigation support.

## Structure

- `index.html` — semantic page content
- `styles.css` — visual system and responsive layout
- `app.js` — navigation, accessible mobile-menu state, scroll progress, typewriter, image fallbacks, and contact form
- `motion.js` — optional Motion.dev reveals, timeline animation, section transitions, and parallax
- `img/` — optimized portfolio imagery
- `Anh-Ha-Resume.pdf` — downloadable résumé

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. No build step is required. Motion.dev 13.1.1 is loaded from jsDelivr, and the contact form uses Web3Forms.

## Deploy to GitHub Pages

The included GitHub Pages workflow publishes the exact contents of the `main` branch, so the public site and repository cannot silently drift apart.

1. Put these files at the root of the `tranquha-portfolio` repository.
2. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Commit and push to `main`, or run the workflow manually from the **Actions** tab.
4. After deployment, view the public page source and confirm this marker is present:

   ```html
   <meta name="portfolio-version" content="2026-08-26-project-motion" />
   ```

The essential navigation and contact-form code is local. If the optional Motion.dev module fails to load, content remains visible and the core experience remains usable.
