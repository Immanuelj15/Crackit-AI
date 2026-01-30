const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');
const Question = require('./models/Question');
const Topic = require('./models/Topic');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const companies = [
    // ==========================================
    // 1. TOP TIER PRODUCT COMPANIES
    // ==========================================
    {
        name: 'Amazon',
        description: 'Amazon is a global technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        hiringPattern: '## Amazon Hiring Process\n\n1. **Online Assessment:** Debugging, Coding (2 Qs), Work Style Assessment.\n2. **Technical Rounds:** 2 Rounds testing DSA & Problem Solving.\n3. **Bar Raiser:** Tough technical probe + behavioral pressure test.\n4. **Managerial Round:** Focus on Leadership Principles.',
        rounds: [
            { name: 'Online Coding Test (DSA)', description: 'Debugging + 2 Coding Questions + Work Style Assessment' },
            { name: 'Technical Interview – 1', description: 'DSA (Trees, Graphs, DP) + Leadership Principles' },
            { name: 'Technical Interview – 2', description: 'System Design / LLD + Leadership Principles' },
            { name: 'HR / Managerial Round', description: 'Behavioral questions based on LP' }
        ]
    },
    {
        name: 'Bosch',
        description: 'Bosch is a leading global supplier of technology and services, focusing on Mobility Solutions, Industrial Technology, and Energy.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-logo.svg/2560px-Bosch-logo.svg.png',
        hiringPattern: '## Bosch Hiring Process\n\n1. **Aptitude + Technical Test:** MCQ based test.\n2. **Technical Interview:** Core Engineering concepts + Project discussion.\n3. **HR Interview:** Behavioral fitment.',
        rounds: [
            { name: 'Aptitude + Technical Test', description: '60 mins MCQ (Quant, Logical, Technical Core)' },
            { name: 'Technical Interview', description: 'Deep dive into projects and core subjects' },
            { name: 'HR Interview', description: 'General behavioral discussion' }
        ]
    },
    {
        name: 'Cadence',
        description: 'Cadence is a pivotal leader in electronic design and computational software, impacting intelligent system design.',
        logoUrl: '/logos/cadence.png',
        hiringPattern: '## Cadence Hiring Process\n\n1. **Aptitude + Coding Test:** Written assessment.\n2. **Technical Interview:** Core CS/Electronics fundamentals.\n3. **HR Interview:** Personality and career goals.',
        rounds: [
            { name: 'Aptitude + Coding Test', description: 'Aptitude, C/C++, Digital Logic' },
            { name: 'Technical Interview', description: 'Deep dive into specialized topics' },
            { name: 'HR Interview', description: 'General fitment' }
        ]
    },
    {
        name: 'BitGo',
        description: 'BitGo provides institutional-grade cryptocurrency security and custody solutions.',
        logoUrl: '/logos/bitgo.png',
        hiringPattern: '## BitGo Hiring Process\n\n1. **Coding Test:** Algorithm focus.\n2. **Technical Interview:** Live coding and debugging.\n3. **HR Interview:** Culture fit.',
        rounds: [
            { name: 'Coding Test', description: 'DSA and Problem solving' },
            { name: 'Technical Interview', description: 'Live coding and debugging' },
            { name: 'HR Interview', description: 'Alignment with values' }
        ]
    },

    // ==========================================
    // 2. TIER-2 / SERVICE / MID-PRODUCT COMPANIES
    // ==========================================
    {
        name: 'TCS',
        description: 'Tata Consultancy Services is an IT services, consulting, and business solutions organization.',
        logoUrl: '/logos/tcs.png',
        hiringPattern: '## TCS Hiring Process\n\n1. **Aptitude Test:** NQT (National Qualifier Test).\n2. **Technical Interview:** Basics of coding and projects.\n3. **HR Interview:** Willingness to relocate, bond etc.',
        rounds: [
            { name: 'Aptitude Test', description: 'Quant, Verbal, Reasoning' },
            { name: 'Technical Interview', description: 'Basics of C/Java/Python' },
            { name: 'HR Interview', description: 'General behavioral questions' }
        ]
    },
    {
        name: 'Infosys',
        description: 'Infosys is a global leader in next-generation digital services and consulting.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
        hiringPattern: '## Infosys Hiring Process\n\n1. **Aptitude Test:** Logical and Verbal ability.\n2. **Coding Round:** Pseudocode and puzzles.\n3. **Technical Interview:** Database, OOPs concepts.\n4. **HR Interview:** Communication skills.',
        rounds: [
            { name: 'Aptitude Test', description: 'Mathematical and Logical reasoning' },
            { name: 'Coding Round', description: 'Basic programming problems' },
            { name: 'Technical Interview', description: 'Subject knowledge check' },
            { name: 'HR Interview', description: 'Soft skills assessment' }
        ]
    },
    {
        name: 'Wipro',
        description: 'Wipro Limited is a leading technology services and consulting company.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
        hiringPattern: '## Wipro Hiring Process\n\n1. **Aptitude Test:** General ability.\n2. **Technical Interview:** Project discussion.\n3. **HR Interview:** General fit.',
        rounds: [
            { name: 'Aptitude Test', description: 'Online assessment' },
            { name: 'Technical Interview', description: 'Technical basics' },
            { name: 'HR Interview', description: 'Behavioral check' }
        ]
    },
    {
        name: 'Accenture',
        description: 'Accenture is a leading global professional services company, providing a broad range of services and solutions.',
        logoUrl: '/logos/accenture.png',
        hiringPattern: '## Accenture Hiring Process\n\n1. **Aptitude + Logical Reasoning:** Cognitive assessment.\n2. **Technical Interview:** Coding and Communication.\n3. **HR Interview:** Culture fit.',
        rounds: [
            { name: 'Aptitude + Logical Reasoning', description: 'Cognitive and Technical assessment' },
            { name: 'Technical Interview', description: 'Project and Coding basics' },
            { name: 'HR Interview', description: 'Organizational fit' }
        ]
    },
    {
        name: 'Cognizant',
        description: 'Cognizant is an American multinational information technology services and consulting company.',
        logoUrl: '/logos/cognizant.png',
        hiringPattern: '## Cognizant Hiring Process\n\n1. **Aptitude + Coding Test:** GenC / GenC Next assessment.\n2. **Technical Interview:** OOPs, DBMS, SQL.\n3. **HR Interview:** Communication check.',
        rounds: [
            { name: 'Aptitude + Coding Test', description: 'Analysis and Automata' },
            { name: 'Technical Interview', description: 'Tech stack discussion' },
            { name: 'HR Interview', description: 'Final selection' }
        ]
    },
    {
        name: 'Hexaware',
        description: 'Hexaware is a global technology and business process services company.',
        logoUrl: '/logos/hexaware.png',
        hiringPattern: '## Hexaware Hiring Process\n\n1. **Aptitude Test:** General ability.\n2. **Technical Interview:** Domain knowledge.\n3. **HR Interview:** Communication.',
        rounds: [
            { name: 'Aptitude Test', description: 'Online aptitude test' },
            { name: 'Technical Interview', description: 'Subject matter expertise' },
            { name: 'HR Interview', description: 'Soft skills' }
        ]
    },
    {
        name: 'HBS',
        description: 'Hinduja Business Solutions (HGS) provides business process management and digital transformation solutions.',
        logoUrl: 'https://companieslogo.com/img/orig/HGS.NS-82e79601.png',
        hiringPattern: '## HBS Hiring Process\n\n1. **Aptitude Test:** Basic screening.\n2. **Technical / Voice Test:** Role dependent.\n3. **HR Interview:** Final check.',
        rounds: [
            { name: 'Aptitude Test', description: 'Screening test' },
            { name: 'Technical / Voice Test', description: 'Process capability' },
            { name: 'HR Interview', description: 'Onboarding discussion' }
        ]
    },
    {
        name: 'Comcast',
        description: 'Comcast Corporation is a global media and technology company.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Comcast_Logo.svg/1200px-Comcast_Logo.svg.png',
        hiringPattern: '## Comcast Hiring Process\n\n1. **Aptitude + Coding Test:** Initial screening.\n2. **Technical Interview:** In-depth tech discussion.\n3. **HR Interview:** Culture fit.',
        rounds: [
            { name: 'Aptitude + Coding Test', description: 'Online assessment' },
            { name: 'Technical Interview', description: 'Programming and Logic' },
            { name: 'HR Interview', description: 'Behavioral' }
        ]
    },
    {
        name: 'Turing',
        description: 'Turing is an AI-powered technology company for remote developers.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Turing_Inc._Logo.jpg',
        hiringPattern: '## Turing Hiring Process\n\n1. **Coding Test:** Algorithmic challenge.\n2. **Technical Interview:** Live coding.\n3. **Client / HR Interview:** Final placement.',
        rounds: [
            { name: 'Coding Test', description: 'High level coding' },
            { name: 'Technical Interview', description: 'Stack specific' },
            { name: 'Client / HR Interview', description: 'Matching' }
        ]
    },

    // ==========================================
    // 3. CORE / MANUFACTURING / DOMAIN COMPANIES
    // ==========================================
    {
        name: 'Caterpillar',
        description: 'Caterpillar Inc. is the world\'s leading manufacturer of construction and mining equipment.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Caterpillar_logo.svg',
        hiringPattern: '## Caterpillar Hiring Process\n\n1. **Aptitude Test:** Analytical ability.\n2. **Technical Interview:** Core Engineering concepts.\n3. **HR Interview:** Cultural fitment.',
        rounds: [
            { name: 'Aptitude Test', description: 'Online test' },
            { name: 'Technical Interview', description: 'Engineering basics' },
            { name: 'HR Interview', description: 'Behavioral' }
        ]
    },
    {
        name: 'Renault-Nissan',
        description: 'Renault-Nissan-Mitsubishi Alliance is a French-Japanese strategic partnership.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Renault-Nissan-Mitsubishi_Alliance_logo.svg',
        hiringPattern: '## Renault-Nissan Hiring Process\n\n1. **Aptitude Test:** Mental ability.\n2. **Technical Interview:** Automotive/Mech/Elec concepts.\n3. **HR Interview:** General.',
        rounds: [
            { name: 'Aptitude Test', description: 'Screening' },
            { name: 'Technical Interview', description: 'Core domain' },
            { name: 'HR Interview', description: 'HR' }
        ]
    },
    {
        name: 'SPIC',
        description: 'Southern Petrochemical Industries Corporation Limited (SPIC) is one of India\'s leading fertilizer companies.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/SPIC_logo.svg',
        hiringPattern: '## SPIC Hiring Process\n\n1. **Aptitude Test:** General.\n2. **Technical Interview:** Chemical/Mechanical basics.\n3. **HR Interview:** Final.',
        rounds: [
            { name: 'Aptitude Test', description: 'Assessment' },
            { name: 'Technical Interview', description: 'Subject knowledge' },
            { name: 'HR Interview', description: 'HR' }
        ]
    },

    // ==========================================
    // 4. STARTUP / SME / SOFTWARE COMPANIES
    // ==========================================
    {
        name: 'Zoho',
        description: 'Zoho Corporation provides SaaS applications and productivity tools.',
        logoUrl: '/logos/zoho.png',
        hiringPattern: '## Zoho Hiring Process\n\n1. **Aptitude Test:** Logic and Puzzles.\n2. **Coding Round:** C/Java Programming (No inbuilt functions).\n3. **Technical Interview 1:** Advanced Coding.\n4. **Technical Interview 2:** System Design.\n5. **HR Interview:** Fitment.',
        rounds: [
            { name: 'Aptitude Test', description: 'Logical reasoning' },
            { name: 'Coding Round', description: 'Basic programming' },
            { name: 'Technical Interview – 1', description: 'Advanced programming' },
            { name: 'Technical Interview – 2', description: 'Design discussion' },
            { name: 'HR Interview', description: 'Culture fit' }
        ]
    },
    {
        name: 'Freshworks',
        description: 'Freshworks provides cloud-based customer engagement software.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Freshworks-vector-logo.svg',
        hiringPattern: '## Freshworks Hiring Process\n\n1. **Aptitude Test:** General.\n2. **Coding Round:** DSA.\n3. **Technical Interview:** Problem Solving.\n4. **HR Interview:** Fitment.',
        rounds: [
            { name: 'Aptitude Test', description: 'Screening' },
            { name: 'Coding Round', description: 'Algorithmic problems' },
            { name: 'Technical Interview', description: 'Tech discussion' },
            { name: 'HR Interview', description: 'Behavioral' }
        ]
    },
    {
        name: 'Mistral',
        description: 'Mistral Solutions is a technology design and systems engineering company.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/High_res_Mistral_logo.png',
        hiringPattern: '## Mistral Hiring Process\n\n1. **Aptitude Test:** General.\n2. **Technical Interview:** Embedded/Software basics.\n3. **HR Interview:** Final.',
        rounds: [
            { name: 'Aptitude Test', description: 'Assessment' },
            { name: 'Technical Interview', description: 'Technical' },
            { name: 'HR Interview', description: 'HR' }
        ]
    },
    {
        name: 'VThink',
        description: 'VThink provides specialized software solutions and digital transformation services.',
        logoUrl: 'https://placehold.co/400x150?text=VThink',
        hiringPattern: '## VThink Hiring Process\n\n1. **Aptitude Test:** General.\n2. **Technical Interview:** Project and Logic.\n3. **HR Interview:** Final.',
        rounds: [
            { name: 'Aptitude Test', description: 'General aptitude' },
            { name: 'Technical Interview', description: 'Tech discussion' },
            { name: 'HR Interview', description: 'HR' }
        ]
    }
];

