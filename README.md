# Fahim Fardin — Personal Portfolio

A responsive, custom-built personal portfolio created from Fahim Fardin's supplied LaTeX résumé. The visual direction was inspired by the sidebar-based portfolio references, but **the HTML, CSS, JavaScript, illustrations, and layouts here are original**, not modified copies of the commercial templates.

## Preview locally

For the simplest preview, open `index.html` in a modern browser. No npm install or build step is required.

For a full local web-server preview (recommended), run this command in the project folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000/.

## Publish for free

### GitHub Pages
1. Create a public GitHub repository, e.g. `fahim-portfolio`.
2. Upload **all files and folders**, keeping `index.html` at the repository root.
3. In GitHub, go to **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select the `main` branch and `/ (root)`, then Save.
5. GitHub Pages will provide a live URL for your website.

### Netlify
Upload this folder to Netlify using its manual deploy feature. There is no build command or output folder.

## Files

- `index.html` — content and page structure.
- `assets/css/styles.css` — responsive layout, components, colour themes.
- `assets/js/script.js` — project filters, mobile navigation, theme switch, certificate expansion, clipboard copy.
- `assets/img/` — SVG site icon, social-sharing preview, and a publishable `uploads/images.json` image manifest.
- `assets/resume/Fahim_Fardin_Resume.pdf` — downloadable résumé generated from the supplied LaTeX document.
- `assets/resume/Fahim_Fardin_Resume.tex` — public-facing LaTeX résumé source (sensitive contact fields removed).

## Content notes

- All personal, university, project, experience, certification, and contact details come from the supplied `main.tex`.
- The illustrations in the project cards are **conceptual UI artwork**, not actual screenshots of the linked projects. They are deliberately not presented as real product screenshots.
- The supplied UY LAB Figma certification used an `example.com` placeholder URL. Its listing is included without a misleading verification link. Replace it once you have a real certificate link.
- For privacy, the public page includes **Dhaka, Bangladesh** rather than your precise home address or telephone number. Private references and referees' contact information are also omitted from the public site; the résumé itself remains as supplied.
- The displayed shop prices, seats, interface labels, and appointment dates are fictional *design elements* within illustrations and are **not product data**.
- No contact-form backend is claimed. The Email button opens the visitor's default mail client, and the Copy button copies your email where clipboard access is supported.
- The site uses Google Fonts when available; system-font fallbacks keep it readable offline.

## Customize

- Change the hero message, biography, and projects directly in `index.html`.
- Update portfolio accent colours in `:root` inside `assets/css/styles.css`.
- Replace the PDF in `assets/resume/` after changing the résumé.
- Use the Image Studio described below to add your own profile photo and project screenshots.

## Accessibility

Semantic sections and nav landmarks, a skip link, accessible button labels, responsive mobile menu, keyboard support, reduced-motion preferences, functional external links, and accessible filter status are included.


## Animation update (v1.1)

This edition adds small, dependency-free motion effects:

- Staggered hero entrance and soft glowing/rotating code illustration
- One-time scroll reveals and staggered statistics/education tiles
- Animated CGPA/project counters (actual values preserved)
- Mouse-responsive project-card highlights and subtle hover effects
- Smooth filter transitions and a thin page-scroll progress bar
- Automatic `prefers-reduced-motion` support; everything remains usable with motion disabled

All animation is implemented in `assets/css/styles.css` and `assets/js/script.js`.
No animation libraries, additional web fonts, or external scripts are required.

## Project update (v1.2)

Four requested projects are featured first: **The Royal Spice**, **CityCare Hospital**, **ZenBlog**, and **Hotel Booking System**. The original Doctor Appointment Scheduler, Online Super Shop, and Movie Ticket Booking projects remain below. The portfolio now shows **7** cards with updated counters and technology/category filters.

The Royal Spice details were checked against `fahim-fardin-1045/The-Royel-Spice` (Flask, MySQL, restaurant ordering + POS; the repository calls it a development MVP). ZenBlog and Hotel Booking descriptions were corrected to match their respective repository READMEs. **CityCare Hospital's technical stack and implemented features could not be verified**, because the likely associated `fahim-fardin-1045/hospital-management-system` repository has no accessible README. Its card is therefore intentionally labelled generically and links to that repository. Confirm or replace that URL if you meant a different CityCare project. All new preview illustrations are **conceptual artwork with fictional sample labels and figures**, not real screenshots or verified project metrics.

## Image upload and management (v1.3)

**New:** Upload a profile picture and a custom screenshot for every one of the seven projects. The existing illustrations remain as the default until you replace them.

### Open the image editor

1. Start a local server inside this portfolio folder: `python -m http.server 8000`.
2. Open **http://localhost:8000/?edit=1** in your browser. (`?edit=1` is the *editor-view toggle*.)
3. In the sidebar click **Manage images**, or click a camera button on your profile picture or a project card.
4. Upload or drag-and-drop a **JPG, PNG or WebP** image (maximum 10 MB each).
5. See the new photo/screenshot directly in the portfolio. Use **Remove** to restore its original appearance.

The browser scales down large pictures and optimizes them, then stores your selections using IndexedDB **in that browser on that origin**. Refreshing that page should preserve the edits as long as that browser permits site storage. Browser settings, storage clearing, and moving the site to a new domain/origin may remove these unpublished local changes.

### Publish the images for everyone

A static HTML site has no image upload server. **Your edits are not public until you export and deploy them.**

1. After making changes, open **Manage images** and click **Download publishing file**.
2. A file called `images.json` will download. It contains optimized image data for all the current images.
3. In your local website folder, replace **`assets/img/uploads/images.json`** with your downloaded copy. (The folder and an empty starter JSON file are already included.)
4. Preview with a local web server, then push/upload the modified file with the rest of the website to GitHub Pages, Netlify, or your hosting provider.
5. Visitors now see your custom pictures automatically. They don't see the edit buttons unless they deliberately add `?edit=1` to the URL; even then, any edits are confined to their own browser and cannot modify your published website.

The exported JSON contains actual encoded image data. **Do not export or publish private photos.** The viewer page still needs its local CSS/JS and all the original project files; `images.json` is not a complete website export. To back up your unpublished changes, also save that JSON file somewhere safe.

### Image dimensions and appearance

- Profile photos: square images are recommended (e.g., 800 × 800 px). The site crops them into a circle/rounded-square frame depending on device.
- Project screenshots: 16:9 or a wide 1200 × 675 px image is recommended; the site uses `object-fit: cover`, so edges can be cropped.
- JPG, PNG, WebP supported, max **10 MB** per incoming file. Processed files are converted to WebP or JPEG depending on browser support. SVG is intentionally not accepted as an uploaded file.
- The website does not upload any files to an external service or server. All editing is client-side and can work without an account.
- `?edit=1` is an editor toggle, **not** a password or an authenticated admin area. It is intentionally browser-local for a static site.
