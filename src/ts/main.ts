import { STUDIO_CONFIG } from './config.js';
import { getLocale, initI18n, setLocale, t } from './i18n.js';

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
function parseAllowedEmbedUrl(rawUrl: string): URL | null {
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
  } catch {
    return null;
  }
}

/**
 * Validates an image URL to allow relative or HTTP(S) assets while rejecting active schemes.
 */
function sanitizeAssetUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed, window.location.href);
    const isHttp = parsed.protocol === 'https:' || parsed.protocol === 'http:';
    const isLocalFile =
      window.location.protocol === 'file:' && parsed.protocol === 'file:';

    if (!isHttp && !isLocalFile) {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}

/**
 * Resolves the trailer URL from a trigger element or matching configured game entry.
 */
function resolveTrailerUrl(trigger: HTMLElement): string {
  const explicitUrl =
    trigger.dataset.trailerUrl || trigger.dataset.trailerTrigger || '';
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
function syncStudioMetadata(): void {
  const badges = document.querySelectorAll<HTMLElement>('[data-studio-badge]');
  badges.forEach((el) => {
    if (!el.hasAttribute('data-i18n')) {
      el.textContent = STUDIO_CONFIG.badgeNumber;
    }
  });

  const years = document.querySelectorAll<HTMLElement>('[data-studio-year]');
  years.forEach((el) => {
    if (!el.hasAttribute('data-i18n')) {
      el.textContent = String(STUDIO_CONFIG.foundedYear);
    }
  });
}

const STORAGE_THEME_KEY = 'aderion_theme_pref';

export type Theme = 'dark' | 'light';

export function getTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

export function updateThemeControls(): void {
  const currentTheme = getTheme();
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const iconText = currentTheme === 'dark' ? '☀️' : '🌙';
  const ariaLabel =
    getLocale() === 'tr'
      ? `${nextTheme === 'dark' ? 'Karanlık' : 'Açık'} temaya geç`
      : `Switch to ${nextTheme} theme`;

  const toggles = document.querySelectorAll<HTMLElement>('[data-theme-toggle]');
  toggles.forEach((toggle) => {
    toggle.setAttribute('aria-label', ariaLabel);
    toggle.setAttribute('title', ariaLabel);

    const iconEl = toggle.querySelector<HTMLElement>('[data-theme-icon]');
    if (iconEl) {
      iconEl.textContent = iconText;
    }

    const labelEl = toggle.querySelector<HTMLElement>('[data-theme-label]');
    if (labelEl) {
      labelEl.remove();
    }
  });
}

export function setTheme(theme: Theme): void {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  try {
    window.localStorage.setItem(STORAGE_THEME_KEY, theme);
  } catch {
    // Ignore storage write failures in restricted contexts.
  }

  updateThemeControls();
}

function initTheme(): void {
  let theme: Theme = 'light';
  try {
    // Clear any stale legacy theme keys
    window.localStorage.removeItem('preferred_theme');
    const stored = window.localStorage.getItem(STORAGE_THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    }
  } catch {
    // Ignore storage read failures.
  }

  setTheme(theme);
}

function bindThemeToggle(): void {
  const toggles = document.querySelectorAll<HTMLElement>('[data-theme-toggle]');
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const nextTheme: Theme = getTheme() === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
    });
  });
}

/**
 * Synchronizes localized titles and roles for dynamically generated credit sections.
 */
