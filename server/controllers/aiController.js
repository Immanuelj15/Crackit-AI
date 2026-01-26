const { HfInference } = require('@huggingface/inference');
const fs = require('fs');
const path = require('path');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const generateQuestion = async (req, res) => {
    const { company, topic, difficulty } = req.body;
    // topic: aptitude, coding, technical_java, etc.

    try {
        const prompt = `You are a strict technical interviewer at ${company || 'a top tech company'}. 
    Generate a single ${difficulty || 'medium'} difficulty ${topic} interview question. 
    Output ONLY the question text. Do not provide the answer.`;

        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
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

        // Clean up markdown if present to parse JSON
        let jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        // Sometimes models return extra text, try to find the JSON block
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
        const systemPrompt = "You are a helpful support agent for 'CrackIt AI', a platform for mock interviews and company-specific preparation. Your goal is to explain features like AI Mock Interviews, Company Archives (Google, Amazon, etc.), and help users understand how to use the site. Be concise and friendly.";

        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            max_tokens: 300,
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

module.exports = { generateQuestion, evaluateAnswer, chatWithBot };
