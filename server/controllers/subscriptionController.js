const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

// GET /api/subscription/status
const getSubscriptionStatus = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT subscription_type, viewed_profiles, last_viewed_reset, 
              DATE_FORMAT(last_viewed_reset, '%Y-%m-%d %H:%i:%s') as last_viewed_reset_formatted
       FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const limit = user.subscription_type === 'premium' ? 1000 : 10;

    // Auto-reset if new month
    const lastReset = new Date(user.last_viewed_reset);
    const now = new Date();
    let viewed = user.viewed_profiles;
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      await pool.query(
        'UPDATE users SET viewed_profiles = 0, last_viewed_reset = NOW() WHERE id = ?',
        [userId]
      );
      viewed = 0;
    }

    return res.status(200).json({
      subscription_type: user.subscription_type,
      viewed_profiles: viewed,
      limit,
      remaining: limit - viewed,
      reached_limit: viewed >= limit,
    });
  } catch (error) {
    console.error('--- GET SUBSCRIPTION STATUS ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to fetch subscription status.' });
  }
};

// POST /api/subscription/upgrade
const upgradeSubscription = async (req, res) => {
  const userId = req.user.id;
  const { plan } = req.body; // 'monthly' or 'yearly'

  if (!plan || !['monthly', 'yearly'].includes(plan)) {
    return res.status(400).json({ message: 'Invalid plan. Choose monthly or yearly.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT subscription_type FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (rows[0].subscription_type === 'premium') {
      return res.status(400).json({ message: 'You are already a premium member.' });
    }

    const amount = plan === 'yearly' ? 4999.00 : 499.00;
    const interval = plan === 'yearly' ? '12 MONTH' : '1 MONTH';

    // Upgrade user
    await pool.query(
      'UPDATE users SET subscription_type = ?, viewed_profiles = 0, last_viewed_reset = NOW() WHERE id = ?',
      ['premium', userId]
    );

    // Record subscription
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, start_date, end_date, amount, status)
       VALUES (?, 'premium', NOW(), DATE_ADD(NOW(), INTERVAL ${interval}), ?, 'active')`,
      [userId, amount]
    );

    return res.status(200).json({
      message: plan === 'yearly' ? 'Successfully upgraded to Premium Yearly!' : 'Successfully upgraded to Premium Monthly!',
      subscription_type: 'premium',
      plan,
    });
  } catch (error) {
    console.error('--- UPGRADE SUBSCRIPTION ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to upgrade subscription.' });
  }
};

// POST /api/subscription/view-profile/:id
const viewProfile = async (req, res) => {
  const viewerId = req.user.id;
  const viewedUserId = parseInt(req.params.id, 10);

  if (viewerId === viewedUserId) {
    return res.status(400).json({ message: 'Cannot view your own profile.' });
  }

  try {
    // Check user exists
    const [userRows] = await pool.query(
      `SELECT subscription_type, viewed_profiles, last_viewed_reset FROM users WHERE id = ?`,
      [viewerId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];
    const limit = user.subscription_type === 'premium' ? 1000 : 10;

    // Auto-reset if new month
    const lastReset = new Date(user.last_viewed_reset);
    const now = new Date();
    let viewed = user.viewed_profiles;
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      await pool.query(
        'UPDATE users SET viewed_profiles = 0, last_viewed_reset = NOW() WHERE id = ?',
        [viewerId]
      );
      viewed = 0;
    }

    if (viewed >= limit) {
      return res.status(403).json({
        message: 'Profile viewing limit reached',
        viewed_profiles: viewed,
        limit,
        requires_upgrade: user.subscription_type === 'free',
      });
    }

    // Increment view count
    await pool.query(
      'UPDATE users SET viewed_profiles = viewed_profiles + 1 WHERE id = ?',
      [viewerId]
    );

    // Record the view
    await pool.query(
      'INSERT INTO profile_views (viewer_id, viewed_user_id) VALUES (?, ?)',
      [viewerId, viewedUserId]
    );

    return res.status(200).json({
      message: 'Profile viewed',
      viewed_profiles: viewed + 1,
      limit,
      remaining: limit - (viewed + 1),
    });
  } catch (error) {
    console.error('--- VIEW PROFILE ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to record profile view.' });
  }
};

// GET /api/matches
const getMatches = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get current user's gender, subscription info, and astro preferences
    const [userRows] = await pool.query(
      `SELECT u.id, u.gender, u.subscription_type, u.viewed_profiles, u.last_viewed_reset,
              p.city, p.state, p.country, p.religion, p.education, p.occupation,
              p.age as my_age, p.height as my_height,
              p.preferred_rasi, p.preferred_nakshatra,
              p.horoscope_match_required
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = userRows[0];
    const prefRasi = currentUser.preferred_rasi ? JSON.parse(currentUser.preferred_rasi) : [];
    const prefNakshatra = currentUser.preferred_nakshatra ? JSON.parse(currentUser.preferred_nakshatra) : [];
    const prefLagnam = [];
    const prefDhosham = [];
    const horoscopeReq = Boolean(currentUser.horoscope_match_required);
    const limit = currentUser.subscription_type === 'premium' ? 1000 : 10;

    // Auto-reset if new month
    const lastReset = new Date(currentUser.last_viewed_reset);
    const now = new Date();
    let viewed = currentUser.viewed_profiles;
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      await pool.query(
        'UPDATE users SET viewed_profiles = 0, last_viewed_reset = NOW() WHERE id = ?',
        [userId]
      );
      viewed = 0;
    }

    // Fetch opposite gender profiles (case-insensitive)
    const normalizedGender = (currentUser.gender || '').toLowerCase();
    const oppositeGender = normalizedGender === 'male' ? 'female' : 'male';
    const [matchRows] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.mobile, u.subscription_type,
              CONCAT('JODM-', LPAD(p.id, 3, '0')) as profile_id,
              p.full_name, p.age, p.height, p.weight,
              p.marital_status, p.religion, p.caste, p.sub_caste, p.mother_tongue,
              p.education, p.occupation, p.company_name, p.annual_income,
              p.father_name, p.mother_name, p.siblings,
              p.country, p.state, p.city,
              p.profile_photo, p.additional_photos,
              p.profile_completed,
              p.rasi, p.nakshatra, p.laknam, p.dhosham
       FROM users u
       INNER JOIN profiles p ON u.id = p.user_id
       WHERE LOWER(u.gender) = ? AND p.profile_completed = 1 AND u.id != ?
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [oppositeGender, userId, limit * 2] // fetch more for astro filtering headroom
    );

    // Apply astro preference filtering
    let filtered = matchRows;
    if (prefRasi.length > 0) {
      filtered = filtered.filter((row) => row.rasi && prefRasi.includes(row.rasi));
    }
    if (filtered.length > 0 && prefNakshatra.length > 0) {
      filtered = filtered.filter((row) => row.nakshatra && prefNakshatra.includes(row.nakshatra));
    }
    if (filtered.length > 0 && prefLagnam.length > 0) {
      filtered = filtered.filter((row) => row.laknam && prefLagnam.includes(row.laknam));
    }
    if (filtered.length > 0 && prefDhosham.length > 0) {
      filtered = filtered.filter((row) => row.dhosham && prefDhosham.includes(row.dhosham));
    }
    // If all filtered out, fall back to unfiltered
    if (filtered.length === 0 && (prefRasi.length > 0 || prefNakshatra.length > 0 || prefLagnam.length > 0 || prefDhosham.length > 0)) {
      filtered = matchRows.slice(0, limit);
    } else {
      filtered = filtered.slice(0, limit);
    }

    const matches = filtered.map((row) => {
      const profilePhoto = row.profile_photo
        ? `http://localhost:${process.env.PORT || 3000}${row.profile_photo}`
        : null;
      const additionalPhotos = row.additional_photos
        ? JSON.parse(row.additional_photos).map(p => `http://localhost:${process.env.PORT || 3000}${p}`)
        : [];

      const baseProfile = {
        id: row.id,
        profileId: row.profile_id,
        fullName: row.full_name || `${row.first_name} ${row.last_name}`,
        age: row.age,
        height: row.height,
        religion: row.religion,
        caste: row.caste,
        subCaste: row.sub_caste,
        education: row.education,
        occupation: row.occupation,
        city: row.city,
        state: row.state,
        maritalStatus: row.marital_status,
        rasi: row.rasi,
        nakshatra: row.nakshatra,
        laknam: row.laknam,
        profilePhoto,
        isFreeProfile: currentUser.subscription_type === 'free',
        subscriptionType: row.subscription_type || 'free',
      };

      // Free users get limited info but profile photo is included (blurred on frontend)
      if (currentUser.subscription_type === 'free') {
        return {
          ...baseProfile,
          email: null,
          mobile: null,
          country: null,
          weight: null,
          motherTongue: null,
          companyName: null,
          annualIncome: null,
          fatherName: null,
          motherName: null,
          siblings: null,
          additionalPhotos: [],
          profilePhoto, // include for blurred preview
        };
      }

      // Premium users get full info
      return {
        ...baseProfile,
        email: row.email,
        mobile: row.mobile,
        country: row.country,
        weight: row.weight,
        motherTongue: row.mother_tongue,
        companyName: row.company_name,
        annualIncome: row.annual_income,
        fatherName: row.father_name,
        motherName: row.mother_name,
        siblings: row.siblings,
        additionalPhotos,
        isFreeProfile: false,
      };
    });

    return res.status(200).json({
      matches,
      subscription: {
        type: currentUser.subscription_type,
        viewed_profiles: viewed,
        limit,
        remaining: limit - viewed,
        reached_limit: viewed >= limit,
      },
      total_matches: matches.length,
    });
  } catch (error) {
    console.error('--- GET MATCHES ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to fetch matches.' });
  }
};

