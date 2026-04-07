const Feedback = require('../models/Feedback');

// @desc    Add feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res) => {
    try {
        const { content, type } = req.body;
        const image = req.file ? `/uploads/feedback/${req.file.filename}` : null;

        const feedback = await Feedback.create({
            user: req.user._id,
            content,
            type,
            image
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's feedback
// @route   GET /api/feedback/my
// @access  Private
const getMyFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback
// @access  Private/Admin
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update feedback status (Admin only or user if pending)
// @route   PUT /api/feedback/:id
// @access  Private
const updateFeedbackStatus = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (req.user.role === 'admin') {
            feedback.status = req.body.status || feedback.status;
        } else if (feedback.user.toString() === req.user._id.toString()) {
            if (feedback.status !== 'Pending') {
                return res.status(400).json({ message: 'Cannot edit feedback after review' });
            }
            feedback.content = req.body.content || feedback.content;
            feedback.type = req.body.type || feedback.type;

            if (req.body.imageRemoved === 'true') {
                feedback.image = null;
            } else if (req.file) {
                feedback.image = `/uploads/feedback/${req.file.filename}`;
            }
        } else {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedFeedback = await feedback.save();
        res.json(updatedFeedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(44).json({ message: 'Feedback not found' });
        }

        if (feedback.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this feedback' });
        }

        await feedback.deleteOne();
        res.json({ message: 'Feedback removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFeedback,
    getMyFeedback,
    getAllFeedback,
    updateFeedbackStatus,
    deleteFeedback
};
