# Guerroudj Abdennour — Ultra 3D Portfolio (Next.js 14)

Immersive, ultra-polished portfolio rebuilt from a static site into **Next.js 14 + Three.js + Framer Motion + Tailwind**.

## ✨ Highlights

- **Real-time 3D hero**: React Three Fiber starfield, wireframe icosahedron core, orbit rings + floating particles with mouse parallax
- **Cinematic UI**: preloader, cursor glow, scroll progress, aurora blobs, grid + noise overlays, glassmorphism everywhere
- **3D tilt project cards** with glare highlight, animated filtering, featured badges
- **Animated sections**: stats, expertise grid, skill bars, alternating certification timeline, validated contact form
- **Performance**: static prerendered (`/ 57kB`), dynamic-imported WebGL, responsive + mobile menu

## 🧱 Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind 3 · Three.js / @react-three/fiber / drei · Framer Motion · Lucide

## 🚀 Run

```bash
npm install
npm run dev
# → http://localhost:3000
```

```bash
npm run build
npm start
```

## 📁 Structure

```text
app/            → layout, page, globals.css
components/     → Preloader, CursorGlow, Navbar, Hero, HeroCanvas, Marquee, Projects, About, Timeline, Contact, Footer
data/           → portfolio.ts (projects, skills, timeline, profile)
public/         → assets (images, cv.pdf), certificates, favicon
```

## 📦 Deploy

Works on Vercel / Netlify / any Node host:

```bash
npm run build
```

## 👤 Author

**Guerroudj Abdennour** — AI Engineer & Full-Stack Developer
- Email: abdennour.guerroudj@ensia.edu.dz
- GitHub: https://github.com/newabdennour
- LinkedIn: https://www.linkedin.com/in/abdennour-guerroudj/
