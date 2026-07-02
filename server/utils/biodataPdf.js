const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const pdfmake = require('pdfmake');

let sharp;
try {
  sharp = require('sharp');
} catch {
  console.warn('[biodataPdf] sharp not installed — run npm install in server/');
}

const SERVER_ROOT = path.join(__dirname, '..');
const FONT_DIR = path.join(SERVER_ROOT, 'fonts');
const UPLOADS_DIR = path.join(SERVER_ROOT, 'uploads');

const PHOTO_MAX_WIDTH = 1200;
const PHOTO_MAX_HEIGHT = 1600;
const PHOTO_JPEG_QUALITY = 95;
const FETCH_TIMEOUT_MS = 12_000;
const LOGO_MAX_BYTES = 900_000;

const BRAND = {
  name: 'JOD Matrimony',
  tagline: 'Where Hearts Meet Forever',
  website: 'www.jodmatrimony.com',
  primary: '#7F55B1',
  secondary: '#9B7EBD',
  accent: '#F49BAB',
  dark: '#3B1E54',
  gold: '#B8860B',
  muted: '#6B7280',
  border: '#E9D5FF',
  bg: '#FFFBFA',
};

const REDACTED = '● Premium Only ●';

// ─── Font setup ───────────────────────────────────────────────────
const resolveFontPath = (...names) => {
  for (const name of names) {
    const p = path.join(FONT_DIR, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
};

const initFonts = () => {
  const normal = resolveFontPath('Roboto-Regular.ttf');
  const bold = resolveFontPath('Roboto-Bold.ttf', 'Roboto-Medium.ttf');
  const italics = resolveFontPath('Roboto-Italic.ttf');
  const bolditalics = resolveFontPath('Roboto-BoldItalic.ttf', 'Roboto-MediumItalic.ttf');

  if (!normal || !bold) {
    throw new Error('Roboto fonts not found. Run: node scripts/downloadFonts.js');
  }

  pdfmake.setFonts({
    Roboto: {
      normal,
      bold,
      italics: italics || normal,
      bolditalics: bolditalics || bold,
    },
  });

  pdfmake.setLocalAccessPolicy(() => true);
  pdfmake.setUrlAccessPolicy(() => false);
};

try {
  initFonts();
} catch (err) {
  console.warn('[biodataPdf]', err.message);
}

// ─── Asset preloading ─────────────────────────────────────────────
const imageCache = new Map();
let logoDataUrl = null;
let placeholderDataUrl = null;
let assetsReady = false;

const LOGO_CANDIDATES = [
  path.join(SERVER_ROOT, 'assets', 'logo.png'),
  path.join(SERVER_ROOT, '..', 'client', 'src', 'assets', 'logo.png'),
];

const bufferToDataUrl = (buf, mime = 'image/jpeg') =>
  `data:${mime};base64,${buf.toString('base64')}`;

const fileToDataUrl = (filePath, maxBytes = LOGO_MAX_BYTES) => {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const ext = path.extname(filePath).slice(1).toLowerCase().replace('jpg', 'jpeg');
  const buf = fs.readFileSync(filePath);
  if (buf.length > maxBytes) return null;
  return bufferToDataUrl(buf, `image/${ext}`);
};

const preloadAssets = () => {
  if (assetsReady) return;
  for (const candidate of LOGO_CANDIDATES) {
    logoDataUrl = fileToDataUrl(candidate);
    if (logoDataUrl) break;
  }
  assetsReady = true;
  createPlaceholderDataUrl().catch((err) => {
    console.warn('[biodataPdf] Placeholder preload failed:', err.message);
  });
};

// ─── Profile photo loading ─────────────────────────────────────────
const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || ''));

const fetchUrlBuffer = (url) => new Promise((resolve, reject) => {
  const lib = url.startsWith('https') ? https : http;
  const req = lib.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      const next = res.headers.location.startsWith('http')
        ? res.headers.location
        : new URL(res.headers.location, url).href;
      fetchUrlBuffer(next).then(resolve).catch(reject);
      return;
    }
    if (res.statusCode !== 200) {
      reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      return;
    }
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => resolve(Buffer.concat(chunks)));
  });
  req.on('error', reject);
  req.setTimeout(FETCH_TIMEOUT_MS, () => req.destroy(new Error(`Timeout fetching ${url}`)));
});

