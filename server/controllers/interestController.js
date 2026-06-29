const pool = require('../config/db');

// Auto-create tables on first load
const initTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS interests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_interest (sender_id, receiver_id)
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user1_id INT NOT NULL,
        user2_id INT NOT NULL,
        interest_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE SET NULL,
        UNIQUE KEY unique_match (user1_id, user2_id)
      )
    `);
  } catch (err) {
    console.error('[INTERESTS] Table init error:', err.message);
  }
};
initTables();

// POST /api/interests/send
const sendInterest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required.' });
    }
    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot send interest to yourself.' });
    }

    const [existing] = await pool.query(
      'SELECT id, status FROM interests WHERE sender_id = ? AND receiver_id = ?',
      [senderId, receiverId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: `Interest already sent (${existing[0].status}).`, status: existing[0].status });
    }

    const [result] = await pool.query(
      'INSERT INTO interests (sender_id, receiver_id, status) VALUES (?, ?, ?)',
      [senderId, receiverId, 'pending']
    );

    return res.status(201).json({
      message: 'Interest sent successfully.',
      interest: { id: result.insertId, senderId, receiverId, status: 'pending' },
    });
  } catch (err) {
    console.error('[sendInterest]', err);
    return res.status(500).json({ message: 'Failed to send interest.' });
  }
};

// GET /api/interests/received
const getReceivedInterests = async (req, res) => {
  try {
    const receiverId = req.user.id;

    const [rows] = await pool.query(
      `SELECT i.id, i.status, i.created_at, i.updated_at,
              u.id AS sender_user_id, u.gender,
              p.full_name, p.age, p.city, p.state, p.occupation, p.education,
              p.profile_photo, p.height, p.marital_status, p.religion
       FROM interests i
       JOIN users u ON u.id = i.sender_id
       JOIN profiles p ON p.user_id = i.sender_id
       WHERE i.receiver_id = ?
       ORDER BY i.created_at DESC`,
      [receiverId]
    );

    return res.json({ interests: rows });
  } catch (err) {
    console.error('[getReceivedInterests]', err);
    return res.status(500).json({ message: 'Failed to fetch received interests.' });
  }
};

// GET /api/interests/sent
const getSentInterests = async (req, res) => {
  try {
    const senderId = req.user.id;

    const [rows] = await pool.query(
      `SELECT i.id, i.status, i.created_at, i.updated_at,
              u.id AS receiver_user_id, u.gender,
              p.full_name, p.age, p.city, p.state, p.occupation, p.education,
              p.profile_photo, p.height, p.marital_status, p.religion
       FROM interests i
       JOIN users u ON u.id = i.receiver_id
       JOIN profiles p ON p.user_id = i.receiver_id
       WHERE i.sender_id = ?
       ORDER BY i.created_at DESC`,
      [senderId]
    );

    return res.json({ interests: rows });
  } catch (err) {
    console.error('[getSentInterests]', err);
    return res.status(500).json({ message: 'Failed to fetch sent interests.' });
  }
};

// PUT /api/interests/:id/accept
const acceptInterest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const interestId = req.params.id;

    const [interest] = await pool.query(
      'SELECT id, sender_id, receiver_id, status FROM interests WHERE id = ?',
      [interestId]
    );

    if (interest.length === 0) {
      return res.status(404).json({ message: 'Interest not found.' });
    }
    if (interest[0].receiver_id !== receiverId) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    if (interest[0].status !== 'pending') {
      return res.status(400).json({ message: `Interest already ${interest[0].status}.` });
    }

    // Update status
    await pool.query('UPDATE interests SET status = ? WHERE id = ?', ['accepted', interestId]);

    // Create match record (order ids to ensure uniqueness)
    const user1Id = Math.min(interest[0].sender_id, interest[0].receiver_id);
    const user2Id = Math.max(interest[0].sender_id, interest[0].receiver_id);

    await pool.query(
      'INSERT IGNORE INTO matches (user1_id, user2_id, interest_id) VALUES (?, ?, ?)',
      [user1Id, user2Id, interestId]
    );

    return res.json({ message: 'Interest accepted! You are now connected.', status: 'accepted' });
  } catch (err) {
    console.error('[acceptInterest]', err);
    return res.status(500).json({ message: 'Failed to accept interest.' });
  }
};

// PUT /api/interests/:id/reject
const rejectInterest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const interestId = req.params.id;

    const [interest] = await pool.query(
      'SELECT id, receiver_id, status FROM interests WHERE id = ?',
      [interestId]
    );

    if (interest.length === 0) {
      return res.status(404).json({ message: 'Interest not found.' });
    }
    if (interest[0].receiver_id !== receiverId) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    if (interest[0].status !== 'pending') {
      return res.status(400).json({ message: `Interest already ${interest[0].status}.` });
    }

    await pool.query('UPDATE interests SET status = ? WHERE id = ?', ['rejected', interestId]);

    return res.json({ message: 'Interest rejected.', status: 'rejected' });
  } catch (err) {
    console.error('[rejectInterest]', err);
    return res.status(500).json({ message: 'Failed to reject interest.' });
  }
};

// GET /api/interests/count
const getInterestCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM interests WHERE receiver_id = ? AND status = ?',
      [userId, 'pending']
    );

    return res.json({ count: rows[0].count });
  } catch (err) {
    console.error('[getInterestCount]', err);
    return res.status(500).json({ message: 'Failed to fetch count.' });
  }
};

module.exports = {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  acceptInterest,
  rejectInterest,
  getInterestCount,
};
