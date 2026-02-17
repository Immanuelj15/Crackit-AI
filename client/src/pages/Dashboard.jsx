import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HistoryChart from '../components/HistoryChart';
import { FiTrendingUp, FiTarget, FiClock, FiActivity, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, statsRes, historyRes] = await Promise.all([
          axios.get('/api/companies', { withCredentials: true }),
          axios.get('/api/topics/stats', { withCredentials: true }),
          axios.get('/api/topics/history', { withCredentials: true })
        ]);

        setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
        setStats(statsRes.data);
        setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
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

            <Link to="/aptitude" className="group relative px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-bold text-lg shadow-lg hover:shadow-sky-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
              <span className="relative z-10">Start Practice</span>
              <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
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

              {/* Key Metrics */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between h-36 group hover:border-sky-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                      <FiTarget size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Topics</span>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-sky-500 transition-colors">{stats?.topicsCompleted || 0}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Modules Completed</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between h-36 group hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <FiTrendingUp size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy</span>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">{stats?.averageAccuracy || 0}%</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Average Score</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between h-36 group hover:border-orange-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      <FiActivity size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activity</span>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">{stats?.totalTests || 0}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Tests Taken</div>
                  </div>
                </div>
              </motion.div>

              {/* Performance Chart */}
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Performance Trend
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Your accuracy over the last 10 attempts</p>
                  </div>
                </div>
                <HistoryChart history={history} />
              </div>

              {/* Recommended Companies */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recommended for You</h3>
                  <Link to="/companies" className="text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1 group bg-sky-50 dark:bg-sky-500/10 px-4 py-2 rounded-full transition-colors">
                    View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {finalRecommended.map(company => (
                    <Link key={company._id} to={`/company/${company._id}`} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 block group">
                      <div className="flex items-center gap-4 mb-4">
                        {company.logoUrl
                          ? <img src={company.logoUrl} className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-slate-700 p-2 shadow-sm" alt={company.name} />
                          : <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-bold text-lg">{company.name[0]}</div>
                        }
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">{company.name}</h4>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">{company.rounds?.length || 0} Rounds</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700/30 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column - Activity & Quick Actions */}
            <div className="space-y-8">

              {/* Recent Activity */}
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <FiClock className="text-slate-400" /> Recent Activity
                </h3>
                <div className="space-y-0">
                  {history.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">💤</div>
                      <p className="text-sm text-slate-500 font-medium">No activity yet.</p>
                      <p className="text-xs text-slate-400">Start a test to see it here.</p>
                    </div>
                  ) : (
                    history.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex gap-4 relative pb-8 last:pb-0">
                        {/* Timeline Line */}
                        {idx !== history.slice(0, 5).length - 1 && (
                          <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-700/50"></div>
                        )}

                        {/* Icon */}
                        <div className={`
                                        w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm transition-transform hover:scale-110
                                        ${item.accuracy >= 80 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : item.accuracy >= 50 ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}
                                    `}>
                          <span className="font-bold text-sm">{item.accuracy.toFixed(0)}%</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.topic?.name || 'Aptitude Test'}</h4>
                            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap ml-2">
                              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Score: <span className="font-medium text-slate-700 dark:text-slate-300">{item.score}/{item.totalQuestions}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Action */}
              <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-white text-center shadow-xl border border-slate-700">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/30 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-2xl">🚀</div>
                  <h3 className="font-bold text-xl mb-2">Push Your Limits</h3>
                  <p className="text-slate-300 mb-6 text-sm leading-relaxed">Ready to improve your score? Take a new challenge now.</p>
                  <Link to="/aptitude" className="inline-block w-full py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-sky-50 transition-colors shadow-lg active:scale-95">
                    Launch Assessment
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
