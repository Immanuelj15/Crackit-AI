const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    googleAuth,
    updateProfile
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/google', googleAuth);
router.put('/profile', protect, upload.single('image'), updateProfile);

module.exports = router;
