(() => {
/**
 * Central strongly typed studio metadata, game catalog, and security allowlist.
 */
const STUDIO_CONFIG = {
    studioName: 'ADERION STUDIO',
    badgeNumber: '( 03 )',
    foundedYear: 2026,
    location: 'Istanbul & Berlin',
    contactEmail: 'support@flaouve.dev',
    securityEmail: 'security@flaouve.dev',
    websiteUrl: 'https://flaouve.dev',
    defaultLocale: 'tr',
    allowedIframeOrigins: [
        'https://www.youtube-nocookie.com',
        'https://store.steampowered.com',
    ],
    games: [
        {
            id: 'ashes-of-veridia',
            title: 'Ashes of Veridia',
            status: 'dev',
            platforms: ['PC (Steam)', 'Steam Deck', 'PlayStation 5'],
            trailerUrl: 'https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?rel=0',
            steamUrl: 'https://store.steampowered.com/',
            image: 'assets/img/games/game-01.svg',
        },
        {
            id: 'nocturne-signal',
            title: 'Nocturne Signal',
            status: 'released',
            platforms: ['PC (Steam)', 'itch.io', 'macOS'],
            trailerUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?rel=0',
            steamUrl: 'https://store.steampowered.com/',
            image: 'assets/img/games/game-02.svg',
        },
        {
            id: 'echoes-of-khora',
            title: 'Echoes of Khora',
            status: 'proto',
            platforms: ['PC', 'WebGL / Playtest'],
            trailerUrl: 'https://www.youtube-nocookie.com/embed/tgbNymZ7vqY?rel=0',
            steamUrl: 'https://store.steampowered.com/',
            image: 'assets/img/games/game-03.svg',
        },
    ],
    team: [
        {
            id: 'stettin',
            name: 'Stettin',
            handle: '@stettin',
            roleKey: 'credit.role_1',
            location: 'Aderion Studio',
            avatar: 'assets/img/team/avatar-stettin.svg',
            links: {
                github: 'https://github.com/Stett1N',
                discord: 'https://discord.com/users/296189055379570688',
            },
        },
        {
            id: 'flaouve',
            name: 'Flaouve',
            handle: '@flaouve',
            roleKey: 'credit.role_2',
            location: 'Aderion Studio',
            avatar: 'assets/img/team/avatar-flaouve.svg',
            links: {
                github: 'https://github.com/flaouve',
                gitlab: 'https://gitlab.com/flaouve',
                discord: 'https://discord.com/users/966300934202359888',
                website: 'https://flaouve.dev/',
            },
        },
    ],
    socials: {
        youtube: 'https://www.youtube.com/@AderionStudios',
        instagram: 'https://www.instagram.com/aderionstudios/',
        twitter: 'https://x.com/aderionstudios',
        reddit: 'https://www.reddit.com/r/AderionStudios/',
        patreon: 'https://www.patreon.com/cw/AderionStudios',
        github: 'https://github.com/flaouve',
    },
};


const CREDITS_DATA = {
    "departments": [
        {
            "id": "founder",
            "code": "01",
            "badge": "DEP // 01",
            "title_tr": "KURUCU & STÜDYO LİDERLİĞİ",
            "title_en": "FOUNDER & STUDIO LEADERSHIP",
            "members": [
                {
                    "id": "stettin",
                    "discordId": "296189055379570688",
                    "roleBadge": "FOUNDER / OWNER",
                    "role_tr": "Kurucu, Stüdyo Sahibi & Yaratıcı Tasarımcı",
                    "role_en": "Founder, Studio Owner & Creative Designer",
                    "meta_tr": "Kurucu & Tasarım Direktörü",
                    "meta_en": "Founder & Design Director",
                    "bubble_tr": "🖌️ Someone drawing their own world.",
                    "bubble_en": "🖌️ Someone drawing their own world.",
                    "links": {
                        "github": "https://github.com/Stett1N",
                        "instagram": "https://www.instagram.com/stettin76/",
                        "X(Twitter)": "https://x.com/StettiN76",
                        "steam": "https://steamcommunity.com/id/StettiNN/",
                        "patreon": "https://www.patreon.com/cw/Stettin"
                    }
                }
            ]
        },
        {
            "id": "technical",
            "code": "02",
            "badge": "DEP // 02",
            "title_tr": "TEKNİK YÖNETİM & ALTYAPI",
            "title_en": "TECHNICAL DIRECTION & INFRASTRUCTURE",
            "members": [
                {
                    "id": "flaouve",
                    "discordId": "966300934202359888",
                    "roleBadge": "CHIEF / SITE DIRECTOR",
                    "role_tr": "Chief / Site Director — DevOps & Sunucu Yönetimi",
                    "role_en": "Chief / Site Director — DevOps & Server Architecture",
                    "meta_tr": "Chief / DevOps & Sistem Lideri",
                    "meta_en": "Chief / DevOps & Systems Lead",
                    "bubble_tr": "KISS",
                    "bubble_en": "KISS",
                    "pronouns": "they/them and Any „(-innen)“",
                    "links": {
                        "github": "https://github.com/flaouve",
                        "gitlab": "https://gitlab.com/flaouve",
                        "website": "https://flaouve.dev/",
                        "steam": "https://steamcommunity.com/id/flaouve/"
                    }
                }
            ]
        }
    ]
};


const STORAGE_KEY = 'preferred_locale';
const tr = {
    // Navigation
    'nav.studio_name': 'ADERION STUDIO',
    'nav.about': 'HAKKIMIZDA',
    'nav.credit': 'CREDIT',
    'nav.games': 'OYUNLAR',
    'nav.devlog': 'GÜNLÜK',
    'nav.presskit': 'BASIN KİTİ',
    'nav.cta_projects': 'PROJELERİMİZİ GÖRÜN ↗',
    'nav.menu_toggle': 'Menüyü aç veya kapat',
    'nav.lang_label': 'Dili değiştir (Türkçe / İngilizce)',
    'nav.theme_toggle': 'Temayı değiştir (Açık / Koyu)',
    // Hero (index.html)
    'hero.eyebrow': 'BAĞIMSIZ OYUN STÜDYOSU / 2026',
    'hero.title_fill': 'AYNI DEĞİLİZ.',
    'hero.title_stroke': 'BİRLİKTEYİZ.',
    'hero.description': 'Farklı disiplinler. Ortak bir oyun dünyası. Anlatı odaklı atmosferi hassas mühendislikle buluşturan bağımsız oyunlar tasarlıyoruz.',
    'hero.cta_trailer': 'FRAGMANI İZLE',
    'hero.cta_catalog': 'OYUN KATALOĞU ↗',
    'hero.ribbon': 'PROJE 001 — YENİ DÜNYALAR, ORTAK İZLER',
    'hero.featured_tag': 'ÖNE ÇIKAN PROJE // 01',
    'hero.featured_title': '[REDACTED]',
    'hero.featured_meta': 'Gizemli Görsel Roman (Visual Novel) — Geliştirme Aşamasında',
    // Bottom 4-Column Strip (index.html)
    'strip.col1_num': '01 / DİSİPLİN',
    'strip.col1_title': 'Anlatı & Dünya İnşası',
    'strip.col1_desc': 'Çatallanan hikayeler, çevresel anlatım ve yaşayan mitolojiler.',
    'strip.col2_num': '02 / SANAT',
    'strip.col2_title': 'Editoryal & Sinematik Atmosfer',
    'strip.col2_desc': 'Yüksek kontrastlı ışık, el işçiliği konseptler ve özgün ses tasarımı.',
    'strip.col3_num': '03 / MÜHENDİSLİK',
    'strip.col3_title': 'Özel Sistemler & Performans',
    'strip.col3_desc': 'Akıcı kare hızları, modüler araçlar ve duyarlı oynanış mekanikleri.',
    'strip.col4_num': '04 / KÜNYE & EKİP',
    'strip.col4_title': 'Aderion Çekirdek Kadro, Tek Vizyon',
    'strip.col4_desc': 'Bağımsız, şeffaf ve oyuncu odaklı stüdyo üretimi.',
    // About & Credits (index.html, credit.html)
    'about.eyebrow': '01 // TOPLULUK & RESMİ KANALLAR',
    'about.title': "Aderion Studios'u Takip Edin",
    'about.body': 'Aderion Studio, 2026 yılında bağımsız geliştiriciler tarafından kuruldu. Her projeyi ticari bir şablon olarak değil; sanat yönetimi, sistem tasarımı ve oyuncuya duyulan saygının birleştiği uzun ömürlü bir deneyim olarak ele alıyoruz.',
    'about.subtitle': 'Oyun geliştirme güncellemeleri, duyurular ve topluluk tartışmaları için resmi kanallarımız.',
    'about.yt_desc': 'Resmi fragmanlar, geliştirici günlükleri ve video içerikler',
    'about.x_desc': 'Anlık haberler, geliştirme notları ve duyurular',
    'about.ig_desc': 'Konsept çizimler, görsel sanat ve stüdyo paylaşımları',
    'about.reddit_desc': 'Topluluk tartışmaları, geri bildirim ve teoriler',
    'about.patreon_desc': 'Özel stüdyo içerikleri, geliştirici destekçisi ve erken erişim',
    'credit.eyebrow': '02 // CREDIT & DEPARTMANLAR',
    'credit.title': 'Stüdyo Yönetim Kadrosu',
    'credit.subtitle': 'Aderion Studio bağımsız üretim, sanat yönetimi ve sunucu altyapısını yöneten çekirdek kadro.',
    'credit.dept_founder': 'KURUCU & STÜDYO LİDERLİĞİ',
    'credit.dept_director': 'TEKNİK YÖNETİM & ALTYAPI',
    'credit.role_1': 'Kurucu, Stüdyo Sahibi & Yaratıcı Tasarımcı',
    'credit.role_2': 'Chief / Site Director — DevOps & Sunucu Yönetimi',
    'credit.role_3': 'Sistem Mimarisi & Oynanış Mühendisliği',
    'credit.meta_stettin': 'Kurucu & Tasarım Direktörü',
    'credit.meta_flaouve': 'Chief / DevOps & Sistem Lideri',
    // Games Page (games.html - Coming Soon)
    'games.coming_eyebrow': 'PROJELER & YAPIMLAR // ÇOK YAKINDA',
    'games.coming_title_fill': 'BU KISIM DAHA',
    'games.coming_title_stroke': 'HAZIRLANMADI.',
    'games.coming_subtitle': 'Aderion Studio bünyesinde üzerinde çalıştığımız bağımsız oyun projelerimiz ve bu sayfa şu anda aktif hazırlık aşamasındadır. İlk duyurularımız çok yakında burada paylaşılacaktır.',
    'games.coming_status': 'DURUM: BU KISIM HENÜZ HAZIRLANMADI',
    'games.coming_heading': 'İlk Yapımımız Üzerinde Titizlikle Çalışıyoruz',
    'games.coming_text': 'Hikaye anlatımı, atmosferik ses tasarımı ve özgün mekanikleri bir araya getiren bağımsız oyun projelerimiz stüdyo mutfağında şekilleniyor. Geliştirme süreçleri, ilk ekran görüntüleri ve fragmanlar çok yakında bu sayfada yer alacak.',
    'games.feat1_tag': '01 // VİZYON',
    'games.feat1_title': 'Bağımsız Ruh, Özgün Hikaye',
    'games.feat1_desc': 'Derin evrenler ve oyuncuyu içine çeken atmosferik maceralar.',
    'games.feat2_tag': '02 // TASARIM',
    'games.feat2_title': 'Özgün Sanat & Ses',
    'games.feat2_desc': 'El işçiliği görsel estetik ve mekânsal akustik ses dünyası.',
    'games.feat3_tag': '03 // MÜHENDİSLİK',
    'games.feat3_title': 'Modern & Akıcı Sistemler',
    'games.feat3_desc': 'Yüksek performans ve sağlam oyun mimarisi.',
    'games.coming_btn_community': 'TOPLULUĞA KATIL ↗',
    'games.coming_btn_team': 'EKİBİ TANI ↗',
    // Games Page (games.html - Catalog)
    'games.eyebrow': 'STÜDYO KATALOĞU // 2026',
    'games.title_fill': 'OYNAYAN DEĞİL,',
    'games.title_stroke': 'YAŞAYAN DÜNYALAR.',
    'games.subtitle': 'Yayınlanan yapımlarımız, aktif geliştirme sürecindeki amiral gemisi projemiz ve deneysel prototiplerimiz.',
    'games.filter_all': 'TÜMÜ (03)',
    'games.filter_released': 'YAYINLANDI',
    'games.filter_dev': 'GELİŞTİRİLİYOR',
    'games.status_dev': 'GELİŞTİRİLİYOR',
    'games.status_released': 'YAYINLANDI',
    'games.status_proto': 'PROTOTİP',
    'games.btn_trailer': 'FRAGMANI İZLE',
    'games.btn_steam': 'STEAM SAYFASI ↗',
    'games.sysreq_title': 'SİSTEM GEREKSİNİMLERİ',
    'games.sysreq_min': 'MİNİMUM',
    'games.sysreq_rec': 'ÖNERİLEN',
    'games.sysreq_os': 'İşletim Sistemi',
    'games.sysreq_cpu': 'İşlemci',
    'games.sysreq_ram': 'Bellek',
    'games.sysreq_gpu': 'Ekran Kartı',
    'games.sysreq_storage': 'Depolama',
    'games.gallery_title': 'KONSEPT & EKRAN GÖRÜNTÜLERİ',
    'games.g1_title': 'Ashes of Veridia',
    'games.g1_genre': 'Taktiksel RYO / Atmosferik',
    'games.g1_desc': 'Kül altında kalmış kadim bir takımadada hayatta kalma ve ahlaki seçimlerle şekillenen sıra tabanlı taktiksel macera.',
    'games.g2_title': 'Nocturne Signal',
    'games.g2_genre': 'Anlatı Odaklı Gizem / Bilim Kurgu',
    'games.g2_desc': 'Terk edilmiş bir yörünge dinleme istasyonunda analog radyo frekanslarını çözerek kayıp mürettebatın izini sürün.',
    'games.g3_title': 'Echoes of Khora',
    'games.g3_genre': 'Deneysel Bulmaca / Ses Mekaniği',
    'games.g3_desc': 'Mekânsal yankı ve akustik rezonans üzerine kurulu, minimalist mimaride geçen kısa deneysel prototip.',
    // Devlog Page (devlog.html)
    'devlog.eyebrow': 'GELİŞTİRME GÜNLÜĞÜ // STÜDYO NOTLARI',
    'devlog.title_fill': 'KOD, IŞIK VE',
    'devlog.title_stroke': 'ÜRETİM NOTLARI.',
    'devlog.subtitle': 'Motor mimarisi, sanat yönelimi ve tasarım kararlarımıza dair filtresiz mühendislik ve tasarım yazıları.',
    'devlog.rss_cta': 'RSS BESLEMESİ ↗',
    'devlog.read_more': 'DEVAMINI OKU',
    'devlog.post1_date': '14 KASIM 2026',
    'devlog.post1_tag': 'MİMARİ / RENDER',
    'devlog.post1_title': 'Ashes of Veridia için Dinamik Kül ve Hacimsel Sis Hattı',
    'devlog.post1_summary': 'Orta seviye GPU bütçesini aşmadan yüksek kontrastlı editoryal ışıklandırmayı nasıl koruduğumuzu inceliyoruz.',
    'devlog.post1_body': 'Veridia evreninin görsel kimliği, yalnızca karartılmış gölgelerle değil kontrollü ışık kırılmalarıyla tanımlanıyor. Ekran uzayı hacimsel örneklemeyi özel bir parçacık yoğunluk haritasıyla birleştirerek 1080p çözünürlükte 0.8 ms altında tutarlı atmosfer elde ettik.',
    'devlog.post2_date': '28 EKİM 2026',
    'devlog.post2_tag': 'SES / ANLATI',
    'devlog.post2_title': 'Nocturne Signal: Analog Radyo Sentezini Oynanış Mekaniğine Dönüştürmek',
    'devlog.post2_summary': 'Statik parazitler ve gerçek zamanlı DSP filtreleri, arayüz süsü değil doğrudan hikâye keşif aracına dönüşüyor.',
    'devlog.post2_body': 'Oyuncunun frekans kadranını her çevirişinde iki ayrı ses katmanı gerçek zamanlı çapraz modülasyonla birleşir. Doğru bant aralığına yaklaştıkça diyalog parçaları netleşir ve gemi kayıtları kronolojik olarak açılır.',
    'devlog.post3_date': '05 EKİM 2026',
    'devlog.post3_tag': 'TASARIM / PROTOTİP',
    'devlog.post3_title': 'Echoes of Khora: Metinsiz Öğretici Tasarımı Üzerine Dersler',
    'devlog.post3_summary': 'İlk 90 saniyede tek bir ipucu penceresi göstermeden akustik kuralları oyuncuya nasıl sezdirdik?',
    'devlog.post3_body': 'Prototip testlerinde açılır metin kutularını kaldırdığımızda oyuncuların mekânı okuma hızının arttığını gözlemledik. Taş koridorlardaki yankı gecikmesini görsel dalga halkalarıyla eşleştirerek kural setini doğrudan fiziksel ortama gömdük.',
    // Press Kit Page (press-kit.html)
    'press.eyebrow': 'BASIN & YAYINCI KAYNAKLARI',
    'press.title_fill': 'BASIN',
    'press.title_stroke': 'KİTİ.',
    'press.subtitle': 'Aderion Studio ve projelerimiz hakkında yayınlarda kullanılabilecek doğrulanmış bilgiler, yüksek çözünürlüklü logolar ve görsel materyaller.',
    'press.download_all': 'TÜM BASIN PAKETİNİ İNDİR (.ZIP)',
    'press.factsheet_title': 'KÜNYE / BİLGİ KARTI',
    'press.fact_studio': 'Stüdyo Adı',
    'press.fact_founded': 'Kuruluş Yılı',
    'press.fact_location': 'Merkez',
    'press.fact_platforms': 'Platformlar',
    'press.fact_website': 'Web Sitesi',
    'press.fact_contact': 'İletişim',
    'press.bio_title': 'STÜDYO HAKKINDA',
    'press.bio_text': 'Aderion Studio, İstanbul ve Berlin ekseninde çalışan üç kişilik bağımsız bir oyun stüdyosudur. Taktiksel derinlik, atmosferik anlatı ve yüksek performanslı özel sistemler üzerine odaklanan stüdyo, ilk büyük projesi Ashes of Veridia üzerinde çalışmaktadır.',
    'press.logos_title': 'STÜDYO LOGOLARI & İŞARETLER',
    'press.logos_desc': 'Koyu ve açık zeminler için ölçeklenebilir vektör (SVG) stüdyo amblemi ve kelime işareti dosyaları.',
    'press.download_svg': 'SVG İNDİR',
    'press.download_zip': 'ARŞİV İNDİR (.ZIP)',
    'press.media_title': 'OYUN GÖRSELLERİ & KONSEPT ÇİZİMLER',
    'press.permissions_title': 'YAYIN & İÇERİK ÜRETİCİ İZİNLERİ',
    'press.permissions_text': 'Aderion Studio, basın mensuplarının, inceleme yazarlarının ve video içerik üreticilerinin bu sayfadaki tüm medya varlıklarını ve oyun görüntülerimizi (para kazanma dahil) haber, inceleme ve yayınlarda kullanmasına açık izin verir.',
    // Modal & Common Footer
    'modal.close': 'KAPAT [ESC]',
    'modal.trailer_title': 'OYUN FRAGMANI',
    'footer.rights': '© 2026 Aderion Studio. Tüm hakları saklıdır.',
    'footer.security': 'Güvenlik Politikası',
    'footer.rss': 'RSS Beslemesi',
};
const en = {
    // Navigation
    'nav.studio_name': 'ADERION STUDIO',
    'nav.about': 'ABOUT',
    'nav.credit': 'CREDIT',
    'nav.games': 'GAMES',
    'nav.devlog': 'DEVLOG',
    'nav.presskit': 'PRESS KIT',
    'nav.cta_projects': 'VIEW OUR PROJECTS ↗',
    'nav.menu_toggle': 'Toggle navigation menu',
    'nav.lang_label': 'Switch language (Turkish / English)',
    'nav.theme_toggle': 'Toggle color theme (Light / Dark)',
    // Hero (index.html)
    'hero.eyebrow': 'INDEPENDENT GAME STUDIO / 2026',
    'hero.title_fill': 'WE ARE NOT THE SAME.',
    'hero.title_stroke': 'WE ARE TOGETHER.',
    'hero.description': 'Different disciplines. One shared game world. We craft independent games that unite narrative-driven atmosphere with precision engineering.',
    'hero.cta_trailer': 'WATCH TRAILER',
    'hero.cta_catalog': 'GAME CATALOG ↗',
    'hero.ribbon': 'PROJECT 001 — NEW WORLDS, SHARED TRACES',
    'hero.featured_tag': 'FEATURED PROJECT // 01',
    'hero.featured_title': '[REDACTED]',
    'hero.featured_meta': 'Mystery Visual Novel — In Active Development',
    // Bottom 4-Column Strip (index.html)
    'strip.col1_num': '01 / DISCIPLINE',
    'strip.col1_title': 'Narrative & Worldbuilding',
    'strip.col1_desc': 'Branching stories, environmental storytelling, and living mythologies.',
    'strip.col2_num': '02 / ART',
    'strip.col2_title': 'Editorial & Cinematic Atmosphere',
    'strip.col2_desc': 'High-contrast lighting, handcrafted concept art, and bespoke sound design.',
    'strip.col3_num': '03 / ENGINEERING',
    'strip.col3_title': 'Custom Systems & Performance',
    'strip.col3_desc': 'Fluid frame rates, modular tooling, and responsive gameplay mechanics.',
    'strip.col4_num': '04 / CREDITS & TEAM',
    'strip.col4_title': 'Aderion Core Team, One Vision',
    'strip.col4_desc': 'Independent, transparent, player-first studio craft.',
    // About & Credits (index.html, credit.html)
    'about.eyebrow': '01 // COMMUNITY & OFFICIAL CHANNELS',
    'about.title': 'Follow Aderion Studios',
    'about.body': 'Aderion Studio was founded in 2026 by independent developers. We treat every project not as a commercial template, but as a lasting experience where art direction, systems design, and respect for the player converge.',
    'about.subtitle': 'Official channels for game development updates, announcements, and community discussions.',
    'about.yt_desc': 'Official trailers, developer logs, and video content',
    'about.x_desc': 'Instant news, development notes, and announcements',
    'about.ig_desc': 'Concept art, visual design, and studio updates',
    'about.reddit_desc': 'Community discussions, feedback, and theories',
    'about.patreon_desc': 'Exclusive studio content, developer support, and early access',
    'credit.eyebrow': '02 // CREDITS & DEPARTMENTS',
    'credit.title': 'Studio Leadership & Roster',
    'credit.subtitle': 'The core team directing independent production, art vision, and server infrastructure at Aderion Studio.',
    'credit.dept_founder': 'FOUNDER & STUDIO LEADERSHIP',
    'credit.dept_director': 'TECHNICAL DIRECTION & INFRASTRUCTURE',
    'credit.role_1': 'Founder, Studio Owner & Creative Designer',
    'credit.role_2': 'Chief / Site Director — DevOps & Server Architecture',
    'credit.role_3': 'Systems Architecture & Gameplay Engineering',
    'credit.meta_stettin': 'Founder & Design Director',
    'credit.meta_flaouve': 'Chief / DevOps & Systems Lead',
    // Games Page (games.html - Coming Soon)
    'games.coming_eyebrow': 'PROJECTS & PRODUCTIONS // COMING SOON',
    'games.coming_title_fill': 'UNDER',
    'games.coming_title_stroke': 'DEVELOPMENT.',
    'games.coming_subtitle': 'Our independent game productions and this showcase section are currently under active preparation. Official announcements will be shared here soon.',
    'games.coming_status': 'STATUS: UNDER PREPARATION',
    'games.coming_heading': 'Crafting Our Debut Production With Care',
    'games.coming_text': 'Combining environmental storytelling, atmospheric soundscapes, and distinctive gameplay mechanics, our independent titles are taking shape. Development logs, first screenshots, and trailers will soon be revealed here.',
    'games.feat1_tag': '01 // VISION',
    'games.feat1_title': 'Indie Spirit, Original Lore',
    'games.feat1_desc': 'Deep narrative universes and captivating atmospheric journeys.',
    'games.feat2_tag': '02 // DESIGN',
    'games.feat2_title': 'Original Art & Sound',
    'games.feat2_desc': 'Handcrafted visual aesthetics and spatial acoustic design.',
    'games.feat3_tag': '03 // ENGINEERING',
    'games.feat3_title': 'Modern & Responsive Systems',
    'games.feat3_desc': 'High-performance mechanics and robust modular architecture.',
    'games.coming_btn_community': 'JOIN COMMUNITY ↗',
    'games.coming_btn_team': 'MEET THE TEAM ↗',
    // Games Page (games.html - Catalog)
    'games.eyebrow': 'STUDIO CATALOG // 2026',
    'games.title_fill': 'WORLDS BUILT',
    'games.title_stroke': 'TO BE LIVED.',
    'games.subtitle': 'Our released titles, flagship production in active development, and experimental prototypes.',
    'games.filter_all': 'ALL (03)',
    'games.filter_released': 'RELEASED',
    'games.filter_dev': 'IN DEVELOPMENT',
    'games.status_dev': 'IN DEVELOPMENT',
    'games.status_released': 'RELEASED',
    'games.status_proto': 'PROTOTYPE',
    'games.btn_trailer': 'WATCH TRAILER',
    'games.btn_steam': 'STEAM PAGE ↗',
    'games.sysreq_title': 'SYSTEM REQUIREMENTS',
    'games.sysreq_min': 'MINIMUM',
    'games.sysreq_rec': 'RECOMMENDED',
    'games.sysreq_os': 'OS',
    'games.sysreq_cpu': 'Processor',
    'games.sysreq_ram': 'Memory',
    'games.sysreq_gpu': 'Graphics',
    'games.sysreq_storage': 'Storage',
    'games.gallery_title': 'CONCEPT & SCREENSHOTS',
    'games.g1_title': 'Ashes of Veridia',
    'games.g1_genre': 'Tactical RPG / Atmospheric',
    'games.g1_desc': 'A turn-based tactical journey shaped by survival and moral consequence across an ancient ash-covered archipelago.',
    'games.g2_title': 'Nocturne Signal',
    'games.g2_genre': 'Narrative Mystery / Sci-Fi',
    'games.g2_desc': 'Decode analog radio frequencies aboard an abandoned orbital listening station to trace a missing crew.',
    'games.g3_title': 'Echoes of Khora',
    'games.g3_genre': 'Experimental Puzzle / Acoustic',
    'games.g3_desc': 'A short experimental prototype set in minimalist architecture built around spatial echo and acoustic resonance.',
    // Devlog Page (devlog.html)
    'devlog.eyebrow': 'DEVLOG // STUDIO DISPATCHES',
    'devlog.title_fill': 'CODE, LIGHT AND',
    'devlog.title_stroke': 'FIELD NOTES.',
    'devlog.subtitle': 'Unfiltered engineering and design logs covering engine architecture, art direction, and gameplay systems.',
    'devlog.rss_cta': 'RSS FEED ↗',
    'devlog.read_more': 'READ ENTRY',
    'devlog.post1_date': 'NOV 14, 2026',
    'devlog.post1_tag': 'ARCHITECTURE / RENDER',
    'devlog.post1_title': 'Dynamic Ash and Volumetric Fog Pipeline for Ashes of Veridia',
    'devlog.post1_summary': 'A breakdown of how we preserve high-contrast editorial lighting without exceeding mid-tier GPU frame budgets.',
    'devlog.post1_body': 'The visual identity of Veridia relies on controlled light scattering rather than crushed blacks. By combining screen-space volumetric sampling with a custom particle density map, we achieved a consistent atmosphere under 0.8 ms at 1080p.',
    'devlog.post2_date': 'OCT 28, 2026',
    'devlog.post2_tag': 'AUDIO / NARRATIVE',
    'devlog.post2_title': 'Nocturne Signal: Turning Analog Radio Synthesis into Core Gameplay',
    'devlog.post2_summary': 'Static interference and real-time DSP filters become a primary narrative discovery mechanic rather than UI decoration.',
    'devlog.post2_body': 'Each turn of the frequency dial blends two distinct audio layers via real-time cross-modulation. Approaching the target band clarifies dialogue fragments and unlocks chronological ship logs.',
    'devlog.post3_date': 'OCT 05, 2026',
    'devlog.post3_tag': 'DESIGN / PROTOTYPE',
    'devlog.post3_title': 'Echoes of Khora: Lessons in Textless Onboarding Design',
    'devlog.post3_summary': 'How we taught acoustic puzzle rules in the first 90 seconds without showing a single tutorial popup.',
    'devlog.post3_body': 'Removing popup prompts during playtests actually accelerated spatial comprehension. By pairing stone corridor echo decay with subtle visual wave rings, the rule set was embedded directly into the architecture.',
    // Press Kit Page (press-kit.html)
    'press.eyebrow': 'PRESS & PUBLISHER RESOURCES',
    'press.title_fill': 'PRESS',
    'press.title_stroke': 'KIT.',
    'press.subtitle': 'Verified studio facts, high-resolution logos, and editorial visual assets cleared for press and creator coverage.',
    'press.download_all': 'DOWNLOAD FULL PRESS KIT (.ZIP)',
    'press.factsheet_title': 'FACT SHEET',
    'press.fact_studio': 'Studio Name',
    'press.fact_founded': 'Founded',
    'press.fact_location': 'Location',
    'press.fact_platforms': 'Platforms',
    'press.fact_website': 'Website',
    'press.fact_contact': 'Contact',
    'press.bio_title': 'STUDIO BIO',
    'press.bio_text': 'Aderion Studio is a three-person independent game studio operating between Istanbul and Berlin. Focused on tactical depth, atmospheric storytelling, and high-performance custom systems, the studio is currently developing its flagship title Ashes of Veridia.',
    'press.logos_title': 'STUDIO LOGOS & MARKS',
    'press.logos_desc': 'Scalable vector (SVG) studio emblem and wordmark assets prepared for dark and light editorial backgrounds.',
    'press.download_svg': 'DOWNLOAD SVG',
    'press.download_zip': 'DOWNLOAD ARCHIVE (.ZIP)',
    'press.media_title': 'GAME ARTWORK & SCREENSHOTS',
    'press.permissions_title': 'PRESS & CREATOR PERMISSIONS',
    'press.permissions_text': 'Aderion Studio grants explicit permission to journalists, reviewers, and content creators to use all media assets on this page and our gameplay footage (including monetized coverage) in editorial articles, reviews, and broadcasts.',
    // Modal & Common Footer
    'modal.close': 'CLOSE [ESC]',
    'modal.trailer_title': 'GAME TRAILER',
    'footer.rights': '© 2026 Aderion Studio. All rights reserved.',
    'footer.security': 'Security Policy',
    'footer.rss': 'RSS Feed',
};
const TRANSLATIONS = { tr, en };
let currentLocale = 'tr';
function isLocale(value) {
    return value === 'tr' || value === 'en';
}
function isTranslationKey(key) {
    return Object.prototype.hasOwnProperty.call(TRANSLATIONS[currentLocale], key);
}
/**
 * Resolves the visitor's preferred locale from localStorage or navigator.language.
 */
function detectLocale() {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (isLocale(stored)) {
            return stored;
        }
    }
    catch {
        // Ignore storage access errors in restricted privacy contexts.
    }
    if (typeof navigator !== 'undefined') {
        const primaryLang = (navigator.languages && navigator.languages.length > 0)
            ? navigator.languages[0]
            : navigator.language;
        if (typeof primaryLang === 'string') {
            return primaryLang.toLowerCase().startsWith('tr') ? 'tr' : 'en';
        }
    }
    return 'en';
}
/**
 * Looks up a translation string for the active locale using strict compile-time keys.
 */
function t(key) {
    return TRANSLATIONS[currentLocale][key] ?? TRANSLATIONS.tr[key];
}
/**
 * Returns the currently active locale.
 */
function getLocale() {
    return currentLocale;
}
/**
 * Updates the active locale, persists preference safely, and refreshes the DOM.
 */
function setLocale(locale) {
    currentLocale = locale;
    try {
        window.localStorage.setItem(STORAGE_KEY, locale);
    }
    catch {
        // Ignore storage write failures in restricted privacy contexts.
    }
    applyTranslations();
}
/**
 * Applies active locale translations across all data-i18n, data-i18n-aria, and toggle elements.
 */
function applyTranslations() {
    document.documentElement.lang = currentLocale;
    const textTargets = document.querySelectorAll('[data-i18n]');
    textTargets.forEach((el) => {
        const key = el.dataset.i18n;
        if (key && isTranslationKey(key)) {
            el.textContent = t(key);
        }
    });
    const bilingualTargets = document.querySelectorAll('[data-lang-tr][data-lang-en]');
    bilingualTargets.forEach((el) => {
        el.textContent = currentLocale === 'tr' ? el.dataset.langTr : el.dataset.langEn;
    });
    const ariaTargets = document.querySelectorAll('[data-i18n-aria]');
    ariaTargets.forEach((el) => {
        const key = el.getAttribute('data-i18n-aria');
        if (key && isTranslationKey(key)) {
            el.setAttribute('aria-label', t(key));
        }
    });
    const toggles = document.querySelectorAll('[data-lang-toggle]');
    const label = t('nav.lang_label');
    toggles.forEach((toggle) => {
        toggle.dataset.activeLocale = currentLocale;
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
        const options = toggle.querySelectorAll('[data-lang-opt]');
        if (options.length > 0) {
            options.forEach((opt) => {
                const isActive = opt.dataset.langOpt === currentLocale;
                opt.classList.toggle('is-active', isActive);
                opt.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        }
        else {
            toggle.textContent = currentLocale === 'tr' ? '[TR] / EN' : 'TR / [EN]';
        }
    });
}
/**
 * Initializes the localization engine using the detected locale.
 */
function initI18n() {
    currentLocale = detectLocale();
    applyTranslations();
}




const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');
/**
 * Validates an iframe embed URL against HTTPS and the studio origin allowlist.
 */
function parseAllowedEmbedUrl(rawUrl) {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
        return null;
    }
    try {
        const parsed = new URL(trimmed, window.location.href);
        if (parsed.protocol !== 'https:') {
            return null;
        }
        if (!STUDIO_CONFIG.allowedIframeOrigins.includes(parsed.origin)) {
            return null;
        }
        return parsed;
    }
    catch {
        return null;
    }
}
/**
 * Validates an image URL to allow relative or HTTP(S) assets while rejecting active schemes.
 */
function sanitizeAssetUrl(rawUrl) {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
        return null;
    }
    try {
        const parsed = new URL(trimmed, window.location.href);
        const isHttp = parsed.protocol === 'https:' || parsed.protocol === 'http:';
        const isLocalFile = window.location.protocol === 'file:' && parsed.protocol === 'file:';
        if (!isHttp && !isLocalFile) {
            return null;
        }
        return trimmed;
    }
    catch {
        return null;
    }
}
/**
 * Resolves the trailer URL from a trigger element or matching configured game entry.
 */
function resolveTrailerUrl(trigger) {
    const explicitUrl = trigger.dataset.trailerUrl || trigger.dataset.trailerTrigger || '';
    if (explicitUrl) {
        return explicitUrl;
    }
    const gameId = trigger.dataset.gameId;
    if (gameId) {
        const matched = STUDIO_CONFIG.games.find((game) => game.id === gameId);
        return matched ? matched.trailerUrl : '';
    }
    if (trigger instanceof HTMLAnchorElement) {
        const hrefAttr = trigger.getAttribute('href') ?? '';
        if (hrefAttr && !hrefAttr.startsWith('#')) {
            return hrefAttr;
        }
    }
    return STUDIO_CONFIG.games[0]?.trailerUrl ?? '';
}
/**
 * Hydrates studio badge and year elements that are not bound to i18n keys.
 */
function syncStudioMetadata() {
    const badges = document.querySelectorAll('[data-studio-badge]');
    badges.forEach((el) => {
        if (!el.hasAttribute('data-i18n')) {
            el.textContent = STUDIO_CONFIG.badgeNumber;
        }
    });
    const years = document.querySelectorAll('[data-studio-year]');
    years.forEach((el) => {
        if (!el.hasAttribute('data-i18n')) {
            el.textContent = String(STUDIO_CONFIG.foundedYear);
        }
    });
}
const STORAGE_THEME_KEY = 'aderion_theme_pref';
function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'dark'
        : 'light';
}
function updateThemeControls() {
    const currentTheme = getTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const iconText = currentTheme === 'dark' ? '☀️' : '🌙';
    const ariaLabel = getLocale() === 'tr'
        ? `${nextTheme === 'dark' ? 'Karanlık' : 'Açık'} temaya geç`
        : `Switch to ${nextTheme} theme`;
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach((toggle) => {
        toggle.setAttribute('aria-label', ariaLabel);
        toggle.setAttribute('title', ariaLabel);
        const iconEl = toggle.querySelector('[data-theme-icon]');
        if (iconEl) {
            iconEl.textContent = iconText;
        }
        const labelEl = toggle.querySelector('[data-theme-label]');
        if (labelEl) {
            labelEl.remove();
        }
    });
}
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.removeAttribute('data-theme');
    }
    try {
        window.localStorage.setItem(STORAGE_THEME_KEY, theme);
    }
    catch {
        // Ignore storage write failures in restricted contexts.
    }
    updateThemeControls();
}
function initTheme() {
    let theme = 'light';
    try {
        // Clear any stale legacy theme keys
        window.localStorage.removeItem('preferred_theme');
        const stored = window.localStorage.getItem(STORAGE_THEME_KEY);
        if (stored === 'light' || stored === 'dark') {
            theme = stored;
        }
    }
    catch {
        // Ignore storage read failures.
    }
    setTheme(theme);
}
function bindThemeToggle() {
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const nextTheme = getTheme() === 'light' ? 'dark' : 'light';
            setTheme(nextTheme);
        });
    });
}
/**
 * Synchronizes localized titles and roles for dynamically generated credit sections.
 */
