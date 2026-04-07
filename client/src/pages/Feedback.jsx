import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSend, FiImage, FiCheckCircle, FiClock, FiAlertCircle, 
    FiTrash2, FiMessageCircle, FiX, FiEdit2, FiZap, FiHeart, FiMoreHorizontal, FiStar 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from '../components/DarkModeToggle';

const Feedback = () => {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [content, setContent] = useState('');
    const [type, setType] = useState('Suggestion');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [imageRemoved, setImageRemoved] = useState(false);

    useEffect(() => {
        if (user) {
            fetchMyFeedback();
        }
    }, [user]);

    const fetchMyFeedback = async () => {
        try {
            const { data } = await axios.get('/api/feedback/my', { withCredentials: true });
            setFeedbacks(data);
        } catch (err) {
            console.error("Error fetching feedback:", err);
        } finally {
            setFetching(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('content', content);
        formData.append('type', type);
        if (image) {
            formData.append('image', image);
        }
        if (imageRemoved) {
            formData.append('imageRemoved', 'true');
        }

        try {
            if (isEditing) {
                const { data } = await axios.put(`/api/feedback/${editId}/status`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
                setFeedbacks(feedbacks.map(f => f._id === editId ? data : f));
                setSuccess(true);
                resetForm();
            } else {
                const { data } = await axios.post('/api/feedback', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
                setFeedbacks([data, ...feedbacks]);
                setSuccess(true);
                resetForm();
            }
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setContent('');
        setType('Suggestion');
        setImage(null);
        setImagePreview(null);
        setIsEditing(false);
        setEditId(null);
        setImageRemoved(false);
    };

    const handleEditClick = (item) => {
        setIsEditing(true);
        setEditId(item._id);
        setContent(item.content);
        setType(item.type);
        setImagePreview(item.image);
        setImageRemoved(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/feedback/${id}`, { withCredentials: true });
            setFeedbacks(feedbacks.filter(f => f._id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
            case 'Reviewed': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getTypeIcon = (t) => {
        switch (t) {
            case 'Bug': return <FiAlertCircle />;
            case 'Appreciation': return <FiHeart />;
            case 'Suggestion': return <FiZap />;
            default: return <FiMoreHorizontal />;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const categories = [
        { name: 'Suggestion', icon: <FiZap /> },
        { name: 'Bug', icon: <FiAlertCircle /> },
        { name: 'Appreciation', icon: <FiHeart /> },
        { name: 'Other', icon: <FiMoreHorizontal /> }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b0e14] transition-colors duration-500 relative overflow-hidden pb-32">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-sky-500/5 via-indigo-500/5 to-transparent opacity-60 pointer-events-none"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 pt-16 relative z-10">
                {/* Modern Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
                    <div className="space-y-3">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-500 text-[10px] font-black uppercase tracking-[3px] shadow-[0_0_20px_rgba(14,165,233,0.1)]"
                        >
                            <FiStar className="animate-spin-slow" /> Platform Evolution
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl font-black tracking-tighter"
                        >
                            FEEDBACK <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">HUB</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-xl"
                        >
                            Your voice drives the engineering behind CrackIt AI. Bridge the gap between ideas and implementation.
                        </motion.p>
                    </div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-white/5 p-2 rounded-[24px] shadow-2xl backdrop-blur-xl border border-white/10"
                    >
                        <DarkModeToggle />
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* REDESIGNED FORM CARD */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-5 sticky top-12"
                    >
                        <div className="bg-white/80 dark:bg-[#151921]/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white dark:border-white/5 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-xl shadow-sky-500/20">
                                    <FiMessageCircle />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1 uppercase tracking-tight">
                                        {isEditing ? 'MODIFY CASE' : 'OPEN NEW CASE'}
                                    </h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-50">Response within 24h</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-2">Select Category</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.map(cat => (
                                            <button 
                                                key={cat.name}
                                                type="button"
                                                onClick={() => setType(cat.name)}
                                                className={`group flex items-center gap-3 py-4 px-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all border-2 ${type === cat.name ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xl translate-y-[-2px]' : 'bg-transparent text-slate-400 border-slate-100 dark:border-white/5 hover:border-sky-500/30'}`}
                                            >
                                                <span className={`${type === cat.name ? 'text-sky-400' : 'text-slate-300 dark:text-slate-700 group-hover:text-sky-500'} transition-colors`}>{cat.icon}</span>
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-2">Technical Description</label>
                                    <textarea 
                                        required
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="What can we improve? Describe the issue or your vision..."
                                        className="w-full bg-slate-50 dark:bg-black/20 border-2 border-transparent focus:border-sky-500/30 dark:focus:border-sky-500/30 rounded-[30px] p-6 text-sm font-medium focus:ring-[15px] focus:ring-sky-500/5 transition-all outline-none resize-none dark:text-white h-44 shadow-inner"
                                    ></textarea>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-2">Evidence Attachment</label>
                                    {imagePreview ? (
                                        <div className="relative w-full aspect-[4/3] rounded-[35px] overflow-hidden border border-slate-100 dark:border-white/5 group shadow-2xl">
                                            <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <button 
                                                    type="button"
                                                    onClick={() => { setImage(null); setImagePreview(null); setImageRemoved(true); }}
                                                    className="bg-white text-rose-600 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-transform"
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[30px] cursor-pointer hover:bg-white dark:hover:bg-white/[0.08] hover:border-sky-500 transition-all group overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-indigo-500/0 group-hover:from-sky-500/5 group-hover:to-indigo-500/5 transition-colors"></div>
                                            <FiImage size={24} className="text-slate-300 dark:text-slate-600 group-hover:text-sky-500 mb-2 transition-transform group-hover:scale-110" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Drag & Drop or Browser</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>

                                <div className="space-y-3 pt-4">
                                    <button 
                                        disabled={loading}
                                        className={`w-full py-5 rounded-[26px] font-black uppercase text-[11px] tracking-[3px] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] ${isEditing ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-black/20 dark:shadow-white/5'}`}
                                    >
                                        {loading ? (
                                            <div className="animate-spin h-5 w-5 border-3 border-current border-t-transparent rounded-full"></div>
                                        ) : (
                                            <>{isEditing ? <FiCheckCircle size={18} /> : <FiSend size={18} />} {isEditing ? 'COMMIT UPDATES' : 'TRANSMIT FEEDBACK'}</>
                                        )}
                                    </button>

                                    {isEditing && (
                                        <button 
                                            type="button"
                                            onClick={resetForm}
                                            className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-[22px] font-black uppercase text-[9px] tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/5"
                                        >
                                            Discard Changes
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {success && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-emerald-500/10 text-emerald-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-emerald-500/20"
                                        >
                                            Transmission Successful! Result Logged.
                                        </motion.div>
                                    )}
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-rose-500/20"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </motion.div>

                    {/* REDESIGNED TIMELINE HISTORY */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-12 px-6">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[4px]">Activity Log</h2>
                            <div className="flex items-center gap-2">
                                <span className="bg-sky-500/10 text-sky-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {feedbacks.length} ENTRIES
                                </span>
                            </div>
                        </div>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {fetching ? (
                                <div className="space-y-6">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="h-44 bg-slate-100 dark:bg-white/5 rounded-[40px] animate-pulse"></div>
                                    ))}
                                </div>
                            ) : feedbacks.length > 0 ? (
                                feedbacks.map(item => (
                                    <motion.div 
                                        key={item._id}
                                        variants={itemVariants}
                                        layout
                                        className="group bg-white dark:bg-[#151921] p-8 rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-sky-500/20 transition-all duration-500 flex items-start gap-8 relative overflow-hidden"
                                    >
                                        {/* Status Glow Bar */}
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full ${item.status === 'Resolved' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : item.status === 'Reviewed' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>

                                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 text-xl shadow-lg ${item.type === 'Bug' ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' : item.type === 'Appreciation' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' : 'bg-sky-50 text-sky-500 dark:bg-sky-500/10'}`}>
                                            {getTypeIcon(item.type)}
                                        </div>

                                        <div className="flex-1 min-w-0 pr-12">
                                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[2px] border ${getStatusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 tracking-tighter uppercase">
                                                    <FiClock className="opacity-50" /> {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 tracking-widest uppercase ml-auto">REF: {item._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-relaxed mb-6">
                                                {item.content}
                                            </p>
                                            
                                            {item.image && (
                                                <div className="w-full max-w-xs overflow-hidden rounded-2xl border border-slate-100 dark:border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                                                    <img src={item.image} alt="Evidence" className="w-full h-auto" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 flex flex-col gap-2 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            {item.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleEditClick(item)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-400 hover:text-sky-500 hover:scale-110 shadow-xl rounded-xl transition-all border border-slate-100 dark:border-white/5"
                                                    title="Edit Log"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:scale-110 shadow-xl rounded-xl transition-all border border-slate-100 dark:border-white/5"
                                                title="Delete Log"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 bg-white/40 dark:bg-white/[0.02] rounded-[60px] border border-dashed border-slate-200 dark:border-white/10">
                                    <div className="w-24 h-24 bg-slate-100 dark:bg-black/20 rounded-full flex items-center justify-center text-slate-300 mb-8">
                                        <FiSend size={40} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-[5px] text-slate-400 mb-2">Registry Offline</h3>
                                    <p className="text-xs font-bold text-slate-400/50 uppercase tracking-tighter">Your feedback history is currently empty</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
