const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getVisitors, getVisited, getVisitCount } = require('../controllers/viewController');

router.get('/views/visitors', authMiddleware, getVisitors);
router.get('/views/visited', authMiddleware, getVisited);
router.get('/views/count', authMiddleware, getVisitCount);

module.exports = router;
