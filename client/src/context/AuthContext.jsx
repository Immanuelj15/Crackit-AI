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

    const sendOtp = async (phoneNumber) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/auth/otp/send', { phoneNumber }, config);
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const verifyOtp = async (phoneNumber, otp) => {
        try {
            // Note: with Firebase on client, we often just send the phone number to 'log in'
            // or send the ID token. For this prototype, we send phone + dummy OTP/flag if needed.
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/auth/otp/verify', { phoneNumber, otp }, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, googleLogin, sendOtp, verifyOtp, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
