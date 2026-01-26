import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MockInterview = () => {
    const [topic, setTopic] = useState('technical');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchQuestion = async () => {
        setLoading(true);
        setFeedback(null);
        setAnswer('');
        try {
            const { data } = await axios.post('/api/ai/generate', {
                topic,
                company: 'Google', // Hardcoded for demo
                difficulty: 'medium'
            }, { withCredentials: true });
            setQuestion(data.question);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const submitAnswer = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/ai/evaluate', {
                question,
                answer,
                topic
            }, { withCredentials: true });
            setFeedback(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">AI Mock Interview</h1>

            <div className="mb-4">
                <label className="block text-gray-700">Topic</label>
                <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                    <option value="technical">Technical</option>
                    <option value="behavioral">HR / Behavioral</option>
                    <option value="coding">Coding Approach</option>
                </select>
            </div>

            <button
                onClick={fetchQuestion}
                className="bg-indigo-600 text-white px-4 py-2 rounded disabled:bg-indigo-300"
                disabled={loading}
            >
                {loading ? 'Thinking...' : 'Get Question'}
            </button>

            {question && (
                <div className="mt-8 bg-white p-6 shadow rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Question:</h2>
                    <p className="text-gray-800 mb-6">{question}</p>

                    <textarea
                        className="w-full border border-gray-300 rounded p-4 mb-4"
                        rows="5"
                        placeholder="Type your answer or speak..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    ></textarea>

                    <button
                        onClick={submitAnswer}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Submit Answer
                    </button>

                    {feedback && (
                        <div className="mt-6 bg-gray-50 p-4 rounded border">
                            <h3 className="text-lg font-bold">Feedback</h3>
                            <p><strong>Score:</strong> {feedback.score}/10</p>
                            <p className="mt-2">{feedback.feedback}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MockInterview;
