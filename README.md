# Anh Ha Portfolio

A responsive, accessible static portfolio for Anh Ha, Application Developer. The site
uses plain HTML, CSS, and JavaScript and does not require a build step.

## Run locally

Open `index.html` directly, or serve the folder with any static web server:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy

Upload the complete folder to GitHub Pages, Netlify, Cloudflare Pages, or any static host. Keep the folder structure unchanged so the image and résumé links continue to resolve.

## Included

- Responsive desktop project grid and mobile project carousel with momentum projection + spring settling
- Six complete project cards with optimized WebP images and PNG fallbacks
- Responsive hero portrait with gradient treatment
- Motion-based hero word morph with a static reduced-motion fallback
- Compact technical toolkit with staggered card accents
- One-time scroll reveals plus Motion-powered press, magnetic, tilt, and shared-element interactions
- Résumé download
- Accessible navigation, announced form errors, external-link labels, and reduced-motion support
- Contact form submission through Web3Forms
- Canonical, Open Graph, structured-data, favicon, robots, and sitemap metadata


## Motion layer

The visual identity keeps the original warm palette (`#faf2e6`, `#fffaf3`, `#3a2317`, `#7a4f38`). Motion is added as progressive enhancement through Motion 13.1.0's vanilla JavaScript bundle; the portfolio still works if the library cannot load.

Implemented motion primitives:

- Hero text morph (`opacity` + small vertical offset + blur, then spring settle)
- Immediate press feedback for primary controls
- Restrained magnetic pull on the main hero CTA
- Pointer-driven project-card tilt with critically damped spring return
- Project-details shared-element dialog that expands from and returns to its source card
- Desktop mouse-drag carousel handoff using recent pointer velocity, momentum projection, and spring settling
- Reduced-motion, reduced-transparency, and increased-contrast fallbacks

Motion is pinned in `index.html` to:

```html
<script src="https://cdn.jsdelivr.net/npm/motion@13.1.0/dist/motion.js" defer></script>
```

## Project structure

```text
.
├── index.html
├── styles.css
├── app.js
├── Anh-Ha-Resume.pdf
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── img/
```

## Before deploying

- Confirm every external repository is publicly accessible in a logged-out browser.
- The Fitness Assistant university repository currently requires sign-in and is labeled as restricted on the site.
- Configure Web3Forms domain restrictions and spam protection for the production domain.
- Test the contact form after deployment.
- Update the canonical, Open Graph, robots, and sitemap URLs if the domain changes.

The canonical URL and social metadata currently target:

`https://quanganhha1997.github.io/tranquha-portfolio/`

Update those URLs in `index.html`, `robots.txt`, and `sitemap.xml` if the production domain changes.
