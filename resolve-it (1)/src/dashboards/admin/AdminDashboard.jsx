import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, Users, BarChart3, Bell } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar.jsx';
import { FeatureNavigation } from '../../components/FeatureNavigation.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { AdminOverview } from './AdminOverview.jsx';
import { ManageComplaints } from './ManageComplaints.jsx';
import { UserManagement } from './UserManagement.jsx';
import { Reports } from './Reports.jsx';
import { AdminNotifications } from './AdminNotifications.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { UserProfile } from '../user/UserProfile.jsx';

export const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const { getNotificationsByRole } = useComplaints();
  const navigate = useNavigate();
  const unreadCount = getNotificationsByRole('admin').filter(n => !n.isRead).length;

  const sidebarItems = [
    { to: '/admin/overview', icon: LayoutDashboard, label: 'Dashboard Overview' },
    { to: '/admin/complaints', icon: ShieldCheck, label: 'Manage Complaints' },
    { to: '/admin/notifications', icon: Bell, label: 'Admin Notifications' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar 
        title="Resolve-It Admin" 
        items={sidebarItems} 
        onLogout={handleLogout} 
      />
      
      <main className="ml-64 p-8">
        <FeatureNavigation items={sidebarItems} />
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Admin Control Center</h2>
            <p className="text-zinc-400 mt-1">Monitor and resolve public transport grievances.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/notifications')}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-emerald-500 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-900"></span>
              )}
            </button>
            <button
              onClick={() => navigate('/admin/profile')}
              className="w-8 h-8 bg-emerald-500 text-zinc-950 rounded-full flex items-center justify-center font-bold text-sm border border-zinc-800 hover:bg-emerald-600 transition"
              title="Profile"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="overview" />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="complaints" element={<ManageComplaints />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<UserProfile />} />
        </Routes>
      </main>
    </div>
  );
};
