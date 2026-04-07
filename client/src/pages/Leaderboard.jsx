import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiAward, FiZap, FiStar, FiUser } from 'react-icons/fi';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const { data } = await axios.get('/api/gamification/leaderboard', { withCredentials: true });
                setLeaders(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4">
                <header className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block p-4 bg-yellow-400 rounded-3xl shadow-xl mb-6 shadow-yellow-500/20"
                    >
                        <FiAward className="text-4xl text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Global Leaderboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Top performers and consistent learners on CrackIt AI</p>
                </header>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                    <div className="grid grid-cols-12 px-8 py-6 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5">User</div>
                        <div className="col-span-2 text-center">Solved</div>
                        <div className="col-span-2 text-center">Streak</div>
                        <div className="col-span-2 text-right">Coins</div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {leaders.map((leader, index) => (
                            <motion.div
                                key={leader._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`grid grid-cols-12 items-center px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all group ${index < 3 ? 'bg-gradient-to-r from-indigo-500/5 to-purple-500/5' : ''}`}
                            >
                                <div className="col-span-1">
                                    {index === 0 ? <FiStar className="text-yellow-500 text-xl" /> :
                                        index === 1 ? <FiStar className="text-gray-400 text-xl" /> :
                                            index === 2 ? <FiStar className="text-orange-400 text-xl" /> :
                                                <span className="text-sm font-black text-gray-400">{index + 1}</span>}
                                </div>
                                <div className="col-span-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800 overflow-hidden">
                                        {leader.picture ? <img src={leader.picture} alt="" className="w-full h-full object-cover" /> : leader.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase text-sm tracking-tighter">{leader.name}</div>
                                        <div className="text-[10px] text-gray-400 font-bold tracking-widest">{leader.college || 'CrackIt User'}</div>
                                    </div>
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{leader.solvedCount || 0}</span>
                                    </div>
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/30 rounded-full border border-orange-100 dark:border-orange-900/50">
                                        <FiZap className="text-orange-500 text-xs" />
                                        <span className="text-xs font-black text-orange-600 dark:text-orange-400">{leader.streak || 0}</span>
                                    </div>
                                </div>
                                <div className="col-span-2 text-right">
                                    <div className="text-lg font-black text-gray-900 dark:text-white flex items-center justify-end gap-1.5">
                                        <span className="text-yellow-500">$</span>
                                        {leader.coins || 0}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400 font-medium italic">Leaderboard updates in real-time based on successful problem submissions and streaks.</p>
            </div>
        </div>
    );
};

export default Leaderboard;
