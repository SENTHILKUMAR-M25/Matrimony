const bcrypt = require('bcryptjs');
const pool = require('../config/db');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@jodmatrimony.com']);
    if (existing.length > 0) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, mobile, password, gender, subscription_type, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Admin', 'JOD', 'admin@jodmatrimony.com', '9999999999', hashedPassword, 'male', 'premium', 1]
    );

    console.log(`Admin user created with ID: ${result.insertId}`);
    console.log('Email: admin@jodmatrimony.com');
    console.log('Password: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
