const pool = require('../config/db');

const getCommunities = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.caste as name, COUNT(*) as count
       FROM profiles p
       WHERE p.caste IS NOT NULL AND p.caste != '' AND p.profile_completed = 1
       GROUP BY p.caste
       ORDER BY count DESC`
    );
    return res.status(200).json({ communities: rows });
  } catch (error) {
    console.error('--- GET COMMUNITIES ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch communities.' });
  }
};

module.exports = { getCommunities };
