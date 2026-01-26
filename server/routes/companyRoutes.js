const express = require('express');
const router = express.Router();
const { getCompanies, getCompanyById, createCompany } = require('../controllers/companyController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').get(getCompanies).post(protect, admin, createCompany);
router.route('/:id').get(protect, getCompanyById);

module.exports = router;
