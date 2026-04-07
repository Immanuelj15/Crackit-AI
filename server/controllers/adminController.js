const User = require('../models/User');
const CodingProblem = require('../models/CodingProblem');
const Question = require('../models/Question');
const Topic = require('../models/Topic');
const ExcelJS = require('exceljs');
const slugify = require('slugify');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const codingCount = await CodingProblem.countDocuments();
        const aptitudeCount = await Question.countDocuments({ type: 'aptitude' });

        res.json({
            studentCount,
            codingCount,
            aptitudeCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new coding problem
// @route   POST /api/admin/coding-problem
// @access  Private/Admin
const addCodingProblem = async (req, res) => {
    try {
        const { title, description, pattern, difficulty, constraints, inputFormat, outputFormat, examples, starterCode, driverCode, testCases, editorial, editorialCost } = req.body;

        const slug = slugify(title, { lower: true, strict: true });

        const problemExists = await CodingProblem.findOne({ slug });
        if (problemExists) {
            return res.status(400).json({ message: 'Problem with this title/slug already exists' });
        }

        const problem = await CodingProblem.create({
            title,
            slug,
            description,
            pattern,
            difficulty,
            constraints,
            inputFormat,
            outputFormat,
            examples,
            starterCode,
            driverCode,
            testCases,
            editorial,
            editorialCost
        });

        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new aptitude question
// @route   POST /api/admin/aptitude-question
// @access  Private/Admin
const addAptitudeQuestion = async (req, res) => {
    try {
        const { category, topic, questionText, options, correctAnswer, explanation, difficulty } = req.body;

        const question = await Question.create({
            type: 'aptitude',
            category,
            topic,
            questionText,
            options,
            correctAnswer,
            explanation,
            difficulty
        });

        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Download student performance in Excel
// @route   GET /api/admin/export-users
// @access  Private/Admin
const exportStudentPerformance = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('name email college branch streak coins solvedProblems');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students Performance');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'College', key: 'college', width: 25 },
            { header: 'Branch', key: 'branch', width: 20 },
            { header: 'Streak', key: 'streak', width: 10 },
            { header: 'Coins', key: 'coins', width: 10 },
            { header: 'Coding Solved', key: 'codingCount', width: 15 },
            { header: 'Aptitude Solved', key: 'aptitudeCount', width: 15 }
        ];

        // Style the header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' }
        };

        users.forEach(user => {
            const codingSolved = user.solvedProblems.filter(p => p.type === 'coding').length;
            const aptitudeSolved = user.solvedProblems.filter(p => p.type === 'aptitude').length;

            worksheet.addRow({
                name: user.name,
                email: user.email,
                college: user.college || 'N/A',
                branch: user.branch || 'N/A',
                streak: user.streak || 0,
                coins: user.coins || 0,
                codingCount: codingSolved,
                aptitudeCount: aptitudeSolved
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'Students_Performance.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudents = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' })
            .select('name email college branch streak coins solvedProblems createdAt')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all coding problems for admin
// @route   GET /api/admin/coding-problems
// @access  Private/Admin
const getAdminCodingProblems = async (req, res) => {
    try {
        const problems = await CodingProblem.find({})
            .select('title slug difficulty pattern dailyChallengeDate updatedAt')
            .sort({ createdAt: -1 });
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set daily challenge
// @route   POST /api/admin/set-daily-challenge
// @access  Private/Admin
const setDailyChallenge = async (req, res) => {
    try {
        const { id, date } = req.body;
        const targetDate = date || new Date().toISOString().split('T')[0];

        // 1. Clear existing challenge for that date
        await CodingProblem.updateMany({ dailyChallengeDate: targetDate }, { $unset: { dailyChallengeDate: "" } });

        // 2. Set new challenge
        const problem = await CodingProblem.findByIdAndUpdate(id, { dailyChallengeDate: targetDate }, { new: true });

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        res.json({ message: `Daily challenge set for ${targetDate}`, problem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminStats,
    addCodingProblem,
    addAptitudeQuestion,
    exportStudentPerformance,
    getStudents,
    getAdminCodingProblems,
    setDailyChallenge
};