function updateDynamicCredits(locale) {
    const deptTitles = document.querySelectorAll('[data-dept-title]');
    deptTitles.forEach((el) => {
        const text = locale === 'tr' ? el.dataset.titleTr : el.dataset.titleEn;
        if (text) {
            el.textContent = text;
        }
    });
    const memberRoles = document.querySelectorAll('[data-credit-role]');
    memberRoles.forEach((el) => {
        const text = locale === 'tr' ? el.dataset.roleTr : el.dataset.roleEn;
        if (text) {
            el.textContent = text;
        }
    });
    const memberMetas = document.querySelectorAll('[data-credit-meta]');
    memberMetas.forEach((el) => {
        const text = locale === 'tr' ? el.dataset.metaTr : el.dataset.metaEn;
        if (text) {
            el.textContent = text;
        }
    });
    const statusBubbles = document.querySelectorAll('[data-status-bubble]');
    statusBubbles.forEach((bubble) => {
        const textEl = bubble.querySelector('.status-bubble-text');
        const text = (locale === 'tr' ? bubble.dataset.bubbleTr : bubble.dataset.bubbleEn) ||
            bubble.dataset.bubbleTr ||
            bubble.dataset.bubbleEn;
        if (textEl && text) {
            textEl.textContent = text;
        }
    });
}
/**
 * Binds language toggle controls across header and mobile drawer.
 */
