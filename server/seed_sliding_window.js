const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const CodingProblem = require('./models/CodingProblem');
const Company = require('./models/Company');

dotenv.config({ path: path.join(__dirname, '.env') });

const problems = [
    // --- EASY (7) ---
    {
        title: "Maximum Average Subarray I",
        difficulty: "Easy",
        pattern: "Sliding Window",
        description: "You are given an integer array `nums` consisting of `n` elements, and an integer `k`.\n\nFind a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value. Any answer with a calculation error less than `10^-5` will be accepted.",
        examples: [
            {
                input: "nums = [1,12,-5,-6,50,3], k = 4",
                output: "12.75000",
                explanation: "Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75"
            },
            {
                input: "nums = [5], k = 1",
                output: "5.00000"
            }
        ],
        constraints: [
            "n == nums.length",
            "1 <= k <= n <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        starterCode: [
            { language: "java", code: "class Solution {\n    public double findMaxAverage(int[] nums, int k) {\n        // Write your code here\n    }\n}" },
            { language: "javascript", code: "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nvar findMaxAverage = function(nums, k) {\n    // Write your code here\n};" },
            { language: "python", code: "class Solution:\n    def findMaxAverage(self, nums: List[int], k: int) -> float:\n        pass" },
            { language: "cpp", code: "class Solution {\npublic:\n    double findMaxAverage(vector<int>& nums, int k) {\n        // Write your code here\n    }\n};" }
        ],
        driverCode: {
            parameterTypes: ["int[]", "int"],
            returnType: "double",
            functionName: "findMaxAverage"
        },
        companies: ["Google", "Amazon", "Meta"]
    },
    {
        title: "Contains Duplicate II",
        difficulty: "Easy",
        pattern: "Sliding Window",
        description: "Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` in the array such that `nums[i] == nums[j]` and `abs(i - j) <= k`.",
        examples: [
            { input: "nums = [1,2,3,1], k = 3", output: "true" },
            { input: "nums = [1,0,1,1], k = 1", output: "true" },
            { input: "nums = [1,2,3,1,2,3], k = 2", output: "false" }
        ],
        constraints: [
            "1 <= nums.length <= 10^5",
            "-10^9 <= nums[i] <= 10^9",
            "0 <= k <= 10^5"
        ],
        starterCode: [
            { language: "java", code: "class Solution {\n    public boolean containsNearbyDuplicate(int[] nums, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Airbnb", "Palantir"]
    },
    {
        title: "Find All Anagrams in a String",
        difficulty: "Easy", // Listed as Medium on LC, but user requested Easy
        pattern: "Sliding Window",
        description: "Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`. You may return the answer in any order.",
        examples: [
            { input: "s = \"cbaebabacd\", p = \"abc\"", output: "[0,6]", explanation: "The substring with start index = 0 is \"cba\", which is an anagram of \"abc\".\nThe substring with start index = 6 is \"bac\", which is an anagram of \"abc\"." }
        ],
        constraints: ["1 <= s.length, p.length <= 3 * 10^4", "s and p consist of lowercase English letters."],
        starterCode: [
            { language: "java", code: "class Solution {\n    public List<Integer> findAnagrams(String s, String p) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Amazon", "Microsoft", "Uber"]
    },
    {
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        pattern: "Sliding Window",
        description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
        examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." }
        ],
        constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Amazon", "Bloomberg", "Google"]
    },
    {
        title: "Longest Nice Substring",
        difficulty: "Easy",
        pattern: "Sliding Window",
        description: "A string `s` is nice if, for every letter of the alphabet that `s` contains, it appears both in uppercase and lowercase. For example, \"abABB\" is nice because 'A' and 'a' appear, and 'B' and 'b' appear. However, \"abA\" is not because 'b' appears, but 'B' does not.\n\nGiven a string `s`, return the longest substring of `s` that is nice. If there are multiple, return the substring of the earliest occurrence. If there are none, return an empty string.",
        examples: [
            { input: "s = \"YazaAay\"", output: "\"aAa\"", explanation: "\"aAa\" is a nice string because 'A/a' is the only letter of the alphabet in s, and both 'A' and 'a' appear." }
        ],
        constraints: ["1 <= s.length <= 100", "s consists of uppercase and lowercase English letters."],
        starterCode: [
            { language: "java", code: "class Solution {\n    public String longestNiceSubstring(String s) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Microsoft"]
    },
    {
        title: "Number of Substrings with Only 1s",
        difficulty: "Easy", // Actually Medium on LC, fitting user request
        pattern: "Sliding Window",
        description: "Given a binary string `s`, return the number of substrings with all characters 1's. Since the answer may be too large, return it modulo 10^9 + 7.",
        examples: [
            { input: "s = \"0110111\"", output: "9", explanation: "There are 9 substrings in total with only 1s." }
        ],
        constraints: ["1 <= s.length <= 10^5", "s[i] is either '0' or '1'."],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int numSub(String s) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Mathworks"]
    },
    {
        title: "Minimum Recolors to Get K Consecutive Black Blocks",
        difficulty: "Easy",
        pattern: "Sliding Window",
        description: "You are given a 0-indexed string `blocks` of length `n`, where `blocks[i]` is either 'W' or 'B', representing the color of the `i`th block. You are also given an integer `k`.\n\nReturn the minimum number of operations needed to ensure there is at least one occurrence of `k` consecutive black blocks.",
        examples: [
            { input: "blocks = \"WBBWWBBWBW\", k = 7", output: "3", explanation: "One way is to recolor the 0th, 3rd, and 4th blocks to get \"BBBBBBBWBW\"." }
        ],
        constraints: ["n == blocks.length", "1 <= n <= 100", "1 <= k <= n"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int minimumRecolors(String blocks, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Google", "Salesforce"]
    },

    // --- MEDIUM (7) ---
    {
        title: "Longest Repeating Character Replacement",
        difficulty: "Medium",
        pattern: "Sliding Window",
        description: "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.",
        examples: [
            { input: "s = \"ABAB\", k = 2", output: "4", explanation: "Replace the two 'A's with two 'B's or vice versa." }
        ],
        constraints: ["1 <= s.length <= 10^5", "s consists of only uppercase English letters.", "0 <= k <= s.length"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int characterReplacement(String s, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Amazon", "Google", "Uber"]
    },
    {
        title: "Permutation in String",
        difficulty: "Medium",
        pattern: "Sliding Window",
        description: "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.\n\nIn other words, return `true` if one of `s1`'s permutations is the substring of `s2`.",
        examples: [
            { input: "s1 = \"ab\", s2 = \"eidbaooo\"", output: "true", explanation: "s2 contains one permutation of s1 (\"ba\")." }
        ],
        constraints: ["1 <= s1.length, s2.length <= 10^4", "s1 and s2 consist of lowercase English letters."],
        starterCode: [
            { language: "java", code: "class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Microsoft", "Yandex", "Oracle"]
    },
    {
        title: "Minimum Size Subarray Sum",
        difficulty: "Medium",
        pattern: "Sliding Window",
        description: "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray of which the sum is greater than or equal to `target`. If there is no such subarray, return 0 instead.",
        examples: [
            { input: "target = 7, nums = [2,3,1,2,4,3]", output: "2", explanation: "The subarray [4,3] has the minimal length under the problem constraint." }
        ],
        constraints: ["1 <= target <= 10^9", "1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int minSubArrayLen(int target, int[] nums) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Facebook", "Goldman Sachs"]
    },
    {
        title: "Fruits Into Baskets",
        difficulty: "Medium",
        pattern: "Sliding Window",
        description: "You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array `fruits` where `fruits[i]` is the type of fruit the `i`th tree produces.\n\nYou have two baskets, and each basket can only hold a single type of fruit. You want to pick as much fruit as possible.",
        examples: [
            { input: "fruits = [1,2,1]", output: "3", explanation: "We can pick from all 3 trees." },
            { input: "fruits = [0,1,2,2]", output: "3", explanation: "We can pick from trees [1,2,2]. If we had started at the first tree, we would only pick [0,1]." }
        ],
        constraints: ["1 <= fruits.length <= 10^5", "0 <= fruits[i] < fruits.length"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int totalFruit(int[] fruits) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Google", "Amazon"]
    },
    {
        title: "Subarray Sum Equals K",
        difficulty: "Medium",
        pattern: "Sliding Window", // Often solved with Prefix Sum + Hashmap, but can be framed as window in positive-only, though standard algo is hashmap. Included as requested.
        description: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
        examples: [
            { input: "nums = [1,1,1], k = 2", output: "2" },
            { input: "nums = [1,2,3], k = 3", output: "2" }
        ],
        constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int subarraySum(int[] nums, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Facebook", "Amazon", "Google"]
    },
    {
        title: "Longest Subarray of 1s After Deleting One Element",
        difficulty: "Medium",
        pattern: "Sliding Window",
        description: "Given a binary array `nums`, you should delete one element from it.\n\nReturn the size of the longest non-empty subarray containing only 1's in the resulting array. Return 0 if there is no such subarray.",
        examples: [
            { input: "nums = [1,1,0,1]", output: "3", explanation: "After deleting the number in position 2, [1,1,1] contains 3 numbers with value 1's." }
        ],
        constraints: ["1 <= nums.length <= 10^5", "nums[i] is either 0 or 1."],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int longestSubarray(int[] nums) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Yandex"]
    },
    {
        title: "Max Consecutive Ones III",
        difficulty: "Medium",
        pattern: "Sliding Window",
        description: "Given a binary array `nums` and an integer `k`, return the maximum number of consecutive 1's in the array if you can flip at most `k` 0's.",
        examples: [
            { input: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2", output: "6", explanation: "[1,1,1,0,0,1,1,1,1,1,1]" }
        ],
        constraints: ["1 <= nums.length <= 10^5", "nums[i] is either 0 or 1.", "0 <= k <= nums.length"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int longestOnes(int[] nums, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Facebook", "Microsoft", "Google"]
    },

    // --- HARD (6) ---
    {
        title: "Minimum Window Substring",
        difficulty: "Hard",
        pattern: "Sliding Window",
        description: "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".",
        examples: [
            { input: "s = \"ADOBECODEBANC\", t = \"ABC\"", output: "\"BANC\"", explanation: "The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t." }
        ],
        constraints: ["m == s.length", "n == t.length", "1 <= m, n <= 10^5"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public String minWindow(String s, String t) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Facebook", "LinkedIn", "Airbnb"]
    },
    {
        title: "Sliding Window Maximum",
        difficulty: "Hard",
        pattern: "Sliding Window",
        description: "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.",
        examples: [
            { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" }
        ],
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= nums.length"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Amazon", "Google", "Microsoft"]
    },
    {
        title: "Subarrays with K Different Integers",
        difficulty: "Hard",
        pattern: "Sliding Window",
        description: "Given an integer array `nums` and an integer `k`, return the number of good subarrays of `nums`.\n\nA good subarray is a subarray where the number of different integers in that subarray is exactly `k`.",
        examples: [
            { input: "nums = [1,2,1,2,3], k = 2", output: "7", explanation: "Subarrays formed with exactly 2 different integers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]" }
        ],
        constraints: ["1 <= nums.length <= 2 * 10^4", "1 <= nums[i], k <= nums.length"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int subarraysWithKDistinct(int[] nums, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Amazon"]
    },
    {
        title: "Longest Substring with At Most K Distinct Characters",
        difficulty: "Hard", // Originally Medium on LeetCode Premium, but listed as Hard in request/context often. Marking Hard as requested.
        pattern: "Sliding Window",
        description: "Given a string `s` and an integer `k`, return the length of the longest substring of `s` that contains at most `k` distinct characters.",
        examples: [
            { input: "s = \"eceba\", k = 2", output: "3", explanation: "The substring is \"ece\" with length 3." }
        ],
        constraints: ["1 <= s.length <= 5 * 10^4", "0 <= k <= 50"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int lengthOfLongestSubstringKDistinct(String s, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Google", "Facebook"]
    },
    {
        title: "Minimum Number of K Consecutive Bit Flips",
        difficulty: "Hard",
        pattern: "Sliding Window",
        description: "You are given a binary array `nums` and an integer `k`.\n\nA k-bit flip is choosing a subarray of length `k` from `nums` and simultaneously changing every 0 in the subarray to 1, and every 1 in the subarray to 0.\n\nReturn the minimum number of k-bit flips required so that there is no 0 in the array. If it is not possible, return -1.",
        examples: [
            { input: "nums = [0,1,0], k = 1", output: "2", explanation: "Flip nums[0], then flip nums[2]." }
        ],
        constraints: ["1 <= nums.length <= 10^5", "1 <= k <= nums.length"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int minKBitFlips(int[] nums, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Google"]
    },
    {
        title: "Shortest Subarray with Sum at Least K",
        difficulty: "Hard",
        pattern: "Sliding Window",
        description: "Given an integer array `nums` and an integer `k`, return the length of the shortest non-empty subarray of `nums` with a sum of at least `k`. If there is no such subarray, return -1.",
        examples: [
            { input: "nums = [2,-1,2], k = 3", output: "3" }
        ],
        constraints: ["1 <= nums.length <= 10^5", "-10^5 <= nums[i] <= 10^5", "1 <= k <= 10^9"],
        starterCode: [
            { language: "java", code: "class Solution {\n    public int shortestSubarray(int[] nums, int k) {\n        // Write your code here\n    }\n}" }
        ],
        companies: ["Goldman Sachs", "Google"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Fetch all companies to map names to IDs
        const companies = await Company.find({});
        const companyMap = new Map(companies.map(c => [c.name, c._id]));

        // Delete existing Sliding Window problems
        await CodingProblem.deleteMany({ pattern: "Sliding Window" });

        const problemsWithSlugs = problems.map(problem => {
            const slug = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            // Map company names to IDs
            const companyIds = (problem.companies || []).map(name => companyMap.get(name)).filter(id => id);

            // Extract function name from Java code
            const javaCode = problem.starterCode.find(c => c.language === 'java')?.code || '';
            // Match "public ReturnType functionName(" handling generics and arrays
            const functionNameMatch = javaCode.match(/public\s+(?:[\w<>\[\]]+\s+)+(\w+)\s*\(/);
            const derivedFunctionName = functionNameMatch ? functionNameMatch[1] : 'solve';

            const existingDriverCode = problem.driverCode || {};

            return {
                ...problem,
                slug,
                companies: companyIds,
                constraints: (problem.constraints || []).join('\n'),
                driverCode: {
                    ...existingDriverCode,
                    functionName: existingDriverCode.functionName || derivedFunctionName
                }
            };
        });

        // Delete existing problems with these slugs to avoid duplicates
        const slugs = problemsWithSlugs.map(p => p.slug);
        await CodingProblem.deleteMany({ slug: { $in: slugs } });

        await CodingProblem.insertMany(problemsWithSlugs);
        console.log('Sliding Window Problems Seeded!');
        process.exit();
    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error('Validation Error Details:');
            Object.keys(err.errors).forEach(key => {
                console.error(`- ${key}: ${err.errors[key].message}`);
            });
        } else {
            console.error(err);
        }
        process.exit(1);
    }
};

seedDB();
