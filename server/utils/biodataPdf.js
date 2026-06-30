const pdfmake = require('pdfmake');
const path = require('path');
const fs = require('fs');

// ─── Cached Assets (loaded once at module init) ──────────────────────────────
const FONT_DIR = path.join(__dirname, '..', 'fonts');
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.png');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const loadFont = (name) => {
  const fp = path.join(FONT_DIR, name);
  return fs.existsSync(fp) ? fp : null;
};

// Preload and cache the logo as base64 for watermark & header
let CACHED_LOGO_BASE64 = null;
try {
  CACHED_LOGO_BASE64 = fs.readFileSync(LOGO_PATH).toString('base64');
} catch { /* logo not found — will render without */ }

// Preload and cache fonts
pdfmake.addFonts({
  Roboto: {
    normal: loadFont('Roboto-Regular.ttf'),
    bold: loadFont('Roboto-Medium.ttf'),
    italics: loadFont('Roboto-Italic.ttf'),
    bolditalics: loadFont('Roboto-MediumItalic.ttf'),
  },
});
pdfmake.setLocalAccessPolicy(() => true);
pdfmake.setUrlAccessPolicy(() => false);

// ─── Brand Theme ──────────────────────────────────────────
const C = {
  primary:    '#7F55B1',
  primaryDk:  '#5C3D82',
  secondary:  '#9B7EBD',
  accent:     '#F49BAB',
  accentLt:   '#FFE1E0',
  maroon:     '#8B1A4A',
  maroonLt:   '#A82060',
  bg:         '#F8F4FC',
  bgCard:     '#FDFBFE',
  border:     '#E4DAEE',
  borderLt:   '#F0EAF8',
  textDark:   '#2A1540',
  textMed:    '#5C3D82',
  textLight:  '#9B7EBD',
  textMuted:  '#B4A0C8',
  white:      '#FFFFFF',
  gold:       '#D4A847',
  goldLight:  '#F5D77B',
  green:      '#10b981',
};

const PW = 505; // printable width

// ─── Image Helpers ────────────────────────────────────────
const SUPPORTED_IMG_SIGS = [
  Buffer.from([0x89, 0x50, 0x4e, 0x47]),
  Buffer.from([0xff, 0xd8, 0xff]),
];

const isSupportedImage = (fp) => {
  try {
    const fd = fs.openSync(fp, 'r');
    const buf = Buffer.alloc(4);
    fs.readSync(fd, buf, 0, 4, 0);
    fs.closeSync(fd);
    return SUPPORTED_IMG_SIGS.some((s) => buf.slice(0, s.length).equals(s));
  } catch { return false; }
};

const getPhotoPath = (photoUrl) => {
  if (!photoUrl) return null;
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  let fp;
  const m = photoUrl.split('/uploads/');
  if (m.length > 1) fp = path.join(uploadsDir, m[1]);
  else fp = path.join(uploadsDir, path.basename(photoUrl));
  if (!fs.existsSync(fp)) return null;
  return isSupportedImage(fp) ? fp : null;
};

// ─── Layout Helpers ───────────────────────────────────────
const sectionCard = (title, icon, items) => ({
  margin: [0, 0, 0, 8],
  stack: [
    {
      canvas: [{ type: 'rect', x: 0, y: 0, w: PW, h: 24, r: 4, lineColor: C.border, lineWidth: 0.5, fillOpacity: 0.5, color: C.bg }],
      absolutePosition: { x: 40, y: 0 },
    },
    {
      columns: [
        { width: 20, text: icon, fontSize: 11, color: C.primary, margin: [8, 4, 0, 0] },
        { width: PW - 20, text: title.toUpperCase(), style: 'sectionTitle', margin: [4, 3, 0, 0] },
      ],
      margin: [0, 0, 0, 4],
    },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: PW, y2: 0, lineWidth: 1.5, lineColor: C.primary }],
      margin: [0, 0, 0, 6],
    },
    ...items.filter(Boolean),
  ],
});

