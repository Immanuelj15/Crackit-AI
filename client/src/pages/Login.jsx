import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import DarkModeToggle from '../components/DarkModeToggle';

const Login = () => {
    const [loginMode, setLoginMode] = useState('email'); // 'email' or 'phone'

    // Email State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Phone State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const [error, setError] = useState('');

    const { login, googleLogin, sendOtp, verifyOtp, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!phoneNumber) {
            setError('Please enter a phone number');
            return;
        }
        setError('');
        try {
            await sendOtp(phoneNumber);
            setOtpSent(true);
        } catch (err) {
            setError(err);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await verifyOtp(phoneNumber, otp);
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
    const buttonClasses = "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-md transform transition-all duration-200";

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
                        Welcome Back
                    </motion.h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Sign in to access your dashboard
                    </p>
                </div>

                {/* Login Mode Toggle */}
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
                    <button
                        onClick={() => { setLoginMode('email'); setError(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginMode === 'email'
                                ? 'bg-white dark:bg-gray-700 text-sky-600 dark:text-sky-400 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Email
                    </button>
                    <button
                        onClick={() => { setLoginMode('phone'); setError(''); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginMode === 'phone'
                                ? 'bg-white dark:bg-gray-700 text-sky-600 dark:text-sky-400 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Phone
                    </button>
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

                {/* Email Form */}
                {loginMode === 'email' && (
                    <motion.form
                        key="email-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                        onSubmit={handleEmailLogin}
                    >
                        <div className="space-y-4">
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
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className={buttonClasses}
                        >
                            Sign in
                        </motion.button>
                    </motion.form>
                )}

                {/* Phone Form */}
                {loginMode === 'phone' && (
                    <motion.form
                        key="phone-form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                        onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
                    >
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="tel"
                                    required
                                    disabled={otpSent}
                                    className={`${inputClasses} ${otpSent ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder="Phone Number (e.g., 9876543210)"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            {otpSent && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <input
                                        type="text"
                                        required
                                        className={inputClasses}
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </motion.div>
                            )}
                        </div>
                        <div className="flex flex-col space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className={buttonClasses}
                            >
                                {otpSent ? 'Verify OTP & Login' : 'Send OTP'}
                            </motion.button>
                            {otpSent && (
                                <button
                                    type="button"
                                    onClick={() => { setOtpSent(false); setOtp(''); }}
                                    className="text-sm text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                                >
                                    Change Phone Number
                                </button>
                            )}
                        </div>
                    </motion.form>
                )}

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
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
