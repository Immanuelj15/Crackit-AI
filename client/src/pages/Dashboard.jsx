import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HistoryChart from '../components/HistoryChart';
import { FiTrendingUp, FiTarget, FiClock, FiActivity, FiArrowRight, FiAward } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState(null);
  const [codingStats, setCodingStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [codingHistory, setCodingHistory] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, statsRes, historyRes, codingStatsRes, codingHistoryRes, dailyChallengeRes] = await Promise.all([
          axios.get('/api/companies', { withCredentials: true }),
          axios.get('/api/topics/stats', { withCredentials: true }),
          axios.get('/api/topics/history', { withCredentials: true }),
          axios.get('/api/code/stats', { withCredentials: true }),
          axios.get('/api/code/submissions', { withCredentials: true }),
          axios.get('/api/gamification/daily-challenge', { withCredentials: true })
        ]);

        setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
        setStats(statsRes.data);
        setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
        setCodingStats(codingStatsRes.data);
        setCodingHistory(Array.isArray(codingHistoryRes.data) ? codingHistoryRes.data : []);
        setDailyChallenge(dailyChallengeRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Filter top companies (Ti1 or random 3)
  const recommendedCompanies = companies
    .filter(c => ['Amazon', 'Google', 'Microsoft'].includes(c.name))
    .slice(0, 3);

  // Fill if less than 3
  const finalRecommended = recommendedCompanies.length < 3
    ? [...recommendedCompanies, ...companies.filter(c => !['Amazon', 'Google', 'Microsoft'].includes(c.name))].slice(0, 3)
    : recommendedCompanies;

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Header */}
        <header className="mb-10 relative overflow-hidden rounded-3xl p-8 shadow-2xl">
          {/* Background with mesh gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-black z-0"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none z-0"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none z-0"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
                  AI-Powered Learning
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4"
              >
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">{user?.name.split(' ')[0]}</span>.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl font-light leading-relaxed"
              >
                Your personal command center is ready. Review your stats, track your progress, and continue your journey to mastery.
              </motion.p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/aptitude" className="group relative px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-bold text-lg shadow-lg hover:shadow-sky-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                <span className="relative z-10">Aptitude</span>
                <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/coding" className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                <span className="relative z-10">Coding</span>
                <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-sky-500 font-bold text-xl animate-pulse">
            Initializing System...
          </div>
        ) : error ? (
          <div className="bg-red-500/10 backdrop-blur text-red-500 p-6 rounded-2xl border border-red-500/20 text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column - Main Stats & Chart */}
            <div className="lg:col-span-2 space-y-8">

              {/* Daily Challenge Card */}
              {dailyChallenge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><FiTarget size={80} /></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-200 text-xs font-black uppercase tracking-widest mb-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Daily Challenge
                      </div>
                      <h3 className="text-3xl font-black text-white tracking-tight mb-2">{dailyChallenge.title}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white uppercase tracking-wider`}>
                          {dailyChallenge.difficulty || 'Medium'}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">+10 COINS REWARD</span>
                      </div>
                    </div>
                    <Link
                      to={`/coding/problem/${dailyChallenge.slug}`}
                      className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Solve Now
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Key Metrics */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-4 gap-4"
              >
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between h-36 group hover:border-sky-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                      <FiTarget size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aptitude</span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-sky-500 transition-colors">{stats?.topicsCompleted || 0}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Topics Done</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between h-36 group hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <FiActivity size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coding</span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">{codingStats?.totalSolved || 0}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Problems Solved</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between h-36 group hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <FiTrendingUp size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall</span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors">{stats?.averageAccuracy || 0}%</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Avg. Accuracy</div>
                  </div>
                </div>

                <Link to="/leaderboard" className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between h-36 group hover:border-yellow-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400">
                      <FiAward size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rankings</span>
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-yellow-500 transition-colors flex items-center gap-1.5">
                      <span className="text-yellow-500 italic">#</span>Leaderboard
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">World Ranking</div>
                  </div>
                </Link>
              </motion.div>

              {/* Performance Chart */}
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Aptitude Performance
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Your accuracy over the last 10 attempts</p>
                  </div>
                </div>
                <HistoryChart history={history} />
              </div>

              {/* Coding Progress Section */}
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Coding Pattern Progress</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {codingStats?.patternWiseSolved?.length > 0 ? (
                    codingStats.patternWiseSolved.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{item._id}</span>
                          <span className="text-emerald-500 font-bold">{item.solvedCount} Solved</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(item.solvedCount * 10, 100)}%` }}
                            className="bg-emerald-500 h-full rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm italic col-span-2">Start solving problems to see pattern-wise progress!</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column - Activity */}
            <div className="space-y-8">

              {/* Combined Activity Feed */}
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <FiClock className="text-slate-400" /> Recent Submissions
                </h3>
                <div className="space-y-4">
                  {codingHistory.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-slate-500 font-medium">No results yet.</p>
                    </div>
                  ) : (
                    codingHistory.slice(0, 5).map((sub, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-900 dark:text-white text-[13px] line-clamp-1">{sub.problemId?.title}</h4>
                          <span className={`${sub.verdict === 'Accepted' ? 'text-emerald-500' : 'text-red-500'} font-bold text-[10px] uppercase tracking-tighter`}>{sub.verdict}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                          <span>{sub.language.toUpperCase()} • {sub.runtime}ms</span>
                          <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-6 flex items-center gap-2">
                  <FiActivity className="text-slate-400" /> Recent Tests
                </h3>
                <div className="space-y-4">
                  {history.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${item.accuracy >= 70 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                        {item.accuracy.toFixed(0)}%
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.topic?.name || 'Quick Test'}</p>
                        <p className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action */}
              <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-white text-center shadow-xl border border-slate-700">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-2xl">💻</div>
                  <h3 className="font-bold text-xl mb-2">Master the Patterns</h3>
                  <p className="text-slate-300 mb-6 text-sm leading-relaxed">Solve real company problems and master coding patterns.</p>
                  <Link to="/coding" className="inline-block w-full py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg active:scale-95">
                    Start Coding
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
