# ADERION STUDIOS — Official Static Web Platform

**Type-Safe Modern Gaming Portal · Zero-Backend · TypeScript-Only · Production-Ready**

---

## 1. Project Overview

**Aderion Studios** is an open-source, type-safe, 100% static web platform built for independent game development. Engineered with modern responsive bento-grid layouts, hardware-accelerated celestial background atmospheres, and zero server-side dependencies, it delivers blazing fast performance and airtight security for deployment across static CDNs, Apache/cPanel (`public_html`), Nginx, or GitHub Pages.

---

## 2. Core Architectural Principles

* **Zero-Backend (100% Static Delivery):** Pure **HTML5**, modern **CSS3**, and compiled **ES2020 JavaScript** (`assets/js/`). No runtime server engines (PHP, Node.js, databases) are required in production, ensuring near-instant Time to First Byte (TTFB) and zero server attack surfaces.
* **TypeScript-Only Policy:** Client-side source logic is maintained under `src/ts/` with strict type guarantees and compiled to `assets/js/` via `tsc`. Direct handwritten JavaScript in `src/` is prohibited and caught by CI guardrails.
* **Bilingual Localization (TR / EN):** Intelligent locale detection (`navigator.language` / `Intl.DateTimeFormat`) automatically defaults to Turkish for Turkish locales and English for all international visitors, with instant manual toggle and persistence in `localStorage`.
* **Dynamic Discord Integration:** Live Discord member cards with custom banners, avatars, badges, and theme-adaptive high-contrast speech bubbles (`bubble_tr`, `bubble_en`) generated from `data/credits.json`.
* **Atmospheric CSS Design System:** Hardware-accelerated radial glow orbs (`#3c4667`, `#232b47`, `#181820`) running on pure CSS gradients and backdrop filters with zero image assets and zero JavaScript overhead.
* **Universal Cross-Platform Build Runners:** Standalone runners (`build.sh`, `build.bat`, `build.ps1`) automatically detect and prioritize **Podman**, **Docker**, or native **Node/npm**.

---

## 3. Repository Structure

```text
Website/
├── index.html                  # Main studio portal, hero showcase, bento grid & social channels
├── games.html                  # Active projects showcase & classified [REDACTED] mystery title
├── credit.html                 # Studio roster & dynamic Discord profile cards
├── build.sh                    # Universal build runner for Linux & macOS (Podman/Docker/npm)
├── build.bat                   # Universal build runner for Windows CMD
├── build.ps1                   # Universal build runner for Windows PowerShell
├── .htaccess                   # Apache/cPanel security headers, HTTPS enforcement & caching
├── robots.txt                  # Search engine crawler directives
├── sitemap.xml                 # Search engine XML sitemap
├── .gitignore                  # Git exclusions (preserves production assets/js/)
├── tsconfig.json               # Strict TypeScript compiler options
├── package.json                # Project dependencies and build scripts
├── data/
│   └── credits.json            # Single source of truth for team members and Discord assets
├── .github/
│   └── workflows/
│       └── build.yml           # CI: Typecheck, compile verification, zero-raw-JS & XML validation
├── src/
│   └── ts/
│       ├── types/
│       │   └── i18n.d.ts       # Strongly-typed TranslationSchema & locale contracts
│       ├── config.ts           # Central studio configuration, social URLs & allowlists
│       ├── credits-data.ts     # Auto-generated credits data contract
│       ├── i18n.ts             # TR/EN dictionaries & DOM localization engine
│       └── main.ts             # Application lifecycle, theme toggles & interactive components
├── assets/
│   ├── css/
│   │   ├── variables.css       # Core color tokens, typography stacks & layout variables
│   │   ├── main.css            # Foundation styles, typography & Discord card layouts
│   │   ├── theme.css           # Modern gaming portal theme, bento grids & glow atmosphere
│   │   └── responsive.css      # Fluid responsive breakpoints (mobile, tablet, desktop)
│   ├── js/                     # Compiled production JavaScript bundle (assets/js/main.js)
│   └── img/                    # Studio logos, favicon suite, game artwork & Discord cache
└── scripts/
    ├── render-credits.js       # Discord profile fetcher & HTML credits generator
    ├── add-credit.js           # Interactive CLI helper to add studio members
    └── bundle.js               # Standalone single-file bundle generator
```

---

## 4. Build & Development

Run the universal build script for your operating system:

```bash
# Linux & macOS
./build.sh              # Compile TypeScript & generate production assets
./build.sh typecheck    # Run strict type checking without emitting files
./build.sh watch        # Live watch mode for continuous compilation
./build.sh install      # Install dependencies

# Windows (Command Prompt)
build.bat               # Compile TypeScript & generate assets
build.bat typecheck     # Run typecheck

# Windows (PowerShell)
.\build.ps1             # Compile TypeScript & generate assets
.\build.ps1 typecheck   # Run typecheck
```

---

## 5. Deployment Guide (cPanel / Apache / Static Hosting)

Because this platform is completely static, publishing to **cPanel** is as simple as copying the static production files into `public_html/`:

1. Upload the following files to your `public_html/` root:
   - `index.html`, `games.html`, `credit.html`
   - `assets/` directory (including `assets/css/`, `assets/js/`, `assets/img/`)
   - `.htaccess`, `robots.txt`, `sitemap.xml`, `favicon.ico`
2. Ensure file permissions are set to standard `644` for files and `755` for directories.
3. The included `.htaccess` automatically manages HTTPS redirection, MIME types, security headers, and aggressive static asset caching.

---

## 6. Core Team & Contributors

| Avatar | Member | Role | Socials |
| :---: | :--- | :--- | :--- |
| <img src="https://github.com/Stett1N.png" width="48" height="48" style="border-radius:50%" /> | **Stettin**<br>`@stettin` | **Founder / Studio Owner & Creative Designer** | [![GitHub](https://img.shields.io/badge/GitHub-Stett1N-181717?logo=github)](https://github.com/Stett1N) [![Discord](https://img.shields.io/badge/Discord-296189055379570688-5865F2?logo=discord)](https://discord.com/users/296189055379570688) |
| <img src="https://github.com/flaouve.png" width="48" height="48" style="border-radius:50%" /> | **Flaouve**<br>`@flaouve` | **Chief / Site Director — DevOps & Server Architecture** | [![GitHub](https://img.shields.io/badge/GitHub-flaouve-181717?logo=github)](https://github.com/flaouve) [![GitLab](https://img.shields.io/badge/GitLab-flaouve-FC6D26?logo=gitlab)](https://gitlab.com/flaouve) [![Website](https://img.shields.io/badge/Website-flaouve.dev-00C7B7)](https://flaouve.dev/) [![Discord](https://img.shields.io/badge/Discord-966300934202359888-5865F2?logo=discord)](https://discord.com/users/966300934202359888) |

---

## 7. Contributing

Community contributions, issue reports, and feedback are warmly welcomed:

1. **Fork** the repository and create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
2. **Follow TypeScript-Only Policy:** Do not add or edit raw `.js` in `src/`. All logic must live in `src/ts/`.
3. **Verify Build & Types:**
   ```bash
   npm run typecheck
   npm run build
   ```
4. **Submit a Pull Request** with clear, descriptive commit messages.

---

## 8. License

This project is licensed under the [Apache License 2.0](LICENSE).
