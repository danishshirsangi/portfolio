# Danish Shirsangi — Portfolio

A personal website for sharing things I build, freelance services, and a little about me. Built with React, Vite, and GSAP, with a prismatic flare hero, scroll-triggered reveals, and an editorial layout.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Deploy

The portfolio deploys to GitHub Pages at `https://danishshirsangi.github.io/danish-portfolio/` when changes are pushed to `main`. GitHub Actions builds the Vite site and publishes the `dist` folder.

The hero uses a CSS prism and lens flare, pointer-responsive light, and a reduced-motion fallback. GSAP ScrollTrigger reveals copy and scales cards into view as they enter the viewport. Project cards expand to show grounded details and link to their GitHub repositories.
