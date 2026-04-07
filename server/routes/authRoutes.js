const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    googleAuth,
    updateProfile,
    requestOtp,
    verifyOtp
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/google', googleAuth);
router.put('/profile', protect, upload.single('image'), updateProfile);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
