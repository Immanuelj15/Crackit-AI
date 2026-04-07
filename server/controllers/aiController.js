const { HfInference } = require('@huggingface/inference');
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const generateQuestion = async (req, res) => {
    const { company, topic, difficulty, resumeText } = req.body;

    try {
        let prompt = "";
        if (resumeText) {
            prompt = `You are a technical interviewer at ${company || 'a top tech company'}. 
            Analyze the following resume:
            "${resumeText}"
            
            Generate a single ${difficulty || 'medium'} difficulty interview question specifically tailored to this candidate's background, projects, or skills mentioned in their resume.
            Output ONLY the question text. Do not provide the answer.`;
        } else {
            prompt = `You are a strict technical interviewer at ${company || 'a top tech company'}. 
            Generate a single ${difficulty || 'medium'} difficulty ${topic} interview question. 
            Output ONLY the question text. Do not provide the answer.`;
        }

        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
            temperature: 0.7
        });

        const text = response.choices[0].message.content;

        res.json({ question: text });
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        res.status(500).json({ message: 'AI generation failed' });
    }
};

const evaluateAnswer = async (req, res) => {
    const { question, answer, topic } = req.body;

    try {
        const prompt = `You are a technical interviewer. 
        Question: "${question}"
        Candidate Answer: "${answer}"
        
        Evaluate the answer. Give a score out of 10.
        Provide constructive feedback on what was good and what can be improved.
        Format response as JSON: { "score": number, "feedback": "string" }
        Ensure valid JSON output only.`;

        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0.5
        });

        const text = response.choices[0].message.content;

        let jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonStart = jsonText.indexOf('{');
        const jsonEnd = jsonText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
        }

        const evaluation = JSON.parse(jsonText);

        res.json(evaluation);
    } catch (error) {
        console.error("AI Evaluation Error:", error);
        res.status(500).json({ message: 'AI evaluation failed' });
    }
};

const chatWithBot = async (req, res) => {
    const { message } = req.body;

    try {
        const systemPrompt = `You are 'CrackIt AI', an expert technical mentor and support bot. 
        Your goals:
        1. Answer technical coding and aptitude questions clearly with examples.
        2. Help users navigate 'CrackIt AI' features like Mock Interviews, Company Roadmaps, and Coding Workspace.
        3. If someone asks for a code explanation (e.g., 'explain sliding window'), provide a clear conceptual explanation followed by a short example.
        4. Be encouraging, concise, and professional.`;

        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            max_tokens: 800,
            temperature: 0.7
        });

        const text = response.choices[0].message.content;

        res.json({ reply: text });
    } catch (error) {
        console.error("AI Chat Error:", error.message);
        res.json({
            reply: "I'm currently experiencing high traffic or connection issues. However, I can tell you that CrackIt AI offers: \n\n1. AI Mock Interviews\n2. Company-Specific Question Archives\n3. Performance Analytics\n\nPlease try again later!"
        });
    }
}

const analyzeResume = async (req, res) => {
    try {
        console.log("Analyzing resume upload...");
        if (!req.file) {
            console.log("No file received in request.");
            return res.status(400).json({ message: 'Please upload a PDF resume' });
        }

        console.log(`Reading file at: ${req.file.path}`);
        if (!fs.existsSync(req.file.path)) {
            console.error(`File does not exist: ${req.file.path}`);
            return res.status(500).json({ message: 'Internal server error: File lost after upload' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        console.log(`File size: ${dataBuffer.length} bytes`);

        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        await parser.destroy();
        console.log("Successfully parsed PDF text.");

        // AI Analysis
        const prompt = `You are an expert technical recruiter. 
        Analyze the following resume text:
        "${data.text.substring(0, 4000)}"
        
        Provide a structured analysis in JSON format with:
        - skills (Found technical skills)
        - missingSkills (Skills commonly needed for their target roles they lack)
        - improvementSuggestions (Resume and career tips)
        - suitableRoles (Roles they should apply for)
        
        Format example: { "skills": [], "missingSkills": [], "improvementSuggestions": [], "suitableRoles": [] }
        Ensure valid JSON only.`;

        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            temperature: 0.5
        });

        let analysis = {};
        try {
            const aiOutput = response.choices[0].message.content;
            let jsonText = aiOutput.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonStart = jsonText.indexOf('{');
            const jsonEnd = jsonText.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
            }
            analysis = JSON.parse(jsonText);
        } catch (e) {
            console.error("AI Analysis Parse Error:", e);
            analysis = { error: "Failed to parse detailed analysis" };
        }

        // Optionally delete the file after parsing
        try {
            fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
            console.warn("Cleanup error (ignorable):", unlinkErr.message);
        }

        res.json({
            text: data.text,
            analysis,
            message: 'Resume analyzed successfully'
        });
    } catch (error) {
        console.error("Resume Analysis Error Detail:", error);
        res.status(500).json({ message: 'Failed to analyze resume: ' + error.message });
    }
};

const analyzePerformance = async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user._id).select('solvedProblems');

        if (!user || !user.solvedProblems || user.solvedProblems.length === 0) {
            return res.json({
                report: "Not enough data yet. Solve more problems to get personalized AI analysis!"
            });
        }

        // Summary for AI
        const history = user.solvedProblems.map(p => ({
            type: p.type,
            topic: p.topic,
            difficulty: p.difficulty,
            score: p.score
        }));

        const prompt = `You are an AI Performance Mentor for a student on 'CrackIt AI', an interview preparation platform.
        Analyze the following student performance history (Coding & Aptitude):
        ${JSON.stringify(history.slice(-20))} 
        
        Provide a concise performance report with:
        - Identified Weak Topics (be specific).
        - Strong Topics.
        - Recommended Next Problems.
        - A personalized Study Plan Suggestion.
        
        Format example:
        Your weakness: Sliding Window
        Recommended practice: 10 medium problems
        Estimated time: 30 minutes
        
        Keep it concise and punchy. Be a helpful mentor.`;

        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0.7
        });

        const report = response.choices[0].message.content;

        res.json({ report });
    } catch (error) {
        console.error("AI Performance Analysis Error:", error);
        res.status(500).json({ message: 'AI analysis failed' });
    }
};

module.exports = { generateQuestion, evaluateAnswer, chatWithBot, analyzeResume, analyzePerformance };
