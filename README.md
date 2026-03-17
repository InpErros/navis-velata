# CSULB Sailing Association — Official Website

The official website of the CSULB Sailing Association, built with Next.js and deployed on Vercel.

## Pages

- **Home** — Hero section, club overview, and events preview
- **About** — Club history, mission, fleet, student board, and coaching staff
- **Events** — Google Calendar embed and upcoming event cards
- **Learn to Sail** — Course listings, membership info, and registration CTA
- **Contact** — Discord and Instagram links, and an embedded map to Leeway Sailing & Aquatics Center

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework
- [React 19](https://react.dev/) — UI library
- [Vercel](https://vercel.com/) — Hosting and deployment
- [Vercel Analytics](https://vercel.com/analytics) — Page view tracking
- Google Calendar Embed — Live club calendar
- Google Maps Embed — Location on the contact page

## Fonts & Colors

| Font | Usage |
|------|-------|
| Farro Bold | Logo / nav branding |
| Source Sans 3 | Body text |

| Color | Hex | Usage |
|-------|-----|-------|
| Black | `#000000` | Nav, footer |
| Cerulean | `#006E90` | Page background |
| Amber Honey | `#ecaa00` | CTAs, branding |
| Black Cherry | `#64100F` | Membership banner accent |
| Sky Blue | `#66C8D8` | Footer social links |

## Getting Started

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Branching & Deployment

| Branch | Purpose | URL |
|--------|---------|-----|
| `main` | Production | Live Vercel URL |
| `dev` | Staging / preview | Auto-generated Vercel preview URL |

All development should be done on `dev`. Merge into `main` to deploy to production.
```bash
# Switch to dev for new work
git checkout dev

# Merge to production when ready
git checkout main
git merge dev
git push
```

## Project Structure
```
app/
├── components/
│   ├── NavBar.js       # Responsive nav with CSS-only hamburger
│   └── NavBar.css      # Nav styles and mobile breakpoints
├── about/
│   └── page.js
├── contact/
│   └── page.js
├── events/
│   └── page.js
├── learn-to-sail/
│   └── page.js
├── globals.css         # Global styles, fonts, base resets
├── layout.js           # Root layout, nav, footer
└── page.js             # Home page
public/
├── hero.jpg            # Homepage hero image
├── logo-borderless.png # Boat logo (used in nav + footer)
└── logo.png            # Full logo
```

## Contact

- Instagram: [@sailcsulb](https://www.instagram.com/sailcsulb/)
- Discord: [discord.gg/DYuD3Zs4JE](https://discord.gg/DYuD3Zs4JE)
- Location: Leeway Sailing & Aquatics Center, 5437 E Ocean Blvd, Long Beach, CA 90803