const resolveLocalPhotoPath = (urlOrPath) => {
  if (!urlOrPath) return null;
  const raw = String(urlOrPath).trim();

  if (path.isAbsolute(raw) && fs.existsSync(raw)) return raw;

  const uploadsIdx = raw.indexOf('/uploads/');
  if (uploadsIdx !== -1) {
    const rel = raw.slice(uploadsIdx + 1);
    const abs = path.join(SERVER_ROOT, rel);
    if (fs.existsSync(abs)) return abs;
  }

  if (raw.startsWith('/uploads/')) {
    const abs = path.join(SERVER_ROOT, raw.slice(1));
    if (fs.existsSync(abs)) return abs;
  }

  if (raw.startsWith('uploads/')) {
    const abs = path.join(SERVER_ROOT, raw);
    if (fs.existsSync(abs)) return abs;
  }

  const basename = path.basename(raw.split('?')[0]);
  if (basename && basename !== raw) {
    const abs = path.join(UPLOADS_DIR, basename);
    if (fs.existsSync(abs)) return abs;
  }

  return null;
};

const collectPhotoSources = (profile, explicitPath) => {
  const sources = [];
  const add = (value) => {
    if (!value) return;
    const v = String(value).trim();
    if (v && !sources.includes(v)) sources.push(v);
  };

  add(explicitPath);
  add(profile?.profilePhotoRaw);
  add(profile?.profilePhoto);

  const expanded = [...sources];
  for (const src of expanded) {
    const local = resolveLocalPhotoPath(src);
    if (local) add(local);
  }

  return sources;
};

const compressPhotoBuffer = async (buffer) => {
  if (!buffer || !buffer.length) return null;

  if (sharp) {
    const output = await sharp(buffer)
      .rotate()
      .resize(PHOTO_MAX_WIDTH, PHOTO_MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: PHOTO_JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
    return bufferToDataUrl(output, 'image/jpeg');
  }

  const header = buffer.slice(0, 12).toString('hex');
  let mime = null;
  if (header.startsWith('ffd8ff')) mime = 'image/jpeg';
  else if (header.startsWith('89504e47')) mime = 'image/png';
  else if (header.startsWith('52494646')) mime = 'image/webp';

  if (!mime || mime === 'image/webp') return null;
  return bufferToDataUrl(buffer, mime);
};

const createPlaceholderDataUrl = async () => {
  if (placeholderDataUrl) return placeholderDataUrl;

  const assetPath = path.join(SERVER_ROOT, 'assets', 'placeholder-profile.png');
  if (fs.existsSync(assetPath)) {
    const buf = fs.readFileSync(assetPath);
    placeholderDataUrl = sharp
      ? await compressPhotoBuffer(buf)
      : fileToDataUrl(assetPath, 2_000_000);
    if (placeholderDataUrl) return placeholderDataUrl;
  }

  if (sharp) {
    const buf = await sharp({
      create: {
        width: PHOTO_MAX_WIDTH,
        height: PHOTO_MAX_HEIGHT,
        channels: 3,
        background: { r: 249, g: 245, b: 255 },
      },
    })
      .composite([{
        input: Buffer.from(`
          <svg width="${PHOTO_MAX_WIDTH}" height="${PHOTO_MAX_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#F9F5FF"/>
            <circle cx="210" cy="175" r="58" fill="#E9D5FF"/>
            <ellipse cx="210" cy="340" rx="95" ry="72" fill="#E9D5FF"/>
            <text x="210" y="470" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#9B7EBD">No Photo</text>
          </svg>
        `),
        top: 0,
        left: 0,
      }])
      .jpeg({ quality: 82 })
      .toBuffer();
    placeholderDataUrl = bufferToDataUrl(buf, 'image/jpeg');
    return placeholderDataUrl;
  }

  placeholderDataUrl = logoDataUrl;
  return placeholderDataUrl;
};

preloadAssets();

/**
 * Resolve profile photo to a Base64 data URL, fully loaded before PDF build.
 * Tries local disk paths, then HTTP(S) URLs (cloud/CDN), then placeholder.
 */
const loadProfilePhotoDataUrl = async (profile, explicitPath) => {
  const cacheKey = [
    explicitPath || '',
    profile?.profilePhotoRaw || '',
    profile?.profilePhoto || '',
  ].join('|');

  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const sources = collectPhotoSources(profile, explicitPath);
  let photoDataUrl = null;

  for (const source of sources) {
    try {
      const localPath = resolveLocalPhotoPath(source);
      if (localPath) {
        const buffer = fs.readFileSync(localPath);
        photoDataUrl = await compressPhotoBuffer(buffer);
        if (photoDataUrl) break;
        continue;
      }

      if (isHttpUrl(source)) {
        const buffer = await fetchUrlBuffer(source);
        photoDataUrl = await compressPhotoBuffer(buffer);
        if (photoDataUrl) break;
      }
    } catch (err) {
      console.warn('[biodataPdf] Photo source failed:', source, '-', err.message);
    }
  }

  if (!photoDataUrl) {
    photoDataUrl = await createPlaceholderDataUrl();
  }

  imageCache.set(cacheKey, photoDataUrl);
  return photoDataUrl;
};

// ─── Helpers ──────────────────────────────────────────────────────
const fmt = (v) => {
  if (v === null || v === undefined || v === '') return '—';
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—';
  return String(v);
};

const gated = (value, isPremium) => {
  if (isPremium) return fmt(value);
  if (value === null || value === undefined || value === '') return '—';
  return REDACTED;
};

const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return fmt(d);
  }
};

