const express = require('express');
const router = express.Router();
const { 
    getAdminStats, 
    addCodingProblem, 
    addAptitudeQuestion, 
    exportStudentPerformance,
    getStudents,
    getAdminCodingProblems,
    setDailyChallenge
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All routes are protected and require admin role
router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/students', getStudents);
router.get('/coding-problems', getAdminCodingProblems);
router.post('/coding-problem', addCodingProblem);
router.post('/set-daily-challenge', setDailyChallenge);
router.post('/aptitude-question', addAptitudeQuestion);
router.get('/export-users', exportStudentPerformance);

module.exports = router;
