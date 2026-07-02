/** Traditional South Indian horoscope constants */

export const PLANETS = [
  { id: 'Sun', abbr: 'Su', label: 'Sun (Surya)' },
  { id: 'Moon', abbr: 'Mo', label: 'Moon (Chandra)' },
  { id: 'Mars', abbr: 'Ma', label: 'Mars (Mangal)' },
  { id: 'Mercury', abbr: 'Me', label: 'Mercury (Budha)' },
  { id: 'Jupiter', abbr: 'Ju', label: 'Jupiter (Guru)' },
  { id: 'Venus', abbr: 'Ve', label: 'Venus (Shukra)' },
  { id: 'Saturn', abbr: 'Sa', label: 'Saturn (Shani)' },
  { id: 'Rahu', abbr: 'Ra', label: 'Rahu' },
  { id: 'Ketu', abbr: 'Ke', label: 'Ketu' },
  { id: 'Lagna', abbr: 'Lg', label: 'Lagna (Ascendant)' },
];

export const UNIQUE_PLANETS = ['Lagna', 'Rahu', 'Ketu'];

export const PLANET_ABBR = Object.fromEntries(PLANETS.map((p) => [p.id, p.abbr]));

/** South Indian 4×4 grid — center empty, houses 1–12 on perimeter */
export const HOUSE_GRID = [
  [12, 1, 2, 3],
  [11, null, null, 4],
  [10, null, null, 5],
  [9, 8, 7, 6],
];

export const RASI_OPTIONS = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)',
];

export const NAKSHATRA_OPTIONS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
  'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
  'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

export const LAGNAM_OPTIONS = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
export const PADA_OPTIONS = ['1', '2', '3', '4'];
export const DOSHAM_OPTIONS = ['None', 'Manglik / Chevvai Dhosham', 'Sarpa Dhosham', 'Naga Dhosham', 'Kuja Dhosham', 'Kala Sarpa Dhosham', 'Pitra Dhosham', 'Others'];
export const CHEVVAI_OPTIONS = ['None', 'Present', 'Not Present', 'Partial'];
export const NADI_OPTIONS = ['Adi', 'Madhya', 'Antya'];
export const YONI_OPTIONS = ['Ashwa', 'Gaja', 'Mesha', 'Sarpa', 'Shwan', 'Marjara', 'Mooshaka', 'Go', 'Mahisha', 'Vyaghra', 'Mriga', 'Vrishabha', 'Vanara', 'Nakula'];
export const RAJJU_OPTIONS = ['Pada', 'Kati', 'Nabhi', 'Kanta', 'Shiro'];
export const GANA_OPTIONS = ['Deva', 'Manushya', 'Rakshasa'];
export const DASA_OPTIONS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'IST — India (Asia/Kolkata)' },
  { value: 'Asia/Dubai', label: 'GST — UAE (Asia/Dubai)' },
  { value: 'Asia/Singapore', label: 'SGT — Singapore' },
  { value: 'Europe/London', label: 'GMT/BST — UK' },
  { value: 'America/New_York', label: 'EST — US East' },
  { value: 'America/Los_Angeles', label: 'PST — US West' },
  { value: 'America/Chicago', label: 'CST — US Central' },
  { value: 'Australia/Sydney', label: 'AEST — Australia' },
  { value: 'Asia/Colombo', label: 'SLST — Sri Lanka' },
  { value: 'Asia/Kathmandu', label: 'NPT — Nepal' },
];

export const emptyChart = () =>
  Object.fromEntries([...Array(12)].map((_, i) => [String(i + 1), []]));

export const emptyHoroscopeFields = () => ({
  rasi: '',
  nakshatra: '',
  lagnam: '',
  pada: '',
  gothram: '',
  dosham: '',
  chevvaiDosham: '',
  nadi: '',
  yoni: '',
  rajju: '',
  gana: '',
  dasa: '',
  mahadasa: '',
});

export const createEmptyHoroscopeData = (overrides = {}) => ({
  birthDetails: {
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    timeZone: 'Asia/Kolkata',
    ...overrides.birthDetails,
  },
  entryMode: 'manual',
  rasiChart: emptyChart(),
  navamsaChart: emptyChart(),
  fields: { ...emptyHoroscopeFields(), ...overrides.fields },
  saved: false,
  savedAt: null,
});

export const parseHoroscopeData = (raw) => {
  if (!raw) return createEmptyHoroscopeData();
  try {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return {
      ...createEmptyHoroscopeData(),
      ...data,
      birthDetails: { ...createEmptyHoroscopeData().birthDetails, ...data.birthDetails },
      fields: { ...emptyHoroscopeFields(), ...data.fields },
      rasiChart: { ...emptyChart(), ...data.rasiChart },
      navamsaChart: { ...emptyChart(), ...data.navamsaChart },
    };
  } catch {
    return createEmptyHoroscopeData();
  }
};

export const getPlanetAbbr = (planetId) => PLANET_ABBR[planetId] || planetId?.slice(0, 2) || '';

export const canAssignPlanet = (chart, planetId, houseNum) => {
  if (!UNIQUE_PLANETS.includes(planetId)) return { ok: true };
  for (const [house, planets] of Object.entries(chart)) {
    if (house !== String(houseNum) && planets.includes(planetId)) {
      return { ok: false, message: `${planetId} can only appear once in a chart.` };
    }
  }
  return { ok: true };
};

export const findPlanetHouse = (chart, planetId) => {
  for (const [house, planets] of Object.entries(chart)) {
    if (planets.includes(planetId)) return Number(house);
  }
  return null;
};