const generationDate = () => new Date().toLocaleDateString('en-IN', {
  day: '2-digit', month: 'long', year: 'numeric',
});

const sectionHeader = (title) => ({
  table: {
    widths: ['*'],
    body: [[{
      text: title.toUpperCase(),
      style: 'sectionTitle',
      fillColor: BRAND.primary,
      color: '#FFFFFF',
      margin: [10, 6, 10, 6],
    }]],
  },
  layout: {
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingLeft: () => 0,
    paddingRight: () => 0,
    paddingTop: () => 0,
    paddingBottom: () => 0,
  },
  margin: [0, 14, 0, 8],
});

const fieldTable = (rows) => ({
  table: {
    widths: ['35%', '65%'],
    body: rows.map(([label, value]) => [
      { text: label, style: 'fieldLabel' },
      { text: value, style: 'fieldValue' },
    ]),
  },
  layout: {
    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.5 : 0.3),
    vLineWidth: () => 0,
    hLineColor: () => BRAND.border,
    paddingLeft: () => 8,
    paddingRight: () => 8,
    paddingTop: () => 5,
    paddingBottom: () => 5,
  },
  margin: [0, 0, 0, 4],
});

const buildWatermark = () => {
  if (!logoDataUrl) return null;
  return (currentPage, pageSize) => ({
    image: logoDataUrl,
    width: 220,
    opacity: 0.06,
    absolutePosition: {
      x: (pageSize.width - 220) / 2,
      y: (pageSize.height - 220) / 2,
    },
  });
};

const buildHeader = () => {
  const logoCell = logoDataUrl
    ? { image: logoDataUrl, width: 52, height: 52, margin: [0, 2, 0, 0] }
    : { text: '♥', fontSize: 36, color: BRAND.accent, alignment: 'center', margin: [0, 4, 0, 0] };

  return {
    table: {
      widths: [60, '*', 60],
      body: [[
        logoCell,
        {
          stack: [
            { text: BRAND.name, style: 'brandTitle', alignment: 'center' },
            { text: BRAND.tagline, style: 'brandTagline', alignment: 'center' },
            {
              canvas: [{
                type: 'line', x1: 80, y1: 0, x2: 280, y2: 0,
                lineWidth: 1, lineColor: BRAND.accent,
              }],
              margin: [0, 4, 0, 0],
            },
          ],
          margin: [0, 4, 0, 0],
        },
        { text: 'MATRIMONIAL\nBIODATA', style: 'biodataBadge', alignment: 'right' },
      ]],
    },
    layout: 'noBorders',
    margin: [0, 0, 0, 10],
  };
};

const buildProfileHero = (profile, photoDataUrl, hasRealPhoto) => {
  const photoContainer = {
    stack: [{
      image: photoDataUrl,
      width: 110,
      alignment: 'center',
    }],
  };

  const highlights = [
    ['Age', fmt(profile.age)],
    ['Height', fmt(profile.height)],
    ['Religion', fmt(profile.religion)],
    ['Marital Status', fmt(profile.maritalStatus)],
    ['Education', fmt(profile.education)],
    ['Occupation', fmt(profile.occupation)],
  ];

  return {
    table: {
      widths: [122, '*'],
      body: [[
        photoContainer,
        {
          stack: [
            { text: profile.fullName || '—', style: 'profileName' },
            {
              text: profile.profileId ? `Profile ID: ${profile.profileId}` : '',
              style: 'profileId',
              margin: [0, 2, 0, 6],
            },
            {
              table: {
                widths: ['50%', '50%'],
                body: highlights.map(([l, v]) => [
                  { text: l, style: 'heroLabel' },
                  { text: v, style: 'heroValue' },
                ]),
              },
              layout: 'noBorders',
            },
          ],
          margin: [10, 4, 0, 4],
        },
      ]],
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => BRAND.border,
      vLineColor: () => BRAND.border,
    },
    margin: [0, 0, 0, 12],
  };
};

