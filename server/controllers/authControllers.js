const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email');

const safeParseJSON = (val, fallback) => {
  if (!val) return fallback;
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : fallback; } catch { return fallback; }
};

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

    const normalizedGender = gender.toLowerCase();
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, mobile, password, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, mobile, hashedPassword, normalizedGender]
    );

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendWelcomeEmail(email, firstName);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        mobile,
        gender: normalizedGender,
        subscription_type: 'free',
        viewed_profiles: 0,
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
      `SELECT u.*,
              p.id AS profile_id,
              p.full_name, p.age, p.height, p.weight,
              p.marital_status, p.religion, p.caste, p.sub_caste, p.mother_tongue,
              p.education, p.occupation, p.company_name, p.annual_income,
              p.father_name, p.mother_name, p.siblings,
              p.country, p.state, p.city,
              p.date_of_birth, p.time_of_birth, p.place_of_birth,
              p.rasi, p.nakshatra, p.laknam, p.gothram, p.dhosham,
              p.horoscope_available, p.horoscope_pdf, p.horoscope_image,
               p.preferred_rasi, p.preferred_nakshatra, p.preferred_lagnam, p.preferred_dhosham, p.dhosham_preference, p.horoscope_match_required,
              p.pref_age_min, p.pref_age_max, p.pref_height,
              p.pref_education, p.pref_location, p.pref_religion,
              p.profile_photo, p.additional_photos,
              COALESCE(p.profile_completed, 0) AS profile_completed
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
      { id: user.id, email: user.email, is_admin: user.is_admin || 0 },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const baseUrl = `http://localhost:${process.env.PORT || 5000}`;
    const profilePic = user.profile_photo ? `${baseUrl}${user.profile_photo}` : null;
    const horoscopePdfUrl = user.horoscope_pdf ? `${baseUrl}${user.horoscope_pdf}` : null;
    const horoscopeImageUrl = user.horoscope_image ? `${baseUrl}${user.horoscope_image}` : null;

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender ? user.gender.toLowerCase() : null,
        is_admin: Boolean(user.is_admin),
        profileCompleted: Boolean(user.profile_completed),
        profilePic,
        subscription_type: user.subscription_type || 'free',
        viewed_profiles: user.viewed_profiles || 0,
        // Profile detail fields (for profile completion check)
        fullName: user.full_name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        maritalStatus: user.marital_status,
        religion: user.religion,
        caste: user.caste,
        subCaste: user.sub_caste,
        motherTongue: user.mother_tongue,
        education: user.education,
        occupation: user.occupation,
        companyName: user.company_name,
        annualIncome: user.annual_income,
        fatherName: user.father_name,
        motherName: user.mother_name,
        siblings: user.siblings,
        country: user.country,
        state: user.state,
        city: user.city,
        prefAgeMin: user.pref_age_min,
        prefAgeMax: user.pref_age_max,
        prefHeight: user.pref_height,
        prefEducation: user.pref_education,
        prefLocation: user.pref_location,
        prefReligion: user.pref_religion,
        profilePhoto: profilePic,
        additionalPhotos: user.additional_photos,
        // Astro details
        dateOfBirth: user.date_of_birth,
        timeOfBirth: user.time_of_birth,
        placeOfBirth: user.place_of_birth,
        rasi: user.rasi,
        nakshatra: user.nakshatra,
        laknam: user.laknam,
        gothram: user.gothram,
        dhosham: user.dhosham,
        horoscopeAvailable: Boolean(user.horoscope_available),
        horoscopePdf: horoscopePdfUrl,
        horoscopeImage: horoscopeImageUrl,
        preferredRasi: safeParseJSON(user.preferred_rasi, []),
        preferredNakshatra: safeParseJSON(user.preferred_nakshatra, []),
        preferredLagnam: safeParseJSON(user.preferred_lagnam, []),
        preferredDhosham: safeParseJSON(user.preferred_dhosham, []),
        dhoshamPreference: user.dhosham_preference,
        horoscopeMatchRequired: Boolean(user.horoscope_match_required),
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const [rows] = await pool.query('SELECT id, first_name FROM users WHERE email = ?', [email]);

    const genericMsg = 'If an account with that email exists, a password reset link has been sent.';

    if (rows.length === 0) {
      return res.status(200).json({ message: genericMsg });
    }

    const user = rows[0];

    const [existingTokens] = await pool.query(
      'SELECT id FROM password_reset_tokens WHERE user_id = ? AND used_at IS NULL AND expires_at > NOW()',
      [user.id]
    );

    if (existingTokens.length > 0) {
      await pool.query(
        'UPDATE password_reset_tokens SET expires_at = NOW() WHERE user_id = ? AND used_at IS NULL',
        [user.id]
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiryMinutes = parseInt(process.env.RESET_TOKEN_EXPIRY_MINUTES || '30', 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    );

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    await sendPasswordResetEmail(email, user.first_name, resetUrl, expiryMinutes);

    return res.status(200).json({ message: genericMsg });
  } catch (error) {
    console.error('--- FORGOT PASSWORD ERROR ---');
    console.error('Message:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, user_id, expires_at, used_at FROM password_reset_tokens WHERE token = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ valid: false, message: 'Invalid reset token.' });
    }

    const record = rows[0];

    if (record.used_at) {
      return res.status(400).json({ valid: false, message: 'This reset link has already been used.' });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ valid: false, message: 'This reset link has expired.' });
    }

    return res.status(200).json({ valid: true, message: 'Token is valid.' });
  } catch (error) {
    console.error('--- VERIFY RESET TOKEN ERROR ---');
    console.error('Message:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, user_id, expires_at, used_at FROM password_reset_tokens WHERE token = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }

    const record = rows[0];

    if (record.used_at) {
      return res.status(400).json({ message: 'This reset link has already been used.' });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: 'This reset link has expired.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, record.user_id]);

    await pool.query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?',
      [record.id]
    );

    return res.status(200).json({ message: 'Password has been reset successfully. Please sign in with your new password.' });
  } catch (error) {
    console.error('--- RESET PASSWORD ERROR ---');
    console.error('Message:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

const adminLogin = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/mobile and password are required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email, mobile, password, is_admin FROM users WHERE (email = ? OR mobile = ?) AND is_admin = 1',
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: 1 },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        mobile: user.mobile,
        is_admin: true,
      },
    });
  } catch (error) {
    console.error('--- ADMIN LOGIN ERROR ---');
    console.error('Message:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

const adminForgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, first_name FROM users WHERE email = ? AND is_admin = 1',
      [email]
    );

    const genericMsg = 'If an admin account with that email exists, a password reset link has been sent.';

    if (rows.length === 0) {
      return res.status(200).json({ message: genericMsg });
    }

    const user = rows[0];

    const [existingTokens] = await pool.query(
      'SELECT id FROM password_reset_tokens WHERE user_id = ? AND used_at IS NULL AND expires_at > NOW()',
      [user.id]
    );

    if (existingTokens.length > 0) {
      await pool.query(
        'UPDATE password_reset_tokens SET expires_at = NOW() WHERE user_id = ? AND used_at IS NULL',
        [user.id]
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiryMinutes = parseInt(process.env.RESET_TOKEN_EXPIRY_MINUTES || '30', 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    );

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin-reset-password?token=${token}`;

    await sendPasswordResetEmail(email, user.first_name, resetUrl, expiryMinutes);

    return res.status(200).json({ message: genericMsg });
  } catch (error) {
    console.error('--- ADMIN FORGOT PASSWORD ERROR ---');
    console.error('Message:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = { signup, login, adminLogin, forgotPassword, adminForgotPassword, verifyResetToken, resetPassword };