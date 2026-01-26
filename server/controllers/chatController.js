const { HfInference } = require('@huggingface/inference');
const dotenv = require('dotenv');
dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const systemInstruction = `You are "CrackIt AI", an intelligent placement assistant designed to help students prepare for job interviews. 
Your role is to:
1. Answer questions about Data Structures & Algorithms (DSA), System Design, and Aptitude.
2. Provide specific advice for companies like Amazon, Google, Zoho, TCS, etc.
3. Explain coding concepts clearly with examples (C++, Java, Python, JavaScript).
4. Do NOT verify or validate the user's answers or provide feedback on their correctness unless explicitly asked.
5. Offer tips on resume building and HR interview questions.
6. Conduct MOCK INTERVIEWS when asked. Ask one question at a time, wait for the user's response, and then provide feedback.

If a user asks about something unrelated to career, placement, or technology, politely steer them back to job preparation topics.
Keep your answers concise, encouraging, and actionable. Use markdown for code blocks.`;

console.log("Chat Controller Initialized (Hugging Face). Key:", process.env.HUGGINGFACE_API_KEY ? "Present" : "Missing");

// @desc    Chat with AI
// @route   POST /api/chat
// @access  Public (or Protected)
const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        console.log("Received chat request:", { message, historyLength: history?.length });

        // Construct messages array for Hugging Face
        // 1. Start with system prompt
        let messages = [
            { role: 'system', content: systemInstruction }
        ];

        // 2. Add history (ensure it's in { role, content } format)
        if (history && Array.isArray(history)) {
            messages = [...messages, ...history];
        }

        // 3. Add current user message
        messages.push({ role: 'user', content: message });

        // Chat Completion
        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: messages,
            max_tokens: 500,
            temperature: 0.7
        });

        const reply = response.choices[0].message.content;
        console.log("AI Response generated successfully");

        res.json({ reply });

    } catch (error) {
        const fs = require('fs');
        fs.appendFileSync('error_log.txt', `[${new Date().toISOString()}] Chat Error: ${error.message}\nFull: ${JSON.stringify(error)}\n`);
        console.error("Chat Error Details:", JSON.stringify(error, null, 2));
        console.error("Chat Error Message:", error.message);
        res.status(500).json({ message: "Failed to get response from AI", error: error.message });
    }
};

module.exports = { chatWithAI };
