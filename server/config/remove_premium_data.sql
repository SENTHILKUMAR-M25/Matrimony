-- Reset all users back to free plan
UPDATE users SET subscription_type = 'free', viewed_profiles = 0, last_viewed_reset = NOW();

-- Clear all subscription records
DELETE FROM subscriptions;

-- Clear all profile view records
DELETE FROM profile_views;
