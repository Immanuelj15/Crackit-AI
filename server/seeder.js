const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');
const Question = require('./models/Question');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const companies = [
    // 🟢 Tier-1 / Product & High Package Companies
    {
        name: 'Amazon',
        description: 'Amazon focuses on e-commerce, cloud computing, and AI. Known for its 14 Leadership Principles.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
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
        description: 'Cadence is a pivotal leader in electronic design, building software, hardware, and IP for chip design.',
        logoUrl: '/logos/cadence.png',
        hiringPattern: '## Cadence Hiring Process\n\n1. **Aptitude + Coding Test:** Focus on Digital Electronics & C++.\n2. **Technical Interview:** Algorithms + Electronics concepts.\n3. **HR Interview:** Personality check.',
        rounds: [
            { name: 'Aptitude + Coding Test', description: 'Digital Logic, C/C++ Programming, Aptitude' },
            { name: 'Technical Interview', description: 'Whiteboard coding and circuit design questions' },
            { name: 'HR Interview', description: 'Salary discussion and relocation check' }
        ]
    },
    {
        name: 'BitGo',
        description: 'BitGo provides institutional-grade cryptocurrency security and custody solutions.',
        logoUrl: '/logos/bitgo.png',
        hiringPattern: '## BitGo Hiring Process\n\n1. **Coding Test:** High-level DSA questions.\n2. **Technical Interview:** Blockchain concepts + Advanced Algorithms.\n3. **HR Interview:** Culture fit for a fintech startup.',
        rounds: [
            { name: 'Coding Test', description: 'HackerRank/CodeSignal test (Hard level DSA)' },
            { name: 'Technical Interview', description: 'System Design & Blockchain fundamentals' },
            { name: 'HR Interview', description: 'Startup mindset assessment' }
        ]
    },

    // 🟡 Tier-2 / Service & Mid-Product Companies
    {
        name: 'TCS',
        description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.',
        logoUrl: '/logos/tcs.png',
        hiringPattern: '## TCS Hiring Process (Ninja/Digital)\n\n1. **Aptitude Test:** Numerical, Verbal, Reasoning.\n2. **Technical Interview:** Basics of C/Java/Python.\n3. **HR Interview:** Willingness to relocate, shifts.',
        rounds: [
            { name: 'Aptitude Test', description: 'NQT (National Qualifier Test). General Ability.' },
            { name: 'Technical Interview', description: 'Basic coding and project questions' },
            { name: 'HR Interview', description: 'Document verification and policy agreement' }
        ]
    },
    {
        name: 'Infosys',
        description: 'Infosys is a global leader in next-generation digital services and consulting.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1200px-Infosys_logo.svg.png',
        hiringPattern: '## Infosys Hiring Process\n\n1. **Aptitude Test:** Mathematical & Logical reasoning.\n2. **Coding Round:** 3 Questions (Easy to Hard).\n3. **Technical Interview:** OOPs concepts & DB.\n4. **HR Interview:** General discussion.',
        rounds: [
            { name: 'Aptitude Test', description: 'Logical Reasoning, Mathematical Ability, Verbal' },
            { name: 'Coding Round', description: 'Pseudocode and Competitive Programming' },
            { name: 'Technical Interview', description: 'SQL, Java/Python basics, Project Review' },
            { name: 'HR Interview', description: 'Behavioral and Soft Skills check' }
        ]
    },
    {
        name: 'Wipro',
        description: 'Wipro Limited is a leading technology services and consulting company.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/1200px-Wipro_Primary_Logo_Color_RGB.svg.png',
        hiringPattern: '## Wipro Hiring Process (NLTH)\n\n1. **Aptitude Test:** Quant, Logical, English.\n2. **Technical Interview:** Basic programming.\n3. **HR Interview:** Communication skills.',
        rounds: [
            { name: 'Aptitude Test', description: 'AMCAT style adaptive test' },
            { name: 'Technical Interview', description: 'C/C++/Java basics + Essay writing' },
            { name: 'HR Interview', description: 'Background check and offer discussion' }
        ]
    },
    {
        name: 'Accenture',
        description: 'Accenture involves in strategy, consulting, digital, technology and operations.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/2560px-Accenture.svg.png',
        hiringPattern: '## Accenture Hiring Process\n\n1. **Aptitude + Logical:** Cognitive assessment.\n2. **Technical Interview:** Pseudocode & Cloud basics.\n3. **HR Interview:** Learning agility.',
        rounds: [
            { name: 'Aptitude + Logical Reasoning', description: 'Cognitive and Technical Assessment (Pseudocode)' },
            { name: 'Technical Interview', description: 'Focus on communication and basic tech skills' },
            { name: 'HR Interview', description: 'Situational judgment test' }
        ]
    },
    {
        name: 'Cognizant',
        description: 'Cognizant helps clients modernize technology, reimagine processes and transform experiences.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cognizant_logo_2022.svg/2560px-Cognizant_logo_2022.svg.png',
        hiringPattern: '## Cognizant Hiring Process (GenC)\n\n1. **Aptitude + Coding:** Automata fix/Coding.\n2. **Technical Interview:** SQL + Java/Python.\n3. **HR Interview:** Shift flexibility.',
        rounds: [
            { name: 'Aptitude + Coding Test', description: 'Quantitative + Code Debugging' },
            { name: 'Technical Interview', description: 'Genc/GenC Next track determination' },
            { name: 'HR Interview', description: 'Document check and onboarding' }
        ]
    },
    {
        name: 'Hexaware',
        description: 'Hexaware is an IT & BPO service provider automating the future.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Hexaware_Technologies_Logo.svg/2560px-Hexaware_Technologies_Logo.svg.png',
        hiringPattern: '## Hexaware Hiring Process\n\n1. **Aptitude Test:** Domain + English.\n2. **Technical Interview:** Project-based.\n3. **HR Interview:** Communication check.',
        rounds: [
            { name: 'Aptitude Test', description: 'Domain specific + Communication test' },
            { name: 'Technical Interview', description: 'Live coding and Resume walkthrough' },
            { name: 'HR Interview', description: 'Versant test (Voice assessment)' }
        ]
    },
    {
        name: 'HBS',
        description: 'Hinduja Business Solutions provides BPM and CX solutions.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Hinduja_Group_logo.svg',
        hiringPattern: '## HBS Hiring Process\n\n1. **Aptitude Test:** General Ability.\n2. **Technical / Voice Test:** Process capability.\n3. **HR Interview:** Fitment.',
        rounds: [
            { name: 'Aptitude Test', description: 'General aptitude and logical reasoning' },
            { name: 'Technical / Voice Test', description: 'Depends on role (Support vs Dev)' },
            { name: 'HR Interview', description: 'Final selection' }
        ]
    },
    {
        name: 'Comcast',
        description: 'Comcast is a global media and technology company.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Comcast_Logo.svg/2560px-Comcast_Logo.svg.png',
        hiringPattern: '## Comcast Hiring Process\n\n1. **Aptitude + Coding:** HackerRank based.\n2. **Technical Interview:** Networking + Dev.\n3. **HR Interview:** Culture fit.',
        rounds: [
            { name: 'Aptitude + Coding Test', description: 'Networking concepts + Basic Coding' },
            { name: 'Technical Interview', description: 'Linux/Unix internals + Programming' },
            { name: 'HR Interview', description: 'Comcast Credo & Values' }
        ]
    },
    {
        name: 'Turing',
        description: 'Turing is an AI-powered tech services company that sources developers.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Turing_Logo.svg/2560px-Turing_Logo.svg.png',
        hiringPattern: '## Turing Hiring Process\n\n1. **Coding Test:** Automated vetting (MCQs + Coding).\n2. **Technical Interview:** Deep stack check.\n3. **Client / HR Interview:** Project matching.',
        rounds: [
            { name: 'Coding Test', description: 'Stack specific (e.g., React/Node) quiz + Algorithms' },
            { name: 'Technical Interview', description: 'Live coding pair programming' },
            { name: 'Client / HR Interview', description: 'Soft skills & English proficiency' }
        ]
    },

    // 🟠 Core / Manufacturing / Domain Companies
    {
        name: 'Caterpillar',
        description: 'Caterpillar involves in construction and mining equipment, diesel and natural gas engines.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Caterpillar_Inc._logo.svg/2560px-Caterpillar_Inc._logo.svg.png',
        hiringPattern: '## Caterpillar Hiring Process\n\n1. **Aptitude Test:** Mechanical/Electrical concepts.\n2. **Technical Interview:** Core Engineering.\n3. **HR Interview:** Industrial readiness.',
        rounds: [
            { name: 'Aptitude Test', description: 'Numerical + Core Domain (Mech/Elec)' },
            { name: 'Technical Interview', description: 'Design concepts, Thermodynamics/Circuits' },
            { name: 'HR Interview', description: 'Safety culture and behavioral' }
        ]
    },
    {
        name: 'Renault-Nissan',
        description: 'Renault-Nissan Mitsubishi Alliance is a strategic partnership in the automotive industry.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Renault_Nissan_Mitsubishi_Alliance_logo.svg/2560px-Renault_Nissan_Mitsubishi_Alliance_logo.svg.png',
        hiringPattern: '## Renault-Nissan Hiring Process\n\n1. **Aptitude Test:** General + Automotive.\n2. **Technical Interview:** Vehicle Dynamics/CAD.\n3. **HR Interview:** Motivation.',
        rounds: [
            { name: 'Aptitude Test', description: 'Data Interpretation + Domain Knowledge' },
            { name: 'Technical Interview', description: 'IC Engines / EV concepts' },
            { name: 'HR Interview', description: 'Passion for automotive industry' }
        ]
    },
    {
        name: 'SPIC',
        description: 'Southern Petrochemical Industries Corporation is a fertilizer manufacturing company.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/SPIC_logo.png/220px-SPIC_logo.png',
        hiringPattern: '## SPIC Hiring Process\n\n1. **Aptitude Test:** Chemical/core concepts.\n2. **Technical Interview:** Plant operations.\n3. **HR Interview:** Stability check.',
        rounds: [
            { name: 'Aptitude Test', description: 'Chemical Engineering basics + Quant' },
            { name: 'Technical Interview', description: 'Process control, Heat/Mass transfer' },
            { name: 'HR Interview', description: 'Willingness to work in plant location' }
        ]
    },

    // 🔵 Startup / SME / Software Companies
    {
        name: 'Zoho',
        description: 'Zoho Corporation is an Indian multinational technology company that makes web-based business tools.',
        logoUrl: '/logos/zoho.png',
        hiringPattern: '## Zoho Hiring Process\n\n1. **Aptitude Test:** C Programming/Logical.\n2. **Coding Round:** No libraries allowed.\n3. **Technical Interview 1:** Advanced C/Java.\n4. **Technical Interview 2:** System Design.\n5. **HR Interview:** Fitment.',
        rounds: [
            { name: 'Aptitude Test', description: 'Nested loops prediction, C snippets' },
            { name: 'Coding Round', description: 'Problem solving without built-in functions' },
            { name: 'Technical Interview – 1', description: 'Data Structures deep dive' },
            { name: 'Technical Interview – 2', description: 'High level design discussion' },
            { name: 'HR Interview', description: 'Zoho culture and simplicity' }
        ]
    },
    {
        name: 'Freshworks',
        description: 'Freshworks provides customer engagement software that makes it easy for businesses to delight their customers.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Freshworks_logo_2022.svg/300px-Freshworks_logo_2022.svg.png',
        hiringPattern: '## Freshworks Hiring Process\n\n1. **Aptitude Test:** General.\n2. **Coding Round:** HackerRank.\n3. **Technical Interview:** Problem solving.\n4. **HR Interview:** Culture fit.',
        rounds: [
            { name: 'Aptitude Test', description: 'Standard Speed & Accuracy test' },
            { name: 'Coding Round', description: '3 DSA questions (String/Array focus)' },
            { name: 'Technical Interview', description: 'Code optimization and review' },
            { name: 'HR Interview', description: 'Chant (Culture) fitment' }
        ]
    },
    {
        name: 'Mistral',
        description: 'Mistral Solutions is a technology design and systems engineering company.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Mistral_Solutions.png',
        hiringPattern: '## Mistral Hiring Process\n\n1. **Aptitude Test:** Embedded C focus.\n2. **Technical Interview:** Microcontrollers.\n3. **HR Interview:** General.',
        rounds: [
            { name: 'Aptitude Test', description: 'Electronics & Embedded Systems' },
            { name: 'Technical Interview', description: 'RTOS, Linux Kernel, C programming' },
            { name: 'HR Interview', description: 'Project availability' }
        ]
    },
    {
        name: 'VThink',
        description: 'VThink is a software development and consulting firm providing digital solutions.',
        logoUrl: 'https://cdn-icons-png.flaticon.com/512/3658/3658959.png', // Generic tech logo
        hiringPattern: '## VThink Hiring Process\n\n1. **Aptitude Test:** Logical.\n2. **Technical Interview:** Web technologies.\n3. **HR Interview:** Terms.',
        rounds: [
            { name: 'Aptitude Test', description: 'Basic programming logic' },
            { name: 'Technical Interview', description: 'Full stack basics (HTML/JS/SQL)' },
            { name: 'HR Interview', description: 'Salary and bond discussion' }
        ]
    }
];

