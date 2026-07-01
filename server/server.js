const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const pool = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const interestRoutes = require('./routes/interestRoutes');
const viewRoutes = require('./routes/viewRoutes');
const communityRoutes = require('./routes/communityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');
const landingRoutes = require('./routes/landingRoutes');
const { preloadAssets } = require('./utils/biodataPdf');

const app = express();

preloadAssets();

app.use(cors());
app.use(express.json());

// Serve uploaded profile photos statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', subscriptionRoutes);
app.use('/api', interestRoutes);
app.use('/api', viewRoutes);
app.use('/api', communityRoutes);
app.use('/api', successStoryRoutes);
app.use('/api', landingRoutes);
app.use('/api', adminRoutes);

// ─── Monthly Reset Cron Job ───
// Runs at midnight on the 1st of every month
cron.schedule('0 0 1 * *', async () => {
  try {
    await pool.query(
      'UPDATE users SET viewed_profiles = 0, last_viewed_reset = NOW()'
    );
    console.log(`[CRON] Monthly profile view limits reset at ${new Date().toISOString()}`);
  } catch (err) {
    console.error('[CRON] Monthly reset failed:', err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});