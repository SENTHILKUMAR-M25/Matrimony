const https = require('https');
const fs = require('fs');
const path = require('path');

const FONT_DIR = path.join(__dirname, '..', 'fonts');
const BASE = 'https://raw.githubusercontent.com/google/fonts/main/apache/roboto/static/';
const FONTS = [
  'Roboto-Regular.ttf',
  'Roboto-Bold.ttf',
  'Roboto-Italic.ttf',
  'Roboto-BoldItalic.ttf',
];

if (!fs.existsSync(FONT_DIR)) fs.mkdirSync(FONT_DIR, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { console.log(`  ✓ ${path.basename(dest)} (cached)`); return resolve(); }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { try { fs.unlinkSync(dest); } catch {} reject(err); });
  });
}

(async () => {
  console.log('Downloading Roboto fonts...');
  for (const name of FONTS) {
    const url = BASE + name;
    const dest = path.join(FONT_DIR, name);
    try {
      await download(url, dest);
      console.log(`  ✓ ${name}`);
    } catch (e) {
      console.error(`  ✗ ${name}: ${e.message}`);
    }
  }
  console.log('Done!');
})();
