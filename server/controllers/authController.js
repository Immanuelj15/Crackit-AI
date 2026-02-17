const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, college, branch } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        college,
        branch
    });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            college: user.college,
            branch: user.branch,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Google Auth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // If user exists, update googleId/picture if missing
            if (!user.googleId) {
                user.googleId = googleId;
                user.picture = picture;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                picture,
                googleId,
                password: '' // No password for Google users
            });
        }

        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            role: user.role,
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({ message: 'Google authentication failed' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.department = req.body.department || user.department;
        user.year = req.body.year || user.year;
        user.phone = req.body.phone || user.phone;
        user.college = req.body.college || user.college;

        // If image is uploaded
        if (req.file) {
            // Save relative path for frontend to use
            user.picture = `/uploads/profiles/${req.file.filename}`;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            picture: updatedUser.picture,
            role: updatedUser.role,
            college: updatedUser.college,
            branch: updatedUser.branch,
            department: updatedUser.department,
            year: updatedUser.year,
            phone: updatedUser.phone
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    googleAuth,
    updateProfile
};
