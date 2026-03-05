const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');

dotenv.config();

const updateStarterCode = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const problem = await CodingProblem.findOne({ slug: 'two-sum-ii-input-array-is-sorted' });

        if (!problem) {
            console.log('Problem not found');
            process.exit(1);
        }

        problem.starterCode = [
            {
                language: 'javascript',
                code: '/**\n * @param {number[]} numbers\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(numbers, target) {\n    \n};'
            },
            {
                language: 'python',
                code: 'class Solution:\n    def twoSum(self, numbers: List[int], target: int) -> List[int]:\n        '
            },
            {
                language: 'java',
                code: 'class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        \n    }\n}'
            },
            {
                language: 'cpp',
                code: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        \n    }\n};'
            }
        ];

        await problem.save();
        console.log('Starter code updated successfully');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateStarterCode();
