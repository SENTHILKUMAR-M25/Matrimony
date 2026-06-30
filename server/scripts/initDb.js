const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const runSqlFile = async (connection, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    try {
      await connection.query(stmt);
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log(`  ⚠ Skipped (already exists): ${stmt.substring(0, 60)}...`);
      } else {
        throw err;
      }
    }
  }
};

const initDb = async () => {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    const dbName = process.env.DB_NAME || 'matrimony';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${dbName}\``);
    console.log(`✅ Database '${dbName}' ready`);

    // Run all SQL files in order
    const configDir = path.join(__dirname, '..', 'config');
    const sqlFiles = [
      'create_profiles_table.sql',
      'create_interests_table.sql',
      'add_is_admin.sql',
      'add_subscription_fields.sql',
      'add_astro_fields.sql',
      'add_astro_preference_columns.sql',
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(configDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`📄 Running ${file}...`);
        await runSqlFile(connection, filePath);
        console.log(`  ✅ Done`);
      } else {
        console.log(`  ⚠ ${file} not found, skipping`);
      }
    }

    console.log('\n🎉 Database initialized successfully!');
    console.log('\n📋 Next step: Run `node scripts/seedAdmin.js` to create admin user');
    console.log('   Or run: npm run seed:admin');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
};

initDb();
