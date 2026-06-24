const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

// GET /api/dashboard/stats
router.get('/stats', authMiddleware, getDashboardStats);

module.exports = router;
