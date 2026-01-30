import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiAward, FiClock, FiTarget, FiActivity, FiEdit2, FiPhone, FiBook, FiLayers, FiCamera, FiX, FiCheck } from 'react-icons/fi';

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
        phone: ''
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
                phone: user.phone || ''
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
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            await updateUserProfile(data);
            setIsEditing(false);
            // Optional: Show success toast
        } catch (error) {
            console.error("Update failed:", error);
            // Optional: Show error toast
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center text-sky-600 font-bold">Loading Profile...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* User Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-sky-400 to-blue-600"></div>

                        <div className="relative z-10 -mt-12 mb-4">
                            <div className="relative inline-block">
                                <div className="h-24 w-24 mx-auto rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center text-3xl font-bold text-sky-600 dark:text-sky-300">
                                            {user?.name?.[0]?.toUpperCase() || <FiUser />}
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-sky-600 text-white p-2 rounded-full cursor-pointer hover:bg-sky-700 shadow-md transition-colors">
                                        <FiCamera className="w-4 h-4" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {!isEditing ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user?.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex items-center justify-center gap-2">
                                    <FiMail className="w-4 h-4" /> {user?.email}
                                </p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mb-6 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2 mx-auto hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <FiEdit2 /> Edit Profile
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleUpdate} className="mb-6 space-y-3">
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Full Name"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                                <div className="flex gap-2 justify-center">
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); setFormData({ ...formData, name: user.name }); setImagePreview(user.picture); }}
                                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <FiX />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-sky-700"
                                    >
                                        {updateLoading ? 'Saving...' : <><FiCheck /> Save</>}
                                    </button>
                                </div>
                            </form>
                        )}


                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 text-left">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Account Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2 min-w-[100px]"><FiCalendar /> Joined</span>
                                    <span className="font-medium text-gray-900 dark:text-white truncate">January 2024</span>
                                </div>

                                {isEditing ? (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400 font-bold ml-1">Department</label>
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
                                                <FiLayers className="text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    placeholder="e.g. CSE"
                                                    className="bg-transparent border-none text-sm w-full focus:outline-none dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400 font-bold ml-1">Year</label>
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
                                                <FiBook className="text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.year}
                                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                    placeholder="e.g. 3rd Year"
                                                    className="bg-transparent border-none text-sm w-full focus:outline-none dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400 font-bold ml-1">Phone</label>
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
                                                <FiPhone className="text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="Phone Number"
                                                    className="bg-transparent border-none text-sm w-full focus:outline-none dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2 min-w-[100px]"><FiLayers /> Dept</span>
                                            <span className="font-medium text-gray-900 dark:text-white truncate">{user?.department || 'Not set'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2 min-w-[100px]"><FiBook /> Year</span>
                                            <span className="font-medium text-gray-900 dark:text-white truncate">{user?.year || 'Not set'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2 min-w-[100px]"><FiPhone /> Phone</span>
                                            <span className="font-medium text-gray-900 dark:text-white truncate">{user?.phone || 'Not set'}</span>
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center justify-between text-sm pt-2">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2 min-w-[100px]"><FiUser /> Role</span>
                                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 capitalize">{user?.role || 'student'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                            <div className="h-12 w-12 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3">
                                <FiActivity className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalTests || 0}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tests Taken</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                            <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
                                <FiTarget className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.averageAccuracy || 0}%</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Accuracy</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                            <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
                                <FiAward className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.topicsCompleted || 0}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Topics Covered</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FiClock className="text-sky-500" /> Recent Activity
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {history.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    No tests taken yet. Start practicing!
                                </div>
                            ) : (
                                history.map((item, index) => (
                                    <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-800 dark:text-white">{item.topic?.name || 'Unknown Topic'}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.accuracy >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                item.accuracy >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {Math.round(item.accuracy)}% Score
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end text-sm text-gray-500 dark:text-gray-400">
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            <span className="text-xs max-w-md truncate ml-4 italic">{item.aiFeedback}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