// Helper to generate domain-specific questions
const sampleQuestions = (companyId) => [
    // Aptitude
    {
        company: companyId,
        type: 'aptitude',
        questionText: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
        options: ['65 sec', '89 sec', '100 sec', '150 sec'],
        correctAnswer: '89 sec',
        difficulty: 'medium'
    },
    {
        company: companyId,
        type: 'aptitude',
        questionText: 'Which number replaces the question mark in the series: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '46'],
        correctAnswer: '42',
        difficulty: 'easy'
    },

    // Coding
    {
        company: companyId,
        type: 'coding',
        questionText: 'Reverse a Linked List.',
        correctAnswer: 'Iterative: Use 3 pointers (prev, curr, next). Recursive: Head.next.next = head.',
        difficulty: 'medium'
    },
    {
        company: companyId,
        type: 'coding',
        questionText: 'Check if a string is a Palindrome.',
        correctAnswer: 'Two pointer approach: Start from start and end, compare characters moving inwards.',
        difficulty: 'easy'
    },

    // Technical
    {
        company: companyId,
        type: 'technical',
        questionText: 'Explain the concept of Virtual Memory.',
        correctAnswer: 'Memory management technique that creates an illusion of large main memory for users.',
        difficulty: 'medium'
    },
    {
        company: companyId,
        type: 'technical',
        questionText: 'Difference between TCP and UDP.',
        correctAnswer: 'TCP is connection-oriented and reliable. UDP is connectionless and faster but unreliable.',
        difficulty: 'medium'
    },

    // HR
    {
        company: companyId,
        type: 'hr',
        questionText: 'Where do you see yourself in 5 years?',
        correctAnswer: 'Relate personal growth to company growth and specific roles.',
        difficulty: 'easy'
    },
    {
        company: companyId,
        type: 'hr',
        questionText: 'What is your biggest weakness?',
        correctAnswer: 'Mention a real weakness but explain how you are working to overcome it.',
        difficulty: 'medium'
    }
];

const importData = async () => {
    try {
        await Company.deleteMany();
        await Question.deleteMany();

        console.log('Data Destroyed...');

        const createdCompanies = await Company.insertMany(companies);

        let allQuestions = [];
        createdCompanies.forEach(company => {
            allQuestions = [...allQuestions, ...sampleQuestions(company._id)];
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
