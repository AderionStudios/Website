# ADERION STUDIO — Official Static Web Platform

**Type-Safe Editorial Web Architecture · Zero-Backend · TypeScript-Only · cPanel-Ready**  
**Tip Güvenli Editoryal Web Mimarisi · Sıfır Sunucu Bağımlılığı · Zorunlu TypeScript · cPanel Uyumlu**

[English Documentation](#english) · [Türkçe Dokümantasyon](#türkçe)

---

## English

### 1. Project Overview

**Aderion Studio** is an open-source, type-safe, 100% static editorial web platform built for independent game development. Designed with high-contrast editorial typography, asymmetric responsive CSS Grid layouts, and zero server-side dependencies, it delivers high performance and security for deployment to **cPanel (`public_html`)**, static CDNs, or VPS hosting.

### 2. Core Architectural Principles

* **Zero-Backend (Static Only):** Pure **HTML5**, **CSS3**, and compiled **ES2020 JavaScript** (`assets/js/`). No database, PHP, or Node.js runtime is required in production, ensuring near-instant TTFB and eliminating server-side attack vectors.
* **TypeScript-Only Policy:** Handwriting raw `.js` under `src/ts/` is prohibited. All client logic is written in strict TypeScript and compiled into standalone `assets/js/main.js` via `tsc`.
* **Universal Cross-Platform Build Runners:** Automated scripts (`build.sh`, `build.bat`, `build.ps1`) auto-detect **Podman**, **Docker**, or local **Node/npm** without manual container setup.
* **Discord Integration:** Real-time profile card rendering with avatars, animated badges, banners, and configurable status bubbles (`bubble_tr`, `bubble_en`) from `data/credits.json`.
* **Compile-Time Safe i18n:** Client-side Turkish (`tr`) / English (`en`) localization enforced by TypeScript's `TranslationSchema`.

### 3. Repository Structure

```text
Website/
├── index.html                  # Editorial home showcase, manifesto & official channels
├── games.html                  # Active development coming-soon showcase & pillars
├── games_backup.html           # Preserved full game catalog backup
├── credit.html                 # Studio roster & dynamic Discord profile cards
├── build.sh                    # Universal build runner for Linux & macOS (Podman/Docker/npm)
├── build.bat                   # Universal build runner for Windows CMD
├── build.ps1                   # Universal build runner for Windows PowerShell
├── .htaccess                   # Apache/cPanel security, HTTPS redirect & cache rules
├── robots.txt                  # Search engine crawler directives
├── sitemap.xml                 # XML Sitemap for search engines
├── .gitignore                  # Git exclusions (preserves assets/js/)
├── tsconfig.json               # Strict TypeScript configuration
├── package.json                # Project metadata & build scripts
├── data/
│   └── credits.json            # Central single source of truth for team & Discord data
├── .github/
│   └── workflows/
│       ├── build.yml           # CI: Zero-raw-JS check, typecheck, build & XML validation
│       └── deploy.yml          # CD: Static bundle staging & automated cPanel rsync deployment
├── src/
│   └── ts/
│       ├── types/
│       │   └── i18n.d.ts       # Strongly typed TranslationSchema & locale contracts
│       ├── config.ts           # Central studio metadata & iframe allowlists
│       ├── credits-data.ts     # Auto-generated credits contract
│       ├── i18n.ts             # TR/EN dictionaries & DOM localization engine
│       └── main.ts             # Application bootstrap, theme toggle, modals & i18n
├── assets/
│   ├── css/
│   │   ├── variables.css       # Design tokens (colors, typography, spacing)
│   │   ├── main.css            # Editorial styling, Discord cards & coming soon state
│   │   └── responsive.css      # Fluid responsive breakpoints (mobile, tablet, desktop)
│   ├── js/                     # Compiled production JavaScript bundle (assets/js/main.js)
│   └── img/                    # Studio logos, concept art & Discord asset cache
└── scripts/
    ├── render-credits.js       # Discord profile fetcher & HTML credits generator
    ├── add-credit.js           # CLI helper to add new members
    └── bundle.js               # Standalone single-file bundle generator
```

### 4. Build & Development

The repository includes universal runners that prioritize Podman, then Docker, then native npm:

```bash
# Linux & macOS
./build.sh              # Compile TypeScript & generate assets
./build.sh typecheck    # Run typecheck without emitting files
./build.sh watch        # Watch mode for live TypeScript compilation
./build.sh install      # Install dependencies

# Windows (Command Prompt)
build.bat               # Compile TypeScript & generate assets
build.bat typecheck     # Run typecheck

# Windows (PowerShell)
.\build.ps1             # Compile TypeScript & generate assets
.\build.ps1 typecheck   # Run typecheck
```

### 5. Contributors & Core Team

| Avatar | Member | Role | Socials |
| :---: | :--- | :--- | :--- |
| <img src="https://github.com/Stett1N.png" width="48" height="48" style="border-radius:50%" /> | **Stettin**<br>`@stettin` | **Founder / Studio Owner & Creative Designer**<br>Kurucu, Stüdyo Sahibi & Yaratıcı Tasarımcı | [![GitHub](https://img.shields.io/badge/GitHub-Stett1N-181717?logo=github)](https://github.com/Stett1N) [![Discord](https://img.shields.io/badge/Discord-296189055379570688-5865F2?logo=discord)](https://discord.com/users/296189055379570688) |
| <img src="https://github.com/flaouve.png" width="48" height="48" style="border-radius:50%" /> | **Flaouve**<br>`@flaouve` | **Chief / Site Director — DevOps & Server Architecture**<br>DevOps, Sistem Mimarisi & Altyapı Lideri | [![GitHub](https://img.shields.io/badge/GitHub-flaouve-181717?logo=github)](https://github.com/flaouve) [![GitLab](https://img.shields.io/badge/GitLab-flaouve-FC6D26?logo=gitlab)](https://gitlab.com/flaouve) [![Website](https://img.shields.io/badge/Website-flaouve.dev-00C7B7)](https://flaouve.dev/) [![Discord](https://img.shields.io/badge/Discord-966300934202359888-5865F2?logo=discord)](https://discord.com/users/966300934202359888) |

### 6. Contributing Guidelines

Contributions and suggestions are warmly welcomed! To contribute:

1. **Fork** the repository and create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
2. **Strict TypeScript Policy:** Do not add or edit raw `.js` in `src/`. All logic must be in `src/ts/` with strict types.
3. **Verify Build:** Ensure all checks pass:
   ```bash
   ./build.sh typecheck
   ./build.sh
   ```
4. **Commit & Pull Request:** Commit with clear descriptive messages and open a PR.

---

## Türkçe

### 1. Proje Özeti

**Aderion Studio**, bağımsız oyun geliştirme için tasarlanmış; tip güvenli, %100 statik ve açık kaynaklı bir editoryal web platformudur. Yüksek kontrastlı koyu tema, asimetrik CSS Grid tasarımı ve sıfır sunucu bağımlılığı üzerine kurulu olan platform; **cPanel (`public_html`)**, statik CDN veya VPS sunucularında doğrudan ve yüksek performansla çalışır.

### 2. Temel Mimari İlkeler

* **Sıfır Sunucu Bağımlılığı (Zero-Backend):** Üretim ortamında veritabanı, PHP veya Node.js gerektirmez. Saf **HTML5**, **CSS3** ve derlenmiş **ES2020 JavaScript** (`assets/js/`) ile çalışır.
* **Ham JavaScript Yasağı (TypeScript-Only):** `src/ts/` altında doğrudan `.js` yazmak yasaktır. Tüm istemci kodları sıkı TypeScript kurallarıyla yazılır ve `tsc` ile derlenir.
* **Evrensel Derleme Betikleri:** `build.sh`, `build.bat` ve `build.ps1` betikleri sistemde **Podman**, **Docker** veya yerel **Node/npm** olup olmadığını otomatik olarak tespit eder.
* **Dinamik Discord Kartları:** `data/credits.json` üzerinden anlık Discord avatarları, afişler ve iki dilli (`bubble_tr`, `bubble_en`) konuşma baloncukları sunar.
* **Tip Güvenli İki Dilli Yapı (i18n):** Türkçe (`tr`) ve İngilizce (`en`) dilleri `TranslationSchema` ile derleme anında doğrulanır.

### 3. Dizin Yapısı

Detaylı dizin ağacı yukarıdaki [Repository Structure](#3-repository-structure) bölümünde listelenmiştir.

### 4. Derleme ve Geliştirme

İşletim sisteminize uygun betiği çalıştırarak kolayca derleme yapabilirsiniz:

```bash
# Linux ve macOS
./build.sh              # Projeyi derler
./build.sh typecheck    # Hata üretmeden tip kontrolü yapar
./build.sh watch        # Canlı izleme modu
./build.sh install      # Bağımlılıkları kurar

# Windows (Komut Satırı / CMD)
build.bat               # Projeyi derler
build.bat typecheck     # Tip kontrolü yapar

# Windows (PowerShell)
.\build.ps1             # Projeyi derler
.\build.ps1 typecheck   # Tip kontrolü yapar
```

### 5. Çekirdek Ekip & Katkıda Bulunanlar (Contributors)

| Profil | Üye | Görev & Rol | Bağlantılar |
| :---: | :--- | :--- | :--- |
| <img src="https://github.com/Stett1N.png" width="48" height="48" style="border-radius:50%" /> | **Stettin**<br>`@stettin` | **Kurucu, Stüdyo Sahibi & Yaratıcı Tasarımcı**<br>Founder / Studio Owner & Creative Designer | [![GitHub](https://img.shields.io/badge/GitHub-Stett1N-181717?logo=github)](https://github.com/Stett1N) [![Discord](https://img.shields.io/badge/Discord-296189055379570688-5865F2?logo=discord)](https://discord.com/users/296189055379570688) |
| <img src="https://github.com/flaouve.png" width="48" height="48" style="border-radius:50%" /> | **Flaouve**<br>`@flaouve` | **Chief / Site Director — DevOps & Sunucu Yönetimi**<br>DevOps, Sistem Mimarisi & Altyapı Lideri | [![GitHub](https://img.shields.io/badge/GitHub-flaouve-181717?logo=github)](https://github.com/flaouve) [![GitLab](https://img.shields.io/badge/GitLab-flaouve-FC6D26?logo=gitlab)](https://gitlab.com/flaouve) [![Website](https://img.shields.io/badge/Website-flaouve.dev-00C7B7)](https://flaouve.dev/) [![Discord](https://img.shields.io/badge/Discord-966300934202359888-5865F2?logo=discord)](https://discord.com/users/966300934202359888) |

### 6. Katkıda Bulunma Rehberi (Contributing)

Topluluk katkıları ve öneriler memnuniyetle karşılanır:

1. Depoyu **Fork** edin ve geliştirme dalınızı açın:
   ```bash
   git checkout -b feature/yeni-ozellik
   ```
2. Değişikliklerinizi yapın ve derleme testlerini çalıştırın:
   ```bash
   ./build.sh typecheck
   ./build.sh
   ```
3. Commit mesajınızı yazarak bir **Pull Request (PR)** açın.

---

### 7. Lisans (License)

Bu proje [Apache License 2.0](LICENSE) ile lisanslanmıştır.
