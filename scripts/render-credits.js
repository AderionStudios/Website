import fs from 'fs';
import path from 'path';

const LINK_LABELS = {
  discord: 'View Profile ↗',
  github: 'GitHub ↗',
  gitlab: 'GitLab ↗',
  website: 'Website ↗',
  x: 'X ↗',
  twitter: 'X ↗',
  youtube: 'YouTube ↗',
  steam: 'Steam ↗',
  patreon: 'Patreon ↗',
  artstation: 'ArtStation ↗',
  itch: 'itch.io ↗',
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function extractDiscordId(input) {
  if (!input) return null;
  const str = String(input).trim();
  const match = str.match(/\d{17,20}/);
  return match ? match[0] : null;
}

async function downloadFile(url, destPath, force = false) {
  if (!url) return null;
  if (!force && fs.existsSync(destPath)) {
    const size = fs.statSync(destPath).size;
    // If already downloaded and not a tiny thumbnail (< 20KB for banners), keep it
    if (size > 20000 || !destPath.includes('banner')) {
      return destPath;
    }
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
    return destPath;
  } catch (err) {
    console.warn(`Could not download ${url}:`, err.message);
    return null;
  }
}

async function fetchDiscordProfile(discordId) {
  const cacheDir = path.resolve('assets/img/team/discord_cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const profileCacheFile = path.join(cacheDir, `${discordId}_profile.json`);

  let profile = null;
  // If cached and fresh (less than 24 hours), use cache
  if (fs.existsSync(profileCacheFile)) {
    try {
      const stats = fs.statSync(profileCacheFile);
      const isRecent = Date.now() - stats.mtimeMs < 24 * 60 * 60 * 1000;
      if (isRecent) {
        profile = JSON.parse(fs.readFileSync(profileCacheFile, 'utf8'));
      }
    } catch {}
  }

  if (!profile) {
    try {
      console.log(`Fetching Discord profile for ID ${discordId}...`);
      const res = await fetch(`https://japi.rest/discord/v1/user/${discordId}`, {
        headers: { 'User-Agent': 'AderionStudioSite/1.0' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          profile = json;
          fs.writeFileSync(profileCacheFile, JSON.stringify(json, null, 2), 'utf8');
        }
      }
    } catch (e) {
      console.warn(`Failed fetching Discord user ${discordId}:`, e.message);
    }
  }

  if (!profile && fs.existsSync(profileCacheFile)) {
    try {
      profile = JSON.parse(fs.readFileSync(profileCacheFile, 'utf8'));
    } catch {}
  }

  if (!profile || !profile.data) {
    return null;
  }

  const data = profile.data;
  const presence = profile.presence;

  // Cache Avatar (High-Res 512px)
  let avatarPath = data.avatarURL;
  if (data.avatarURL) {
    const ext = data.avatarURL.includes('.gif') ? '.gif' : '.png';
    const localAvatar = path.join(cacheDir, `${discordId}_avatar${ext}`);
    const highResAvatarUrl = data.avatarURL.includes('?') ? data.avatarURL : `${data.avatarURL}?size=512`;
    const downloaded = await downloadFile(highResAvatarUrl, localAvatar);
    if (downloaded) {
      avatarPath = `assets/img/team/discord_cache/${discordId}_avatar${ext}`;
    }
  }

  // Cache Banner (Ultra High-Res 1024px)
  let bannerPath = data.bannerURL;
  if (data.bannerURL) {
    const ext = data.bannerURL.includes('.gif') ? '.gif' : '.png';
    const localBanner = path.join(cacheDir, `${discordId}_banner${ext}`);
    const highResBannerUrl = data.bannerURL.includes('?') ? data.bannerURL : `${data.bannerURL}?size=1024`;
    const downloaded = await downloadFile(highResBannerUrl, localBanner, true);
    if (downloaded) {
      bannerPath = `assets/img/team/discord_cache/${discordId}_banner${ext}`;
    }
  }

  // Cache Avatar Decoration (High-Res)
  let decorationPath = null;
  if (data.avatar_decoration_data?.asset) {
    const decUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${data.avatar_decoration_data.asset}.png?size=256`;
    const localDec = path.join(cacheDir, `${discordId}_decoration.png`);
    const downloaded = await downloadFile(decUrl, localDec);
    if (downloaded) {
      decorationPath = `assets/img/team/discord_cache/${discordId}_decoration.png`;
    }
  }

  return {
    id: data.id,
    globalName: data.global_name || data.username,
    username: data.username,
    avatarUrl: avatarPath || 'assets/img/team/avatar-default.svg',
    bannerUrl: bannerPath,
    decorationUrl: decorationPath,
    clanTag: data.clan?.tag || null,
    customStatus: presence?.activities?.[0]?.state || null,
    status: presence?.status || 'offline',
  };
}

export async function renderCreditsHtml(data) {
  const blocks = [];

  for (const dept of data.departments) {
    const memberCards = [];

    for (const m of dept.members) {
      const discordId = extractDiscordId(m.discordId || m.discord || m.links?.discord);
      let discordProfile = null;
      if (discordId) {
        discordProfile = await fetchDiscordProfile(discordId);
      }

      const displayName = escapeHtml(discordProfile?.globalName || m.name);
      const handle = escapeHtml(discordProfile ? `@${discordProfile.username}` : (m.handle || `@${m.id}`));
      const pronouns = escapeHtml(m.pronouns || (m.id === 'flaouve' ? 'they/them and Any „(-innen)“' : ''));
      const roleBadge = escapeHtml(m.roleBadge || 'MEMBER');
      const roleTr = escapeHtml(m.role_tr || m.role || '');
      const roleEn = escapeHtml(m.role_en || m.role || m.role_tr || '');
      const metaTr = escapeHtml(m.meta_tr || m.meta || '');
      const metaEn = escapeHtml(m.meta_en || m.meta || m.meta_tr || '');

      const avatarSrc = escapeHtml(discordProfile?.avatarUrl || m.avatar || 'assets/img/team/avatar-default.svg');
      const bannerSrc = discordProfile?.bannerUrl ? escapeHtml(discordProfile.bannerUrl) : null;
      const decorationSrc = discordProfile?.decorationUrl ? escapeHtml(discordProfile.decorationUrl) : null;
      const bubbleTr = escapeHtml(m.bubble_tr || m.bubble?.tr || m.status_tr || discordProfile?.customStatus || '');
      const bubbleEn = escapeHtml(m.bubble_en || m.bubble?.en || m.status_en || m.bubble_tr || m.bubble?.tr || discordProfile?.customStatus || '');
      const hasBubble = Boolean(bubbleTr || bubbleEn);
      const clanTag = discordProfile?.clanTag ? escapeHtml(discordProfile.clanTag) : null;

      const profileUrl = discordId ? `https://discord.com/users/${discordId}` : (m.links?.discord || '#');

      // Social Chips (Other links)
      const otherChips = Object.entries(m.links || {})
        .filter(([type, url]) => type !== 'discord' && Boolean(url && url.trim()))
        .map(([type, url]) => {
          const label = LINK_LABELS[type.toLowerCase()] || `${type.toUpperCase()} ↗`;
          return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="social-chip" title="${displayName} ${type}">${label}</a>`;
        })
        .join('\n                    ');

      const cardHtml = `            <article class="discord-profile-card" data-member-id="${escapeHtml(m.id || discordProfile?.username || 'member')}">
              <!-- Discord Banner -->
              <div class="discord-banner-stage"${bannerSrc ? ` style="background-image: url('${bannerSrc}');"` : ''}>
                ${bannerSrc ? `<img src="${bannerSrc}" alt="Banner" class="discord-banner-media" loading="lazy">` : '<div class="discord-banner-fallback"></div>'}
              </div>

              <!-- Discord Avatar & Status Header -->
              <div class="discord-card-header">
                <div class="discord-avatar-anchor">
                  <div class="discord-avatar-box">
                    <img src="${avatarSrc}" alt="${displayName}" class="discord-avatar-img" width="80" height="80" loading="lazy">
                    ${decorationSrc ? `<img src="${decorationSrc}" alt="" class="discord-avatar-decoration" aria-hidden="true">` : ''}
                  </div>
                  ${hasBubble ? `
                  <div class="discord-status-bubble" title="Status" data-status-bubble data-bubble-tr="${bubbleTr}" data-bubble-en="${bubbleEn}">
                    <span class="status-bubble-tail"></span>
                    <span class="status-bubble-text">${bubbleTr || bubbleEn}</span>
                  </div>` : ''}
                </div>

                <div class="discord-header-badges">
                  <span class="role-badge">${roleBadge}</span>
                </div>
              </div>

              <!-- Discord Card Body -->
              <div class="discord-card-body">
                <div class="discord-identity-row">
                  <div class="discord-names">
                    <h3 class="discord-global-name">${displayName}</h3>
                    <div class="discord-handle-row">
                      <span class="discord-handle">${handle}</span>
                      ${pronouns ? `<span class="discord-dot">•</span><span class="discord-pronouns">${pronouns}</span>` : ''}
                    </div>
                  </div>
                </div>

                <div class="discord-divider" aria-hidden="true"></div>

                <div class="discord-meta-section">
                  <span class="discord-field-label">STÜDYO ROLÜ &amp; GÖREV</span>
                  <div class="credit-role" data-credit-role data-role-tr="${roleTr}" data-role-en="${roleEn}">${roleTr}</div>
                  <div class="credit-meta" data-credit-meta data-meta-tr="${metaTr}" data-meta-en="${metaEn}">${metaTr}</div>
                </div>

                <!-- Action Buttons: Discord View Profile + Social Chips -->
                <div class="discord-actions-row">
                  <a href="${escapeHtml(profileUrl)}" target="_blank" rel="noopener noreferrer" class="discord-btn-view" title="Discord Profilini Aç">
                    <svg class="discord-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span>View Profile</span>
                  </a>
                  <div class="discord-card-chips">
                    ${otherChips}
                  </div>
                </div>
              </div>
            </article>`;

      memberCards.push(cardHtml);
    }

    const deptHtml = `          <!-- ${escapeHtml(dept.code)} ${escapeHtml(dept.title_tr)} -->
          <section class="department-group" aria-labelledby="dept-${escapeHtml(dept.id)}-heading" data-dept-id="${escapeHtml(dept.id)}">
            <header class="department-header">
              <span class="dept-badge">${escapeHtml(dept.badge)}</span>
              <h2 id="dept-${escapeHtml(dept.id)}-heading" class="department-title" data-dept-title data-title-tr="${escapeHtml(dept.title_tr)}" data-title-en="${escapeHtml(dept.title_en)}">
                ${escapeHtml(dept.title_tr)}
              </h2>
              <div class="department-line" aria-hidden="true"></div>
            </header>
            <div class="department-members discord-card-grid">
${memberCards.join('\n')}
            </div>
          </section>`;

    blocks.push(deptHtml);
  }

  return `        <div class="credit-container" data-credit-container>
${blocks.join('\n\n')}
        </div>`;
}

export async function syncCredits() {
  const creditsFile = path.resolve('data/credits.json');
  if (!fs.existsSync(creditsFile)) {
    console.error('Credits data file not found:', creditsFile);
    return;
  }

  const rawJson = fs.readFileSync(creditsFile, 'utf8');
  const data = JSON.parse(rawJson);

  // 1. Update credit.html with Discord Profile Cards
  const creditHtmlPath = path.resolve('credit.html');
  if (fs.existsSync(creditHtmlPath)) {
    let html = fs.readFileSync(creditHtmlPath, 'utf8');
    const containerRegex = /<div class="credit-container"[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
    const generatedHtml = await renderCreditsHtml(data);
    const replacementHtml = `${generatedHtml}\n      </div>\n    </section>`;

    if (containerRegex.test(html)) {
      html = html.replace(containerRegex, replacementHtml);
      fs.writeFileSync(creditHtmlPath, html, 'utf8');
      console.log('✓ credit.html updated with Discord Profile Cards!');
    } else {
      console.warn('Could not find .credit-container in credit.html');
    }
  }

  // 2. Generate TypeScript credits-data.ts
  const tsContent = `// Auto-generated from data/credits.json - DO NOT EDIT MANUALLY
export interface CreditMemberLinks {
  readonly discord?: string;
  readonly github?: string;
  readonly gitlab?: string;
  readonly website?: string;
  readonly [key: string]: string | undefined;
}

export interface CreditMemberData {
  readonly id?: string;
  readonly discordId?: string;
  readonly name?: string;
  readonly pronouns?: string;
  readonly roleBadge: string;
  readonly role_tr: string;
  readonly role_en: string;
  readonly meta_tr: string;
  readonly meta_en: string;
  readonly bubble_tr?: string;
  readonly bubble_en?: string;
  readonly links?: CreditMemberLinks;
}

export interface CreditDepartmentData {
  readonly id: string;
  readonly code: string;
  readonly badge: string;
  readonly title_tr: string;
  readonly title_en: string;
  readonly members: readonly CreditMemberData[];
}

export interface CreditsData {
  readonly departments: readonly CreditDepartmentData[];
}

export const CREDITS_DATA: CreditsData = ${JSON.stringify(data, null, 2)} as const;
`;

  fs.writeFileSync(path.resolve('src/ts/credits-data.ts'), tsContent, 'utf8');
  console.log('✓ src/ts/credits-data.ts generated');
}

// Run if called directly
if (process.argv[1]?.endsWith('render-credits.js')) {
  syncCredits();
}