function bindLanguageToggle() {
    const toggles = document.querySelectorAll('[data-lang-toggle]');
    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const nextLocale = getLocale() === 'tr' ? 'en' : 'tr';
            setLocale(nextLocale);
            updateDynamicCredits(nextLocale);
            updateThemeControls();
        });
    });
}
/**
 * Binds game catalog status filters ([data-game-filter] -> [data-game-status]).
 */
function bindGameFilters() {
    const filterButtons = document.querySelectorAll('[data-game-filter]');
    const gameCards = document.querySelectorAll('[data-game-status]');
    if (filterButtons.length === 0 || gameCards.length === 0) {
        return;
    }
    const applyFilter = (activeFilter) => {
        filterButtons.forEach((btn) => {
            const btnFilter = btn.dataset.gameFilter ?? 'all';
            const isActive = btnFilter === activeFilter;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });
        gameCards.forEach((card) => {
            const status = card.dataset.gameStatus ?? '';
            let isVisible = false;
            if (activeFilter === 'all') {
                isVisible = true;
            }
            else if (activeFilter === 'released') {
                isVisible = status === 'released';
            }
            else if (activeFilter === 'dev') {
                isVisible = status === 'dev' || status === 'proto';
            }
            else {
                isVisible = status === activeFilter;
            }
            card.hidden = !isVisible;
            card.classList.toggle('is-hidden', !isVisible);
        });
    };
    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            applyFilter(btn.dataset.gameFilter ?? 'all');
        });
    });
}
/**
 * Initializes all interactive DOM controls once the document is ready.
 */
