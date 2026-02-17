const CodingProblem = require('../models/CodingProblem');

// @desc    Get all patterns with problem counts
// @route   GET /api/coding/patterns
// @access  Private
const getPatterns = async (req, res) => {
    try {
        const patterns = await CodingProblem.aggregate([
            {
                $group: {
                    _id: "$pattern",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Define all supported patterns to ensure even empty ones might show up if we wanted (optional, but good for UI consistency)
        // For now, we return what's in DB or we can hardcode the list and merge counts.
        // Let's return the aggregation result for dynamic data.

        res.status(200).json(patterns);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get problems by pattern
// @route   GET /api/coding/patterns/:pattern
// @access  Private
const getProblemsByPattern = async (req, res) => {
    try {
        const { pattern } = req.params;
        const problems = await CodingProblem.find({ pattern: pattern })
            .select('title slug difficulty companies') // Select only necessary fields for list
            .populate('companies', 'name logoUrl');

        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single problem by slug
// @route   GET /api/coding/problem/:slug
// @access  Private
const getProblemBySlug = async (req, res) => {
    try {
        const problem = await CodingProblem.findOne({ slug: req.params.slug })
            .populate('companies', 'name');

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // We might want to remove testCases[].isHidden = true for the user response,
        // or just send the whole object and let frontend filter (less secure but ok for MVP phase 1)
        // Ideally, we restrict hidden test cases.
        const problemObj = problem.toObject();
        problemObj.testCases = problemObj.testCases.filter(tc => !tc.isHidden);

        res.status(200).json(problemObj);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getPatterns,
    getProblemsByPattern,
    getProblemBySlug
};
