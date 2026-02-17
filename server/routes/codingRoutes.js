const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getPatterns, getProblemsByPattern, getProblemBySlug } = require('../controllers/codingController');

router.get('/patterns', protect, getPatterns);
router.get('/patterns/:pattern', protect, getProblemsByPattern);
router.get('/problem/:slug', protect, getProblemBySlug);

module.exports = router;
