-- Run this SQL in your 'matrimony' MySQL database to create the profiles table

CREATE TABLE IF NOT EXISTS profiles (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL UNIQUE,

  -- Personal
  full_name       VARCHAR(150),
  age             INT,
  height          VARCHAR(20),
  weight          VARCHAR(20),
  marital_status  VARCHAR(50),
  religion        VARCHAR(50),
  caste           VARCHAR(100),
  sub_caste       VARCHAR(100),
  mother_tongue   VARCHAR(50),

  -- Education & Career
  education       VARCHAR(150),
  occupation      VARCHAR(150),
  company_name    VARCHAR(150),
  annual_income   VARCHAR(50),

  -- Family
  father_name     VARCHAR(150),
  mother_name     VARCHAR(150),
  siblings        INT DEFAULT 0,

  -- Location
  country         VARCHAR(100),
  state           VARCHAR(100),
  city            VARCHAR(100),

  -- Partner Preferences
  pref_age_min    INT,
  pref_age_max    INT,
  pref_height     VARCHAR(20),
  pref_education  VARCHAR(150),
  pref_location   VARCHAR(150),
  pref_religion   VARCHAR(50),

  -- Photos
  profile_photo   VARCHAR(500),
  additional_photos TEXT,   -- JSON array of file paths

  profile_completed TINYINT(1) DEFAULT 0,

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
