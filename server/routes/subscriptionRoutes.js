const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { checkSubscriptionLimit } = require('../middleware/subscriptionMiddleware');
const {
  getSubscriptionStatus,
  upgradeSubscription,
  viewProfile,
  getMatches,
  getAdminSubscriptions,
  getAdminStats,
  resetMonthlyLimits,
  updateUserPlan,
  serveImage,
} = require('../controllers/subscriptionController');

// ─── User Routes ───

// Get matches (with subscription filtering)
router.get('/matches', authMiddleware, getMatches);

// Get subscription status
router.get('/subscription/status', authMiddleware, getSubscriptionStatus);

// Upgrade to premium
router.post('/subscription/upgrade', authMiddleware, upgradeSubscription);

// View a profile (increments counter)
router.post('/subscription/view-profile/:id', authMiddleware, checkSubscriptionLimit, viewProfile);

// Protected image serving (auth required)
router.get('/images/:filename', authMiddleware, serveImage);

// ─── Admin Routes ───

// Get all subscriptions
router.get('/admin/subscriptions', authMiddleware, getAdminSubscriptions);

// Get subscription analytics & revenue
router.get('/admin/stats', authMiddleware, getAdminStats);

// Reset all monthly limits
router.post('/admin/reset-limits', authMiddleware, resetMonthlyLimits);

// Update user plan
router.post('/admin/subscription/update-plan', authMiddleware, updateUserPlan);

module.exports = router;