// ─────────── ADMIN CONTROLLERS ───────────

// GET /api/admin/subscriptions
const getAdminSubscriptions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.user_id, s.plan, s.start_date, s.end_date, s.amount, s.status,
              u.first_name, u.last_name, u.email
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );

    return res.status(200).json({ subscriptions: rows });
  } catch (error) {
    console.error('--- ADMIN SUBSCRIPTIONS ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to fetch subscriptions.' });
  }
};

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const [[totalUsers]] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [[premiumUsers]] = await pool.query(
      "SELECT COUNT(*) as total FROM users WHERE subscription_type = 'premium'"
    );
    const [[freeUsers]] = await pool.query(
      "SELECT COUNT(*) as total FROM users WHERE subscription_type = 'free'"
    );
    const [[totalRevenue]] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM subscriptions WHERE status = "active"'
    );
    const [[totalViews]] = await pool.query('SELECT COUNT(*) as total FROM profile_views');

    return res.status(200).json({
      total_users: totalUsers.total,
      premium_users: premiumUsers.total,
      free_users: freeUsers.total,
      total_revenue: totalRevenue.total,
      total_profile_views: totalViews.total,
    });
  } catch (error) {
    console.error('--- ADMIN STATS ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
};

// POST /api/admin/reset-limits
const resetMonthlyLimits = async (req, res) => {
  try {
    await pool.query(
      'UPDATE users SET viewed_profiles = 0, last_viewed_reset = NOW()'
    );
    return res.status(200).json({ message: 'All monthly limits have been reset.' });
  } catch (error) {
    console.error('--- RESET LIMITS ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to reset limits.' });
  }
};

