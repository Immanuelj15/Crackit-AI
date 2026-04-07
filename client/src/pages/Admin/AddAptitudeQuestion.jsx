import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiSave, FiX, FiPlus, FiTrash2, FiHelpCircle, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AddAptitudeQuestion = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]);
    const [topicLoading, setTopicLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        category: 'quant',
        topic: '',
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        difficulty: 'medium'
    });

    const categories = [
        { id: 'quant', label: 'Quantitative' },
        { id: 'logical', label: 'Logical' },
        { id: 'verbal', label: 'Verbal' },
    ];

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const { data } = await axios.get(`/api/topics?category=${form.category}`, { withCredentials: true });
                setTopics(data);
                if (data.length > 0) setForm(prev => ({ ...prev, topic: data[0]._id }));
                setTopicLoading(false);
            } catch (error) {
                console.error('Error fetching topics:', error);
                setTopicLoading(false);
            }
        };
        fetchTopics();
    }, [form.category]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (idx, val) => {
        const newOptions = [...form.options];
        newOptions[idx] = val;
        setForm(prev => ({ ...prev, options: newOptions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.correctAnswer) return setError('Please specify the correct answer');
        
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/admin/aptitude-question', form, { withCredentials: true });
            setSuccess(true);
            setTimeout(() => navigate('/admin/aptitude'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create question');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">New MCQ</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Expanding the intelligence repository</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/aptitude')} className="p-4 text-slate-400 hover:text-slate-600 font-black uppercase text-[10px] tracking-widest transition-colors">Cancel</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-3"
                    >
                        <FiSave /> {loading ? 'Saving Item...' : 'Add to Bank'}
                    </button>
                </div>
            </header>

            {success && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500 text-white p-6 rounded-[32px] font-black uppercase tracking-widest text-center shadow-xl">
                    Question Added Successfully!
                </motion.div>
            )}

            {error && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-500 text-white p-6 rounded-[32px] font-black uppercase tracking-widest text-center shadow-xl">
                    {error}
                </motion.div>
            )}

            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Categorization */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-50">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Domain</label>
                            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                {categories.map(cat => (
                                    <button 
                                        type="button"
                                        key={cat.id}
                                        onClick={() => setForm(p => ({...p, category: cat.id}))}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                                            form.category === cat.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Specific Topic</label>
                            <select 
                                name="topic"
                                value={form.topic}
                                onChange={handleInputChange}
                                disabled={topicLoading}
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm appearance-none"
                            >
                                {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                {topics.length === 0 && <option>No topics found</option>}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Difficulty</label>
                            <select 
                                name="difficulty"
                                value={form.difficulty}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm appearance-none"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Question Text</label>
                            <textarea 
                                name="questionText"
                                value={form.questionText}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full bg-slate-50 border border-slate-200 p-6 rounded-3xl outline-none focus:border-indigo-500 transition-all font-bold"
                                placeholder="Type the question content here..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {form.options.map((opt, idx) => (
                                <div key={idx} className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-[3px] ml-1">Option {String.fromCharCode(65 + idx)}</label>
                                    <div className="flex gap-3">
                                        <input 
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                                            placeholder={`Value for option ${String.fromCharCode(65 + idx)}`}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setForm(p => ({...p, correctAnswer: opt}))}
                                            className={`w-12 rounded-2xl flex items-center justify-center transition-all ${
                                                form.correctAnswer === opt && opt !== ''
                                                ? 'bg-emerald-500 text-white shadow-lg' 
                                                : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                                            }`}
                                        >
                                            <FiCheckCircle />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 pt-6">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Solution Explanation</label>
                            <textarea 
                                name="explanation"
                                value={form.explanation}
                                onChange={handleInputChange}
                                rows="5"
                                className="w-full bg-slate-50 border border-slate-200 p-6 rounded-3xl outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                                placeholder="Explain the logical steps to reach the correct answer..."
                            />
                        </div>
                    </div>
                </form>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><FiHelpCircle /></div>
                <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-900 mb-1">Administrative Hint</h5>
                    <p className="text-xs text-indigo-700 font-medium">Click the check icon next to an option to mark it as the correct answer. The explanation supports standard text.</p>
                </div>
            </div>
        </div>
    );
};

export default AddAptitudeQuestion;
