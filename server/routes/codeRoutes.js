const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { runCode, submitCode, getUserSubmissions, getGlobalUserSubmissions, getCodingStats } = require('../controllers/codeController');

router.get('/stats', protect, getCodingStats);
router.get('/submissions', protect, getGlobalUserSubmissions);
router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);
router.get('/submissions/:problemId', protect, getUserSubmissions);

module.exports = router;
