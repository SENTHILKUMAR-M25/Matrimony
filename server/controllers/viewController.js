const pool = require('../config/db');

// GET /api/views/visitors?page=1&limit=10&filter=all&search=
const getUserPlan = async (userId) => {
  const [rows] = await pool.query('SELECT subscription_type FROM users WHERE id = ?', [userId]);
  return rows.length > 0 ? rows[0].subscription_type === 'premium' : false;
};

const getVisitors = async (req, res) => {
  try {
    const userId = req.user.id;
    const isPremium = await getUserPlan(userId);
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;
    const filter = req.query.filter || 'all';
    const search = req.query.search || '';

    let dateFilter = '';
    if (filter === 'today') dateFilter = 'AND latest.viewed_at >= CURDATE()';
    else if (filter === 'week') dateFilter = 'AND latest.viewed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    else if (filter === 'month') dateFilter = 'AND latest.viewed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';

    const searchFilter = search ? 'AND (p.full_name LIKE ? OR p.city LIKE ? OR p.occupation LIKE ?)' : '';

    const baseCondition = `WHERE pv.viewed_user_id = ?`;

    // Deduplicated: one row per visitor with their latest visit
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM (
        SELECT pv.viewer_id
        FROM profile_views pv
        JOIN profiles p ON p.user_id = pv.viewer_id
        ${baseCondition}
        GROUP BY pv.viewer_id
      ) latest
    `;

    let dataQuery = `
      SELECT pv.id AS view_id, latest.viewed_at,
             u.id AS visitor_user_id,
             p.full_name, p.age, p.city, p.state, p.occupation, p.education,
             p.profile_photo, p.height, p.marital_status, p.religion
      FROM (
        SELECT viewer_id, MAX(viewed_at) AS viewed_at
        FROM profile_views
        WHERE viewed_user_id = ?
        GROUP BY viewer_id
      ) latest
      JOIN profile_views pv ON pv.viewer_id = latest.viewer_id AND pv.viewed_at = latest.viewed_at
      JOIN users u ON u.id = pv.viewer_id
      JOIN profiles p ON p.user_id = pv.viewer_id
      ${dateFilter} ${searchFilter}
      ORDER BY latest.viewed_at DESC
    `;

    // If there are ties (same viewer, same timestamp), collapse to one
    dataQuery = `
      SELECT pv.id AS view_id, latest.viewed_at,
             latest.visitor_user_id,
             p.full_name, p.age, p.city, p.state, p.occupation, p.education,
             p.profile_photo, p.height, p.marital_status, p.religion
      FROM (
        SELECT pv.viewer_id AS visitor_user_id, MAX(pv.viewed_at) AS viewed_at
        FROM profile_views pv
        WHERE pv.viewed_user_id = ?
        GROUP BY pv.viewer_id
      ) latest
      JOIN profiles p ON p.user_id = latest.visitor_user_id
      JOIN users u ON u.id = latest.visitor_user_id
      LEFT JOIN profile_views pv ON pv.viewer_id = latest.visitor_user_id AND pv.viewed_at = latest.viewed_at AND pv.viewed_user_id = ?
      ${dateFilter} ${searchFilter}
      ORDER BY latest.viewed_at DESC
      ${isPremium ? 'LIMIT ? OFFSET ?' : 'LIMIT 3'}
    `;

    const params = [userId];
    const dataParams = [userId, userId];

    if (search) {
      const s = `%${search}%`;
      params.push(s, s, s);
      dataParams.push(s, s, s);
    }

    if (isPremium) {
      dataParams.push(limit, offset);
    }

    const [[{ total }]] = await pool.query(countQuery, params);
    const [visitors] = await pool.query(dataQuery, dataParams);

    // Final deduplication safety net on the frontend-friendly unique key
    const seen = new Set();
    const unique = [];
    for (const v of visitors) {
      if (!seen.has(v.visitor_user_id)) {
        seen.add(v.visitor_user_id);
        unique.push(v);
      }
    }

    return res.json({
      visitors: unique,
      pagination: isPremium ? {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      } : {
        page: 1,
        limit: 3,
        total,
        totalPages: 1,
        limited: total > 3,
      },
      isPremium,
    });
  } catch (err) {
    console.error('[getVisitors]', err);
    return res.status(500).json({ message: 'Failed to fetch visitors.' });
  }
};

// GET /api/views/visited?page=1&limit=10&filter=all&search=
const getVisited = async (req, res) => {
  try {
    const userId = req.user.id;
    const isPremium = await getUserPlan(userId);
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;
    const filter = req.query.filter || 'all';
    const search = req.query.search || '';

    let dateFilter = '';
    if (filter === 'today') dateFilter = 'AND latest.viewed_at >= CURDATE()';
    else if (filter === 'week') dateFilter = 'AND latest.viewed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    else if (filter === 'month') dateFilter = 'AND latest.viewed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';

    const searchFilter = search ? 'AND (p.full_name LIKE ? OR p.city LIKE ? OR p.occupation LIKE ?)' : '';

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM (
        SELECT pv.viewed_user_id
        FROM profile_views pv
        JOIN profiles p ON p.user_id = pv.viewed_user_id
        WHERE pv.viewer_id = ?
        GROUP BY pv.viewed_user_id
      ) latest
    `;

    let dataQuery = `
      SELECT pv.id AS view_id, latest.viewed_at,
             latest.visited_user_id,
             p.full_name, p.age, p.city, p.state, p.occupation, p.education,
             p.profile_photo, p.height, p.marital_status, p.religion
      FROM (
        SELECT pv.viewed_user_id AS visited_user_id, MAX(pv.viewed_at) AS viewed_at
        FROM profile_views pv
        WHERE pv.viewer_id = ?
        GROUP BY pv.viewed_user_id
      ) latest
      JOIN profiles p ON p.user_id = latest.visited_user_id
      JOIN users u ON u.id = latest.visited_user_id
      LEFT JOIN profile_views pv ON pv.viewed_user_id = latest.visited_user_id AND pv.viewed_at = latest.viewed_at AND pv.viewer_id = ?
      ${dateFilter} ${searchFilter}
      ORDER BY latest.viewed_at DESC
      ${isPremium ? 'LIMIT ? OFFSET ?' : 'LIMIT 3'}
    `;

    const params = [userId];
    const dataParams = [userId, userId];

    if (search) {
      const s = `%${search}%`;
      params.push(s, s, s);
      dataParams.push(s, s, s);
    }

    if (isPremium) {
      dataParams.push(limit, offset);
    }

    const [[{ total }]] = await pool.query(countQuery, params);
    const [visited] = await pool.query(dataQuery, dataParams);

    // Deduplication safety net
    const seen = new Set();
    const unique = [];
    for (const v of visited) {
      if (!seen.has(v.visited_user_id)) {
        seen.add(v.visited_user_id);
        unique.push(v);
      }
    }

    return res.json({
      visited: unique,
      pagination: isPremium ? {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      } : {
        page: 1,
        limit: 3,
        total,
        totalPages: 1,
        limited: total > 3,
      },
      isPremium,
    });
  } catch (err) {
    console.error('[getVisited]', err);
    return res.status(500).json({ message: 'Failed to fetch visited profiles.' });
  }
};

// GET /api/views/count
const getVisitCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count views from the last 7 days that the user hasn't seen
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS count FROM profile_views
       WHERE viewed_user_id = ? AND viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      [userId]
    );

    return res.json({ count: rows[0].count });
  } catch (err) {
    console.error('[getVisitCount]', err);
    return res.status(500).json({ message: 'Failed to fetch count.' });
  }
};

module.exports = { getVisitors, getVisited, getVisitCount };
