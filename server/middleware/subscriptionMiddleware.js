const pool = require('../config/db');

const checkSubscriptionLimit = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT subscription_type, viewed_profiles, last_viewed_reset FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const limit = user.subscription_type === 'premium' ? 1000 : 10;

    // Check if reset is needed (monthly)
    const lastReset = new Date(user.last_viewed_reset);
    const now = new Date();
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      await pool.query(
        'UPDATE users SET viewed_profiles = 0, last_viewed_reset = NOW() WHERE id = ?',
        [userId]
      );
      user.viewed_profiles = 0;
    }

    if (user.viewed_profiles >= limit) {
      return res.status(403).json({
        message: 'Profile viewing limit reached',
        subscription_type: user.subscription_type,
        viewed_profiles: user.viewed_profiles,
        limit,
        requires_upgrade: user.subscription_type === 'free',
      });
    }

    req.subscription = {
      type: user.subscription_type,
      viewed: user.viewed_profiles,
      limit,
    };

    next();
  } catch (error) {
    console.error('--- SUBSCRIPTION MIDDLEWARE ERROR ---');
    console.error(error.message);
    return res.status(500).json({ message: 'Failed to check subscription limits.' });
  }
};

module.exports = { checkSubscriptionLimit };
