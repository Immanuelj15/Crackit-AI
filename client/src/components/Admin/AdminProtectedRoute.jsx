import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0f1115]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (!user || user.role !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }

    return <AdminLayout>{children}</AdminLayout>;
};

export default AdminProtectedRoute;