const buildPremiumBanner = (isPremium) => {
  if (isPremium) return null;
  return {
    table: {
      widths: ['*'],
      body: [[{
        text: '⭐  Upgrade to Premium to unlock contact details, family info & complete biodata fields.',
        style: 'premiumBanner',
        fillColor: '#FFF7ED',
        border: [true, true, true, true],
        borderColor: [BRAND.gold, BRAND.gold, BRAND.gold, BRAND.gold],
        margin: [8, 6, 8, 6],
      }]],
    },
    layout: 'noBorders',
    margin: [0, 0, 0, 10],
  };
};

const buildDocDefinition = (profile, { isPremium, photoDataUrl, hasRealPhoto }) => {
  const content = [
    buildHeader(),
    buildPremiumBanner(isPremium),
    buildProfileHero(profile, photoDataUrl, hasRealPhoto),

    sectionHeader('Personal Details'),
    fieldTable([
      ['Full Name', fmt(profile.fullName)],
      ['Gender', gated(profile.gender, isPremium)],
      ['Date of Birth', gated(formatDate(profile.dateOfBirth), isPremium)],
      ['Age', fmt(profile.age)],
      ['Height', fmt(profile.height)],
      ['Weight', gated(profile.weight, isPremium)],
      ['Marital Status', fmt(profile.maritalStatus)],
      ['Religion', fmt(profile.religion)],
      ['Caste', gated(profile.caste, isPremium)],
      ['Sub Caste', gated(profile.subCaste, isPremium)],
      ['Mother Tongue', gated(profile.motherTongue, isPremium)],
    ]),

    sectionHeader('Education & Career'),
    fieldTable([
      ['Education', fmt(profile.education)],
      ['Occupation', fmt(profile.occupation)],
      ['Company', gated(profile.companyName, isPremium)],
      ['Annual Income', gated(profile.annualIncome, isPremium)],
    ]),

    sectionHeader('Family Details'),
    fieldTable([
      ['Father\'s Name', gated(profile.fatherName, isPremium)],
      ['Mother\'s Name', gated(profile.motherName, isPremium)],
      ['Siblings', gated(profile.siblings, isPremium)],
    ]),

    sectionHeader('Location'),
    fieldTable([
      ['City', gated(profile.city, isPremium)],
      ['State', gated(profile.state, isPremium)],
      ['Country', gated(profile.country, isPremium)],
    ]),

    sectionHeader('Lifestyle'),
    fieldTable([
      ['Marital Status', fmt(profile.maritalStatus)],
      ['Height / Weight', `${fmt(profile.height)}${profile.weight && isPremium ? ` / ${profile.weight}` : profile.weight && !isPremium ? ` / ${REDACTED}` : ''}`],
      ['Horoscope Available', profile.horoscopeAvailable ? 'Yes' : 'No'],
    ]),

    ...(buildHoroscopeSection(profile) || [
      sectionHeader('Horoscope & Astro Details'),
      fieldTable([
        ['Rasi', fmt(profile.rasi)],
        ['Nakshatra', fmt(profile.nakshatra)],
        ['Lagnam (Laknam)', fmt(profile.laknam)],
        ['Gothram', fmt(profile.gothram)],
        ['Dosham', fmt(profile.dhosham)],
      ]),
    ]),

    sectionHeader('Partner Preferences'),
    fieldTable([
      ['Preferred Age', isPremium && (profile.prefAgeMin || profile.prefAgeMax)
        ? `${profile.prefAgeMin || '?'} – ${profile.prefAgeMax || '?'} years`
        : gated(profile.prefAgeMin ? `${profile.prefAgeMin}-${profile.prefAgeMax}` : null, isPremium)],
      ['Preferred Height', gated(profile.prefHeight, isPremium)],
      ['Preferred Education', gated(profile.prefEducation, isPremium)],
      ['Preferred Location', gated(profile.prefLocation, isPremium)],
      ['Preferred Religion', gated(profile.prefReligion, isPremium)],
      ['Preferred Rasi', gated(profile.preferredRasi, isPremium)],
      ['Preferred Nakshatra', gated(profile.preferredNakshatra, isPremium)],
      ['Preferred Lagnam', gated(profile.preferredLagnam, isPremium)],
      ['Dosham Preference', gated(profile.dhoshamPreference, isPremium)],
    ]),

    sectionHeader('Contact Information'),
    fieldTable([
      ['Email', gated(profile.email, isPremium)],
      ['Mobile', gated(profile.mobile, isPremium)],
    ]),

    sectionHeader('Additional Information'),
    fieldTable([
      ['Profile ID', fmt(profile.profileId)],
      ['Profile Status', profile.profileCompleted ? 'Complete' : 'Incomplete'],
      ['Document Type', isPremium ? 'Full Premium Biodata' : 'Basic Biodata (Limited)'],
      ['Generated On', generationDate()],
    ]),
  ].filter(Boolean);

  return {
    pageSize: 'A4',
    pageMargins: [42, 42, 42, 56],
    defaultStyle: { font: 'Roboto', fontSize: 9.5, color: '#1F2937', lineHeight: 1.25 },
    background: buildWatermark(),
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: BRAND.name, fontSize: 7.5, color: BRAND.secondary, margin: [42, 0, 0, 0] },
        { text: `${BRAND.website}  •  Generated ${generationDate()}`, alignment: 'center', fontSize: 7.5, color: BRAND.muted },
        { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', fontSize: 7.5, color: BRAND.muted, margin: [0, 0, 42, 0] },
      ],
      margin: [0, 8, 0, 0],
    }),
    styles: {
      brandTitle: { fontSize: 20, bold: true, color: BRAND.dark },
      brandTagline: { fontSize: 9, italics: true, color: BRAND.secondary, margin: [0, 2, 0, 0] },
      biodataBadge: { fontSize: 8, bold: true, color: BRAND.primary, lineHeight: 1.3 },
      profileName: { fontSize: 16, bold: true, color: BRAND.dark },
      profileId: { fontSize: 9, color: BRAND.primary, bold: true },
      heroLabel: { fontSize: 8, color: BRAND.muted, bold: true },
      heroValue: { fontSize: 9, color: '#111827' },
      sectionTitle: { fontSize: 9.5, bold: true, characterSpacing: 0.8 },
      fieldLabel: { fontSize: 8.5, bold: true, color: BRAND.primary },
      fieldValue: { fontSize: 9, color: '#374151' },
      premiumBanner: { fontSize: 8.5, color: '#92400E', italics: true },
    },
    info: {
      title: `${profile.fullName || 'Profile'} - Matrimonial Biodata`,
      author: BRAND.name,
      subject: 'Matrimonial Biodata',
      keywords: 'matrimony, biodata, horoscope, JOD',
    },
    content,
  };
};

