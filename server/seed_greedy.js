const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');
const Company = require('./models/Company');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedGreedy = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Path to the Greedy JSON file
        const problemsPath = path.join(__dirname, 'greedy_problems.json');
        if (!fs.existsSync(problemsPath)) {
            console.error('Problem file not found:', problemsPath);
            process.exit(1);
        }

        const problemsData = fs.readFileSync(problemsPath, 'utf8');
        const problems = JSON.parse(problemsData);
        console.log(`Loaded ${problems.length} problems from JSON.`);

        // Fetch all companies to map names to IDs
        const companies = await Company.find({});
        const companyMap = new Map(companies.map(c => [c.name, c._id]));

        // Delete existing Greedy problems to avoid duplicates
        await CodingProblem.deleteMany({ pattern: "Greedy" });
        console.log('Cleared existing "Greedy" problems.');

        const problemsWithSlugs = problems.map(problem => {
            // Generate slug from title
            let slug = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            // Map company names to IDs (if any provided in future, empty for now)
            const companyIds = (problem.companies || []).map(name => companyMap.get(name)).filter(id => id);

            // Constraints as string
            const constraints = Array.isArray(problem.constraints)
                ? problem.constraints.join('\n')
                : problem.constraints;

            return {
                ...problem,
                slug,
                pattern: 'Greedy',
                companies: companyIds,
                constraints: constraints,
                driverCode: {
                    functionName: problem.functionName || 'solve'
                }
            };
        });

        // Dedup by slug
        let uniqueProblems = Array.from(new Map(problemsWithSlugs.map(p => [p.slug, p])).values());

        // Slug collision check
        const slugsToCheck = uniqueProblems.map(p => p.slug);
        const existingProblems = await CodingProblem.find({ slug: { $in: slugsToCheck } }).select('slug');
        const existingSlugsInDB = new Set(existingProblems.map(p => p.slug));

        uniqueProblems = uniqueProblems.map(p => {
            if (existingSlugsInDB.has(p.slug)) {
                console.log(`Slug collision for "${p.title}". Renaming.`);
                return { ...p, slug: `${p.slug}-greedy` };
            }
            return p;
        });

        await CodingProblem.insertMany(uniqueProblems);
        console.log(`Successfully seeded ${uniqueProblems.length} Greedy problems!`);

        process.exit();
    } catch (err) {
        if (err.name === 'ValidationError') {
            fs.appendFileSync(path.join(__dirname, 'seed_error.log'), `TIMESTAMP: ${new Date().toISOString()}\n${JSON.stringify(err.errors, null, 2)}\n\n`);
        }
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedGreedy();
