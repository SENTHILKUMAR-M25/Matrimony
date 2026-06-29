const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  acceptInterest,
  rejectInterest,
  getInterestCount,
} = require('../controllers/interestController');

router.post('/interests/send', authMiddleware, sendInterest);
router.get('/interests/received', authMiddleware, getReceivedInterests);
router.get('/interests/sent', authMiddleware, getSentInterests);
router.put('/interests/:id/accept', authMiddleware, acceptInterest);
router.put('/interests/:id/reject', authMiddleware, rejectInterest);
router.get('/interests/count', authMiddleware, getInterestCount);

module.exports = router;
