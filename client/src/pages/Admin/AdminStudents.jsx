import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiSearch, FiArrowRight, FiCheckCircle, FiActivity, FiZap, FiX, FiAward, FiBook, FiCode } from 'react-icons/fi';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [exportLoading, setExportLoading] = useState(false);
    
    // Modal States
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await axios.get('/api/admin/students', { withCredentials: true });
                setStudents(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching students:', error);
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.college && s.college.toLowerCase().includes(search.toLowerCase()))
    );

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const response = await axios.get('/api/admin/export-users', {
                responseType: 'blob',
                withCredentials: true
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `CrackitAI_Performance_${new Date().toLocaleDateString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            setExportLoading(false);
        } catch (error) {
            console.error('Export failed:', error);
            setExportLoading(false);
        }
    };

    const openStudentDetail = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">Student Directory</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage and monitor student engagement</p>
                </div>
                <button 
                    onClick={handleExport}
                    disabled={exportLoading}
                    className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                >
                    <FiDownload className="text-indigo-400" />
                    {exportLoading ? 'Generating...' : 'Export Performance Analysis'}
                </button>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-black/20">
                    <div className="relative w-full max-w-md">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search by name, email or college..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 pl-14 pr-6 py-4 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-colors font-bold dark:text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Total: {students.length} Students
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Info</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Stats</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Solved Count</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Joined</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black">
                                                    {student.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{student.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-1">
                                                    <FiZap className="text-orange-500 text-xs" />
                                                    <span className="text-xs font-black dark:text-white">{student.streak || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                                    <span className="text-xs font-black dark:text-white">{student.coins || 0}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coding: {student.solvedProblems?.filter(p => p.type === 'coding').length || 0}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aptitude: {student.solvedProblems?.filter(p => p.type === 'aptitude').length || 0}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                {new Date(student.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => openStudentDetail(student)}
                                                className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 rounded-xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                            >
                                                <FiArrowRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center text-slate-400 italic text-sm">No students found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedStudent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[48px] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row h-full max-h-[85vh] border border-white/10"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-8 right-8 p-3 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-indigo-500 rounded-full z-20 transition-all"
                            >
                                <FiX size={20} />
                            </button>

                            {/* Left Panel: Profile */}
                            <div className="w-full md:w-80 bg-slate-50 dark:bg-[#0b0e14] p-12 flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-[40px] bg-indigo-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-500/30 mb-8">
                                    {selectedStudent.name[0]}
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{selectedStudent.name}</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{selectedStudent.email}</p>
                                
                                <div className="w-full space-y-4">
                                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FiZap className="text-orange-500" />
                                            <span className="text-[10px] font-black uppercase text-slate-400">Current Streak</span>
                                        </div>
                                        <span className="font-bold dark:text-white">{selectedStudent.streak || 0}</span>
                                    </div>
                                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FiAward className="text-yellow-500" />
                                            <span className="text-[10px] font-black uppercase text-slate-400">Total Credits</span>
                                        </div>
                                        <span className="font-bold dark:text-white">{selectedStudent.coins || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Details */}
                            <div className="flex-1 p-12 overflow-y-auto">
                                <section className="mb-12">
                                    <div className="flex items-center gap-4 mb-6">
                                        <FiActivity className="text-indigo-500" />
                                        <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400">Performance Log</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-3xl">
                                            <div className="flex items-center gap-3 text-indigo-500 mb-2">
                                                <FiCode />
                                                <span className="text-[10px] font-black uppercase">Coding Solved</span>
                                            </div>
                                            <div className="text-3xl font-black dark:text-white">
                                                {selectedStudent.solvedProblems?.filter(p => p.type === 'coding').length || 0}
                                            </div>
                                        </div>
                                        <div className="bg-teal-500/5 border border-teal-500/10 p-6 rounded-3xl">
                                            <div className="flex items-center gap-3 text-teal-500 mb-2">
                                                <FiBook />
                                                <span className="text-[10px] font-black uppercase">Aptitude Solved</span>
                                            </div>
                                            <div className="text-3xl font-black dark:text-white">
                                                {selectedStudent.solvedProblems?.filter(p => p.type === 'aptitude').length || 0}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <FiCheckCircle className="text-emerald-500" />
                                            <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400">Solved Registry</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedStudent.solvedProblems && selectedStudent.solvedProblems.length > 0 ? (
                                            selectedStudent.solvedProblems.slice().reverse().map((solved, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-2 h-2 rounded-full ${solved.type === 'coding' ? 'bg-indigo-500' : 'bg-teal-500'}`}></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{solved.problemId || solved.questionId || 'N/A'}</p>
                                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{solved.type}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {new Date(solved.solvedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-slate-300 font-bold opacity-50 uppercase tracking-widest text-[10px]">
                                                No challenges solved recorded
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminStudents;
