import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiImage, FiCheckCircle, FiClock, FiAlertCircle, FiTrash2, FiSearch, FiFilter, FiExternalLink, FiX } from 'react-icons/fi';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const { data } = await axios.get('/api/feedback', { withCredentials: true });
            setFeedbacks(data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const { data } = await axios.put(`/api/feedback/${id}`, { status }, { withCredentials: true });
            setFeedbacks(feedbacks.map(f => f._id === id ? data : f));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;
        try {
            await axios.delete(`/api/feedback/${id}`, { withCredentials: true });
            setFeedbacks(feedbacks.filter(f => f._id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesFilter = filter === 'All' || f.status === filter;
        const matchesType = typeFilter === 'All' || f.type === typeFilter;
        const matchesSearch = f.content.toLowerCase().includes(search.toLowerCase()) || 
                             f.user?.name.toLowerCase().includes(search.toLowerCase()) ||
                             f.user?.email.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesType && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Reviewed': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="p-8 pb-20">
            <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Platform <span className="text-indigo-500">Feedback</span></h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Manage user reviews, bug reports, and suggestions</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        <FiFilter /> Status
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                        {['All', 'Pending', 'Reviewed', 'Resolved'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        <FiMessageSquare /> Type
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                        {['All', 'Bug', 'Suggestion', 'Appreciation', 'Other'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="relative mb-4">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by content, user name, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border-none rounded-3xl py-5 pl-14 pr-6 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm dark:text-white"
                    />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-white dark:bg-slate-800 rounded-[40px] animate-pulse"></div>)}
                    </div>
                ) : filteredFeedbacks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredFeedbacks.map(f => (
                                <motion.div 
                                    layout
                                    key={f._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group bg-white dark:bg-slate-800 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col relative overflow-hidden h-full"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(f.status)}`}>
                                            {f.status}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => handleDelete(f._id)}
                                                className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                                                {f.type === 'Bug' ? <FiAlertCircle /> : f.type === 'Appreciation' ? <FiCheckCircle /> : <FiMessageSquare />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{f.user?.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 truncate">{f.user?.email}</p>
                                            </div>
                                        </div>

                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">"{f.content}"</p>

                                        {f.image && (
                                            <div 
                                                onClick={() => setSelectedImage(f.image)}
                                                className="relative h-32 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 cursor-pointer group/img"
                                            >
                                                <img src={f.image} alt="Attachment" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-black uppercase tracking-widest gap-2">
                                                    <FiExternalLink /> View
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                            {new Date(f.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2">
                                            {f.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(f._id, 'Reviewed')}
                                                    className="px-4 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all"
                                                >
                                                    Reviewed
                                                </button>
                                            )}
                                            {(f.status === 'Pending' || f.status === 'Reviewed') && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(f._id, 'Resolved')}
                                                    className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                                                >
                                                    Resolved
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 grayscale opacity-30 text-center">
                        <FiMessageSquare size={80} className="mb-6 text-slate-300" />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">No Feedback Found</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Everything is running smoothly!</p>
                    </div>
                )}
            </div>

            {/* Full Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-xl"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-8 right-8 text-white hover:text-indigo-400 transition-colors p-3 bg-white/10 rounded-full"><FiX size={24} /></button>
                        <motion.img 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            src={selectedImage} 
                            alt="Full View" 
                            className="max-w-full max-h-full rounded-3xl shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminFeedback;
