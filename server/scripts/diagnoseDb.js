const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function check() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'matrimony',
  });

  try {
    const [tables] = await conn.execute('SHOW TABLES');
    console.log('Tables:', tables.map(t => Object.values(t)[0]));

    const [userCols] = await conn.execute('SHOW COLUMNS FROM users');
    console.log('\nusers columns:', userCols.map(c => c.Field).join(', '));

    const [profCols] = await conn.execute('SHOW COLUMNS FROM profiles');
    console.log('profiles columns:', profCols.map(c => c.Field).join(', '));

    const [[userCount]] = await conn.execute('SELECT COUNT(*) as cnt FROM users');
    console.log('\nTotal users:', userCount.cnt);

    const [[profCount]] = await conn.execute('SELECT COUNT(*) as cnt FROM profiles');
    console.log('Total profiles:', profCount.cnt);

    const [[compCount]] = await conn.execute('SELECT COUNT(*) as cnt FROM profiles WHERE profile_completed = 1');
    console.log('Completed profiles:', compCount.cnt);

    const [orphans] = await conn.execute(
      'SELECT u.id, u.first_name, u.gender FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE p.id IS NULL'
    );
    console.log('\nUsers WITHOUT profiles:', orphans.length);
    orphans.forEach(o => console.log('  -', o.id, o.first_name, o.gender));

    const [broken] = await conn.execute(
      'SELECT p.id, p.user_id FROM profiles p LEFT JOIN users u ON p.user_id = u.id WHERE u.id IS NULL'
    );
    console.log('\nProfiles with missing user:', broken.length);
    broken.forEach(b => console.log('  - profile id:', b.id, 'user_id:', b.user_id));

    const [genders] = await conn.execute('SELECT id, first_name, gender FROM users');
    console.log('\nAll users:');
    genders.forEach(g => console.log('  -', g.id, g.first_name, '\tgender:', g.gender, '\ttype:', typeof g.gender));

    console.log('\n--- DONE ---');
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await conn.end();
  }
}
check();
