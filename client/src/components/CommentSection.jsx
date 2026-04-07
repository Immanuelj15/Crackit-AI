import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiImage, FiThumbsUp, FiTrash2, FiMessageSquare, FiX, FiEdit2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ problemId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchComments();
    }, [problemId]);

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`/api/comments/${problemId}`);
            setComments(data);
        } catch (err) {
            console.error("Error fetching comments:", err);
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

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() && !image) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('content', newComment);
        formData.append('problem', problemId);
        if (image) {
            formData.append('image', image);
        }

        try {
            const { data } = await axios.post('/api/comments', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            setComments([data, ...comments]);
            setNewComment('');
            setImage(null);
            setImagePreview(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post comment");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            await axios.delete(`/api/comments/${commentId}`, { withCredentials: true });
            setComments(comments.filter(c => c._id !== commentId));
        } catch (err) {
            alert("Failed to delete comment");
        }
    };

    const handleLike = async (commentId) => {
        if (!user) return;
        try {
            const { data } = await axios.put(`/api/comments/${commentId}/like`, {}, { withCredentials: true });
            setComments(comments.map(c => 
                c._id === commentId ? { ...c, likes: data } : c
            ));
        } catch (err) {
            console.error("Error liking comment:", err);
        }
    };

    const startEditing = (comment) => {
        setEditingId(comment._id);
        setEditContent(comment.content);
        setEditImagePreview(comment.image);
        setEditImage(null);
        setImageRemoved(false);
    };

    const handleUpdateComment = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('content', editContent);
        if (editImage) {
            formData.append('image', editImage);
        }
        if (imageRemoved) {
            formData.append('imageRemoved', 'true');
        }

        try {
            const { data } = await axios.put(`/api/comments/${editingId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            setComments(comments.map(c => c._id === editingId ? data : c));
            setEditingId(null);
            setEditImage(null);
            setEditImagePreview(null);
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
                <FiMessageSquare className="text-sky-500" />
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Discussion Forum</h3>
                <span className="ml-auto bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-[10px] font-black text-gray-500">{comments.length} Comments</span>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto max-h-[600px]">
                <AnimatePresence initial={false}>
                    {comments.map((comment, idx) => (
                        <motion.div 
                            key={comment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 group"
                        >
                            <div className="flex-shrink-0">
                                <img 
                                    src={comment.user?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.name}`} 
                                    alt={comment.user?.name}
                                    className="w-10 h-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-black text-sm text-gray-900 dark:text-white mr-2">{comment.user?.name}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {(user?._id === comment.user?._id || user?.role === 'admin') && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            {user?._id === comment.user?._id && (
                                                <button 
                                                    onClick={() => startEditing(comment)}
                                                    className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/10 text-sky-400 rounded-lg"
                                                >
                                                    <FiEdit2 size={14} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-400 rounded-lg"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {editingId === comment._id ? (
                                    <form onSubmit={handleUpdateComment} className="space-y-3 pt-2">
                                        <textarea 
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-sm outline-none focus:border-sky-500 font-medium"
                                            rows="2"
                                        ></textarea>
                                        
                                        {editImagePreview && (
                                            <div className="relative inline-block mt-2">
                                                <img src={editImagePreview} className="w-20 h-20 object-cover rounded-lg border border-slate-200" alt="Edit Preview" />
                                                <button 
                                                    type="button"
                                                    onClick={() => { setEditImage(null); setEditImagePreview(null); setImageRemoved(true); }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                                >
                                                    <FiX size={10} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <label className="cursor-pointer p-2 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors">
                                                <FiImage size={14} />
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if(file) {
                                                        setEditImage(file);
                                                        setEditImagePreview(URL.createObjectURL(file));
                                                        setImageRemoved(false);
                                                    }
                                                }} />
                                            </label>
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="px-4 py-1.5 bg-sky-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                                            >
                                                {loading ? '...' : <><FiCheck /> Save</>}
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setEditingId(null)}
                                                className="px-4 py-1.5 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                            {comment.content}
                                        </div>
                                        {comment.image && (
                                            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 max-w-md bg-gray-50 dark:bg-gray-800/20">
                                                <img src={comment.image} alt="Attachment" className="w-full h-auto" />
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="flex items-center gap-4 pt-2">
                                    <button 
                                        onClick={() => handleLike(comment._id)}
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${comment.likes?.includes(user?._id) ? 'text-sky-500' : 'text-gray-400 hover:text-sky-500'}`}
                                    >
                                        <FiThumbsUp /> {comment.likes?.length || 0}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-6 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10">
                {user ? (
                    <form onSubmit={handlePostComment} className="space-y-4">
                        {imagePreview && (
                            <div className="relative inline-block">
                                <img src={imagePreview} className="w-24 h-24 object-cover rounded-xl border-2 border-sky-500/20 shadow-lg" alt="Preview" />
                                <button 
                                    type="button"
                                    onClick={() => { setImage(null); setImagePreview(null); }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                >
                                    <FiX size={12} />
                                </button>
                            </div>
                        )}
                        <div className="relative group">
                            <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts or ask a question..."
                                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 pr-32 text-sm font-medium outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all resize-none dark:text-white"
                                rows="3"
                            ></textarea>
                            <div className="absolute right-4 bottom-4 flex items-center gap-2">
                                <label className="cursor-pointer p-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm">
                                    <FiImage />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                                <button 
                                    disabled={loading || (!newComment.trim() && !image)}
                                    className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
                                >
                                    <FiSend />
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center">{error}</p>}
                    </form>
                ) : (
                    <div className="text-center p-6 bg-sky-50 dark:bg-sky-900/10 rounded-2xl border border-sky-100 dark:border-sky-900/20">
                        <p className="text-sm font-bold text-sky-600 dark:text-sky-400">Please <Link to="/login" className="underline font-black">login</Link> to join the conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
