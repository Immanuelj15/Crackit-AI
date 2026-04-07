import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-600">
            <AdminSidebar />
            
            <main className="flex-1 ml-64 min-h-screen">
                <div className="max-w-[1400px] mx-auto p-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
