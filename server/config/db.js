const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || 3307,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'matrimony',
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

module.exports = pool;