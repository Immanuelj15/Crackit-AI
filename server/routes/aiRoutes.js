const express = require('express');
const router = express.Router();
const { generateQuestion, evaluateAnswer, chatWithBot } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/generate', protect, generateQuestion);
router.post('/evaluate', protect, evaluateAnswer);
router.post('/chat', chatWithBot); // Public route for landing page

module.exports = router;
