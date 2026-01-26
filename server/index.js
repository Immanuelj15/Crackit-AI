const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration (allow credentials for cookies)
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));



app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Global Server Error:", err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
