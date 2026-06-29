-- Add subscription fields to users table
ALTER TABLE users
  ADD COLUMN subscription_type ENUM('free', 'premium') DEFAULT 'free',
  ADD COLUMN viewed_profiles INT DEFAULT 0,
  ADD COLUMN last_viewed_reset DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Create subscriptions table for admin tracking
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
);

-- Create profile_views table to track individual views
CREATE TABLE IF NOT EXISTS profile_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  viewer_id INT NOT NULL,
  viewed_user_id INT NOT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (viewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (viewed_user_id) REFERENCES users(id) ON DELETE CASCADE
);
