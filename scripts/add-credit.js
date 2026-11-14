#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { syncCredits } from './render-credits.js';

function parseArgs(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        const key = arg.slice(2, eqIdx);
        const val = arg.slice(eqIdx + 1);
        result[key] = val;
      } else {
        const key = arg.slice(2);
        const next = args[i + 1];
        if (next && !next.startsWith('--')) {
          result[key] = next;
          i++;
        } else {
          result[key] = true;
        }
      }
    }
  }
  return result;
}

function normalizeDiscord(input) {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^\d{17,20}$/.test(trimmed)) {
    return `https://discord.com/users/${trimmed}`;
  }
  if (trimmed.startsWith('discord.com') || trimmed.startsWith('www.discord.com')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const args = parseArgs(process.argv.slice(2));

if (args.help || (!args.name && !args.discord)) {
  console.log(`
Aderion Studio — Otomatik Künye / Credit Ekleme Aracı
=====================================================
Kullanım:
  node scripts/add-credit.js --name="Ad Soyad" --discord="DISCORD_LINK_VEYA_ID" [seçenekler]

Zorunlu Parametreler:
  --name       : Kişinin görünen adı (Örn: "Kuzey")
  --discord    : Discord kullanıcı linki veya ID'si (Örn: "https://discord.com/users/12345" veya "123456789012345678")

Opsiyonel Parametreler:
  --role       : Rol tanımı Türkçe (Örn: "Ses Tasarımcısı & Besteci")
  --role-en    : Rol tanımı İngilizce (Varsayılan: --role ile aynı)
  --badge      : Kart rozeti (Örn: "AUDIO LEAD", "DEVELOPER", varsayılan: "TEAM MEMBER")
  --handle     : Kullanıcı adı (Örn: "@kuzey", varsayılan: @slug)
  --meta       : Kısa görev alanı Türkçe (Örn: "Ses & Akustik Tasarım")
  --meta-en    : Kısa görev alanı İngilizce
  --dept       : Departman ID veya Kodu ("01", "02", "audio", "art", varsayılan: "02")
  --github     : GitHub linki
  --gitlab     : GitLab linki
  --website    : Kişisel site linki
  --avatar     : Avatar dosya yolu (Varsayılan: assets/img/team/avatar-default.svg)

Örnek:
  node scripts/add-credit.js --name="Kuzey" --discord="https://discord.com/users/99887766" --role="Ses Tasarımcısı" --badge="AUDIO DESIGNER"
`);
  process.exit(0);
}

const name = args.name;
if (!name) {
  console.error('Hata: --name parametresi zorunludur. (Örn: --name="Kuzey")');
  process.exit(1);
}

const discord = normalizeDiscord(args.discord);
if (!discord) {
  console.error('Hata: --discord parametresi zorunludur. (Örn: --discord="https://discord.com/users/123456789")');
  process.exit(1);
}

const creditsPath = path.resolve('data/credits.json');
if (!fs.existsSync(creditsPath)) {
  console.error('Hata: data/credits.json bulunamadı!');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(creditsPath, 'utf8'));
const id = slugify(name);
const handle = args.handle || `@${id}`;
const roleTr = args.role || args['role-tr'] || 'Ekip Üyesi';
const roleEn = args['role-en'] || roleTr;
const roleBadge = (args.badge || 'TEAM MEMBER').toUpperCase();
const metaTr = args.meta || args['meta-tr'] || roleTr;
const metaEn = args['meta-en'] || args.meta || roleEn;
const avatar = args.avatar || 'assets/img/team/avatar-default.svg';

const links = {
  discord,
};

if (args.github) links.github = args.github.trim();
if (args.gitlab) links.gitlab = args.gitlab.trim();
if (args.website) links.website = args.website.trim();
if (args.x || args.twitter) links.x = (args.x || args.twitter).trim();
if (args.youtube) links.youtube = args.youtube.trim();

const newMember = {
  id,
  name,
  handle,
  roleBadge,
  role_tr: roleTr,
  role_en: roleEn,
  meta_tr: metaTr,
  meta_en: metaEn,
  avatar,
  links,
};

// Departman seçimi veya oluşturulması
const targetDeptCode = args.dept || '02';
let targetDept = data.departments.find(
  (d) => d.id === targetDeptCode || d.code === targetDeptCode
);

if (!targetDept) {
  if (data.departments.length > 0) {
    targetDept = data.departments[data.departments.length - 1];
  } else {
    targetDept = {
      id: 'general',
      code: '01',
      badge: 'DEP // 01',
      title_tr: '01 // PROJE & GELİŞTİRME EKİBİ',
      title_en: '01 // PROJECT & DEVELOPMENT TEAM',
      members: [],
    };
    data.departments.push(targetDept);
  }
}

// Varsa güncelle, yoksa ekle
const existingIdx = targetDept.members.findIndex((m) => m.id === id);
if (existingIdx !== -1) {
  targetDept.members[existingIdx] = newMember;
  console.log(`✓ [${name}] profili mevcut olduğu için güncellendi.`);
} else {
  targetDept.members.push(newMember);
  console.log(`✓ [${name}] profili departmana (${targetDept.title_tr}) eklendi.`);
}

fs.writeFileSync(creditsPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('✓ data/credits.json dosyası güncellendi.');

// HTML ve TypeScript dosyalarını senkronize et
syncCredits();
console.log('\nBaşarılı! Eklenen üye:');
console.log(`- İsim: ${name} (${handle})`);
console.log(`- Rol: ${roleTr} [${roleBadge}]`);
console.log(`- Discord: ${discord}`);
console.log('\nŞimdi "npm run build" çalıştırarak yayına alabilirsiniz.');
