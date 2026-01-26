const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    googleAuth,
    sendOtp,
    verifyOtp
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/google', googleAuth);
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);

module.exports = router;