function initApp() {
    initI18n();
    initTheme();
    syncStudioMetadata();
    updateDynamicCredits(getLocale());
    bindLanguageToggle();
    bindThemeToggle();
    bindGameFilters();
    const drawer = document.querySelector('[data-nav-drawer]');
    const menuToggles = document.querySelectorAll('[data-menu-toggle]');
    const isDrawerOpen = () => Boolean(drawer && drawer.classList.contains('is-open'));
    const setDrawerOpen = (open, restoreFocus = false) => {
        if (!drawer) {
            return;
        }
        drawer.classList.toggle('is-open', open);
        document.body.classList.toggle('menu-open', open);
        menuToggles.forEach((btn) => {
            btn.setAttribute('aria-expanded', String(open));
        });
        if (!open && restoreFocus) {
            menuToggles[0]?.focus();
        }
    };
    menuToggles.forEach((btn) => {
        btn.addEventListener('click', () => {
            setDrawerOpen(!isDrawerOpen());
        });
    });
    if (drawer) {
        const drawerLinks = drawer.querySelectorAll('a[href]');
        drawerLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (isDrawerOpen()) {
                    setDrawerOpen(false);
                }
            });
        });
    }
    const modal = document.querySelector('[data-modal]');
    const modalBody = document.querySelector('[data-modal-body]');
    const modalTitle = document.querySelector('[data-modal-title]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    let lastFocusedElement = null;
    let previousBodyOverflow = '';
    const isModalOpen = () => Boolean(modal && modal.getAttribute('aria-hidden') === 'false');
    const openModal = (content, titleText) => {
        if (!modal || !modalBody) {
            return;
        }
        lastFocusedElement =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
        if (modalTitle) {
            modalTitle.textContent = titleText;
        }
        modalBody.replaceChildren(content);
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('is-open');
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        modalCloseButtons[0]?.focus();
    };
    const closeModal = () => {
        if (!modal || !isModalOpen()) {
            return;
        }
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('is-open');
        modalBody?.replaceChildren();
        document.body.classList.remove('modal-open');
        document.body.style.overflow = previousBodyOverflow;
        if (lastFocusedElement && lastFocusedElement.isConnected) {
            lastFocusedElement.focus();
        }
        lastFocusedElement = null;
    };
    modalCloseButtons.forEach((btn) => {
        btn.addEventListener('click', closeModal);
    });
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    const trailerTriggers = document.querySelectorAll('[data-trailer-trigger]');
    trailerTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            const rawUrl = resolveTrailerUrl(trigger);
            const validUrl = parseAllowedEmbedUrl(rawUrl);
            const titleText = trigger.dataset.trailerTitle || t('modal.trailer_title');
            if (!validUrl) {
                return;
            }
            const iframe = document.createElement('iframe');
            iframe.src = validUrl.toString();
            iframe.title = titleText;
            iframe.className = 'modal-trailer-frame';
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            openModal(iframe, titleText);
        });
    });
    const lightboxTriggers = document.querySelectorAll('[data-lightbox-src]');
    lightboxTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            const safeSrc = sanitizeAssetUrl(trigger.dataset.lightboxSrc ?? '');
            if (!safeSrc) {
                return;
            }
            const altText = trigger.dataset.lightboxAlt ||
                trigger.getAttribute('aria-label') ||
                '';
            const titleText = altText || t('games.gallery_title');
            const img = document.createElement('img');
            img.setAttribute('src', safeSrc);
            img.setAttribute('alt', altText);
            img.className = 'modal-lightbox-image';
            openModal(img, titleText);
        });
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (isModalOpen()) {
                event.preventDefault();
                closeModal();
                return;
            }
            if (isDrawerOpen()) {
                event.preventDefault();
                setDrawerOpen(false, true);
            }
            return;
        }
        if (event.key === 'Tab' && isModalOpen() && modal) {
            const focusables = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => !el.hasAttribute('disabled') && el.getClientRects().length > 0);
            if (focusables.length === 0) {
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
}
else {
    initApp();
}

})();
