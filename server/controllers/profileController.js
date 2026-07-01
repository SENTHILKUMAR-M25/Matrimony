const pool = require('../config/db');
const path = require('path');
const { sendAppreciationEmail } = require('../utils/email');
const { generateBiodataPdf, preloadAssets } = require('../utils/biodataPdf');

const safeParseJSON = (val, fallback) => {
  if (!val) return fallback;
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : fallback; } catch { return fallback; }
};

preloadAssets();

// POST /api/profile/create
const createProfile = async (req, res) => {
  const userId = req.user.id;

  const {
    fullName, age, height, weight,
    maritalStatus, religion, caste, subCaste, motherTongue,
    education, occupation, companyName, annualIncome,
    fatherName, motherName, siblings,
    country, state, city,
    dateOfBirth, timeOfBirth, placeOfBirth,
    rasi, nakshatra, laknam, gothram, dhosham,
    horoscopeAvailable,
    preferredRasi, preferredNakshatra, preferredLagnam, preferredDhosham, dhoshamPreference, horoscopeMatchRequired,
    prefAgeMin, prefAgeMax, prefHeight, prefEducation, prefLocation, prefReligion,
  } = req.body;

  // Handle uploaded photos
  let profilePhotoPath = null;
  let additionalPhotosPaths = [];
  let horoscopePdfPath = null;
  let horoscopeImagePath = null;

  if (req.files) {
    if (req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
      profilePhotoPath = '/uploads/' + req.files['profilePhoto'][0].filename;
    }
    if (req.files['additionalPhotos']) {
      additionalPhotosPaths = req.files['additionalPhotos'].map(
        (f) => '/uploads/' + f.filename
      );
    }
    if (req.files['horoscopePdf'] && req.files['horoscopePdf'][0]) {
      horoscopePdfPath = '/uploads/' + req.files['horoscopePdf'][0].filename;
    }
    if (req.files['horoscopeImage'] && req.files['horoscopeImage'][0]) {
      horoscopeImagePath = '/uploads/' + req.files['horoscopeImage'][0].filename;
    }
  }

  try {
    // Upsert: insert or update profile for this user
    const [existing] = await pool.query(
      'SELECT id FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      // UPDATE
      await pool.query(
        `UPDATE profiles SET
          full_name=?, age=?, height=?, weight=?,
          marital_status=?, religion=?, caste=?, sub_caste=?, mother_tongue=?,
          education=?, occupation=?, company_name=?, annual_income=?,
          father_name=?, mother_name=?, siblings=?,
          country=?, state=?, city=?,
          date_of_birth=?, time_of_birth=?, place_of_birth=?,
          rasi=?, nakshatra=?, laknam=?, gothram=?, dhosham=?,
          horoscope_available=?,
          horoscope_pdf=COALESCE(?, horoscope_pdf),
          horoscope_image=COALESCE(?, horoscope_image),
          preferred_rasi=?, preferred_nakshatra=?, preferred_lagnam=?, preferred_dhosham=?, dhosham_preference=?, horoscope_match_required=?,
          pref_age_min=?, pref_age_max=?, pref_height=?, pref_education=?, pref_location=?, pref_religion=?,
          profile_photo=COALESCE(?, profile_photo),
          additional_photos=COALESCE(?, additional_photos),
          profile_completed=1
        WHERE user_id=?`,
        [
          fullName, age || null, height, weight,
          maritalStatus, religion, caste, subCaste, motherTongue,
          education, occupation, companyName, annualIncome,
          fatherName, motherName, siblings || 0,
          country, state, city,
          dateOfBirth || null, timeOfBirth || null, placeOfBirth || null,
          rasi || null, nakshatra || null, laknam || null, gothram || null, dhosham || null,
          horoscopeAvailable === 'true' || horoscopeAvailable === true ? 1 : 0,
          horoscopePdfPath,
          horoscopeImagePath,
          preferredRasi ? (Array.isArray(preferredRasi) ? JSON.stringify(preferredRasi) : preferredRasi) : null,
          preferredNakshatra ? (Array.isArray(preferredNakshatra) ? JSON.stringify(preferredNakshatra) : preferredNakshatra) : null,
          preferredLagnam ? (Array.isArray(preferredLagnam) ? JSON.stringify(preferredLagnam) : preferredLagnam) : null,
          preferredDhosham ? (Array.isArray(preferredDhosham) ? JSON.stringify(preferredDhosham) : preferredDhosham) : null,
          dhoshamPreference || null,
          horoscopeMatchRequired === 'true' || horoscopeMatchRequired === true ? 1 : 0,
          prefAgeMin || null, prefAgeMax || null, prefHeight, prefEducation, prefLocation, prefReligion,
          profilePhotoPath,
          additionalPhotosPaths.length > 0 ? JSON.stringify(additionalPhotosPaths) : null,
          userId,
        ]
      );
    } else {
      // INSERT
      await pool.query(
        `INSERT INTO profiles (
          user_id,
          full_name, age, height, weight,
          marital_status, religion, caste, sub_caste, mother_tongue,
          education, occupation, company_name, annual_income,
          father_name, mother_name, siblings,
          country, state, city,
          date_of_birth, time_of_birth, place_of_birth,
          rasi, nakshatra, laknam, gothram, dhosham,
          horoscope_available, horoscope_pdf, horoscope_image,
          preferred_rasi, preferred_nakshatra, preferred_lagnam, preferred_dhosham, dhosham_preference, horoscope_match_required,
          pref_age_min, pref_age_max, pref_height, pref_education, pref_location, pref_religion,
          profile_photo, additional_photos, profile_completed
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
        [
          userId,
          fullName, age || null, height, weight,
          maritalStatus, religion, caste, subCaste, motherTongue,
          education, occupation, companyName, annualIncome,
          fatherName, motherName, siblings || 0,
          country, state, city,
          dateOfBirth || null, timeOfBirth || null, placeOfBirth || null,
          rasi || null, nakshatra || null, laknam || null, gothram || null, dhosham || null,
          horoscopeAvailable === 'true' || horoscopeAvailable === true ? 1 : 0,
          horoscopePdfPath,
          horoscopeImagePath,
          preferredRasi ? (Array.isArray(preferredRasi) ? JSON.stringify(preferredRasi) : preferredRasi) : null,
          preferredNakshatra ? (Array.isArray(preferredNakshatra) ? JSON.stringify(preferredNakshatra) : preferredNakshatra) : null,
          preferredLagnam ? (Array.isArray(preferredLagnam) ? JSON.stringify(preferredLagnam) : preferredLagnam) : null,
          preferredDhosham ? (Array.isArray(preferredDhosham) ? JSON.stringify(preferredDhosham) : preferredDhosham) : null,
          dhoshamPreference || null,
          horoscopeMatchRequired === 'true' || horoscopeMatchRequired === true ? 1 : 0,
          prefAgeMin || null, prefAgeMax || null, prefHeight, prefEducation, prefLocation, prefReligion,
          profilePhotoPath,
          additionalPhotosPaths.length > 0 ? JSON.stringify(additionalPhotosPaths) : null,
        ]
      );
    }

    // Fetch updated profile to return to client
    const [profileRows] = await pool.query(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );

    const profile = profileRows[0];

    const profileId = `JODM-${String(profile.id).padStart(3, '0')}`;

    pool.query('SELECT first_name, email FROM users WHERE id = ?', [userId])
      .then(([[userRow]]) => {
        if (userRow) sendAppreciationEmail(userRow.email, userRow.first_name);
      })
      .catch(() => {});

    return res.status(200).json({
      message: 'Profile saved successfully',
      profile: {
        profileId,
        fullName: profile.full_name,
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        maritalStatus: profile.marital_status,
        religion: profile.religion,
        caste: profile.caste,
        subCaste: profile.sub_caste,
        motherTongue: profile.mother_tongue,
        education: profile.education,
        occupation: profile.occupation,
        companyName: profile.company_name,
        annualIncome: profile.annual_income,
        fatherName: profile.father_name,
        motherName: profile.mother_name,
        siblings: profile.siblings,
        country: profile.country,
        state: profile.state,
        city: profile.city,
        dateOfBirth: profile.date_of_birth,
        timeOfBirth: profile.time_of_birth,
        placeOfBirth: profile.place_of_birth,
        rasi: profile.rasi,
        nakshatra: profile.nakshatra,
        laknam: profile.laknam,
        gothram: profile.gothram,
        dhosham: profile.dhosham,
        horoscopeAvailable: Boolean(profile.horoscope_available),
        horoscopePdf: profile.horoscope_pdf,
        horoscopeImage: profile.horoscope_image,
        preferredRasi: safeParseJSON(profile.preferred_rasi, []),
        preferredNakshatra: safeParseJSON(profile.preferred_nakshatra, []),
        preferredLagnam: safeParseJSON(profile.preferred_lagnam, []),
        preferredDhosham: safeParseJSON(profile.preferred_dhosham, []),
        dhoshamPreference: profile.dhosham_preference,
        horoscopeMatchRequired: Boolean(profile.horoscope_match_required),
        prefAgeMin: profile.pref_age_min,
        prefAgeMax: profile.pref_age_max,
        prefHeight: profile.pref_height,
        prefEducation: profile.pref_education,
        prefLocation: profile.pref_location,
        prefReligion: profile.pref_religion,
        profilePhoto: profile.profile_photo,
        additionalPhotos: profile.additional_photos ? JSON.parse(profile.additional_photos) : [],
        profileCompleted: Boolean(profile.profile_completed),
      },
    });
  } catch (error) {
    console.error('--- CREATE PROFILE ERROR ---');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({ message: 'Failed to save profile. Please try again.' });
  }
};

const getProfileUrl = (path) => {
  if (!path) return null;
  return `http://localhost:${process.env.PORT || 3000}${path}`;
};

const formatProfile = (row) => ({
  id: row.id,
  profileId: `JODM-${String(row.id).padStart(3, '0')}`,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  mobile: row.mobile,
  gender: row.gender,
  profileCompleted: Boolean(row.profile_completed),
  fullName: row.full_name,
  age: row.age,
  height: row.height,
  weight: row.weight,
  maritalStatus: row.marital_status,
  religion: row.religion,
  caste: row.caste,
  subCaste: row.sub_caste,
  motherTongue: row.mother_tongue,
  education: row.education,
  occupation: row.occupation,
  companyName: row.company_name,
  annualIncome: row.annual_income,
  fatherName: row.father_name,
  motherName: row.mother_name,
  siblings: row.siblings,
  country: row.country,
  state: row.state,
  city: row.city,
  dateOfBirth: row.date_of_birth,
  timeOfBirth: row.time_of_birth,
  placeOfBirth: row.place_of_birth,
  rasi: row.rasi,
  nakshatra: row.nakshatra,
  laknam: row.laknam,
  gothram: row.gothram,
  dhosham: row.dhosham,
  horoscopeAvailable: Boolean(row.horoscope_available),
  horoscopePdf: row.horoscope_pdf ? getProfileUrl(row.horoscope_pdf) : null,
  horoscopeImage: row.horoscope_image ? getProfileUrl(row.horoscope_image) : null,
  preferredRasi: safeParseJSON(row.preferred_rasi, []),
  preferredNakshatra: safeParseJSON(row.preferred_nakshatra, []),
  preferredLagnam: safeParseJSON(row.preferred_lagnam, []),
  preferredDhosham: safeParseJSON(row.preferred_dhosham, []),
  dhoshamPreference: row.dhosham_preference,
  horoscopeMatchRequired: Boolean(row.horoscope_match_required),
  prefAgeMin: row.pref_age_min,
  prefAgeMax: row.pref_age_max,
  prefHeight: row.pref_height,
  prefEducation: row.pref_education,
  prefLocation: row.pref_location,
  prefReligion: row.pref_religion,
  profilePhoto: getProfileUrl(row.profile_photo),
  profilePhotoRaw: row.profile_photo || null,
  additionalPhotos: row.additional_photos ? JSON.parse(row.additional_photos).map(getProfileUrl) : [],
});

// GET /api/profile/me
const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.mobile, u.gender,
              p.*
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const row = rows[0];
    return res.status(200).json({ user: formatProfile(row) });
  } catch (error) {
    console.error('--- GET PROFILE ERROR ---');
    console.error('Message:', error.message);
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

// GET /api/profile/:id
const getProfileById = async (req, res) => {
  const viewerId = req.user.id;
  const profileId = parseInt(req.params.id, 10);

  if (viewerId === profileId) {
    return res.status(400).json({ message: 'Use /profile/me to view your own profile.' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.mobile, u.gender,
              p.*
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ? AND p.profile_completed = 1`,
      [profileId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const row = rows[0];

    // Apply subscription-based access control
    const [viewerRows] = await pool.query(
      'SELECT subscription_type, viewed_profiles, last_viewed_reset FROM users WHERE id = ?',
      [viewerId]
    );

    if (viewerRows.length === 0) {
      return res.status(404).json({ message: 'Viewer not found' });
    }

    const viewer = viewerRows[0];
    const isPremium = viewer.subscription_type === 'premium';

    // Auto-reset monthly
    const lastReset = new Date(viewer.last_viewed_reset);
    const now = new Date();
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      await pool.query(
        'UPDATE users SET viewed_profiles = 0, last_viewed_reset = NOW() WHERE id = ?',
        [viewerId]
      );
      viewer.viewed_profiles = 0;
    }

    // Check limit
    const limit = isPremium ? 1000 : 10;
    const viewed = viewer.viewed_profiles;
    const reachedLimit = viewed >= limit;

    // Record the view
    if (!reachedLimit) {
      await pool.query(
        'UPDATE users SET viewed_profiles = viewed_profiles + 1 WHERE id = ?',
        [viewerId]
      );
      await pool.query(
        'INSERT INTO profile_views (viewer_id, viewed_user_id) VALUES (?, ?)',
        [viewerId, profileId]
      );
    }

    const profile = formatProfile(row);

    if (!isPremium) {
      // Free users: return basic info only
      return res.status(200).json({
        profile: {
          id: profile.id,
          profileId: profile.profileId,
          fullName: profile.fullName,
          age: profile.age,
          height: profile.height,
          religion: profile.religion,
          education: profile.education,
          occupation: profile.occupation,
          maritalStatus: profile.maritalStatus,
          isFreeProfile: true,
          profilePhoto: null,
          email: null,
          mobile: null,
          city: null,
          state: null,
          country: null,
          weight: null,
          caste: null,
          subCaste: null,
          motherTongue: null,
          companyName: null,
          annualIncome: null,
          fatherName: null,
          motherName: null,
          siblings: null,
          additionalPhotos: [],
          rasi: profile.rasi,
          nakshatra: profile.nakshatra,
          dhosham: profile.dhosham,
        },
        reached_limit: reachedLimit,
        viewed_profiles: reachedLimit ? viewed : viewed + 1,
        limit,
      });
    }

    return res.status(200).json({
      profile,
      reached_limit: reachedLimit,
      viewed_profiles: reachedLimit ? viewed : viewed + 1,
      limit,
    });
  } catch (error) {
    console.error('--- GET PROFILE BY ID ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

const fetchFullProfileRow = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.mobile, u.gender,
            p.*
     FROM users u
     LEFT JOIN profiles p ON u.id = p.user_id
     WHERE u.id = ? AND p.profile_completed = 1`,
    [userId]
  );
  return rows.length > 0 ? rows[0] : null;
};

const buildBiodataFilename = (profile) => {
  const id = profile.profileId || `JODM-${String(profile.id).padStart(3, '0')}`;
  const name = (profile.fullName || 'Profile').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  return `${id}_${name}_Biodata.pdf`;
};

// GET /api/profile/me/biodata
const downloadMyBiodata = async (req, res) => {
  const userId = req.user.id;

  try {
    const [userRows] = await pool.query(
      'SELECT subscription_type FROM users WHERE id = ?',
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPremium = userRows[0].subscription_type === 'premium';
    if (!isPremium) {
      return res.status(403).json({
        message: 'This feature is available exclusively for Premium Members. Upgrade your membership to download your complete matrimonial biodata.',
      });
    }

    const row = await fetchFullProfileRow(userId);
    if (!row) {
      return res.status(404).json({ message: 'Complete your profile before downloading biodata.' });
    }

    const profile = formatProfile(row);
    const pdfBuffer = await generateBiodataPdf(profile, {
      isPremium: true,
      profilePhotoPath: row.profile_photo,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${buildBiodataFilename(profile)}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('--- DOWNLOAD MY BIODATA ERROR ---');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({ message: 'Failed to generate biodata PDF.' });
  }
};

// GET /api/profile/:id/biodata
const downloadBiodata = async (req, res) => {
  const viewerId = req.user.id;
  const targetId = parseInt(req.params.id, 10);

  if (Number.isNaN(targetId)) {
    return res.status(400).json({ message: 'Invalid profile ID.' });
  }

  if (viewerId === targetId) {
    return downloadMyBiodata(req, res);
  }

  try {
    const row = await fetchFullProfileRow(targetId);
    if (!row) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    const [viewerRows] = await pool.query(
      'SELECT subscription_type FROM users WHERE id = ?',
      [viewerId]
    );
    if (viewerRows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPremium = viewerRows[0].subscription_type === 'premium';
    if (!isPremium) {
      return res.status(403).json({
        message: 'This feature is available exclusively for Premium Members. Upgrade your membership to download your complete matrimonial biodata.',
      });
    }

    const profile = formatProfile(row);
    const pdfBuffer = await generateBiodataPdf(profile, {
      isPremium,
      profilePhotoPath: row.profile_photo,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${buildBiodataFilename(profile)}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('--- DOWNLOAD BIODATA ERROR ---');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({ message: 'Failed to generate biodata PDF.' });
  }
};

module.exports = {
  createProfile,
  getProfile,
  getProfileById,
  downloadMyBiodata,
  downloadBiodata,
};