const fieldRow = (label, value, hidden = false) => {
  let val;
  if (hidden) val = { text: 'Premium Only', style: 'hiddenVal' };
  else if (value != null && value !== '' && value !== '—') val = { text: String(value), style: 'fieldVal' };
  else val = { text: '—', style: 'fieldValMuted' };

  return {
    columns: [
      { width: '38%', text: label, style: 'fieldLbl' },
      { width: '62%', ...val },
    ],
    margin: [0, 1.5, 0, 1.5],
  };
};

const fieldRow2Col = (l1, v1, h1, l2, v2, h2) => ({
  columns: [
    { width: '50%', stack: [fieldRow(l1, v1, h1)] },
    { width: '50%', stack: [fieldRow(l2, v2, h2)] },
  ],
  margin: [0, 0, 0, 0],
});

// ─── Main Generator ───────────────────────────────────────
const generateBiodata = (profile, user, isPremium) => {
  const hidden = !isPremium;
  const photoPath = getPhotoPath(profile.profilePhoto);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const prefAge = (profile.prefAgeMin || profile.prefAgeMax)
    ? `${profile.prefAgeMin || '—'} to ${profile.prefAgeMax || '—'} yrs`
    : '—';

  const locationStr = [profile.city, profile.state, profile.country].filter(Boolean).join(', ') || '—';

  // ── Photo block with premium frame ──
  const photoBlock = photoPath
    ? {
        stack: [
          { canvas: [{ type: 'rect', x: -3, y: -3, w: 101, h: 121, r: 6, lineColor: C.primary, lineWidth: 2, fillOpacity: 0 }] },
          { image: photoPath, width: 95, height: 115, alignment: 'center', margin: [0, 0, 0, 0] },
        ],
        width: 95,
        margin: [0, 0, 0, 0],
      }
    : {
        stack: [
          { canvas: [{ type: 'rect', x: -3, y: -3, w: 101, h: 121, r: 6, lineColor: C.border, lineWidth: 1, fillOpacity: 0 }] },
          { text: 'No Photo', alignment: 'center', color: C.textMuted, fontSize: 10, margin: [0, 45, 0, 0] },
        ],
        width: 95,
        margin: [0, 0, 0, 0],
      };

  // ── Build document ──
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 65, 40, 70],

    info: {
      title: `Biodata - ${profile.fullName || 'Profile'}`,
      author: 'JOD Matrimony',
      subject: 'Matrimonial Biodata',
      creator: 'JOD Matrimony',
    },

    // ── Header (every page) ──
    header: () => ({
      columns: [
        CACHED_LOGO_BASE64
          ? { image: `data:image/png;base64,${CACHED_LOGO_BASE64}`, width: 18, height: 18, margin: [40, 8, 4, 0] }
          : { text: '', width: 0 },
        { text: 'JOD Matrimony', fontSize: 9, bold: true, color: C.primary, margin: [4, 9, 0, 0] },
        { text: today, fontSize: 7.5, color: C.textMuted, alignment: 'right', margin: [0, 10, 40, 0] },
      ],
    }),

    // ── Footer (every page) ──
    footer: (current, total) => ({
      margin: [40, 0, 40, 0],
      stack: [
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: PW, y2: 0, lineWidth: 0.5, lineColor: C.borderLt }] },
        {
          columns: [
            { text: 'JOD Matrimony \u2014 Find Your Perfect Life Partner', fontSize: 7, color: C.textMuted, margin: [0, 6, 0, 0] },
            { text: `Page ${current} of ${total}`, fontSize: 7, color: C.textMuted, alignment: 'right', margin: [0, 6, 0, 0] },
          ],
        },
        { text: 'This biodata is generated for personal matrimonial purposes. Information is subject to verification.', fontSize: 6, color: C.textMuted, alignment: 'center', margin: [0, 3, 0, 0], italics: true },
      ],
    }),

    // ── Watermark ──
    watermark: {
      text: 'JOD Matrimony',
      color: C.border,
      opacity: 0.06,
      bold: true,
      fontSize: 52,
      angle: -30,
    },

    // ── Background (logo watermark on every page) ──
    background: CACHED_LOGO_BASE64
      ? () => ({
          image: `data:image/png;base64,${CACHED_LOGO_BASE64}`,
          width: 250,
          height: 250,
          alignment: 'center',
          opacity: 0.03,
          margin: [0, 350, 0, 0],
        })
      : undefined,

    content: [
      // ═══════════════════════════════════════════
      // TITLE BANNER
      // ═══════════════════════════════════════════
      {
        canvas: [
          { type: 'rect', x: 0, y: 0, w: PW, h: 60, r: 8, lineColor: C.primary, lineWidth: 1.5, fillOpacity: 0.08, color: C.primary },
        ],
        absolutePosition: { x: 40, y: 0 },
      },
      {
        columns: [
          {
            width: CACHED_LOGO_BASE64 ? 40 : 0,
            image: CACHED_LOGO_BASE64 ? `data:image/png;base64,${CACHED_LOGO_BASE64}` : undefined,
            width: 36,
            height: 36,
            margin: [12, 10, 0, 0],
          },
          {
            width: '*',
            stack: [
              { text: 'MATRIMONIAL BIODATA', style: 'docTitle', margin: [0, 6, 0, 2] },
              { text: profile.profileId || '', style: 'docId', margin: [0, 0, 0, 0] },
            ],
          },
        ],
        margin: [0, 0, 0, 12],
      },

      // ═══════════════════════════════════════════
      // PHOTO + NAME CARD
      // ═══════════════════════════════════════════
      {
        canvas: [{ type: 'rect', x: 0, y: 0, w: PW, h: 140, r: 6, lineColor: C.border, lineWidth: 1, fillOpacity: 0.03, color: C.bg }],
        absolutePosition: { x: 40, y: 72 },
      },
      {
        columns: [
          { width: 105, stack: [photoBlock], margin: [6, 0, 0, 0] },
          {
            width: '*',
            stack: [
              { text: profile.fullName || 'Profile', style: 'userName', margin: [0, 4, 0, 4] },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 2, lineColor: C.accent }],
                margin: [0, 0, 0, 6],
              },
              {
                columns: [
                  { width: '50%', stack: [
                    { text: `${profile.age || '\u2014'} yrs`, style: 'userMeta' },
                    { text: profile.gender || '\u2014', style: 'userMeta' },
                  ]},
                  { width: '50%', stack: [
                    { text: profile.height || '\u2014', style: 'userMeta' },
                    { text: profile.maritalStatus || '\u2014', style: 'userMeta' },
                  ]},
                ],
                margin: [0, 0, 0, 4],
              },
              { text: locationStr, style: 'userLocation', margin: [0, 0, 0, 4] },
              hidden
                ? { text: 'Contact details available for premium members', style: 'hiddenNote' }
                : {
                    columns: [
                      { width: '50%', stack: [
                        profile.email ? { text: profile.email, style: 'contactInfo', margin: [0, 0, 0, 2] } : null,
                      ].filter(Boolean) },
                      { width: '50%', stack: [
                        profile.mobile ? { text: profile.mobile, style: 'contactInfo' } : null,
                      ].filter(Boolean) },
                    ],
                  },
            ],
          },
        ],
        margin: [6, 0, 0, 14],
      },

      // ═══════════════════════════════════════════
      // PROFILE SUMMARY
      // ═══════════════════════════════════════════
      sectionCard('Profile Summary', '\u2726', [
        {
          columns: [
            { width: '33%', stack: [
              { text: 'Name', style: 'summLabel' }, { text: profile.fullName || '\u2014', style: 'summValue' },
            ]},
            { width: '33%', stack: [
              { text: 'Age', style: 'summLabel' }, { text: profile.age ? `${profile.age} years` : '\u2014', style: 'summValue' },
            ]},
            { width: '34%', stack: [
              { text: 'Religion', style: 'summLabel' }, { text: profile.religion || '\u2014', style: 'summValue' },
            ]},
          ],
          margin: [8, 0, 8, 4],
        },
        {
          columns: [
            { width: '33%', stack: [
              { text: 'Education', style: 'summLabel' }, { text: profile.education || '\u2014', style: 'summValue' },
            ]},
            { width: '33%', stack: [
              { text: 'Occupation', style: 'summLabel' }, { text: profile.occupation || '\u2014', style: 'summValue' },
            ]},
            { width: '34%', stack: [
              { text: 'Location', style: 'summLabel' }, { text: [profile.city, profile.state].filter(Boolean).join(', ') || '\u2014', style: 'summValue' },
            ]},
          ],
          margin: [8, 0, 8, 4],
        },
      ]),

      // ═══════════════════════════════════════════
      // PERSONAL DETAILS
      // ═══════════════════════════════════════════
      sectionCard('Personal Details', '\u263A', [
        { margin: [8, 0, 8, 0], stack: [
          fieldRow2Col('Full Name', profile.fullName, false, 'Gender', profile.gender, false),
          fieldRow2Col('Date of Birth', profile.dateOfBirth, false, 'Age', profile.age, false),
          fieldRow2Col('Height', profile.height, false, 'Weight', profile.weight, hidden),
          fieldRow2Col('Marital Status', profile.maritalStatus, false, 'Mother Tongue', profile.motherTongue, hidden),
          fieldRow2Col('Religion', profile.religion, false, 'Caste', profile.caste, hidden),
          fieldRow('Sub Caste', profile.subCaste, hidden),
        ]},
      ]),

      // ═══════════════════════════════════════════
      // EDUCATION & CAREER
      // ═══════════════════════════════════════════
      sectionCard('Education & Career', '\u2726', [
        { margin: [8, 0, 8, 0], stack: [
          fieldRow2Col('Education', profile.education, false, 'Occupation', profile.occupation, false),
          fieldRow2Col('Company / Institution', profile.companyName, hidden, 'Annual Income', profile.annualIncome, hidden),
        ]},
      ]),

      // ═══════════════════════════════════════════
      // FAMILY DETAILS
      // ═══════════════════════════════════════════
      sectionCard('Family Details', '\u263A', [
        { margin: [8, 0, 8, 0], stack: [
          fieldRow2Col("Father's Name", profile.fatherName, hidden, "Mother's Name", profile.motherName, hidden),
          fieldRow('Siblings', profile.siblings != null ? String(profile.siblings) : '\u2014', hidden),
        ]},
      ]),

      // ═══════════════════════════════════════════
      // HOROSCOPE
      // ═══════════════════════════════════════════
      sectionCard('Horoscope Details', '\u2605', [
        { margin: [8, 0, 8, 0], stack: [
          fieldRow2Col('Date of Birth', profile.dateOfBirth, false, 'Time of Birth', profile.timeOfBirth, false),
          fieldRow2Col('Place of Birth', profile.placeOfBirth, false, 'Rasi (Moon Sign)', profile.rasi, false),
          fieldRow2Col('Nakshatra (Star)', profile.nakshatra, false, 'Lagnam (Ascendant)', profile.laknam, false),
          fieldRow2Col('Gothram', profile.gothram, false, 'Dhosham', profile.dhosham, false),
          profile.horoscopeAvailable
            ? { text: '\u2713  Horoscope Available', style: 'availTag', margin: [8, 4, 0, 2] }
            : null,
        ]},
      ]),

      // ═══════════════════════════════════════════
      // PARTNER PREFERENCES
      // ═══════════════════════════════════════════
      sectionCard('Partner Preferences', '\u2661', [
        { margin: [8, 0, 8, 0], stack: [
          fieldRow2Col('Age Preference', prefAge, false, 'Height Preference', profile.prefHeight, false),
          fieldRow2Col('Education', profile.prefEducation, false, 'Location', profile.prefLocation, false),
          fieldRow2Col('Religion', profile.prefReligion, false, 'Horoscope Match', profile.horoscopeMatchRequired ? 'Required' : 'Not Required', false),
          fieldRow('Preferred Rasi', Array.isArray(profile.preferredRasi) && profile.preferredRasi.length ? profile.preferredRasi.join(', ') : '\u2014', false),
          fieldRow('Preferred Nakshatra', Array.isArray(profile.preferredNakshatra) && profile.preferredNakshatra.length ? profile.preferredNakshatra.join(', ') : '\u2014', false),
          fieldRow('Preferred Lagnam', Array.isArray(profile.preferredLagnam) && profile.preferredLagnam.length ? profile.preferredLagnam.join(', ') : '\u2014', false),
          fieldRow('Preferred Dhosham', Array.isArray(profile.preferredDhosham) && profile.preferredDhosham.length ? profile.preferredDhosham.join(', ') : '\u2014', false),
        ]},
      ]),

      // ═══════════════════════════════════════════
      // CONTACT INFORMATION
      // ═══════════════════════════════════════════
      sectionCard('Contact Information', '\u2709', [
        hidden
          ? { text: 'Contact details are available for premium members only. Upgrade to view.', style: 'hiddenNote', margin: [12, 4, 0, 4] }
          : { margin: [8, 0, 8, 0], stack: [
              fieldRow('Email', profile.email, false),
              fieldRow('Mobile', profile.mobile, false),
              fieldRow('City', profile.city, false),
              fieldRow('State', profile.state, false),
              fieldRow('Country', profile.country, false),
            ]},
      ]),

      // ═══════════════════════════════════════════
      // BRANDED FOOTER
      // ═══════════════════════════════════════════
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: PW, y2: 0, lineWidth: 1, lineColor: C.primary }], margin: [0, 10, 0, 6] },
      {
        columns: [
          CACHED_LOGO_BASE64
            ? { image: `data:image/png;base64,${CACHED_LOGO_BASE64}`, width: 16, height: 16, margin: [0, 0, 6, 0] }
            : { text: '', width: 0 },
          {
            stack: [
              { text: 'JOD Matrimony', fontSize: 11, bold: true, color: C.primary, margin: [0, 0, 0, 1] },
              { text: 'Find Your Perfect Life Partner', fontSize: 7.5, color: C.textMuted, italics: true },
            ],
          },
          {
            text: `Generated on ${today}`,
            fontSize: 7,
            color: C.textMuted,
            alignment: 'right',
            margin: [0, 4, 0, 0],
          },
        ],
        margin: [0, 0, 0, 4],
      },
    ].filter(Boolean),

    styles: {
      docTitle:      { fontSize: 18, bold: true, color: C.white },
      docId:         { fontSize: 8.5, color: C.accent, margin: [0, 2, 0, 0] },
      userName:      { fontSize: 17, bold: true, color: C.textDark },
      userMeta:      { fontSize: 9.5, color: C.textMed, margin: [0, 0.5, 0, 0.5] },
      userLocation:  { fontSize: 9, color: C.textLight },
      contactInfo:   { fontSize: 8.5, color: C.textMed },
      sectionTitle:  { fontSize: 10, bold: true, color: C.primary },
      fieldLbl:      { fontSize: 8.5, bold: true, color: C.textLight },
      fieldVal:      { fontSize: 9, color: C.textDark },
      fieldValMuted: { fontSize: 9, color: C.textMuted },
      hiddenVal:     { fontSize: 8, color: C.textMuted, italics: true },
      hiddenNote:    { fontSize: 8, color: C.textMuted, italics: true },
      summLabel:     { fontSize: 7.5, color: C.textLight, bold: true, margin: [8, 0, 0, 1] },
      summValue:     { fontSize: 9, color: C.textDark, margin: [8, 0, 0, 3] },
      availTag:      { fontSize: 8.5, color: C.green, bold: true },
    },

    defaultStyle: { font: 'Roboto' },
  };

  return pdfmake.createPdf(docDefinition);
};

module.exports = { generateBiodata };