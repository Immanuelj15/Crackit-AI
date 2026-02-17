const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');
const Company = require('./models/Company');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedTree = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Path to the Tree JSON file
        const problemsPath = path.join(__dirname, 'tree_problems.json');
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

        // Delete existing Tree problems to avoid duplicates/stale data
        await CodingProblem.deleteMany({ pattern: "Trees" });
        console.log('Cleared existing "Trees" problems.');

        const problemsWithSlugs = problems.map(problem => {
            // Generate slug from title
            let slug = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            // Map company names to IDs
            const companyIds = (problem.companies || []).map(name => companyMap.get(name)).filter(id => id);

            // Extract function name from Java code (fallback if JSON is missing it)
            const javaCode = (problem.starterCode || []).find(c => c.language === 'java')?.code || '';
            const functionNameMatch = javaCode.match(/public\s+(?:[\w<>\[\]]+\s+)+(\w+)\s*\(/);
            const derivedFunctionName = functionNameMatch ? functionNameMatch[1] : 'solve';

            const existingFunctionName = problem.functionName;

            // Format constraints: if array, join to string; if string, keep as is
            const constraints = Array.isArray(problem.constraints)
                ? problem.constraints.join('\n')
                : problem.constraints;

            return {
                ...problem,
                slug,
                pattern: 'Trees',
                companies: companyIds,
                constraints: constraints,
                driverCode: {
                    functionName: existingFunctionName || derivedFunctionName
                }
            };
        });

        // Dedup by slug just in case within this list
        let uniqueProblems = Array.from(new Map(problemsWithSlugs.map(p => [p.slug, p])).values());

        // Final slug collision check with OTHER patterns in DB
        const slugsToCheck = uniqueProblems.map(p => p.slug);
        const existingProblems = await CodingProblem.find({ slug: { $in: slugsToCheck } }).select('slug');
        const existingSlugsInDB = new Set(existingProblems.map(p => p.slug));

        uniqueProblems = uniqueProblems.map(p => {
            if (existingSlugsInDB.has(p.slug)) {
                console.log(`Slug collision for "${p.title}" (already exists in DB). Renaming to "${p.slug}-tree".`);
                return { ...p, slug: `${p.slug}-tree` };
            }
            return p;
        });

        await CodingProblem.insertMany(uniqueProblems);
        console.log(`Successfully seeded ${uniqueProblems.length} Tree problems!`);

        // Verification
        const count = await CodingProblem.countDocuments({ pattern: 'Trees' });
        console.log(`Database now contains ${count} Tree problems.`);

        process.exit();
    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error('Validation Error Details (Writing to seed_error.log):');
            let log = `TIMESTAMP: ${new Date().toISOString()}\n`;
            Object.keys(err.errors).forEach(key => {
                const message = `- ${key}: ${err.errors[key].message}\n`;
                console.error(message.trim());
                log += message;
            });
            fs.appendFileSync(path.join(__dirname, 'seed_error.log'), log + '\n');
        } else {
            console.error('Error seeding data:', err);
        }
        process.exit(1);
    }
};

seedTree();
