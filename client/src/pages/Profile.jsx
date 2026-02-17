import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiMail, FiCalendar, FiAward, FiClock, FiTarget,
    FiActivity, FiEdit2, FiPhone, FiBook, FiLayers, FiCamera,
    FiX, FiCheck, FiBriefcase
} from 'react-icons/fi';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        year: '',
        phone: '',
        college: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                department: user.department || '',
                year: user.year || '',
                phone: user.phone || '',
                college: user.college || ''
            });
            setImagePreview(user.picture);
        }
    }, [user]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [statsRes, historyRes] = await Promise.all([
                    axios.get('/api/topics/stats', { withCredentials: true }),
                    axios.get('/api/topics/history', { withCredentials: true })
                ]);
                setStats(statsRes.data);
                setHistory(historyRes.data);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('department', formData.department);
        data.append('year', formData.year);
        data.append('phone', formData.phone);
        data.append('college', formData.college);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            await updateUserProfile(data);
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden sticky top-24">
                            {/* Header Gradient */}
                            <div className="h-32 bg-gradient-to-br from-sky-500 to-indigo-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            </div>

                            {/* Profile Content */}
                            <div className="px-8 pb-8 -mt-16 text-center relative z-10">
                                <div className="relative inline-block mb-4">
                                    <div className="h-32 w-32 mx-auto rounded-full p-1 bg-white dark:bg-gray-800 shadow-xl ring-4 ring-sky-500/20">
                                        <div className="h-full w-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative group">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-4xl font-bold text-sky-600 dark:text-sky-400">
                                                    {user?.name?.[0]?.toUpperCase() || <FiUser />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-2 right-2 bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-all transform hover:scale-110">
                                            <FiCamera className="w-4 h-4" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user?.name}</h2>
                                        <p className="text-sky-600 dark:text-sky-400 font-medium text-sm flex items-center justify-center gap-2 mb-2">
                                            {user?.college || 'Update College Name'}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-6 flex items-center justify-center gap-2">
                                            <FiMail className="w-3 h-3" /> {user?.email}
                                        </p>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full py-2.5 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                                        >
                                            <FiEdit2 className="w-4 h-4" /> Edit Profile
                                        </button>
                                    </>
                                ) : (
                                    <form onSubmit={handleUpdate} className="space-y-4 mb-6 text-left">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">College / University</label>
                                            <div className="relative">
                                                <FiBriefcase className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.college}
                                                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2 mt-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                                                    placeholder="Enter your college name"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => { setIsEditing(false); setFormData({ name: user.name, department: user.department, year: user.year, phone: user.phone, college: user.college }); setImagePreview(user.picture); }}
                                                className="flex-1 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors text-sm font-bold"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={updateLoading}
                                                className="flex-1 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 transition-all"
                                            >
                                                {updateLoading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                                    <FiCalendar className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium">Joined</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">Jan 2024</span>
                                        </div>

                                        {isEditing ? (
                                            <div className="space-y-4 animate-fadeIn">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 ml-1">DEPT</label>
                                                    <input
                                                        type="text"
                                                        value={formData.department}
                                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                                                        placeholder="CSE"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 ml-1">YEAR</label>
                                                    <input
                                                        type="text"
                                                        value={formData.year}
                                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                                                        placeholder="3rd Year"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 ml-1">PHONE</label>
                                                    <input
                                                        type="text"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                                                        placeholder="+91..."
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                                            <FiLayers className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium">Department</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{user?.department || 'Not set'}</span>
                                                </div>
                                                <div className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                        <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-500 dark:text-pink-400 group-hover:scale-110 transition-transform">
                                                            <FiBook className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium">Year</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{user?.year || 'Not set'}</span>
                                                </div>
                                                <div className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform">
                                                            <FiPhone className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium">Phone</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{user?.phone || 'Not set'}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Activity */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: 'Tests Taken', value: stats?.totalTests || 0, icon: <FiActivity />, color: 'sky' },
                                { label: 'Avg Accuracy', value: `${stats?.averageAccuracy || 0}%`, icon: <FiTarget />, color: 'emerald' },
                                { label: 'Topics Covered', value: stats?.topicsCompleted || 0, icon: <FiAward />, color: 'violet' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5 }}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20 dark:border-gray-700/50 flex flex-col items-start justify-center relative overflow-hidden group"
                                >
                                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
                                    <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 mb-4`}>
                                        <div className="w-6 h-6">{stat.icon}</div>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
                                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-gray-700/50 overflow-hidden min-h-[400px]">
                            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <span className="p-2 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-500">
                                        <FiClock className="w-5 h-5" />
                                    </span>
                                    Test History
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {history.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                            <FiActivity className="w-10 h-10" />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">No activity yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Start practicing to track your progress!</p>
                                    </div>
                                ) : (
                                    history.map((item, index) => (
                                        <div key={index} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-sky-600 transition-colors">
                                                        {item.topic?.name || 'Unknown Topic'}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                                        <FiCalendar className="w-3 h-3" />
                                                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-xl font-bold text-sm shadow-sm ${item.accuracy >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' :
                                                        item.accuracy >= 50 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-100 dark:border-amber-800' :
                                                            'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-800'
                                                    }`}>
                                                    {Math.round(item.accuracy)}%
                                                </div>
                                            </div>
                                            {item.aiFeedback && (
                                                <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">
                                                        "{item.aiFeedback}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
