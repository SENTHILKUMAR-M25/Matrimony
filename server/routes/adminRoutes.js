const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminAuth');
const {
  getDashboardStats,
  getUsers,
  getUserDetail,
  updateUser,
  deleteUser,
  toggleVerifyUser,
  toggleSuspendUser,
  getProfileStats,
  getPendingProfiles,
  getProfileDetail,
  approveProfile,
  rejectProfile,
  requestProfileUpdate,
  getCommunities,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  toggleCommunity,
  getAdminSubscriptionsList,
  getPaymentHistory,
  toggleSubscriptionStatus,
  getMatchesList,
  deleteMatch,
  getReportStats,
  getReports,
  resolveReport,
  getContactMessages,
  updateContactMessageStatus,
  getSettings,
  updateSettings,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} = require('../controllers/adminController');

const {
  adminGetStories,
  adminApproveStory,
  adminRejectStory,
  adminEditStory,
  adminDeleteStory,
  adminGetStoryStats,
} = require('../controllers/successStoryController');

const {
  adminGetLanding,
  adminUpdateLanding,
} = require('../controllers/landingController');

// All admin routes require auth + admin middleware
router.use(authMiddleware, adminMiddleware);

// Dashboard
router.get('/admin/dashboard', getDashboardStats);

// Users Management
router.get('/admin/users', getUsers);
router.get('/admin/users/:id', getUserDetail);
router.put('/admin/users/:id', updateUser);
router.delete('/admin/users/:id', deleteUser);
router.put('/admin/users/:id/verify', toggleVerifyUser);
router.put('/admin/users/:id/suspend', toggleSuspendUser);

// Profile Approval
router.get('/admin/profiles/stats', getProfileStats);
router.get('/admin/profiles/pending', getPendingProfiles);
router.get('/admin/profiles/:id', getProfileDetail);
router.put('/admin/profiles/:id/approve', approveProfile);
router.put('/admin/profiles/:id/reject', rejectProfile);
router.put('/admin/profiles/:id/request-update', requestProfileUpdate);

// Community Management
router.get('/admin/communities', getCommunities);
router.post('/admin/communities', createCommunity);
router.put('/admin/communities/:id', updateCommunity);
router.delete('/admin/communities/:id', deleteCommunity);
router.put('/admin/communities/:id/toggle', toggleCommunity);

// Subscription Management
router.get('/admin/subscriptions', getAdminSubscriptionsList);
router.get('/admin/subscriptions/payments', getPaymentHistory);
router.put('/admin/subscriptions/:id/toggle', toggleSubscriptionStatus);

// Matches Management
router.get('/admin/matches', getMatchesList);
router.delete('/admin/matches/:id', deleteMatch);

// Reports & Support
router.get('/admin/reports/stats', getReportStats);
router.get('/admin/reports', getReports);
router.put('/admin/reports/:id/resolve', resolveReport);
router.get('/admin/contact-messages', getContactMessages);
router.put('/admin/contact-messages/:id/status', updateContactMessageStatus);

// Settings
router.get('/admin/settings', getSettings);
router.put('/admin/settings', updateSettings);

// Landing Page Content
router.get('/admin/landing', adminGetLanding);
router.put('/admin/landing', adminUpdateLanding);

// Success Stories Management
router.get('/admin/success-stories/stats', adminGetStoryStats);
router.get('/admin/success-stories', adminGetStories);
router.put('/admin/success-stories/:id/approve', adminApproveStory);
router.put('/admin/success-stories/:id/reject', adminRejectStory);
router.put('/admin/success-stories/:id', adminEditStory);
router.delete('/admin/success-stories/:id', adminDeleteStory);

// Admin Profile
router.get('/admin/profile', getAdminProfile);
router.put('/admin/profile', updateAdminProfile);
router.put('/admin/profile/password', changeAdminPassword);

module.exports = router;