/**
 * Generate a print-ready A4 biodata PDF buffer.
 * @param {object} profile
 * @param {{ isPremium?: boolean, profilePhotoPath?: string }} options
 * @returns {Promise<Buffer>}
 */
const generateBiodataPdf = async (profile, { isPremium = false, profilePhotoPath = null } = {}) => {
  preloadAssets();

  if (!pdfmake.fonts || !Object.keys(pdfmake.fonts).length) {
    initFonts();
  }

  const placeholder = await createPlaceholderDataUrl();
  let photoDataUrl = null;
  let hasRealPhoto = false;

  try {
    const loaded = await loadProfilePhotoDataUrl(profile, profilePhotoPath);
    if (loaded && loaded !== placeholder) {
      photoDataUrl = loaded;
      hasRealPhoto = true;
    }
  } catch (err) {
    console.warn('[biodataPdf] Profile photo load failed:', err.message);
  }

  if (!photoDataUrl) {
    photoDataUrl = placeholder;
  }

  const docDefinition = buildDocDefinition(profile, { isPremium, photoDataUrl, hasRealPhoto });
  const pdfDoc = pdfmake.createPdf(docDefinition);
  return pdfDoc.getBuffer();
};

// ─── Premium horoscope chart rendering ────────────────────────────
const PLANET_ABBR = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju',
  Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke', Lagna: 'Lg',
};

