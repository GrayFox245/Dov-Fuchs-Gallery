# Visibility and Mobile Plan

## Purpose

The desktop gallery remains the primary authored experience: an immersive 3D digital art environment. The supporting layers make the project easier for crawlers, AI systems, curators, mobile visitors, and institutional readers to understand without replacing the gallery.

## Mission 1: AI, Crawler, and Institutional Visibility

Current limitation: the main experience is rendered by JavaScript and WebGL, so many indexing systems see little more than a canvas and a few controls. They may not understand the artist, series, current exhibition, CV, contact information, or selected works.

Implemented first layer:

- OpenGraph and Twitter preview metadata.
- Canonical URL and search-indexing hints.
- JSON-LD structured data for the site, artist, and series.
- Conventional HTML pages:
  - About
  - Artist Statement
  - Series
  - Selected Works
  - CV
  - Contact
- `robots.txt` and `sitemap.xml`.
- `netlify.toml` with static publish settings.

Recommended next layer:

- Enable Netlify Prerender or prerender.io if AI/crawler visibility still appears weak after deployment.
- Add a custom domain before serious external outreach, then update canonical URLs, OpenGraph URLs, and sitemap URLs.
- Submit the sitemap to Google Search Console after the final domain is selected.

## Mission 2: Mobile-Native Gallery

Current limitation: the desktop free-flight interface is too dense for phones. Small screens, touch controls, slower GPUs, and limited attention make the desktop gallery feel like a distorted version of itself.

Implemented first layer:

- A mobile-only guided gallery appears on small screens.
- The mobile layer presents:
  - Current exhibition
  - Selected current works
  - Series library
  - Office documents
  - Contact and selected works links
- Desktop visitors continue to receive the immersive 3D gallery.

Recommended next layer:

- Add a richer mobile series viewer with swipe navigation through all images in each series.
- Add a guided curator path: current exhibition, image of the month, other series, artist info, contact.
- Add lower-resolution mobile image variants for faster loading.
- Consider a visible "Enter immersive 3D version" option only after touch navigation is stable.

## Risks and Tradeoffs

- Prerendering helps crawlers but can introduce stale snapshots if not configured carefully.
- A mobile-native layer is more maintainable than forcing WebGL flight on phones, but it means mobile and desktop become two related experiences rather than one identical interface.
- The current static HTML pages are deliberately restrained; they improve discoverability, but they should eventually inherit more polished copy and page-specific previews.
- Image weight remains the largest performance risk. Mobile optimization will eventually require compressed derivatives.
