const express = require('express');
const router = express.Router();
const { 
    getComments, 
    createComment, 
    updateComment, 
    deleteComment, 
    likeComment 
} = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Middleware to set subfolder for upload
const setSubfolder = (req, res, next) => {
    req.uploadSubfolder = 'comments';
    next();
};

router.get('/:problemId', getComments);
router.post('/', protect, setSubfolder, upload.single('image'), createComment);
router.put('/:id', protect, setSubfolder, upload.single('image'), updateComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, likeComment);

module.exports = router;
