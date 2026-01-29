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
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Accenture.svg',
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
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Cognizant_logo_2022.svg',
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
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Hexaware_new_logo.svg',
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
                    { question: 'What is 20% of 500?', solution: '(20/100) * 500 = 100', difficulty: 'easy' },
                    { question: 'If 50 is increased by 10%, what is the new number?', solution: '10% of 50 is 5. So, 50 + 5 = 55.', difficulty: 'easy' }
                ]
            },
            {
                category: 'quant',
                name: 'Time and Work',
                description: 'Relationship between work done, time taken, and number of workers.',
                content: '# Time and Work\n\nThe basic concept is that Work = Rate * Time.\n\n## Key Concepts\n- If A can do a piece of work in n days, then A\'s 1 day\'s work = 1/n.\n- If A is twice as good a workman as B, then ratio of work done by A and B = 2:1.',
                examples: [
                    { question: 'A can do a work in 5 days, B in 10 days. How many days if they work together?', solution: 'A\'s 1 day work = 1/5. B\'s 1 day work = 1/10. Together = 1/5 + 1/10 = 3/10. Days = 10/3 = 3.33 days.', difficulty: 'medium' }
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
            }
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

        const seedSet = [
            ...percentageQuestions, ...timeAndWorkQuestions, ...trainQuestions, ...profitQuestions,
            ...seriesQuestions, ...bloodQuestions, ...codingQuestions,
            ...verbalQuestions, ...sentenceQuestions,
            ...simpleQuestions, ...syllogismQuestions, ...rcQuestions
        ];

        // Process seed set
        seedSet.forEach(item => {
            const topicId = getTopicId(item.t);
            if (!topicId) console.log(`Topic missing: ${item.t}`);

            // Map simple topic name to category if needed (but we already have them in db)
            // Just assume category is looked up from topic or hardcoded for now
            // Actually question model needs category.
            const topic = topics.find(tp => tp.name === item.t);

            allQuestions.push({
                type: 'aptitude',
                category: topic.category,
                topic: topicId,
                questionText: item.q,
                options: item.o,
                correctAnswer: item.a,
                difficulty: item.d
            });
        });

        // Add some generic company specific ones from before too
        createdCompanies.forEach(company => {
            // Just add a couple of placeholder company questions
            allQuestions.push({
                company: company._id,
                type: 'hr',
                questionText: 'Why do you want to join us?',
                options: [],
                correctAnswer: 'Passion for the role',
                difficulty: 'easy'
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
