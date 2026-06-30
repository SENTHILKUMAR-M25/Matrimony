const pool = require('../config/db');

const sectionRows = async () => {
  const [rows] = await pool.query('SELECT section_key, content FROM landing_content');
  return rows;
};

const parseContent = (row) => {
  if (typeof row.content === 'string') {
    try { return JSON.parse(row.content); } catch { return row.content; }
  }
  return row.content;
};

const getLanding = async (req, res) => {
  try {
    const rows = await sectionRows();
    const data = {};
    for (const r of rows) {
      try { data[r.section_key] = JSON.parse(r.content); }
      catch { data[r.section_key] = r.content; }
    }

    const [[{ users }]] = await pool.query('SELECT COUNT(*) as users FROM users');
    const [[{ approvedStories }]] = await pool.query("SELECT COUNT(*) as approvedStories FROM success_stories WHERE status = 'approved'");

    data.stats = { users, approvedStories };

    return res.status(200).json(data);
  } catch (error) {
    console.error('--- GET LANDING ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch landing content.' });
  }
};

const adminGetLanding = async (req, res) => {
  try {
    const rows = await sectionRows();
    const data = {};
    for (const r of rows) {
      try { data[r.section_key] = JSON.parse(r.content); }
      catch { data[r.section_key] = r.content; }
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error('--- ADMIN GET LANDING ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch landing content.' });
  }
};

const adminUpdateLanding = async (req, res) => {
  try {
    const { section_key, content } = req.body;
    if (!section_key || content === undefined) {
      return res.status(400).json({ message: 'section_key and content are required.' });
    }

    await pool.query(
      'INSERT INTO landing_content (section_key, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
      [section_key, JSON.stringify(content)]
    );

    return res.status(200).json({ message: 'Section updated.' });
  } catch (error) {
    console.error('--- ADMIN UPDATE LANDING ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to update landing content.' });
  }
};

module.exports = { getLanding, adminGetLanding, adminUpdateLanding };
