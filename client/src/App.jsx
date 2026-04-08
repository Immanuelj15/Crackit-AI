import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/LandingPage';
import CompanyDetail from './pages/CompanyDetail';
import AptitudeTest from './pages/AptitudeTest';
import Companies from './pages/Companies';
import MockInterview from './pages/MockInterview';
import TopicSelection from './pages/TopicSelection';
import TopicDetail from './pages/TopicDetail';
// import ChatbotHistory from './pages/ChatbotHistory'; // File does not exist, removing for now
import Profile from './pages/Profile';
import CodingPractice from './pages/CodingPractice';
import CodingProblemList from './components/CodingProblemList';
import CodingProblemDetail from './pages/CodingProblemDetail';
import Leaderboard from './pages/Leaderboard';
import InterviewBank from './pages/InterviewBank';
import SystemDesign from './pages/SystemDesign';
import CoreCSSelection from './pages/CoreCSSelection';
import Feedback from './pages/Feedback';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/Admin/AdminProtectedRoute';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminStudents from './pages/Admin/AdminStudents';
import AdminCodingProblems from './pages/Admin/AdminCodingProblems';
import AddCodingProblem from './pages/Admin/AddCodingProblem';
import AdminAptitude from './pages/Admin/AdminAptitude';
import AddAptitudeQuestion from './pages/Admin/AddAptitudeQuestion';
import AdminFeedback from './pages/Admin/AdminFeedback';
import { ThemeProvider } from './context/ThemeContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/company/:id",
    element: (
      <ProtectedRoute>
        <CompanyDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mock-interview",
    element: (
      <ProtectedRoute>
        <MockInterview />
      </ProtectedRoute>
    ),
  },
  {
    path: "/aptitude",
    element: (
      <ProtectedRoute>
        <TopicSelection />
      </ProtectedRoute>
    ),
  },
  {
    path: "/aptitude/:category",
    element: (
      <ProtectedRoute>
        <TopicSelection />
      </ProtectedRoute>
    ),
  },
  {
    path: "/aptitude/:category/:id",
    element: (
      <ProtectedRoute>
        <TopicDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/topic/:id",
    element: (
      <ProtectedRoute>
        <TopicDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/test/:topicId",
    element: (
      <ProtectedRoute>
        <AptitudeTest />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coding",
    element: (
      <ProtectedRoute>
        <CodingPractice />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coding/:pattern",
    element: (
      <ProtectedRoute>
        <CodingProblemList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coding/problem/:slug",
    element: (
      <ProtectedRoute>
        <CodingProblemDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <ProtectedRoute>
        <Leaderboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/interview-questions",
    element: (
      <ProtectedRoute>
        <InterviewBank />
      </ProtectedRoute>
    ),
  },
  {
    path: "/system-design",
    element: (
      <ProtectedRoute>
        <SystemDesign />
      </ProtectedRoute>
    ),
  },
  {
    path: "/core-cs",
    element: (
      <ProtectedRoute>
        <CoreCSSelection />
      </ProtectedRoute>
    ),
  },
  {
    path: "/core-cs/:id",
    element: (
      <ProtectedRoute>
        <TopicDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feedback",
    element: (
      <ProtectedRoute>
        <Feedback />
      </ProtectedRoute>
    ),
  },
  // Admin Routes
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/students",
    element: (
      <AdminProtectedRoute>
        <AdminStudents />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/coding",
    element: (
      <AdminProtectedRoute>
        <AdminCodingProblems />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/coding/add",
    element: (
      <AdminProtectedRoute>
        <AddCodingProblem />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/aptitude",
    element: (
      <AdminProtectedRoute>
        <AdminAptitude />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/aptitude/add",
    element: (
      <AdminProtectedRoute>
        <AddAptitudeQuestion />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/feedback",
    element: (
      <AdminProtectedRoute>
        <AdminFeedback />
      </AdminProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
