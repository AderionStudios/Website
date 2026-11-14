# FLAOUVE — Indie Game Studio Static Web Platform

**Bilingual Editorial Web Architecture · Zero-Backend · TypeScript-Only · cPanel-Ready**  
**Çift Dilli Editoryal Web Mimarisi · Sıfır Sunucu Bağımlılığı · Zorunlu TypeScript · cPanel Uyumlu**

[English Documentation](#english) · [Türkçe Dokümantasyon](#türkçe)

---

## English

### 1. Project Overview

**FLAOUVE** is an open-source, type-safe, 100% static editorial web platform built for independent game studios, solo developers, and creative collectives. Designed around high-contrast dark editorial typography, asymmetric CSS Grid layouts, and zero server-side dependencies, it ships production-ready static assets directly to **cPanel (`public_html`)**, VPS servers, or static CDNs.

### 2. Core Architectural Principles

* **Zero-Backend:** Pure **HTML5**, **CSS3**, and compiled **ES2020 JavaScript** (`assets/js/`). No database, PHP, or Node.js runtime is required in production, minimizing TTFB and eliminating classic CMS attack surfaces (SQLi, RCE).
* **TypeScript-Only Policy:** Handwriting raw `.js` files is strictly forbidden. All client-side logic lives under `src/ts/` with `strict: true` and zero external UI frameworks (Vanilla DOM API only), compiled via `tsc` into `assets/js/`.
* **cPanel-Ready & Hardened:** Includes a production Apache/cPanel `.htaccess` configuration (dotfile/dotdir protection, `Options -Indexes`, HTTPS 301 enforcement, security headers, Brotli/Gzip compression, and `Cache-Control`/`Expires` rules) alongside automated SSH/`rsync` deployment workflows.
* **Compile-Time Safe i18n:** Client-side Turkish (`tr`) / English (`en`) localization backed by `TranslationSchema` (`src/ts/types/i18n.d.ts`), `navigator.language` detection, `localStorage` persistence, and instant DOM updates via `data-i18n` attributes.

### 3. Directory Structure

```text
Website/
├── index.html                  # Editorial home showcase, manifesto, featured title & studio strip
├── games.html                  # Studio game catalog, platform filters, system specs & gallery
├── credit.html                 # Studio roster & dynamic Discord profile cards
├── press-kit.html              # Verified fact sheet, studio bio, vector logos & media kit
├── .htaccess                   # Apache/cPanel security, HTTPS redirect, compression & cache rules
├── robots.txt                  # Search engine crawler directives & sitemap pointer
├── sitemap.xml                 # XML Sitemap covering all studio pages
├── .gitignore                  # Ignores node_modules/ & local temp files; preserves assets/js/
├── tsconfig.json               # Strict TypeScript compiler config (src/ts -> assets/js)
├── package.json                # Minimal dev dependencies (TypeScript only)
├── data/
│   └── credits.json            # Central team roster & Discord ID data source
├── .github/
│   └── workflows/
│       ├── build.yml           # CI: Zero-raw-JS guardrail, typecheck, build & XML validation
│       └── deploy.yml          # CD: Stages production bundle & syncs to cPanel public_html
├── src/
│   └── ts/
│       ├── types/
│       │   └── i18n.d.ts       # Strongly typed TranslationSchema & locale contracts
│       ├── config.ts           # Central studio metadata, games, team & iframe origin allowlist
│       ├── i18n.ts             # TR/EN dictionaries, locale detection & DOM translation engine
│       └── main.ts             # Trailer modal, mobile drawer, filters & keyboard accessibility
├── assets/
│   ├── css/
│   │   ├── variables.css       # Design tokens (palette, typography, spacing, borders)
│   │   ├── main.css            # Asymmetric editorial grid, stroke headings & components
│   │   └── responsive.css      # Desktop, tablet & mobile media queries
│   ├── js/                     # Compiled tsc output deployed to cPanel (do not hand-edit)
│   ├── fonts/                  # Self-hosted web font assets
│   ├── img/                    # Hero concept artwork, game covers & team visuals
│   └── press-kit/              # Downloadable press media archives
└── LICENSE                     # Apache License 2.0
```

### 4. Universal Cross-Platform Build Runners (Podman / Docker / Native)

The repository provides automated cross-platform build scripts that auto-detect **Podman**, fallback to **Docker**, or use native **Node/npm**:

```bash
# Linux & macOS (Bash)
./build.sh              # Runs npm run build
./build.sh typecheck    # Runs npm run typecheck
./build.sh watch        # Runs npm run watch
./build.sh install      # Runs npm install

# Windows (Command Prompt)
build.bat               # Runs npm run build
build.bat typecheck     # Runs npm run typecheck

# Windows (PowerShell)
.\build.ps1             # Runs npm run build
.\build.ps1 typecheck   # Runs npm run typecheck
```

Alternatively, commands can still be executed directly via Podman:

```bash
# Direct Podman execution
podman exec website-dev npm run build
podman exec website-dev npm run typecheck
podman exec website-dev npm run add-member -- --name="Member Name" --discord="https://discord.com/users/ID" --role="Role Title"
```

### 5. CI/CD & cPanel Deployment

* **CI Pipeline ([`.github/workflows/build.yml`](./.github/workflows/build.yml)):** Runs on every push and PR to `main`. Enforces zero raw `.js` files under `src/`, executes `npm run typecheck` and `npm run build`, verifies compiled outputs (`assets/js/main.js`, `config.js`, `i18n.js`), and validates `sitemap.xml` and `feed.xml`.
* **CD Pipeline ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)):** Runs on push to `main` or manual `workflow_dispatch`. Compiles TypeScript, stages only static production artifacts (`.html`, `.htaccess`, `robots.txt`, `sitemap.xml`, `feed.xml`, `assets/`) into `_deploy/`, preserves cPanel-managed paths (`.well-known/`, `cgi-bin/`), and syncs via SSH/`rsync`. Configure repository secrets:
  * `CPANEL_HOST` (required)
  * `CPANEL_USER` (required)
  * `CPANEL_SSH_KEY` (required)
  * `CPANEL_PORT` (optional, defaults to `22`)
  * `CPANEL_REMOTE_PATH` (optional, defaults to `public_html/`)
  * `CPANEL_SSH_KNOWN_HOSTS` (optional, pinned host key)

