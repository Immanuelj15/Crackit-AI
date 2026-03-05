const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');

dotenv.config();

const populateEditorials = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const problems = await CodingProblem.find({});
        console.log(`Found ${problems.length} problems`);

        for (const problem of problems) {
            if (!problem.editorial) {
                problem.editorial = `
# Editorial: ${problem.title}

## Intuition
The core idea behind this problem is to use an efficient approach to achieve the desired result. For most sliding window or array problems, we want to avoid nested loops to maintain O(N) time complexity.

## Approach
1. **Initialize** variables to track the current state (e.g., current sum, maximum sum).
2. **Iterate** through the array using a pointer or a window.
3. **Update** the state based on the problem's constraints.
4. **Compare** and store the optimal result.

## Complexity
- **Time Complexity:** O(N) as we traverse the array once.
- **Space Complexity:** O(1) as we only use a few constant variables.

## Code (Java)
\`\`\`java
class Solution {
    public void solve() {
        // Implementation details
    }
}
\`\`\`
`;
                problem.editorialCost = 50;
                await problem.save();
                console.log(`Updated editorial for: ${problem.title}`);
            }
        }

        console.log('Finished updating editorials');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

populateEditorials();
