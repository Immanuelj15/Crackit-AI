import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import MockInterview from './pages/MockInterview';
import CompanyDetail from './pages/CompanyDetail';
import AptitudePractice from './pages/AptitudePractice';
import TopicSelection from './pages/TopicSelection';
import TopicDetail from './pages/TopicDetail';
import Chatbot from './components/ChatBot';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();


  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 text-gray-900 dark:text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-interview"
              element={
                <ProtectedRoute>
                  <MockInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/:id"
              element={
                <ProtectedRoute>
                  <CompanyDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aptitude"
              element={
                <ProtectedRoute>
                  <AptitudePractice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aptitude/:category"
              element={
                <ProtectedRoute>
                  <TopicSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aptitude/:category/:topicId"
              element={
                <ProtectedRoute>
                  <TopicDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<LandingPage />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
          <Chatbot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
