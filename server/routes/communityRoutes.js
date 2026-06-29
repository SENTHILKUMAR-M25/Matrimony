const express = require('express');
const router = express.Router();
const { getCommunities } = require('../controllers/communityController');

router.get('/communities', getCommunities);

module.exports = router;