function updateDynamicCredits(locale: 'tr' | 'en'): void {
  const deptTitles = document.querySelectorAll<HTMLElement>('[data-dept-title]');
  deptTitles.forEach((el) => {
    const text = locale === 'tr' ? el.dataset.titleTr : el.dataset.titleEn;
    if (text) {
      el.textContent = text;
    }
  });

  const memberRoles = document.querySelectorAll<HTMLElement>('[data-credit-role]');
  memberRoles.forEach((el) => {
    const text = locale === 'tr' ? el.dataset.roleTr : el.dataset.roleEn;
    if (text) {
      el.textContent = text;
    }
  });

  const memberMetas = document.querySelectorAll<HTMLElement>('[data-credit-meta]');
  memberMetas.forEach((el) => {
    const text = locale === 'tr' ? el.dataset.metaTr : el.dataset.metaEn;
    if (text) {
      el.textContent = text;
    }
  });

  const statusBubbles = document.querySelectorAll<HTMLElement>('[data-status-bubble]');
  statusBubbles.forEach((bubble) => {
    const textEl = bubble.querySelector<HTMLElement>('.status-bubble-text');
    const text =
      (locale === 'tr' ? bubble.dataset.bubbleTr : bubble.dataset.bubbleEn) ||
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
function bindLanguageToggle(): void {
  const toggles = document.querySelectorAll<HTMLElement>('[data-lang-toggle]');
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
function bindGameFilters(): void {
  const filterButtons =
    document.querySelectorAll<HTMLElement>('[data-game-filter]');
  const gameCards =
    document.querySelectorAll<HTMLElement>('[data-game-status]');

  if (filterButtons.length === 0 || gameCards.length === 0) {
    return;
  }

  const applyFilter = (activeFilter: string): void => {
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
      } else if (activeFilter === 'released') {
        isVisible = status === 'released';
      } else if (activeFilter === 'dev') {
        isVisible = status === 'dev' || status === 'proto';
      } else {
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
function initApp(): void {
  initI18n();
  initTheme();
  syncStudioMetadata();
  updateDynamicCredits(getLocale());
  bindLanguageToggle();
  bindThemeToggle();
  bindGameFilters();

  const drawer = document.querySelector<HTMLElement>('[data-nav-drawer]');
  const menuToggles =
    document.querySelectorAll<HTMLElement>('[data-menu-toggle]');

  const isDrawerOpen = (): boolean =>
    Boolean(drawer && drawer.classList.contains('is-open'));

  const setDrawerOpen = (open: boolean, restoreFocus = false): void => {
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
    const drawerLinks = drawer.querySelectorAll<HTMLAnchorElement>('a[href]');
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (isDrawerOpen()) {
          setDrawerOpen(false);
        }
      });
    });
  }

  const modal = document.querySelector<HTMLElement>('[data-modal]');
  const modalBody = document.querySelector<HTMLElement>('[data-modal-body]');
  const modalTitle = document.querySelector<HTMLElement>('[data-modal-title]');
  const modalCloseButtons =
    document.querySelectorAll<HTMLElement>('[data-modal-close]');

  let lastFocusedElement: HTMLElement | null = null;
  let previousBodyOverflow = '';

  const isModalOpen = (): boolean =>
    Boolean(modal && modal.getAttribute('aria-hidden') === 'false');

  const openModal = (content: Node, titleText: string): void => {
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

  const closeModal = (): void => {
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
    modal.addEventListener('click', (event: MouseEvent) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  const trailerTriggers = document.querySelectorAll<HTMLElement>(
    '[data-trailer-trigger]'
  );
  trailerTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();

      const rawUrl = resolveTrailerUrl(trigger);
      const validUrl = parseAllowedEmbedUrl(rawUrl);
      const titleText =
        trigger.dataset.trailerTitle || t('modal.trailer_title');

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
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      );

      openModal(iframe, titleText);
    });
  });

  const lightboxTriggers =
    document.querySelectorAll<HTMLElement>('[data-lightbox-src]');
  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();

      const safeSrc = sanitizeAssetUrl(trigger.dataset.lightboxSrc ?? '');
      if (!safeSrc) {
        return;
      }

      const altText =
        trigger.dataset.lightboxAlt ||
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

  document.addEventListener('keydown', (event: KeyboardEvent) => {
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
      const focusables = Array.from(
        modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(
        (el) => !el.hasAttribute('disabled') && el.getClientRects().length > 0
      );

      if (focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
