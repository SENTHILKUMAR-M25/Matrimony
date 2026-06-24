const pool = require('../config/db');
const path = require('path');

// POST /api/profile/create
const createProfile = async (req, res) => {
  const userId = req.user.id;

  const {
    fullName, age, height, weight,
    maritalStatus, religion, caste, subCaste, motherTongue,
    education, occupation, companyName, annualIncome,
    fatherName, motherName, siblings,
    country, state, city,
    prefAgeMin, prefAgeMax, prefHeight, prefEducation, prefLocation, prefReligion,
  } = req.body;

  // Handle uploaded photos
  let profilePhotoPath = null;
  let additionalPhotosPaths = [];

  if (req.files) {
    if (req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
      profilePhotoPath = '/uploads/' + req.files['profilePhoto'][0].filename;
    }
    if (req.files['additionalPhotos']) {
      additionalPhotosPaths = req.files['additionalPhotos'].map(
        (f) => '/uploads/' + f.filename
      );
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
          pref_age_min, pref_age_max, pref_height, pref_education, pref_location, pref_religion,
          profile_photo, additional_photos, profile_completed
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
        [
          userId,
          fullName, age || null, height, weight,
          maritalStatus, religion, caste, subCaste, motherTongue,
          education, occupation, companyName, annualIncome,
          fatherName, motherName, siblings || 0,
          country, state, city,
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

    return res.status(200).json({
      message: 'Profile saved successfully',
      profile: {
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
    return res.status(200).json({
      user: {
        id: row.id,
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
        prefAgeMin: row.pref_age_min,
        prefAgeMax: row.pref_age_max,
        prefHeight: row.pref_height,
        prefEducation: row.pref_education,
        prefLocation: row.pref_location,
        prefReligion: row.pref_religion,
        profilePhoto: row.profile_photo,
        additionalPhotos: row.additional_photos ? JSON.parse(row.additional_photos) : [],
      },
    });
  } catch (error) {
    console.error('--- GET PROFILE ERROR ---');
    console.error('Message:', error.message);
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

module.exports = { createProfile, getProfile };