const chartCell = (houseNum, planets) => {
  const abbrs = (planets || []).map(p => PLANET_ABBR[p] || p).join('  ');
  return {
    stack: [
      { text: String(houseNum), fontSize: 5.5, color: '#9CA3AF', alignment: 'right', margin: [0, 0, 2, 0] },
      { text: abbrs, fontSize: 9, bold: true, color: BRAND.dark, alignment: 'center', margin: [0, 2, 0, 0] },
    ],
  };
};

const buildChartTable = (chartData) => {
  if (!chartData) return null;
  const emptyCell = { text: '', fillColor: '#FDF4FF' };
  const body = [
    [chartCell(12, chartData['12']), chartCell(1, chartData['1']), chartCell(2, chartData['2']), chartCell(3, chartData['3'])],
    [chartCell(11, chartData['11']), emptyCell, emptyCell, chartCell(4, chartData['4'])],
    [chartCell(10, chartData['10']), emptyCell, emptyCell, chartCell(5, chartData['5'])],
    [chartCell(9, chartData['9']), chartCell(8, chartData['8']), chartCell(7, chartData['7']), chartCell(6, chartData['6'])],
  ];
  return {
    table: { widths: ['*', '*', '*', '*'], body },
    layout: {
      hLineWidth: (i, node) => {
        if (i === 0 || i === node.table.body.length) return 2;
        if (i === 2) return 0;
        return 0.5;
      },
      vLineWidth: (j, node) => {
        if (j === 0 || j === node.table.widths.length) return 2;
        if (j === 2) return 0;
        return 0.5;
      },
      hLineColor: (i, node) => {
        if (i === 0 || i === node.table.body.length) return BRAND.primary;
        return BRAND.border;
      },
      vLineColor: (j, node) => {
        if (j === 0 || j === node.table.widths.length) return BRAND.primary;
        return BRAND.border;
      },
      paddingLeft: () => 5,
      paddingRight: () => 5,
      paddingTop: () => 6,
      paddingBottom: () => 6,
    },
  };
};

const chartColumn = (title, chartData) => ({
  stack: [
    {
      text: title,
      fontSize: 8,
      bold: true,
      color: BRAND.dark,
      alignment: 'center',
      background: '#FDF4FF',
      margin: [0, 0, 0, 5],
    },
    buildChartTable(chartData),
  ],
});

const buildHoroscopeSection = (profile) => {
  const hd = profile.horoscopeData;
  if (!hd || typeof hd !== 'object') return null;

  const rasiChart = hd.rasiChart && typeof hd.rasiChart === 'object' ? hd.rasiChart : null;
  const navamsaChart = hd.navamsaChart && typeof hd.navamsaChart === 'object' ? hd.navamsaChart : null;
  const hasRasi = rasiChart && Object.values(rasiChart).some(arr => Array.isArray(arr) && arr.length > 0);
  const hasNavamsa = navamsaChart && Object.values(navamsaChart).some(arr => Array.isArray(arr) && arr.length > 0);
  if (!hasRasi && !hasNavamsa) return null;

  const flds = hd.fields || {};

  const chartsContent = {
    table: {
      widths: ['50%', '50%'],
      body: [[
        chartColumn('RASI CHART (D1)', rasiChart),
        chartColumn('NAVAMSA CHART (D9)', navamsaChart),
      ]],
    },
    layout: 'noBorders',
    margin: [0, 0, 0, 14],
  };

  const astroFields = [
    ['Rasi', fmt(flds.rasi)],
    ['Nakshatra', fmt(flds.nakshatra)],
    ['Lagnam', fmt(flds.lagnam)],
    ['Pada', fmt(flds.pada)],
    ['Gothram', fmt(flds.gothram)],
    ['Dosham', fmt(flds.dosham)],
    ['Chevvai Dosham', fmt(flds.chevvaiDosham)],
    ['Nadi', fmt(flds.nadi)],
    ['Yoni', fmt(flds.yoni)],
    ['Rajju', fmt(flds.rajju)],
    ['Gana', fmt(flds.gana)],
    ['Dasa', fmt(flds.dasa)],
    ['Mahadasa', fmt(flds.mahadasa)],
  ];

  return [
    sectionHeader('Horoscope & Astro Details'),
    {
      table: {
        widths: ['*', 'auto', '*'],
        body: [[
          { text: '' },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1.5, lineColor: BRAND.gold }] },
          { text: '' },
        ]],
      },
      layout: 'noBorders',
      margin: [0, -6, 0, 10],
    },
    chartsContent,
    fieldTable(astroFields),
  ];
};

module.exports = { generateBiodataPdf, preloadAssets, loadProfilePhotoDataUrl };
