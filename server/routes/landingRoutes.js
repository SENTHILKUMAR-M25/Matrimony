const { Router } = require('express');
const { getLanding } = require('../controllers/landingController');

const router = Router();

router.get('/landing', getLanding);

module.exports = router;
