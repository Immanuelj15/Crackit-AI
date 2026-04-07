const express = require('express');
const router = express.Router();
const { 
    createFeedback, 
    getMyFeedback, 
    getAllFeedback, 
    updateFeedbackStatus, 
    deleteFeedback 
} = require('../controllers/feedbackController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Middleware to set subfolder for upload
const setSubfolder = (req, res, next) => {
    req.uploadSubfolder = 'feedback';
    next();
};

router.post('/', protect, setSubfolder, upload.single('image'), createFeedback);
router.get('/my', protect, getMyFeedback);
router.get('/', protect, admin, getAllFeedback);
router.put('/:id', protect, updateFeedbackStatus);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
