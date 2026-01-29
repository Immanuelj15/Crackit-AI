const Topic = require('../models/Topic');
const Result = require('../models/Result');
const Question = require('../models/Question');
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// @desc    Get all topics by category with user progress
// @route   GET /api/topics?category=quant
// @access  Private
const getTopics = async (req, res) => {
    const { category } = req.query;
    try {
        const topics = await Topic.find({ category }).select('name description category').lean();

        // Fetch user results for these topics to show progress
        const results = await Result.find({ user: req.user._id, category });

        const topicsWithProgress = topics.map(topic => {
            const topicResults = results.filter(r => r.topic.toString() === topic._id.toString());
            let progress = null;

            if (topicResults.length > 0) {
                // Get best performance based on score, then accuracy
                const best = topicResults.reduce((prev, current) => {
                    // Normalize score to percentage for comparison if totalQuestions varies, 
                    // but usually we care about raw score or just the latest? 
                    // Let's go with Best Score based on accuracy to represent mastery.
                    return (current.accuracy > prev.accuracy) ? current : prev;
                });

                progress = {
                    score: best.score,
                    totalQuestions: best.totalQuestions,
                    accuracy: best.accuracy,
                    completed: true
                };
            }
            return { ...topic, progress };
        });

        res.json(topicsWithProgress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single topic with study content
// @route   GET /api/topics/:id
// @access  Private
const getTopicDetails = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (topic) {
            res.json(topic);
        } else {
            res.status(404).json({ message: 'Topic not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit test result & get AI Feedback
// @route   POST /api/topics/result
// @access  Private
const submitTestResult = async (req, res) => {
    const { topicId, category, score, totalQuestions, correctAnswers, wrongAnswers, timeTaken, answers } = req.body;

    // Calculate metrics
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const averageTimePerQuestion = timeTaken / totalQuestions;

    // Advanced Analysis for AI
    let difficultySummary = "";
    try {
        if (answers && Object.keys(answers).length > 0) {
            const questionIds = Object.keys(answers);
            const questions = await Question.find({ _id: { $in: questionIds } });

            let difficultyStats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };

            questions.forEach(q => {
                const diff = q.difficulty || 'medium';
                if (difficultyStats[diff]) {
                    difficultyStats[diff].total++;
                    if (answers[q._id] === q.correctAnswer) {
                        difficultyStats[diff].correct++;
                    }
                }
            });

            difficultySummary = `
            Difficulty Breakdown:
            - Easy: ${difficultyStats.easy.correct}/${difficultyStats.easy.total}
            - Medium: ${difficultyStats.medium.correct}/${difficultyStats.medium.total}
            - Hard: ${difficultyStats.hard.correct}/${difficultyStats.hard.total}
            `;
        }
    } catch (err) {
        console.error("Error fetching question details for analysis:", err);
    }

    // AI Analysis
    let aiFeedback = "Great effort! Keep practicing to improve speed and accuracy.";

    try {
        const prompt = `
        Analyze this aptitude test performance:
        Topic: ${category}
        Score: ${score}/${totalQuestions}
        Time: ${timeTaken} seconds (${averageTimePerQuestion.toFixed(1)}s per question)
        Accuracy: ${accuracy.toFixed(1)}%
        ${difficultySummary}
        
        Provide concise, friendly, and actionable advice in exactly 2 sentences. 
        If accuracy is low on Easy questions, suggest foundational review. 
        If speed is slow, suggest time management.
        If Hard questions were missed, suggest advanced practice.
        `;

        if (process.env.HUGGINGFACE_API_KEY) {
            const response = await hf.chatCompletion({
                model: "Qwen/Qwen2.5-72B-Instruct",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150,
                temperature: 0.7
            });
            aiFeedback = response.choices[0].message.content.trim();
        }
    } catch (error) {
        console.error("AI Feedback Error:", error.message);
    }

    try {
        const result = await Result.create({
            user: req.user._id,
            topic: topicId,
            category,
            score,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            timeTaken,
            accuracy,
            averageTimePerQuestion,
            aiFeedback
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save result' });
    }
};

// @desc    Get overall user aptitude statistics
// @route   GET /api/topics/stats
// @access  Private
const getOverallStats = async (req, res) => {
    try {
        const results = await Result.find({ user: req.user._id });

        let totalTests = results.length;
        if (totalTests === 0) {
            return res.json({
                totalTests: 0,
                averageScore: 0,
                averageAccuracy: 0,
                topicsCompleted: 0
            });
        }

        const averageScore = results.reduce((acc, curr) => acc + curr.score, 0) / totalTests;
        const averageAccuracy = results.reduce((acc, curr) => acc + curr.accuracy, 0) / totalTests;

        // Unique topics attempted
        const uniqueTopics = new Set(results.map(r => r.topic.toString()));

        res.json({
            totalTests,
            averageScore: Math.round(averageScore * 10) / 10,
            averageAccuracy: Math.round(averageAccuracy),
            topicsCompleted: uniqueTopics.size
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
};

module.exports = {
    getTopics,
    getTopicDetails,
    submitTestResult,
    getOverallStats
};
