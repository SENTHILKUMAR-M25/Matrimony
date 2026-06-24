const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

const signup = async (req, res) => {
  const { firstName, lastName, email, mobile, password, gender } = req.body;

  console.log('Signup request received:', { firstName, lastName, email, mobile, gender });

  if (!firstName || !lastName || !email || !mobile || !password || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR mobile = ?',
      [email, mobile]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email or mobile number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, mobile, password, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, mobile, hashedPassword, gender]
    );

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        mobile,
        gender,
      },
    });
  } catch (error) {
    console.error('--- SIGNUP ERROR ---');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('SQL:', error.sql);
    console.error('Full stack:', error.stack);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body; // identifier = email or mobile

  console.log('Login attempt for:', identifier);

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/mobile and password are required' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT u.*, COALESCE(p.profile_completed, 0) AS profile_completed
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.email = ? OR u.mobile = ?`,
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        profileCompleted: Boolean(user.profile_completed),
        profilePic: user.profile_photo ? `http://localhost:${process.env.PORT || 5000}${user.profile_photo}` : null,
      },
    });
  } catch (error) {
    console.error('--- LOGIN ERROR ---');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('SQL:', error.sql);
    console.error('Full stack:', error.stack);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = { signup, login };