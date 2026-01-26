const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private/Public
const getCompanies = async (req, res) => {
    const companies = await Company.find({});
    res.json(companies);
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private/Public
const getCompanyById = async (req, res) => {
    const company = await Company.findById(req.params.id);
    if (company) {
        res.json(company);
    } else {
        res.status(404).json({ message: 'Company not found' });
    }
};

const createCompany = async (req, res) => {
    const { name, description, hiringPattern, rounds } = req.body;
    const company = await Company.create({ name, description, hiringPattern, rounds });
    res.status(201).json(company);
}

module.exports = { getCompanies, getCompanyById, createCompany };
