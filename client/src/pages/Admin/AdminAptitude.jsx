import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiPlus, FiBookOpen, FiSearch, FiLayers, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminAptitude = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Fetch all questions
                const { data } = await axios.get('/api/questions?type=aptitude', { withCredentials: true });
                setQuestions(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false);
            }
        };
        // fetchQuestions();
    }, []);

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Knowledge Bank</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Curating the largest collection of technical & logical MCQs</p>
                </div>
                <Link 
                    to="/admin/aptitude/add"
                    className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-emerald-600/20"
                >
                    <FiPlus className="text-lg" />
                    New MCQ Question
                </Link>
            </header>

            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden min-h-[500px] relative">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-full max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search questions by category or topic..."
                            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-colors font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-400 hover:bg-slate-50">
                            <FiFilter /> Filter
                        </button>
                        <button className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-400 hover:bg-slate-50">
                            <FiLayers /> Topics
                        </button>
                    </div>
                </div>

                <div className="p-20 text-center text-slate-400 space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl mx-auto flex items-center justify-center text-emerald-200">
                        <FiBookOpen size={40} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-1">MCQ Repository Active</h3>
                        <p className="text-[11px] font-bold uppercase opacity-50">Syncing thousands of quantitative and verbal items</p>
                    </div>
                    
                    <Link 
                        to="/admin/aptitude/add"
                        className="inline-block mt-8 bg-emerald-50 text-emerald-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                        Seed Initial Data
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminAptitude;
