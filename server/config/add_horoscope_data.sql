-- Structured horoscope JSON (charts + extended fields)
ALTER TABLE profiles ADD COLUMN horoscope_data JSON NULL;
