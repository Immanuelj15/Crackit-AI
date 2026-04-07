import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiX, FiPlus, FiTrash2, FiInfo, FiCode, FiTerminal, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AddCodingProblem = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        pattern: 'Two Pointers',
        difficulty: 'Medium',
        constraints: '',
        inputFormat: '',
        outputFormat: '',
        examples: [{ input: '', output: '', explanation: '' }],
        starterCode: [
            { language: 'javascript', code: 'function solve(params) {\n  // your code here\n}' },
            { language: 'python', code: 'def solve(params):\n    pass' }
        ],
        driverCode: {
            functionName: 'solve',
            parameterTypes: ['array'],
            returnType: 'number'
        },
        testCases: [{ input: '', expectedOutput: '', isHidden: true }],
        editorial: '',
        editorialCost: 50
    });

    const patterns = ['Two Pointers', 'Sliding Window', 'Binary Search', 'Prefix Sum', 'Hashing', 'Stack & Queue', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy', 'Backtracking'];
    const difficulties = ['Easy', 'Medium', 'Hard'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleExampleChange = (index, field, value) => {
        const newExamples = [...form.examples];
        newExamples[index][field] = value;
        setForm(prev => ({ ...prev, examples: newExamples }));
    };

    const addExample = () => setForm(prev => ({ ...prev, examples: [...prev.examples, { input: '', output: '', explanation: '' }] }));
    const removeExample = (index) => setForm(prev => ({ ...prev, examples: prev.examples.filter((_, i) => i !== index) }));

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...form.testCases];
        if (field === 'isHidden') {
            newTestCases[index][field] = !newTestCases[index][field];
        } else {
            newTestCases[index][field] = value;
        }
        setForm(prev => ({ ...prev, testCases: newTestCases }));
    };

    const addTestCase = () => setForm(prev => ({ ...prev, testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: true }] }));
    const removeTestCase = (index) => setForm(prev => ({ ...prev, testCases: prev.testCases.filter((_, i) => i !== index) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/admin/coding-problem', form, { withCredentials: true });
            setSuccess(true);
            setTimeout(() => navigate('/admin/coding'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create problem');
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General Info', icon: <FiInfo /> },
        { id: 'details', label: 'Problem Details', icon: <FiTerminal /> },
        { id: 'templates', label: 'Code Templates', icon: <FiCode /> },
        { id: 'testing', label: 'Test Cases', icon: <FiCheckCircle /> },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Create Challenge</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Architecting the next standard algorithmic problem</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/coding')} className="p-4 text-slate-400 hover:text-slate-600 font-black uppercase text-[10px] tracking-widest transition-colors">Cancel</button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3"
                    >
                        <FiSave /> {loading ? 'Saving...' : 'Publish Challenge'}
                    </button>
                </div>
            </header>

            {success && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500 text-white p-6 rounded-[32px] font-black uppercase tracking-widest text-center shadow-xl shadow-emerald-500/20">
                    Challenge Published Successfully! Redirecting...
                </motion.div>
            )}

            {error && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-500 text-white p-6 rounded-[32px] font-black uppercase tracking-widest text-center shadow-xl shadow-rose-500/20">
                    {error}
                </motion.div>
            )}

            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex">
                {/* Sidebar Tabs */}
                <div className="w-64 bg-slate-50/50 border-r border-slate-100 p-8 space-y-2">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id 
                                ? 'bg-white text-indigo-600 shadow-md border border-slate-100' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                            }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-12 overflow-y-auto max-h-[700px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'general' && (
                            <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Problem Title</label>
                                    <input 
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500/50 transition-all font-bold text-lg"
                                        placeholder="e.g., Target Sum with Two Pointers"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Category / Pattern</label>
                                        <select 
                                            name="pattern"
                                            value={form.pattern}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500/50 transition-all font-bold appearance-none"
                                        >
                                            {patterns.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Difficulty</label>
                                        <select 
                                            name="difficulty"
                                            value={form.difficulty}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500/50 transition-all font-bold appearance-none"
                                        >
                                            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Problem Description</label>
                                    <textarea 
                                        name="description"
                                        value={form.description}
                                        onChange={handleInputChange}
                                        rows="8"
                                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500/50 transition-all font-bold resize-none"
                                        placeholder="Describe the problem clearly using Markdown..."
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'details' && (
                            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Technical Constraints</label>
                                    <textarea 
                                        name="constraints"
                                        value={form.constraints}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500/50 transition-all font-bold text-sm"
                                        placeholder="e.g., 1 <= nums.length <= 10^5"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Input Format</label>
                                        <textarea 
                                            name="inputFormat"
                                            value={form.inputFormat}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500/50 transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Output Format</label>
                                        <textarea 
                                            name="outputFormat"
                                            value={form.outputFormat}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500/50 transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400">Examples</h3>
                                        <button onClick={addExample} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"><FiPlus /></button>
                                    </div>
                                    {form.examples.map((ex, idx) => (
                                        <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 relative space-y-4">
                                            <button onClick={() => removeExample(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"><FiTrash2 /></button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Input" value={ex.input} onChange={(e) => handleExampleChange(idx, 'input', e.target.value)} className="w-full bg-white p-3 rounded-xl border border-slate-200 outline-none text-xs font-bold" />
                                                <input placeholder="Output" value={ex.output} onChange={(e) => handleExampleChange(idx, 'output', e.target.value)} className="w-full bg-white p-3 rounded-xl border border-slate-200 outline-none text-xs font-bold" />
                                            </div>
                                            <textarea placeholder="Explanation (Markdown)" value={ex.explanation} onChange={(e) => handleExampleChange(idx, 'explanation', e.target.value)} rows="3" className="w-full bg-white p-3 rounded-xl border border-slate-200 outline-none text-xs font-bold resize-none" />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        
                        {activeTab === 'testing' && (
                            <motion.div key="testing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="bg-slate-900 p-8 rounded-[32px] border border-white/5 space-y-6">
                                    <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest pl-1">Execution Engine Config</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Entry Function Name</label>
                                            <input value={form.driverCode.functionName} onChange={(e) => setForm(p => ({...p, driverCode: {...p.driverCode, functionName: e.target.value}}))} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-mono text-sm outline-none focus:border-indigo-500/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Return Type</label>
                                            <input value={form.driverCode.returnType} onChange={(e) => setForm(p => ({...p, driverCode: {...p.driverCode, returnType: e.target.value}}))} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-mono text-sm outline-none focus:border-indigo-500/50" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400">Automated Test Cases</h3>
                                        <button onClick={addTestCase} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FiPlus /></button>
                                    </div>
                                    {form.testCases.map((tc, idx) => (
                                        <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                <textarea placeholder="Raw Input" value={tc.input} onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)} className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono" />
                                                <textarea placeholder="Expected Output" value={tc.expectedOutput} onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)} className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => handleTestCaseChange(idx, 'isHidden')} className={`text-[9px] font-black uppercase p-2 rounded-lg transition-colors ${tc.isHidden ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                    {tc.isHidden ? 'Hidden' : 'Public'}
                                                </button>
                                                <button onClick={() => removeTestCase(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><FiTrash2 /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        <div className="pt-20 opacity-0 pointer-events-none">Placeholder</div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AddCodingProblem;
