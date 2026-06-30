const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', 'pdfmake', 'fonts', 'Roboto');
const dest = path.join(__dirname, '..', 'fonts');

if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

fs.readdirSync(src).forEach((f) => {
  if (f.endsWith('.ttf')) {
    fs.copyFileSync(path.join(src, f), path.join(dest, f));
    console.log(`  ✓ ${f}`);
  }
});
console.log('Fonts copied!');