### 6. Multi-Agent Architecture Summary

This repository was engineered using a specialized multi-agent workflow with strict file ownership boundaries:

1. **Editorial UI & Assets Agent:** Semantic HTML5 pages (`index.html`, `games.html`, `credit.html`, `press-kit.html`), editorial CSS system (`variables.css`, `main.css`, `responsive.css`), and vector visual assets.
2. **TypeScript & i18n Engineering Agent:** Tooling (`package.json`, `tsconfig.json`), strict translation contracts (`src/ts/types/i18n.d.ts`), studio data layer (`src/ts/config.ts`, `data/credits.json`), client i18n engine (`src/ts/i18n.ts`), and accessible interactions (`src/ts/main.ts`).
3. **DevOps, Security & SEO Specialist:** Server hardening (`.htaccess`), crawler endpoints (`robots.txt`, `sitemap.xml`), repository hygiene (`.gitignore`), and GitHub Actions CI/CD (`.github/workflows/`).

---

## Türkçe

### 1. Proje Özeti

**FLAOUVE**, bağımsız oyun stüdyoları, solo geliştiriciler ve yaratıcı kolektifler için tasarlanmış; tip güvenli, %100 statik ve açık kaynaklı bir editoryal web platformudur. Yüksek kontrastlı koyu tema, asimetrik CSS Grid yerleşimi ve sıfır sunucu bağımlılığı üzerine kurulan mimari; doğrudan **cPanel (`public_html`)**, VPS veya statik CDN ortamlarında anında çalışır.

### 2. Temel Mimari İlkeler

* **Sıfır Sunucu Bağımlılığı (Zero-Backend):** Yalnızca standart **HTML5**, **CSS3** ve derlenmiş **ES2020 JavaScript** (`assets/js/`) çıktıları kullanılır. Üretim ortamında veritabanı, PHP veya Node.js çalışma zamanı gerekmez; TTFB minimumdur ve klasik CMS zafiyetlerini (SQLi, RCE) barındırmaz.
* **Ham JavaScript Yasağı (TypeScript-Only):** Doğrudan `.js` dosyası yazmak yasaktır. Tüm istemci mantığı harici framework olmadan (`Vanilla DOM API`) `src/ts/` altında `strict: true` ile yazılır ve `tsc` ile `assets/js/` dizinine derlenir.
* **cPanel Uyumluluğu ve Sıkılaştırma:** `.htaccess` dosyası ile gizli dosya/dizin engelleme, `Options -Indexes`, HTTPS 301 yönlendirmesi, HTTP güvenlik başlıkları, Brotli/Gzip sıkıştırma ve `Cache-Control`/`Expires` önbellekleme kurallarını hazır sunar.
* **Tip Güvenli Çoklu Dil (i18n):** `TranslationSchema` (`src/ts/types/i18n.d.ts`) arayüzü ile eksik çevirileri derleme anında yakalar; `navigator.language` tespiti, `localStorage` tercihi ve `data-i18n` nitelikleri üzerinden sayfa yenilenmeden TR/EN dil geçişi sağlar.

