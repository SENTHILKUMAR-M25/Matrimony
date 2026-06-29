const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function fix() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'matrimony',
  });

  const [result] = await conn.execute(
    'UPDATE users SET gender = LOWER(gender) WHERE gender IS NOT NULL'
  );
  console.log('Fixed', result.affectedRows, 'users');

  const [rows] = await conn.execute('SELECT id, first_name, gender FROM users');
  rows.forEach(r => console.log(' -', r.id, r.first_name, r.gender));

  await conn.end();
}
fix().catch(e => console.error(e.message));
