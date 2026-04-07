const express = require('express');
const router = express.Router();
const { generateQuestion, evaluateAnswer, chatWithBot, analyzeResume, analyzePerformance } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');
const uploadResume = require('../middlewares/resumeMiddleware');

router.post('/generate', protect, generateQuestion);
router.post('/evaluate', protect, evaluateAnswer);
router.post('/chat', chatWithBot); // Public route for landing page
router.post('/analyze-resume', protect, uploadResume.single('resume'), analyzeResume);
router.post('/analyze-performance', protect, analyzePerformance);

module.exports = router;
