const Comment = require('../models/Comment');

// @desc    Get comments for a problem
// @route   GET /api/comments/:problemId
// @access  Public
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ problem: req.params.problemId })
            .populate('user', 'name email picture')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
    try {
        const { problem, content } = req.body;
        const image = req.file ? `/uploads/comments/${req.file.filename}` : null;

        const comment = await Comment.create({
            user: req.user._id,
            problem,
            content,
            image
        });

        const populatedComment = await comment.populate('user', 'name email picture');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this comment' });
        }

        comment.content = req.body.content || comment.content;
        
        if (req.body.imageRemoved === 'true') {
            comment.image = null;
        } else if (req.file) {
            comment.image = `/uploads/comments/${req.file.filename}`;
        }

        const updatedComment = await comment.save();
        const populatedComment = await updatedComment.populate('user', 'name email picture');
        res.json(populatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike a comment
// @route   PUT /api/comments/:id/like
// @access  Private
const likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const isLiked = comment.likes.includes(req.user._id);

        if (isLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            comment.likes.push(req.user._id);
        }

        await comment.save();
        res.json(comment.likes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment
};
