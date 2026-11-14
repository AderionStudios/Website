/**
 * Supported interface locales for the static studio platform.
 */
export type Locale = 'tr' | 'en';

/**
 * Exhaustive translation schema enforced at compile time.
 * Any missing or misspelled key causes a TypeScript build failure.
 */
export interface TranslationSchema {
  // Navigation
  'nav.studio_name': string;
  'nav.about': string;
  'nav.credit': string;
  'nav.games': string;
  'nav.devlog': string;
  'nav.presskit': string;
  'nav.cta_projects': string;
  'nav.menu_toggle': string;
  'nav.lang_label': string;
  'nav.theme_toggle': string;

  // Hero (index.html)
  'hero.eyebrow': string;
  'hero.title_fill': string;
  'hero.title_stroke': string;
  'hero.description': string;
  'hero.cta_trailer': string;
  'hero.cta_catalog': string;
  'hero.ribbon': string;
  'hero.featured_tag': string;
  'hero.featured_title': string;
  'hero.featured_meta': string;

  // Bottom 4-Column Strip (index.html)
  'strip.col1_num': string;
  'strip.col1_title': string;
  'strip.col1_desc': string;
  'strip.col2_num': string;
  'strip.col2_title': string;
  'strip.col2_desc': string;
  'strip.col3_num': string;
  'strip.col3_title': string;
  'strip.col3_desc': string;
  'strip.col4_num': string;
  'strip.col4_title': string;
  'strip.col4_desc': string;

  // About & Credits (index.html, credit.html)
  'about.eyebrow': string;
  'about.title': string;
  'about.body': string;
  'about.subtitle': string;
  'about.yt_desc': string;
  'about.x_desc': string;
  'about.ig_desc': string;
  'about.reddit_desc': string;
  'about.patreon_desc': string;
  'credit.eyebrow': string;
  'credit.title': string;
  'credit.subtitle': string;
  'credit.dept_founder': string;
  'credit.dept_director': string;
  'credit.role_1': string;
  'credit.role_2': string;
  'credit.role_3': string;
  'credit.meta_stettin': string;
  'credit.meta_flaouve': string;

  // Games Page (games.html - Coming Soon)
  'games.coming_eyebrow': string;
  'games.coming_title_fill': string;
  'games.coming_title_stroke': string;
  'games.coming_subtitle': string;
  'games.coming_status': string;
  'games.coming_heading': string;
  'games.coming_text': string;
  'games.feat1_tag': string;
  'games.feat1_title': string;
  'games.feat1_desc': string;
  'games.feat2_tag': string;
  'games.feat2_title': string;
  'games.feat2_desc': string;
  'games.feat3_tag': string;
  'games.feat3_title': string;
  'games.feat3_desc': string;
  'games.coming_btn_community': string;
  'games.coming_btn_team': string;

  // Games Page (games.html - Catalog)
  'games.eyebrow': string;
  'games.title_fill': string;
  'games.title_stroke': string;
  'games.subtitle': string;
  'games.filter_all': string;
  'games.filter_released': string;
  'games.filter_dev': string;
  'games.status_dev': string;
  'games.status_released': string;
  'games.status_proto': string;
  'games.btn_trailer': string;
  'games.btn_steam': string;
  'games.sysreq_title': string;
  'games.sysreq_min': string;
  'games.sysreq_rec': string;
  'games.sysreq_os': string;
  'games.sysreq_cpu': string;
  'games.sysreq_ram': string;
  'games.sysreq_gpu': string;
  'games.sysreq_storage': string;
  'games.gallery_title': string;
  'games.g1_title': string;
  'games.g1_genre': string;
  'games.g1_desc': string;
  'games.g2_title': string;
  'games.g2_genre': string;
  'games.g2_desc': string;
  'games.g3_title': string;
  'games.g3_genre': string;
  'games.g3_desc': string;

  // Devlog Page (devlog.html)
  'devlog.eyebrow': string;
  'devlog.title_fill': string;
  'devlog.title_stroke': string;
  'devlog.subtitle': string;
  'devlog.rss_cta': string;
  'devlog.read_more': string;
  'devlog.post1_date': string;
  'devlog.post1_tag': string;
  'devlog.post1_title': string;
  'devlog.post1_summary': string;
  'devlog.post1_body': string;
  'devlog.post2_date': string;
  'devlog.post2_tag': string;
  'devlog.post2_title': string;
  'devlog.post2_summary': string;
  'devlog.post2_body': string;
  'devlog.post3_date': string;
  'devlog.post3_tag': string;
  'devlog.post3_title': string;
  'devlog.post3_summary': string;
  'devlog.post3_body': string;

  // Press Kit Page (press-kit.html)
  'press.eyebrow': string;
  'press.title_fill': string;
  'press.title_stroke': string;
  'press.subtitle': string;
  'press.download_all': string;
  'press.factsheet_title': string;
  'press.fact_studio': string;
  'press.fact_founded': string;
  'press.fact_location': string;
  'press.fact_platforms': string;
  'press.fact_website': string;
  'press.fact_contact': string;
  'press.bio_title': string;
  'press.bio_text': string;
  'press.logos_title': string;
  'press.logos_desc': string;
  'press.download_svg': string;
  'press.download_zip': string;
  'press.media_title': string;
  'press.permissions_title': string;
  'press.permissions_text': string;

  // Modal & Common Footer
  'modal.close': string;
  'modal.trailer_title': string;
  'footer.rights': string;
  'footer.security': string;
  'footer.rss': string;
}

export type TranslationKey = keyof TranslationSchema;

export type TranslationDictionaries = Record<Locale, TranslationSchema>;
