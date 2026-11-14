// Auto-generated from data/credits.json - DO NOT EDIT MANUALLY
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

export const CREDITS_DATA: CreditsData = {
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
} as const;
