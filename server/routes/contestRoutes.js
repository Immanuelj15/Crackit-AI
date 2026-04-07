const express = require('express');
const router = express.Router();
const { getContests, getContestById, joinContest } = require('../controllers/contestController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getContests);
router.route('/:id').get(protect, getContestById);
router.post('/:id/join', protect, joinContest);

module.exports = router;