// POST /api/admin/subscription/update-plan
const updateUserPlan = async (req, res) => {
  const { userId, plan } = req.body;

  if (!userId || !plan || !['free', 'premium'].includes(plan)) {
    return res.status(400).json({ message: 'Invalid user ID or plan.' });
  }

  try {
    await pool.query(
      'UPDATE users SET subscription_type = ?, viewed_profiles = 0, last_viewed_reset = NOW() WHERE id = ?',
      [plan, userId]
    );

    return res.status(200).json({ message: `User plan updated to ${plan}.` });
  } catch (error) {
    console.error('--- UPDATE USER PLAN ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to update user plan.' });
  }
};

// GET /api/images/:filename — protected image serving
const serveImage = async (req, res) => {
  const { filename } = req.params;

  const sanitized = path.basename(filename);
  const filePath = path.join(__dirname, '..', 'uploads', sanitized);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Image not found' });
  }

  const ext = path.extname(sanitized).toLowerCase();
  const mimeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };
  const mime = mimeMap[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', mime);
  res.setHeader('Cache-Control', 'private, max-age=86400');
  res.sendFile(filePath);
};

module.exports = {
  getSubscriptionStatus,
  upgradeSubscription,
  viewProfile,
  getMatches,
  getAdminSubscriptions,
  getAdminStats,
  resetMonthlyLimits,
  updateUserPlan,
  serveImage,
};
