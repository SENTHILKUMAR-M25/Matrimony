const pool = require('../config/db');

// GET /api/dashboard/stats
// Returns profile views, matches count, interests sent/received counts for the logged-in user
const getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch the user's own profile
    const [profileRows] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.mobile, u.gender,
              p.full_name, p.age, p.height, p.weight,
              p.marital_status, p.religion, p.caste, p.sub_caste, p.mother_tongue,
              p.education, p.occupation, p.company_name, p.annual_income,
              p.father_name, p.mother_name, p.siblings,
              p.country, p.state, p.city,
              p.pref_age_min, p.pref_age_max, p.pref_height,
              p.pref_education, p.pref_location, p.pref_religion,
              p.profile_photo, p.additional_photos,
              p.profile_completed, p.created_at
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (profileRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const row = profileRows[0];

    // Build the user+profile object
    const profile = {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      fullName: row.full_name || `${row.first_name} ${row.last_name}`,
      email: row.email,
      mobile: row.mobile,
      gender: row.gender,
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
      profilePhoto: row.profile_photo
        ? `http://localhost:${process.env.PORT || 5000}${row.profile_photo}`
        : null,
      additionalPhotos: row.additional_photos
        ? JSON.parse(row.additional_photos).map(p => `http://localhost:${process.env.PORT || 5000}${p}`)
        : [],
      profileCompleted: Boolean(row.profile_completed),
      memberSince: row.created_at,
    };

    // Count potential matches (profiles of opposite gender, profile completed)
    const oppositeGender = row.gender === 'Male' ? 'Female' : 'Male';
    const [[{ matchCount }]] = await pool.query(
      `SELECT COUNT(*) AS matchCount
       FROM users u
       INNER JOIN profiles p ON u.id = p.user_id
       WHERE u.gender = ? AND p.profile_completed = 1 AND u.id != ?`,
      [oppositeGender, userId]
    );

    // Placeholder stats (extend later when interests/views tables exist)
    const stats = {
      profileViews: 0,
      newMatches: Number(matchCount),
      sentInterests: 0,
      receivedInterests: 0,
    };

    return res.status(200).json({ profile, stats });
  } catch (error) {
    console.error('--- DASHBOARD STATS ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
};

module.exports = { getDashboardStats };
