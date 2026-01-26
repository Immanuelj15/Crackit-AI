import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import DarkModeToggle from '../components/DarkModeToggle';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [college, setCollege] = useState('');
    const [branch, setBranch] = useState('');
    const [error, setError] = useState('');

    const { register, googleLogin, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register(name, email, password, college, branch);
        } catch (err) {
            setError(err);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse);
        } catch (err) {
            setError('Google Login Failed');
        }
    };

    const handleGoogleError = () => {
        setError('Google Login Failed');
    };

    const inputClasses = "appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:z-10 sm:text-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80";

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative">
            <div className="absolute top-4 right-4">
                <DarkModeToggle />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl dark:shadow-2xl border border-white/50 dark:border-gray-700"
            >
                <div>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 text-center text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                    >
                        Create Account
                    </motion.h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Join us and start your journey
                    </p>
                </div>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 rounded-lg p-3 text-center text-sm"
                    >
                        {error}
                    </motion.div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                required
                                className={inputClasses}
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                required
                                className={inputClasses}
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className={inputClasses}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className={inputClasses}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                required
                                className={inputClasses}
                                placeholder="College Name"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                required
                                className={inputClasses}
                                placeholder="Branch (e.g., CSE, ECE)"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-md transform transition-all duration-200"
                        >
                            Sign up
                        </motion.button>
                    </div>
                </form>

                <div className="flex flex-col items-center space-y-4 mt-8">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/60 rounded backdrop-blur-xl">Or continue with</span>
                        </div>
                    </div>
                    <div className="bg-white p-1 rounded-lg shadow-sm">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="outline"
                            shape="pill"
                        />
                    </div>
                </div>
                <div className="text-center">
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
