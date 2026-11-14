import fs from 'fs';

let creditsDataSrc = '';
if (fs.existsSync('assets/js/credits-data.js')) {
  creditsDataSrc = fs.readFileSync('assets/js/credits-data.js', 'utf8')
    .replace(/^export\s+/gm, '');
}

const configSrc = fs.readFileSync('assets/js/config.js', 'utf8')
  .replace(/^export\s+/gm, '');

const i18nSrc = fs.readFileSync('assets/js/i18n.js', 'utf8')
  .replace(/^export\s+/gm, '');

const mainSrc = fs.readFileSync('assets/js/main.js', 'utf8')
  .replace(/^import\s+.*?;\s*$/gm, '')
  .replace(/^export\s+/gm, '');

const bundle = `(() => {\n${configSrc}\n\n${creditsDataSrc}\n\n${i18nSrc}\n\n${mainSrc}\n})();\n`;
fs.writeFileSync('assets/js/main.js', bundle);
console.log('Standalone main.js generated for file:// and web compatibility.');
