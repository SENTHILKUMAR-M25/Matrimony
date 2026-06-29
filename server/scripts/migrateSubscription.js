const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'matrimony',
  });

  try {
    console.log('Running subscription migration...');

    // Check and add columns to users table
    const [columns] = await conn.execute('SHOW COLUMNS FROM users');
    const colNames = columns.map(c => c.Field);

    if (!colNames.includes('subscription_type')) {
      await conn.execute("ALTER TABLE users ADD COLUMN subscription_type ENUM('free', 'premium') DEFAULT 'free'");
      console.log('✓ Added subscription_type column');
    } else {
      console.log('→ subscription_type already exists');
    }

    if (!colNames.includes('viewed_profiles')) {
      await conn.execute('ALTER TABLE users ADD COLUMN viewed_profiles INT DEFAULT 0');
      console.log('✓ Added viewed_profiles column');
    } else {
      console.log('→ viewed_profiles already exists');
    }

    if (!colNames.includes('last_viewed_reset')) {
      await conn.execute('ALTER TABLE users ADD COLUMN last_viewed_reset DATETIME DEFAULT CURRENT_TIMESTAMP');
      console.log('✓ Added last_viewed_reset column');
    } else {
      console.log('→ last_viewed_reset already exists');
    }

    // Create subscriptions table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan ENUM('free', 'premium') NOT NULL DEFAULT 'free',
        start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_date DATETIME,
        amount DECIMAL(10,2) DEFAULT 0.00,
        status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Created subscriptions table');

    // Create profile_views table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS profile_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        viewer_id INT NOT NULL,
        viewed_user_id INT NOT NULL,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (viewer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (viewed_user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Created profile_views table');

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

migrate();
