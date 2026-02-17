const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');
const Company = require('./models/Company');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedTwoPointers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const problemsPath = path.join(__dirname, 'two_pointers_problems.json');
        if (!fs.existsSync(problemsPath)) {
            console.error('Problem file not found:', problemsPath);
            process.exit(1);
        }

        const problemsData = fs.readFileSync(problemsPath, 'utf8');
        const problems = JSON.parse(problemsData);
        console.log(`Loaded ${problems.length} problems from JSON.`);

        // Fetch all companies to map names to IDs (if needed in future)
        const companies = await Company.find({});
        const companyMap = new Map(companies.map(c => [c.name, c._id]));

        // Delete existing Two Pointers problems to avoid duplicates/stale data
        await CodingProblem.deleteMany({ pattern: "Two Pointers" });
        console.log('Cleared existing "Two Pointers" problems.');

        const problemsWithSlugs = problems.map(problem => {
            const slug = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            // Map company names to IDs (if present in JSON, currently likely empty)
            const companyIds = (problem.companies || []).map(name => companyMap.get(name)).filter(id => id);

            // Extract function name from Java code (fallback if JSON is missing it)
            const javaCode = (problem.starterCode || []).find(c => c.language === 'java')?.code || '';
            const functionNameMatch = javaCode.match(/public\s+(?:[\w<>\[\]]+\s+)+(\w+)\s*\(/);
            const derivedFunctionName = functionNameMatch ? functionNameMatch[1] : 'solve';

            const existingFunctionName = problem.functionName; // JSON has root-level functionName

            // Format constraints: if array, join to string; if string, keep as is
            const constraints = Array.isArray(problem.constraints)
                ? problem.constraints.join('\n')
                : problem.constraints;



            return {
                ...problem,
                slug,
                pattern: 'Two Pointers',
                companies: companyIds,
                constraints: constraints,
                driverCode: {
                    functionName: existingFunctionName || derivedFunctionName
                }
            };
        });

        // Dedup by slug just in case
        let uniqueProblems = Array.from(new Map(problemsWithSlugs.map(p => [p.slug, p])).values());
        if (uniqueProblems.length !== problemsWithSlugs.length) {
            console.warn(`Removed ${problemsWithSlugs.length - uniqueProblems.length} duplicate slugs.`);
        }

        // Check for existing slugs in DB (from other patterns like Sliding Window)
        const slugsToCheck = uniqueProblems.map(p => p.slug);
        const existingProblems = await CodingProblem.find({ slug: { $in: slugsToCheck } }).select('slug');
        const existingSlugs = new Set(existingProblems.map(p => p.slug));

        // Modify slugs if they exist
        uniqueProblems = uniqueProblems.map(p => {
            if (existingSlugs.has(p.slug)) {
                console.log(`Slug collision for "${p.title}". Renaming slug to "${p.slug}-tp".`);
                return { ...p, slug: `${p.slug}-tp` };
            }
            return p;
        });

        await CodingProblem.insertMany(uniqueProblems);
        console.log(`Successfully seeded ${uniqueProblems.length} Two Pointers problems!`);

        // Verification
        const count = await CodingProblem.countDocuments({ pattern: 'Two Pointers' });
        console.log(`Database now contains ${count} Two Pointers problems.`);

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
            fs.writeFileSync('seed_error.log', log);
        } else {
            console.error('Seeding Error:', err);
            fs.writeFileSync('seed_error.log', `Seeding Error: ${err.message}\n${err.stack}`);
        }
        process.exit(1);
    }
};

seedTwoPointers();
