import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DarkModeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 ${theme === 'dark'
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-sky-100 text-sky-600 hover:bg-sky-200'
                }`}
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </motion.button>
    );
};

export default DarkModeToggle;
