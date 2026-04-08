import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                // We assume the token is stored in HTTP-only cookie, so we just check /me or verify session
                // However, for this simple implementation, we might not have a /me endpoint yet?
                // Let's rely on localStorage for UI state or add a /me endpoint.
                // Actually, best practice with cookies is to call an endpoint to get current user.
                // Let's assume we persisted user in localStorage for non-sensitive UI or we fetch on load.

                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    setUser(JSON.parse(userInfo));
                }
                setLoading(false);

            } catch (error) {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post('/api/auth/login', { email, password }, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data; // success
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const register = async (name, email, password, college, branch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post('/api/auth/register', { name, email, password, college, branch }, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const googleLogin = async (tokenResult) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            // tokenResult from @react-oauth/google contains .credential
            const { data } = await axios.post('/api/auth/google', { token: tokenResult.credential }, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    }

    const logout = async () => {
        await axios.post('/api/auth/logout');
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateUserProfile = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.put('/api/auth/profile', formData, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const requestOtp = async (email) => {
        try {
            const { data } = await axios.post('/api/auth/request-otp', { email });
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const verifyOtpLogin = async (email, otp) => {
        try {
            const { data } = await axios.post('/api/auth/verify-otp', { email, otp });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const refreshUser = async () => {
        try {
            const { data } = await axios.get('/api/auth/me');
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Refresh User Error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, googleLogin, updateUserProfile, requestOtp, verifyOtpLogin, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
