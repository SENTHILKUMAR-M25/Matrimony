ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0;
ALTER TABLE users ADD COLUMN is_suspended TINYINT(1) DEFAULT 0;
ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN approval_status ENUM('pending','approved','rejected','revision') DEFAULT 'approved';
ALTER TABLE profiles ADD COLUMN rejection_reason TEXT NULL;

CREATE TABLE IF NOT EXISTS communities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_enabled TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reported_by INT NOT NULL,
  reported_user_id INT NULL,
  type ENUM('fake_profile','abuse','complaint','other') DEFAULT 'other',
  description TEXT,
  status ENUM('pending','resolved','dismissed') DEFAULT 'pending',
  resolved_by INT NULL,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  subject VARCHAR(200),
  message TEXT,
  status ENUM('unread','read','replied') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS website_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