const importData = async () => {
    try {
        await Company.deleteMany();
        await Question.deleteMany();
        await Topic.deleteMany();

        console.log('Data Destroyed...');
        console.log(`Inserting ${companies.length} companies...`);

        const createdCompanies = await Company.insertMany(companies);

        // ==========================================
        // TOPICS SEEDING (IndiaBIX Style)
        // ==========================================
        const topics = [
            // Quant
            {
                category: 'quant',
                name: 'Percentage',
                description: 'Concept of part per hundred, fractions to percentages, percentage increase/decrease.',
                content: '# Percentage\n\nA percentage is a number or ratio expressed as a fraction of 100. It is often denoted using the percent sign, "%".\n\n## Key Formulas\n- **X% of Y** = (X/100) * Y\n- **Percentage Change** = ((New Value - Old Value) / Old Value) * 100\n- **Fraction to Percentage** = Fraction * 100',
                examples: [
                    {
                        question: 'What is 20% of 500?',
                        solution: '**Step 1:** Identify the values.\n- Percentage = 20%\n- Total = 500\n\n**Step 2:** Apply the formula (X/100) * Y.\n- (20 / 100) * 500\n\n**Step 3:** Calculate.\n- 0.2 * 500 = 100.\n\n**Answer:** 100',
                        difficulty: 'easy'
                    },
                    {
                        question: 'If 50 is increased by 10%, what is the new number?',
                        solution: '**Step 1:** Find 10% of 50.\n- (10 / 100) * 50 = 5.\n\n**Step 2:** Add the result to the original number.\n- 50 + 5 = 55.\n\n**Answer:** 55',
                        difficulty: 'easy'
                    }
                ]
            },
            {
                category: 'quant',
                name: 'Time and Work',
                description: 'Relationship between work done, time taken, and number of workers.',
                content: '# Time and Work\n\nThe basic concept is that **Work = Rate * Time**.\n\n## Key Concepts\n- If A can do a piece of work in **n days**, then A\'s 1 day\'s work = **1/n**.\n- If A is twice as good a workman as B, then ratio of work done by A and B = **2:1**.',
                examples: [
                    {
                        question: 'A can do a work in 5 days, B in 10 days. How many days if they work together?',
                        solution: '**Step 1:** Calculate A\'s 1 day work.\n- 1 / 5\n\n**Step 2:** Calculate B\'s 1 day work.\n- 1 / 10\n\n**Step 3:** Add them together.\n- 1/5 + 1/10 = 2/10 + 1/10 = 3/10\n\n**Step 4:** Invert to find total days.\n- 10 / 3 = 3.33 days.\n\n**Answer:** 3.33 days',
                        difficulty: 'medium'
                    }
                ]
            },
            {
                category: 'quant',
                name: 'Problems on Trains',
                description: 'Speed, distance, and time calculations involving trains relative to platforms or other moving objects.',
                content: '# Problems on Trains\n\nBasic relative speed concepts.\n\n## Key Formulas\n- km/hr to m/s conversion: x * 5/18\n- m/s to km/hr conversion: x * 18/5',
                examples: []
            },
            {
                category: 'quant',
                name: 'Profit and Loss',
                description: 'Concepts of Cost Price (CP), Selling Price (SP), Profit, Loss, and Discount.',
                content: '# Profit and Loss\n\n- **Profit** = SP - CP\n- **Loss** = CP - SP\n- **Profit %** = (Profit/CP) * 100\n- **Loss %** = (Loss/CP) * 100',
                examples: []
            },
            {
                category: 'quant',
                name: 'Simplification',
                description: 'Solving complex mathematical expressions using BODMAS rules.',
                content: '# Simplification\n\nSimplification involves reducing a complex expression into a simpler form using the BODMAS rule.\n\n## BODMAS Rule\n- **B** - Brackets ((), {}, [])\n- **O** - Orders (Powers, Roots)\n- **D** - Division\n- **M** - Multiplication\n- **A** - Addition\n- **S** - Subtraction\n\nAlways perform operations in this order to get the correct result.',
                examples: [
                    { question: 'Simplify: 10 + 2 * 3', solution: '10 + (2 * 3) = 10 + 6 = 16', difficulty: 'easy' }
                ]
            },

            // Logical
            {
                category: 'logical',
                name: 'Number Series',
                description: 'Identifying patterns in a sequence of numbers to find missing or wrong terms.',
                content: '# Number Series\n\nFind the pattern in the sequence. Common patterns include:\n- Arithmetic progression (+d)\n- Geometric progression (*r)\n- Squares/Cubes\n- Mixed operations',
                examples: []
            },
            {
                category: 'logical',
                name: 'Blood Relations',
                description: 'Analyzing family relationships based on given information.',
                content: '# Blood Relations\n\nUnderstanding family tree structures.\n\n## Tips\n- Use a generation tree diagram.\n- Circles for females, squares for males.',
                examples: []
            },
            {
                category: 'logical',
                name: 'Coding Decoding',
                description: 'Deciphering patterns in words or numbers based on specific rules.',
                content: '# Coding Decoding\n\nLook for shifts in alphabet positions (A=1, B=2...), reverse orders, or substitutions.',
                examples: []
            },
            {
                category: 'logical',
                name: 'Syllogism',
                description: 'Deductive reasoning where a conclusion is drawn from two or more premises.',
                content: '# Syllogism\n\nSyllogism questions test logical deduction.\n\n## Venn Diagrams\nUse Venn diagrams to verify statements.\n- "All A are B" -> Circle A inside Circle B.\n- "Some A are B" -> Circle A intersects Circle B.\n- "No A is B" -> Disjoint circles.',
                examples: [
                    { question: 'Statements: All cats are dogs. All dogs are birds.\nConclusion: All cats are birds.', solution: 'True. A inside B, B inside C => A inside C.', difficulty: 'medium' }
                ]
            },

            // Verbal
            {
                category: 'verbal',
                name: 'Synonyms and Antonyms',
                description: 'Testing vocabulary strength by identifying words with similar or opposite meanings.',
                content: '# Synonyms and Antonyms\n\nRead widely to improve vocabulary. Pay attention to context as words can have multiple meanings.',
                examples: []
            },
            {
                category: 'verbal',
                name: 'Sentence Correction',
                description: 'Identifying and correcting grammatical errors in sentences.',
                content: '# Sentence Correction\n\nCheck for:\n- Subject-Verb Agreement\n- Tense Consistency\n- Preposition usage\n- Redundancy',
                examples: []
            },
            {
                category: 'verbal',
                name: 'Reading Comprehension',
                description: 'Analyze a passage and answer questions based on it.',
                content: '# Reading Comprehension\n\nRead the passage carefully and answer based ONLY on the provided text.\n\n## Strategy\n1. Read the questions first to know what to look for.\n2. Skim the passage for keywords.\n3. Eliminate obviously wrong options.',
                examples: []
            },
            // NEW QUANT TOPICS
            { category: 'quant', name: 'Simple Interest', description: 'Calculation of interest on the principal amount.', content: '# Simple Interest\nSI = (P * R * T) / 100', examples: [] },
            { category: 'quant', name: 'Compound Interest', description: 'Interest calculated on the initial principal and also on the accumulated interest.', content: '# Compound Interest\nA = P(1 + R/100)^t', examples: [] },
            { category: 'quant', name: 'Ratio and Proportion', description: 'Comparison of two quantities.', content: '# Ratio\n\nA:B = A/B', examples: [] },
            { category: 'quant', name: 'Time, Speed and Distance', description: 'Relation between speed, distance and time.', content: '# Speed\nSpeed = Distance / Time', examples: [] },
            { category: 'quant', name: 'Averages', description: 'Mean value of a group of numbers.', content: '# Average\nSum of elements / Number of elements', examples: [] },
            { category: 'quant', name: 'Number System', description: 'Properties of numbers, divisibility, etc.', content: '# Number System\n\n- Integers, Prime numbers, Divisibility rules.', examples: [] },
            { category: 'quant', name: 'Permutation and Combination', description: 'Arrangements and Selections.', content: '# Permutation vs Combination\n\n- Permutation: Order matters (nPr)\n- Combination: Order does not matter (nCr)', examples: [] },
            { category: 'quant', name: 'Probability', description: 'Likelihood of an event occurring.', content: '# Probability\n\nP(E) = Fav Outcomes / Total Outcomes', examples: [] },

            // NEW LOGICAL TOPICS
            { category: 'logical', name: 'Direction Sense', description: 'Questions based on directions (North, South, East, West).', content: '# Directions\n\nStandard map directions: N, S, E, W.', examples: [] },
            { category: 'logical', name: 'Seating Arrangement', description: 'Arranging people or objects based on conditions.', content: '# Seating\n- Linear\n- Circular', examples: [] },
            { category: 'logical', name: 'Puzzles', description: 'Complex data arrangement problems.', content: '# Puzzles\nRead all constraints carefully and form a table.', examples: [] },
            { category: 'logical', name: 'Analogies', description: 'Finding relationships between word or number pairs.', content: '# Analogies\nA : B :: C : D', examples: [] },
            { category: 'logical', name: 'Data Sufficiency', description: 'Determining if given data is sufficient to answer a question.', content: '# Data Sufficiency\nCheck if Statement I alone is sufficient, or II alone, or both.', examples: [] },

            // NEW VERBAL TOPICS
            { category: 'verbal', name: 'Error Spotting', description: 'Finding grammatical errors in sentences.', content: '# Error Spotting\nCheck grammar rules.', examples: [] },
            { category: 'verbal', name: 'Para Jumbles', description: 'Rearranging sentences to form a coherent paragraph.', content: '# Para Jumbles\nFind the opening sentence first.', examples: [] },
            { category: 'verbal', name: 'Fill in the Blanks', description: 'Choosing the correct word to complete a sentence.', content: '# Fill in the Blanks\nContext is key.', examples: [] },
            { category: 'verbal', name: 'One Word Substitution', description: 'Replacing a phrase with a single word.', content: '# One Word Substitution\nExpand vocabulary.', examples: [] }
        ];

        const createdTopics = await Topic.insertMany(topics);
        const getTopicId = (name) => createdTopics.find(t => t.name === name)?._id;

        // ==========================================
        // QUESTIONS SEEDING (IndiaBIX Data)
        // ==========================================

        let allQuestions = [];

        // 1. TOPIC: Percentage
        const percentageQuestions = [
            { t: 'Percentage', q: 'Two students appeared at an examination. One of them secured 9 marks more than the other and his marks was 56% of the sum of their marks. The marks obtained by them are:', o: ['39, 30', '41, 32', '42, 33', '43, 34'], a: '42, 33', d: 'medium' },
            { t: 'Percentage', q: 'A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had:', o: ['588 apples', '600 apples', '672 apples', '700 apples'], a: '700 apples', d: 'easy' },
            { t: 'Percentage', q: 'What percentage of numbers from 1 to 70 have 1 or 9 in the unit\'s digit?', o: ['1', '14', '20', '21'], a: '20', d: 'medium' },
            { t: 'Percentage', q: 'If 20% of a = b, then b% of 20 is the same as:', o: ['4% of a', '5% of a', '20% of a', 'None of these'], a: '4% of a', d: 'hard' },
            { t: 'Percentage', q: 'In a certain school, 20% of students are below 8 years of age. The number of students above 8 years of age is 2/3 of the number of students of 8 years of age which is 48. What is the total number of students in the school?', o: ['72', '80', '120', '100'], a: '100', d: 'hard' },
            { t: 'Percentage', q: 'What is 15% of 80?', o: ['10', '12', '14', '16'], a: '12', d: 'easy' },
            { t: 'Percentage', q: 'A batsman scored 110 runs which included 3 boundaries and 8 sixes. What percent of his total score did he make by running between the wickets?', o: ['45%', '45.45%', '54.54%', '55%'], a: '45.45%', d: 'medium' }
        ];

        // 2. TOPIC: Time and Work
        const timeAndWorkQuestions = [
            { t: 'Time and Work', q: 'A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is:', o: ['1/4', '1/10', '7/15', '8/15'], a: '8/15', d: 'medium' },
            { t: 'Time and Work', q: 'A can lay railway track between two given stations in 16 days and B can do the same job in 12 days. With help of C, they did the job in 4 days only. Then, C alone can do the job in:', o: ['9 1/5 days', '9 2/5 days', '9 3/5 days', '10 days'], a: '9 3/5 days', d: 'hard' },
            { t: 'Time and Work', q: 'A, B and C can do a piece of work in 20, 30 and 60 days respectively. In how many days can A do the work if he is assisted by B and C on every third day?', o: ['12 days', '15 days', '16 days', '18 days'], a: '15 days', d: 'medium' },
            { t: 'Time and Work', q: 'A is alone can do a piece of work in 6 days and B alone in 8 days. A and B undertook to do it for Rs. 3200. With the help of C, they completed the work in 3 days. How much is to be paid to C?', o: ['Rs. 375', 'Rs. 400', 'Rs. 600', 'Rs. 800'], a: 'Rs. 400', d: 'medium' },
            { t: 'Time and Work', q: 'If 6 men and 8 boys can do a piece of work in 10 days while 26 men and 48 boys can do the same in 2 days, the time taken by 15 men and 20 boys in doing the same type of work will be:', o: ['4 days', '5 days', '6 days', '7 days'], a: '4 days', d: 'hard' }
        ];

        // 3. TOPIC: Problems on Trains
        const trainQuestions = [
            { t: 'Problems on Trains', q: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?', o: ['120 metres', '180 metres', '324 metres', '150 metres'], a: '150 metres', d: 'medium' },
            { t: 'Problems on Trains', q: 'A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:', o: ['45 km/hr', '50 km/hr', '54 km/hr', '55 km/hr'], a: '50 km/hr', d: 'medium' },
            { t: 'Problems on Trains', q: 'The length of the bridge, which a train 130 metres long and travelling at 45 km/hr can cross in 30 seconds, is:', o: ['200 m', '225 m', '245 m', '250 m'], a: '245 m', d: 'medium' },
            { t: 'Problems on Trains', q: 'Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. The ratio of their speeds is:', o: ['1:3', '3:2', '3:4', 'None of these'], a: '3:2', d: 'hard' },
            { t: 'Problems on Trains', q: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?', o: ['65 sec', '89 sec', '100 sec', '150 sec'], a: '89 sec', d: 'easy' }
        ];

        // 4. TOPIC: Profit and Loss
        const profitQuestions = [
            { t: 'Profit and Loss', q: 'Alfred buys an old scooter for Rs. 4700 and spends Rs. 800 on its repairs. If he sells the scooter for Rs. 5800, his gain percent is:', o: ['4 4/7%', '5 5/11%', '10%', '12%'], a: '5 5/11%', d: 'easy' },
            { t: 'Profit and Loss', q: 'The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:', o: ['15', '16', '18', '25'], a: '16', d: 'medium' },
            { t: 'Profit and Loss', q: 'If selling price is doubled, the profit triples. Find the profit percent.', o: ['66 2/3%', '100%', '105 1/3%', '120%'], a: '100%', d: 'medium' },
            { t: 'Profit and Loss', q: 'A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?', o: ['3', '4', '5', '6'], a: '5', d: 'hard' }
        ];

        // 5. TOPIC: Number Series
        const seriesQuestions = [
            { t: 'Number Series', q: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?', o: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'], a: '(1/8)', d: 'easy' },
            { t: 'Number Series', q: '7, 10, 8, 11, 9, 12, ... What number should come next?', o: ['7', '10', '12', '13'], a: '10', d: 'easy' },
            { t: 'Number Series', q: '36, 34, 30, 28, 24, ... What number should come next?', o: ['20', '22', '23', '26'], a: '22', d: 'medium' },
            { t: 'Number Series', q: '22, 21, 23, 22, 24, 23, ... What number should come next?', o: ['22', '24', '25', '26'], a: '25', d: 'medium' },
            { t: 'Number Series', q: '53, 53, 40, 40, 27, 27, ... What number should come next?', o: ['12', '14', '27', '53'], a: '14', d: 'medium' }
        ];

        // 6. TOPIC: Blood Relations
        const bloodQuestions = [
            { t: 'Blood Relations', q: 'Pointing to a photograph of a boy Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?', o: ['Brother', 'Uncle', 'Cousin', 'Father'], a: 'Father', d: 'easy' },
            { t: 'Blood Relations', q: 'If A + B means A is the mother of B; A - B means A is the brother B; A % B means A is the father of B and A x B means A is the sister of B, which of the following shows that P is the maternal uncle of Q?', o: ['Q - N + M x P', 'P + S x N - Q', 'P - M + N x Q', 'Q - S % P'], a: 'P - M + N x Q', d: 'hard' },
            { t: 'Blood Relations', q: 'If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?', o: ['Brother', 'Sister', 'Nephew', 'Cannot be determined'], a: 'Cannot be determined', d: 'medium' }
        ];

        // 7. TOPIC: Coding Decoding
        const codingQuestions = [
            { t: 'Coding Decoding', q: 'In a certain code language, "134" means "good and tasty"; "478" means "see good pictures" and "729" means "pictures are faint". Which of the following digits stands for "see"?', o: ['9', '2', '1', '8'], a: '8', d: 'medium' },
            { t: 'Coding Decoding', q: 'If TAP is coded as SZO, then how is FREEZE coded?', o: ['EQDDYD', 'ESDDYD', 'EQDDZE', 'ESDXZD'], a: 'EQDDYD', d: 'easy' }
        ];

        // 8. TOPIC: Synonyms
        const verbalQuestions = [
            { t: 'Synonyms and Antonyms', q: 'Synonym of: CANDID', o: ['Apparent', 'Explicit', 'Frank', 'Bright'], a: 'Frank', d: 'easy' },
            { t: 'Synonyms and Antonyms', q: 'Synonym of: CORPULENT', o: ['Lean', 'Gaunt', 'Emaciated', 'Obese'], a: 'Obese', d: 'hard' },
            { t: 'Synonyms and Antonyms', q: 'Antonym of: ARTIFICIAL', o: ['Red', 'Natural', 'Truthful', 'Solid'], a: 'Natural', d: 'easy' },
            { t: 'Synonyms and Antonyms', q: 'Antonym of: MINUSCULE', o: ['Impressive', 'Minute', 'Massive', 'Tiny'], a: 'Massive', d: 'medium' }
        ];

        // 9. TOPIC: Sentence Correction
        const sentenceQuestions = [
            { t: 'Sentence Correction', q: 'She is ...... than her sister.', o: ['Prettiest', 'Prettier', 'More Pretty', 'Most Pretty'], a: 'Prettier', d: 'easy' },
            { t: 'Sentence Correction', q: 'I ...... working here for 5 years.', o: ['Have been', 'Has been', 'Am', 'Was'], a: 'Have been', d: 'medium' }
        ];

        // 10. TOPIC: Simplification
        const simpleQuestions = [
            { t: 'Simplification', q: 'Simplify: 12 + 8 / 4 - 2', o: ['12', '14', '10', '5'], a: '12', d: 'easy' },
            { t: 'Simplification', q: '25% of 400 + 30% of 200 = ?', o: ['150', '160', '180', '140'], a: '160', d: 'medium' },
            { t: 'Simplification', q: '(16)^2 + (5^3) - 100 = ?', o: ['256', '281', '286', '261'], a: '281', d: 'medium' }
        ];

        // 11. TOPIC: Syllogism
        const syllogismQuestions = [
            { t: 'Syllogism', q: 'Statements: Some apples are bananas. All bananas are fruits.\nConclusion: Some apples are fruits.', o: ['True', 'False', 'Either True or False', 'Neither'], a: 'True', d: 'easy' },
            { t: 'Syllogism', q: 'Statements: No car is a bike. Some bikes are trucks.\nConclusion: All trucks are cars is a possibility.', o: ['True', 'False', 'Depends', 'None'], a: 'False', d: 'hard' }
        ];

        // 12. TOPIC: Reading Comprehension
        const rcQuestions = [
            { t: 'Reading Comprehension', q: 'Passage: The rapid pace of technological change requires workers to be adaptable. Lifelong learning is no longer a luxury but a necessity.\n\nQ: What is the main idea?', o: ['Technology moves fast', 'Workers need to learn continuously', 'Technological change is bad', 'Adaptability is a luxury'], a: 'Workers need to learn continuously', d: 'medium' }
        ];

        // NEW QUESTIONS (Expanded)
        const simpleInterestQuestions = [
            { t: 'Simple Interest', q: 'Find the simple interest on Rs. 68,000 at 16 2/3% per annum for 9 months.', o: ['Rs. 8500', 'Rs. 7500', 'Rs. 6500', 'Rs. 9500'], a: 'Rs. 8500', d: 'medium', e: 'SI = P*R*T/100. Time = 9/12 = 3/4 years. Rate = 50/3 %. SI = (68000 * 50/3 * 3/4) / 100 = 8500.' },
            { t: 'Simple Interest', q: 'A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:', o: ['Rs. 650', 'Rs. 690', 'Rs. 698', 'Rs. 700'], a: 'Rs. 698', d: 'medium', e: 'SI for 1 year = 854 - 815 = 39. SI for 3 years = 39*3 = 117. Sum = 815 - 117 = 698.' }
        ];

        const compoundInterestQuestions = [
            { t: 'Compound Interest', q: 'What will be the compound interest on a sum of Rs. 25,000 after 3 years at the rate of 12% p.a.?', o: ['Rs. 10123.20', 'Rs. 10213.20', 'Rs. 10483.20', 'Rs. 9000.30'], a: 'Rs. 10123.20', d: 'hard', e: 'Amount = P(1 + R/100)^n = 25000(1 + 12/100)^3. CI = Amount - P.' },
            { t: 'Compound Interest', q: 'The difference between simple and compound interests compounded annually on a certain sum of money for 2 years at 4% per annum is Re. 1. The sum is:', o: ['Rs. 600', 'Rs. 625', 'Rs. 575', 'Rs. 650'], a: 'Rs. 625', d: 'medium', e: 'Check formula Diff = P(R/100)^2.' }
        ];

        const ratioQuestions = [
            { t: 'Ratio and Proportion', q: 'If A:B = 5:7 and B:C = 6:11, then A:B:C is:', o: ['55:77:66', '30:42:77', '35:49:42', 'None of these'], a: '30:42:77', d: 'easy', e: 'Multiply A:B by 6 and B:C by 7. A:B = 30:42, B:C = 42:77.' },
            { t: 'Ratio and Proportion', q: 'Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new numbers are in the ratio 12:23. The smaller number is:', o: ['27', '33', '49', '55'], a: '33', d: 'medium', e: 'Let numbers be 3x and 5x. (3x-9)/(5x-9) = 12/23. Solve for x.' }
        ];

        const speedQuestions = [
            { t: 'Time, Speed and Distance', q: 'A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour?', o: ['3.6', '7.2', '8.4', '10'], a: '7.2', d: 'easy', e: 'Speed = Dist/Time = 600/(5*60) = 2 m/s. 2 * 18/5 = 7.2 km/hr.' },
            { t: 'Time, Speed and Distance', q: 'Excluding stoppages, the speed of a bus is 54 kmph and including stoppages, it is 45 kmph. For how many minutes does the bus stop per hour?', o: ['9', '10', '12', '20'], a: '10', d: 'hard', e: 'Time taken to cover 9km (54-45) at 54kmph is the stop time. (9/54)*60 minutes.' }
        ];

        const averageQuestions = [
            { t: 'Averages', q: 'The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one weighing 65 kg. What might be the weight of the new person?', o: ['76 kg', '76.5 kg', '85 kg', 'Data inadequate'], a: '85 kg', d: 'medium', e: 'Total increase = 8 * 2.5 = 20kg. New Weight = 65 + 20 = 85.' }
        ];

        const numberSystemQuestions = [
            { t: 'Number System', q: 'The sum of first five prime numbers is:', o: ['11', '18', '26', '28'], a: '28', d: 'easy', e: '2 + 3 + 5 + 7 + 11 = 28.' },
            { t: 'Number System', q: 'Which of the following numbers is divisible by 24?', o: ['35718', '63810', '537804', '3125736'], a: '3125736', d: 'medium', e: 'Number must be divisible by 3 and 8.' }
        ];

        const probabilityQuestions = [
            { t: 'Probability', q: 'In a throw of a coin, the probability of getting a head is:', o: ['1', '1/2', '1/4', '2'], a: '1/2', d: 'easy', e: 'Head or Tail. 1 favorable out of 2.' },
            { t: 'Probability', q: 'Two dice are tossed. The probability that the total score is a prime number is:', o: ['1/6', '5/12', '1/2', '7/9'], a: '5/12', d: 'hard', e: 'Total 36. Primes: 2, 3, 5, 7, 11.' }
        ];

        const permQuestions = [
            { t: 'Permutation and Combination', q: 'In how many different ways can the letters of the word "CORPORATION" be arranged so that the vowels always come together?', o: ['810', '1440', '2880', '50400'], a: '50400', d: 'hard', e: 'Treat vowels (O,O,A,I,O) as 1 unit.' }
        ];

        const directionQuestions = [
            { t: 'Direction Sense', q: 'A man walks 5 km toward south and then turns to the right. After walking 3 km he turns to the left and walks 5 km. Now in which direction is he from the starting place?', o: ['West', 'South', 'North-East', 'South-West'], a: 'South-West', d: 'medium', e: 'Draw the path. He is South-West of origin.' }
        ];

        const seatingQuestions = [
            { t: 'Seating Arrangement', q: 'A, P, R, X, S and Z are sitting in a row. S and Z are in the centre. A and P are at the ends. R is sitting to the left of A. Who is to the right of P?', o: ['A', 'X', 'S', 'Z'], a: 'X', d: 'medium', e: 'Arrangement: P X Z S R A.' }
        ];

        const puzzleQuestions = [
            { t: 'Puzzles', q: 'Five friends P, Q, R, S and T traveled to five different cities. P went to Chennai, Q went to Delhi... (Question truncated for brevity)', o: ['3', '4', '5', 'Data Insufficient'], a: 'Data Insufficient', d: 'hard', e: 'Requires full table construction.' }
        ];

        const analogyQuestions = [
            { t: 'Analogies', q: 'Moon : Satellite :: Earth : ?', o: ['Sun', 'Planet', 'Solar System', 'Asteroid'], a: 'Planet', d: 'easy', e: 'Moon is a satellite, Earth is a planet.' }
        ];

        const dataQuestions = [
            { t: 'Data Sufficiency', q: 'What is the value of x?\nI. x^2 = 4\nII. x > 0', o: ['I alone', 'II alone', 'Both required', 'Neither'], a: 'Both required', d: 'medium', e: 'I gives 2 or -2. II clarifies it is 2.' }
        ];

        const verbalNewQuestions = [
            { t: 'Error Spotting', q: 'Find the error: "The cattle is grazing in the field."', o: ['The cattle', 'is grazing', 'in the field', 'No error'], a: 'is grazing', d: 'medium', e: 'Cattle is plural, should be "are grazing".' },
            { t: 'Para Jumbles', q: 'Arrange: 1. He was tired. 2. He went to bed. 3. He worked hard.', o: ['123', '312', '213', '321'], a: '312', d: 'medium', e: 'Worked hard -> Tired -> Bed.' },
            { t: 'Fill in the Blanks', q: 'He is afraid _____ the dog.', o: ['on', 'of', 'in', 'at'], a: 'of', d: 'easy', e: 'Afraid of.' },
            { t: 'One Word Substitution', q: 'One who knows everything.', o: ['Omnipresent', 'Omnipotent', 'Omniscient', 'Optimist'], a: 'Omniscient', d: 'medium', e: 'Omniscient means all-knowing.' }
        ];

        const seedSet = [
            ...percentageQuestions, ...timeAndWorkQuestions, ...trainQuestions, ...profitQuestions,
            ...simpleInterestQuestions, ...compoundInterestQuestions, ...ratioQuestions, ...speedQuestions,
            ...averageQuestions, ...numberSystemQuestions, ...probabilityQuestions, ...permQuestions,
            ...seriesQuestions, ...bloodQuestions, ...codingQuestions, ...directionQuestions, ...seatingQuestions,
            ...puzzleQuestions, ...analogyQuestions, ...dataQuestions, ...syllogismQuestions,
            ...verbalQuestions, ...sentenceQuestions, ...verbalNewQuestions, ...simpleQuestions, ...rcQuestions
        ];

        // Process seed set
        seedSet.forEach(item => {
            const topicId = getTopicId(item.t);
            if (!topicId) console.log(`Topic missing: ${item.t}`);

            const topic = topics.find(tp => tp.name === item.t);

            if (topic && topicId) {
                allQuestions.push({
                    type: 'aptitude',
                    category: topic.category,
                    topic: topicId,
                    questionText: item.q,
                    options: item.o,
                    correctAnswer: item.a,
                    difficulty: item.d,
                    explanation: item.e // Added Explanation
                });
            }
        });

        // Add some generic company specific ones from before too
        // ==========================================
        // COMPANY SPECIFIC QUESTIONS (Previous Year Patterns)
        // ==========================================

        // Amazon Questions
        const amazon = createdCompanies.find(c => c.name === 'Amazon');
        if (amazon) {
            allQuestions.push(
                { company: amazon._id, type: 'coding', questionText: 'Given an array of integers, find the length of the longest increasing subsequence.', options: [], correctAnswer: 'O(n log n) solution using binary search', difficulty: 'hard' },
                { company: amazon._id, type: 'coding', questionText: 'Design a data structure that supports insert, delete, and getRandom in O(1) time.', options: [], correctAnswer: 'HashMap + ArrayList', difficulty: 'hard' },
                { company: amazon._id, type: 'technical', questionText: 'Explain the difference between Process and Thread. How does context switching work?', options: [], correctAnswer: 'Process is heavier, Thread is lightweight...', difficulty: 'medium' }
            );
        }

        // TCS Questions
        const tcs = createdCompanies.find(c => c.name === 'TCS');
        if (tcs) {
            allQuestions.push(
                { company: tcs._id, type: 'aptitude', questionText: 'What is the unit digit of 7^105?', options: ['1', '3', '7', '9'], correctAnswer: '7', difficulty: 'medium' },
                { company: tcs._id, type: 'aptitude', questionText: 'The average of 5 consecutive odd numbers is 61. What is the difference between the highest and lowest numbers?', options: ['4', '8', '12', '16'], correctAnswer: '8', difficulty: 'easy' },
                { company: tcs._id, type: 'coding', questionText: 'Write a program to check if a year is a leap year or not.', options: [], correctAnswer: '(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)', difficulty: 'easy' }
            );
        }

        // Zoho Questions
        const zoho = createdCompanies.find(c => c.name === 'Zoho');
        if (zoho) {
            allQuestions.push(
                { company: zoho._id, type: 'coding', questionText: 'Write a program to print the pattern:\n1\n2 3\n4 5 6\n7 8 9 10', options: [], correctAnswer: 'Nested loops with counter', difficulty: 'medium' },
                { company: zoho._id, type: 'coding', questionText: 'Given a string, resize it such that characters at odd positions are decreased by 1 and characters at even positions are increased by 1.', options: [], correctAnswer: 'ASCII manipulation', difficulty: 'medium' },
                { company: zoho._id, type: 'technical', questionText: 'Design a Snake and Ladder game using Object Oriented Programming.', options: [], correctAnswer: 'Classes for Board, Player, Dice...', difficulty: 'hard' }
            );
        }

        // Infosys Questions
        const infosys = createdCompanies.find(c => c.name === 'Infosys');
        if (infosys) {
            allQuestions.push(
                { company: infosys._id, type: 'aptitude', questionText: 'A train 120m long is running at 54 km/hr. How much time will it take to pass a pole?', options: ['8 sec', '10 sec', '12 sec', '15 sec'], correctAnswer: '8 sec', difficulty: 'easy' },
                { company: infosys._id, type: 'coding', questionText: 'Write a program to reverse a string without using built-in functions.', options: [], correctAnswer: 'Iterative swap from ends', difficulty: 'easy' },
                { company: infosys._id, type: 'technical', questionText: 'What is the difference between TRUNCATE and DELETE in SQL?', options: [], correctAnswer: 'TRUNCATE is DDL, DELETE is DML. TRUNCATE is faster.', difficulty: 'medium' }
            );
        }

        // Wipro Questions
        const wipro = createdCompanies.find(c => c.name === 'Wipro');
        if (wipro) {
            allQuestions.push(
                { company: wipro._id, type: 'aptitude', questionText: 'Find the odd man out: 3, 5, 11, 14, 17, 21.', options: ['21', '17', '14', '3'], correctAnswer: '14', difficulty: 'easy' },
                { company: wipro._id, type: 'technical', questionText: 'Explain the concept of Virtual Memory.', options: [], correctAnswer: 'Technique to use HDD as RAM extension', difficulty: 'medium' },
                { company: wipro._id, type: 'coding', questionText: 'Write a program to find the factorial of a number using recursion.', options: [], correctAnswer: 'n * factorial(n-1)', difficulty: 'easy' }
            );
        }

        // Accenture Questions
        const accenture = createdCompanies.find(c => c.name === 'Accenture');
        if (accenture) {
            allQuestions.push(
                { company: accenture._id, type: 'aptitude', questionText: 'If flow is related to River, then Stagnant is related to:', o: ['Rain', 'Stream', 'Pool', 'Canal'], a: 'Pool', d: 'easy', type: 'aptitude', category: 'logical' }, // Fixed object for questions array
                { company: accenture._id, type: 'aptitude', questionText: 'Choose the correct synonym for "CANDID".', options: ['Apparent', 'Explicit', 'Frank', 'Bright'], correctAnswer: 'Frank', difficulty: 'easy' },
                { company: accenture._id, type: 'technical', questionText: 'What is cloud computing? Name some services.', options: [], correctAnswer: 'On-demand computing resources. AWS, Azure.', difficulty: 'easy' }
            );
        }

        // Cognizant Questions
        const cognizant = createdCompanies.find(c => c.name === 'Cognizant');
        if (cognizant) {
            allQuestions.push(
                { company: cognizant._id, type: 'aptitude', questionText: 'A and B together can do a work in 15 days. A alone can do it in 20 days. In how many days can B alone do it?', options: ['30', '40', '45', '60'], correctAnswer: '60', difficulty: 'medium' },
                { company: cognizant._id, type: 'technical', questionText: 'Difference between Method Overloading and Method Overriding?', options: [], correctAnswer: 'Overloading: compile-time, Overriding: run-time', difficulty: 'medium' },
                { company: cognizant._id, type: 'coding', questionText: 'Write a query to find the second highest salary from a table.', options: [], correctAnswer: 'SELECT MAX(Salary) FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee)', difficulty: 'medium' }
            );
        }

        // Bosch Questions
        const bosch = createdCompanies.find(c => c.name === 'Bosch');
        if (bosch) {
            allQuestions.push(
                { company: bosch._id, type: 'aptitude', questionText: 'A car travels at 60 km/hr. How many meters does it travel in 1 second?', options: ['10m', '16.6m', '20m', '60m'], correctAnswer: '16.6m', difficulty: 'easy' },
                { company: bosch._id, type: 'technical', questionText: 'Explain the working of an ABS system in cars.', options: [], correctAnswer: 'Prevents wheel lockup during braking', difficulty: 'medium' },
                { company: bosch._id, type: 'coding', questionText: 'Write a C program to implement a linked list.', options: [], correctAnswer: 'struct Node { int data; struct Node* next; }', difficulty: 'medium' }
            );
        }

        // Cadence Questions
        const cadence = createdCompanies.find(c => c.name === 'Cadence');
        if (cadence) {
            allQuestions.push(
                { company: cadence._id, type: 'aptitude', questionText: 'Probability of getting a sum of 9 with two dice?', options: ['1/9', '1/6', '1/12', '1/36'], correctAnswer: '1/9', difficulty: 'medium' },
                { company: cadence._id, type: 'technical', questionText: 'What is Setup and Hold time in Digital Electronics?', options: [], correctAnswer: 'Timing constraints for flip-flops', difficulty: 'hard' },
                { company: cadence._id, type: 'coding', questionText: 'Implement a Finite State Machine (FSM) in Verilog/C.', options: [], correctAnswer: 'State transition logic', difficulty: 'hard' }
            );
        }

        // BitGo Questions
        const bitgo = createdCompanies.find(c => c.name === 'BitGo');
        if (bitgo) {
            allQuestions.push(
                { company: bitgo._id, type: 'coding', questionText: 'Implement a Merkle Tree.', options: [], correctAnswer: 'Tree of hashes', difficulty: 'hard' },
                { company: bitgo._id, type: 'technical', questionText: 'How does Public-Private key encryption work?', options: [], correctAnswer: 'Asymmetric cryptography', difficulty: 'medium' },
                { company: bitgo._id, type: 'aptitude', questionText: 'If 3 men can mine 3 blocks in 3 minutes, how many men to mine 100 blocks in 100 minutes?', options: ['3', '100', '1', '30'], correctAnswer: '3', difficulty: 'medium' }
            );
        }

        // Hexaware Questions
        const hexaware = createdCompanies.find(c => c.name === 'Hexaware');
        if (hexaware) {
            allQuestions.push(
                { company: hexaware._id, type: 'aptitude', questionText: 'Average of first five multiples of 3?', options: ['3', '9', '12', '15'], correctAnswer: '9', difficulty: 'easy' },
                { company: hexaware._id, type: 'technical', questionText: 'What is cloud scaling?', options: [], correctAnswer: 'Vertical vs Horizontal scaling', difficulty: 'easy' },
                { company: hexaware._id, type: 'coding', questionText: 'Write a program to limit an API rate.', options: [], correctAnswer: 'Token bucket algorithm', difficulty: 'medium' }
            );
        }

        // HBS Questions
        const hbs = createdCompanies.find(c => c.name === 'HBS');
        if (hbs) {
            allQuestions.push(
                { company: hbs._id, type: 'aptitude', questionText: 'Complete the series: 2, 6, 12, 20, 30, ...', options: ['40', '42', '44', '46'], correctAnswer: '42', difficulty: 'medium' },
                { company: hbs._id, type: 'technical', questionText: 'Difference between BPO and KPO?', options: [], correctAnswer: 'Business Process vs Knowledge Process', difficulty: 'easy' },
                { company: hbs._id, type: 'hr', questionText: 'How do you handle a difficult customer?', options: [], correctAnswer: 'Empathy and patience', difficulty: 'easy' }
            );
        }

        // Comcast Questions
        const comcast = createdCompanies.find(c => c.name === 'Comcast');
        if (comcast) {
            allQuestions.push(
                { company: comcast._id, type: 'aptitude', questionText: 'A man buys a cycle for Rs. 1400 and sells it at a loss of 15%. What is the selling price?', options: ['1090', '1160', '1190', '1202'], correctAnswer: '1190', difficulty: 'easy' },
                { company: comcast._id, type: 'technical', questionText: 'Explain TCP/IP protocol suite.', options: [], correctAnswer: '4 layer model', difficulty: 'medium' },
                { company: comcast._id, type: 'coding', questionText: 'Find the first non-repeating character in a string.', options: [], correctAnswer: 'Hash map frequency count', difficulty: 'medium' }
            );
        }

        // Turing Questions
        const turing = createdCompanies.find(c => c.name === 'Turing');
        if (turing) {
            allQuestions.push(
                { company: turing._id, type: 'coding', questionText: 'Given a binary tree, find its maximum depth.', options: [], correctAnswer: 'Recursive DFS', difficulty: 'medium' },
                { company: turing._id, type: 'coding', questionText: 'Implement an LRU Cache.', options: [], correctAnswer: 'Doubly Linked List + HashMap', difficulty: 'hard' },
                { company: turing._id, type: 'technical', questionText: 'What is Big O notation?', options: [], correctAnswer: 'Time/Space complexity analysis', difficulty: 'easy' }
            );
        }

        // Caterpillar Questions
        const caterpillar = createdCompanies.find(c => c.name === 'Caterpillar');
        if (caterpillar) {
            allQuestions.push(
                { company: caterpillar._id, type: 'aptitude', questionText: 'Calculate the volume of a cylinder with radius 7 and height 10.', options: ['1540', '1450', '1500', '1600'], correctAnswer: '1540', difficulty: 'medium' },
                { company: caterpillar._id, type: 'technical', questionText: 'What is the Second Law of Thermodynamics?', options: [], correctAnswer: 'Entropy always increases', difficulty: 'medium' },
                { company: caterpillar._id, type: 'technical', questionText: 'Difference between 2-stroke and 4-stroke engine.', options: [], correctAnswer: 'Power strokes per revolution', difficulty: 'medium' }
            );
        }

        // Renault-Nissan Questions
        const renault = createdCompanies.find(c => c.name === 'Renault-Nissan');
        if (renault) {
            allQuestions.push(
                { company: renault._id, type: 'aptitude', questionText: 'Speed = 60kmph, Time = 2.5 hrs. Distance?', options: ['120', '140', '150', '160'], correctAnswer: '150', difficulty: 'easy' },
                { company: renault._id, type: 'technical', questionText: 'What is an IC Engine?', options: [], correctAnswer: 'Internal Combustion Engine', difficulty: 'easy' },
                { company: renault._id, type: 'technical', questionText: 'Explain the concept of Hybrid Vehicles.', options: [], correctAnswer: 'Electric + Combustion engine', difficulty: 'medium' }
            );
        }

        // SPIC Questions
        const spic = createdCompanies.find(c => c.name === 'SPIC');
        if (spic) {
            allQuestions.push(
                { company: spic._id, type: 'aptitude', questionText: 'Log(1) is equal to?', options: ['0', '1', '10', 'Undefined'], correctAnswer: '0', difficulty: 'easy' },
                { company: spic._id, type: 'technical', questionText: 'What is PH value?', options: [], correctAnswer: 'Measure of acidity/basicity', difficulty: 'easy' },
                { company: spic._id, type: 'technical', questionText: 'Process of Haber for Ammonia production.', options: [], correctAnswer: 'Nitrogen + Hydrogen', difficulty: 'hard' }
            );
        }

        // Freshworks Questions
        const freshworks = createdCompanies.find(c => c.name === 'Freshworks');
        if (freshworks) {
            allQuestions.push(
                { company: freshworks._id, type: 'coding', questionText: 'Rotate an array to the right by K steps.', options: [], correctAnswer: 'Array reversal method', difficulty: 'medium' },
                { company: freshworks._id, type: 'aptitude', questionText: 'How many triangles in a square with both diagonals drawn?', options: ['4', '6', '8', '10'], correctAnswer: '8', difficulty: 'medium' },
                { company: freshworks._id, type: 'technical', questionText: 'Explain REST API principles.', options: [], correctAnswer: 'Stateless, Client-Server', difficulty: 'medium' }
            );
        }

        // Mistral Questions
        const mistral = createdCompanies.find(c => c.name === 'Mistral');
        if (mistral) {
            allQuestions.push(
                { company: mistral._id, type: 'technical', questionText: 'Difference between Microprocessor and Microcontroller?', options: [], correctAnswer: 'Internal peripherals', difficulty: 'medium' },
                { company: mistral._id, type: 'coding', questionText: 'Set a specific bit in a number.', options: [], correctAnswer: 'Bitwise OR', difficulty: 'medium' },
                { company: mistral._id, type: 'aptitude', questionText: 'Binary representation of 10?', options: ['1010', '1001', '1100', '1000'], correctAnswer: '1010', difficulty: 'easy' }
            );
        }

        // VThink Questions
        const vthink = createdCompanies.find(c => c.name === 'VThink');
        if (vthink) {
            allQuestions.push(
                { company: vthink._id, type: 'aptitude', questionText: 'A clock shows 3:30. What is the angle between hands?', options: ['75', '90', '80', '60'], correctAnswer: '75', difficulty: 'medium' },
                { company: vthink._id, type: 'technical', questionText: 'What is SDLC?', options: [], correctAnswer: 'Software Development Life Cycle', difficulty: 'easy' },
                { company: vthink._id, type: 'hr', questionText: 'Describe a time you faced a challenge.', options: [], correctAnswer: 'STAR method answer', difficulty: 'medium' }
            );
        }

        // Generic HR Questions for ALL companies
        createdCompanies.forEach(company => {
            allQuestions.push({
                company: company._id,
                type: 'hr',
                questionText: 'Why do you want to join us?',
                options: [],
                correctAnswer: 'Passion for the role',
                difficulty: 'easy'
            });
            allQuestions.push({
                company: company._id,
                type: 'hr',
                questionText: 'Where do you see yourself in 5 years?',
                options: [],
                correctAnswer: 'Leading a team',
                difficulty: 'medium'
            });
        });


        await Question.insertMany(allQuestions);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Company.deleteMany();
        await Question.deleteMany();
        await Topic.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
