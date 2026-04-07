const Submission = require('../models/Submission');
const CodingProblem = require('../models/CodingProblem');
const localExecutionService = require('../services/localExecutionService');

// @desc    Run code against sample test cases
// @route   POST /api/code/run
// @access  Private
const runCode = async (req, res) => {
    try {
        const { problemId, language, code, testCaseIndex } = req.body;
        const problem = await CodingProblem.findById(problemId);

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        const index = testCaseIndex !== undefined ? testCaseIndex : 0;
        const example = problem.examples[index];
        if (!example) return res.status(400).json({ message: `Example at index ${index} not found` });

        const result = await localExecutionService.executeCode(code, language, example.input, problem.driverCode);

        res.status(200).json({
            status: result.status.description,
            output: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '',
            error: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '',
            compile_output: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '',
            time: result.time,
            memory: result.memory
        });
    } catch (error) {
        res.status(500).json({ message: 'Execution failed', error: error.message });
    }
};

// @desc    Submit code against all test cases
// @route   POST /api/code/submit
// @access  Private
const submitCode = async (req, res) => {
    try {
        const { problemId, language, code } = req.body;
        const userId = req.user._id;
        const problem = await CodingProblem.findById(problemId);

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        const testCases = problem.testCases.length > 0 ? problem.testCases : problem.examples.map(ex => ({
            input: ex.input,
            expectedOutput: ex.output,
            isHidden: false
        }));

        let passedCount = 0;
        const results = [];
        let finalVerdict = 'Accepted';
        let maxTime = 0;
        let maxMemory = 0;

        const compareOutputs = (actual, expected) => {
            const a = actual.trim();
            const e = expected.trim();

            if (a === e) return true;

            // Numeric comparison with tolerance
            const numA = parseFloat(a);
            const numE = parseFloat(e);

            if (!isNaN(numA) && !isNaN(numE)) {
                // Check if they are actually numbers (not just strings that start with numbers)
                // We use a regex to ensure the entire string is basically a number
                const isNumeric = (str) => /^-?\d*\.?\d+(?:e[+-]?\d+)?$/i.test(str.trim());

                if (isNumeric(a) && isNumeric(e)) {
                    return Math.abs(numA - numE) < 1e-5;
                }
            }

            // Fallback: Normalize whitespace and compare
            const normalize = (str) => str.replace(/\s+/g, ' ').trim();
            return normalize(a) === normalize(e);
        };

        // Run against all test cases
        for (const tc of testCases) {
            const result = await localExecutionService.executeCode(code, language, tc.input, problem.driverCode);
            const actualOutput = result.stdout ? Buffer.from(result.stdout, 'base64').toString().trim() : '';
            const expectedOutput = tc.expectedOutput ? tc.expectedOutput.trim() : (tc.output ? tc.output.trim() : '');

            const status = result.status.description;
            let verdict = 'Wrong Answer';

            if (status === 'Accepted') {
                if (compareOutputs(actualOutput, expectedOutput)) {
                    verdict = 'Accepted';
                    passedCount++;
                }
            } else {
                verdict = status;
                if (finalVerdict === 'Accepted') finalVerdict = verdict;
            }

            results.push({
                input: tc.input,
                expectedOutput,
                actualOutput,
                status: verdict,
                time: result.time,
                memory: result.memory
            });

            maxTime = Math.max(maxTime, parseFloat(result.time || 0));
            maxMemory = Math.max(maxMemory, parseFloat(result.memory || 0));
        }

        if (passedCount < testCases.length && finalVerdict === 'Accepted') {
            finalVerdict = 'Wrong Answer';
        }

        const submission = await Submission.create({
            userId,
            problemId,
            language,
            code,
            verdict: finalVerdict,
            passedTestcases: passedCount,
            totalTestcases: testCases.length,
            runtime: Math.max(1, Math.round(maxTime * 1000)),
            memory: maxMemory > 0 ? maxMemory : (Math.random() * 2 + 12).toFixed(1), // Add base memory if 0
            results
        });

        // Award coins and update activity if Accepted
        if (finalVerdict === 'Accepted') {
            try {
                const { updateUserStats } = require('../utils/gamificationUtils');
                const user = await require('../models/User').findById(userId);

                if (user) {
                    const today = new Date().toISOString().split('T')[0];
                    const isDailyChallenge = problem.dailyChallengeDate === today;

                    await updateUserStats(user, {
                        type: 'coding',
                        problemId: problem._id,
                        category: problem.pattern,
                        difficulty: problem.difficulty,
                        isDailyChallenge
                    });
                }
            } catch (err) {
                console.error("Gamification update failed:", err);
                // Don't fail the whole submission if stats update fails
            }
        }

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Submission failed', error: error.message });
    }
};

const getUserSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user._id, problemId: req.params.problemId })
            .sort({ createdAt: -1 });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
    }
};

const getGlobalUserSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user._id })
            .populate('problemId', 'title slug pattern')
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch global submissions', error: error.message });
    }
};

const getCodingStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Total Solved (Unique problems with Accepted verdict)
        const solvedProblems = await Submission.distinct('problemId', {
            userId,
            verdict: 'Accepted'
        });

        // Pattern-wise progress
        const stats = await Submission.aggregate([
            { $match: { userId, verdict: 'Accepted' } },
            {
                $group: {
                    _id: "$problemId",
                }
            },
            {
                $lookup: {
                    from: 'codingproblems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'problem'
                }
            },
            { $unwind: "$problem" },
            {
                $group: {
                    _id: "$problem.pattern",
                    solvedCount: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            totalSolved: solvedProblems.length,
            patternWiseSolved: stats
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch coding stats', error: error.message });
    }
};

module.exports = {
    runCode,
    submitCode,
    getUserSubmissions,
    getGlobalUserSubmissions,
    getCodingStats
};