### 3. Dizin Yapısı

Tam dizin ağacı yukarıdaki [Directory Structure](#3-directory-structure) bölümünde yer almaktadır. Kaynak TypeScript kodları `src/ts/` altında tutulur; `assets/js/` dizini yalnızca `tsc` tarafından üretilen cPanel uyumlu çıktıları içerir.

### 4. Evrensel Çapraz Platform Derleme Betikleri (Podman / Docker / Yerel)

Projeyi derlemek için sisteminizde **Podman**, **Docker** veya yerel **Node.js/npm** olup olmadığını otomatik tespit eden betikler hazırlanmıştır:

```bash
# Linux ve macOS (Bash)
./build.sh              # npm run build çalıştırır
./build.sh typecheck    # npm run typecheck çalıştırır
./build.sh watch        # Canlı izleme (watch mode)
./build.sh install      # npm install bağımlılık yükleme

# Windows (Komut Satırı / CMD)
build.bat               # npm run build çalıştırır
build.bat typecheck     # npm run typecheck çalıştırır

# Windows (PowerShell)
.\build.ps1             # npm run build çalıştırır
.\build.ps1 typecheck   # npm run typecheck çalıştırır
```

Doğrudan Podman konteyneri üzerinden çalıştırmak isterseniz:

```bash
# Podman konteyneri üzerinden doğrudan çalıştırma
podman exec website-dev npm run build
podman exec website-dev npm run typecheck
podman exec website-dev npm run add-member -- --name="Ad Soyad" --discord="https://discord.com/users/ID" --role="Rol"
```

### 5. CI/CD ve cPanel Dağıtımı

* **Sürekli Entegrasyon ([`.github/workflows/build.yml`](./.github/workflows/build.yml)):** `main` dalına gönderilen her `push` ve `pull_request` işleminde `src/` altında ham `.js` bulunmadığını doğrular, `npm run typecheck` ve `npm run build` adımlarını çalıştırır, üretilen `assets/js/` dosyalarını ve `sitemap.xml` geçerliliğini denetler.
* **Sürekli Dağıtım ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)):** `main` dalına `push` veya manuel `workflow_dispatch` tetiklendiğinde TypeScript kodunu derler, yalnızca üretim dosyalarını (`.html`, `.htaccess`, `robots.txt`, `sitemap.xml`, `assets/`) `_deploy/` dizininde paketler, cPanel'e ait `.well-known/` ve `cgi-bin/` dizinlerini koruyarak SSH/`rsync` ile `public_html` dizinine aktarır.

### 6. Çoklu Ajan Mimari Özeti

Platform, dosya sahipliği sınırları net biçimde ayrılmış üç uzman ajan alanı ile geliştirilmiştir:

1. **Editoryal Arayüz ve Görsel Tasarım Ajanı:** Semantik HTML5 sayfaları (`index.html`, `games.html`, `credit.html`, `press-kit.html`), CSS tasarım tokenları (`variables.css`, `main.css`, `responsive.css`) ve vektör görseller.
2. **TypeScript ve i18n Mühendislik Ajanı:** Derleme yapılandırması (`package.json`, `tsconfig.json`), tip güvenli çeviri şeması (`i18n.d.ts`), merkezi veri katmanı (`config.ts`, `data/credits.json`), çoklu dil motoru (`i18n.ts`) ve etkileşim kontrolleri (`main.ts`).
3. **DevOps, Güvenlik ve SEO Uzmanı:** Apache/cPanel sıkılaştırma (`.htaccess`), arama motoru dosyaları (`robots.txt`, `sitemap.xml`), depo kuralları (`.gitignore`) ve GitHub Actions CI/CD iş akışları.
* [`LICENSE`](./LICENSE) — Apache License 2.0
