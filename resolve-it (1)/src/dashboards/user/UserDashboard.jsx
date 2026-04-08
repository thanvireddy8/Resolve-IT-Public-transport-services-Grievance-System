import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, MessageSquare, Bell } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar.jsx';
import { FeatureNavigation } from '../../components/FeatureNavigation.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserOverview } from './UserOverview.jsx';
import MyComplaints from "./MyComplaints";
import { RaiseComplaint } from './RaiseComplaint.jsx';
import { FeedbackForm } from './FeedbackForm.jsx';
import { UserNotifications } from './UserNotifications.jsx';
import { UserProfile } from './UserProfile.jsx';
import ChatbotWidget from '../../components/ChatbotWidget.jsx';

export const UserDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sidebarItems = [
    { to: '/user/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/user/complaints', icon: FileText, label: 'My Complaints' },
    { to: '/user/raise', icon: PlusCircle, label: 'Raise Complaint' },
    { to: '/user/feedback', icon: MessageSquare, label: 'Feedback' },
    { to: '/user/notifications', icon: Bell, label: 'Notifications' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'user') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar 
        title="Resolve-It" 
        items={sidebarItems} 
        onLogout={handleLogout} 
      />
      
      <main className="ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Welcome back, {user.name}</h2>
            <p className="text-zinc-400 mt-1">Track and manage your transport grievances.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Page sliders (FeatureNavigation) to the left of notifications */}
            <FeatureNavigation items={sidebarItems} />
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border-2 border-zinc-900"></span>
            </button>
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-500 font-bold transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                {user.name.charAt(0)}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/user/profile');
                    }}
                    className="w-full text-left px-4 py-3 text-zinc-100 hover:bg-zinc-800 transition"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-3 text-zinc-100 hover:bg-zinc-800 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="overview" />} />
          <Route path="overview" element={<UserOverview />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="raise" element={<RaiseComplaint />} />
          <Route path="feedback" element={<FeedbackForm />} />
          <Route path="notifications" element={<UserNotifications />} />
          <Route path="profile" element={<UserProfile />} />
        </Routes>
      </main>
      <ChatbotWidget />
    </div>
  );
};
