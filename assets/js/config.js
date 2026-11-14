/**
 * Central strongly typed studio metadata, game catalog, and security allowlist.
 */
export const STUDIO_CONFIG = {
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
