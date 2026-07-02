const express = require('express');
const router = express.Router();
const { signup, login, adminLogin, forgotPassword, adminForgotPassword, verifyResetToken, resetPassword } = require('../controllers/authControllers');

router.post('/signup', signup);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/admin-forgot-password', adminForgotPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/reset-password', resetPassword);

module.exports = router;