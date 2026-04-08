
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
// Bar chart data and color helpers
const statusBarColors = {
  Pending: '#f59e42', // amber
  'In Progress': '#6366f1', // indigo
  Resolved: '#34d399', // emerald
};

function getStatusBarData() {
  // Count complaints by status
  const counts = { Pending: 0, 'In Progress': 0, Resolved: 0 };
  (mockComplaints || []).forEach(c => {
    if (c.status && counts.hasOwnProperty(c.status)) {
      counts[c.status]++;
    }
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
import { mockComplaints } from '../../data/mockComplaints';

// Pie chart color palette
const pieColors = [
  '#34d399', // emerald
  '#f59e42', // amber
  '#6366f1', // indigo
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#a78bfa', // violet
  '#fbbf24', // yellow
];

function getCategoryPieData() {
  // Count complaints by category
  const counts = {};
  (mockComplaints || []).forEach(c => {
    if (c.category) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
import { LayoutDashboard, List, AlertCircle, Bell } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar.jsx';
import { FeatureNavigation } from '../../components/FeatureNavigation.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { DepartmentProfile } from './DepartmentProfile';
import AssignedComplaints from './AssignedComplaints';
import DepartmentNotifications from './DepartmentNotifications';

function DepartmentDashboard() {
  const { logout, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  // Sidebar navigation items for department
  const sidebarItems = [
    { to: '/department/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/department/complaints', icon: List, label: 'Assigned Complaints' },
    { to: '/department/notifications', icon: Bell, label: 'Notifications' },
  ];



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (!user || user.role !== 'department') {
    return <div className="text-red-500 p-8">Unauthorized. Please log in as a department user.</div>;
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
            <h2 className="text-3xl font-bold">Welcome back, <span className="capitalize text-green-400">{user.name}</span></h2>
            <p className="text-zinc-400 mt-1">Track and manage your department's grievances.</p>
          </div>
          <div className="flex items-center gap-4">
            <FeatureNavigation items={sidebarItems} />
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
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-zinc-100 hover:bg-zinc-800 transition-colors"
                    onClick={() => { setProfileOpen(false); setShowProfile(true); }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-500 hover:bg-zinc-800 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
              {showProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="relative">
                    <button
                      className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 text-xl font-bold z-10"
                      onClick={() => setShowProfile(false)}
                    >
                      ×
                    </button>
                    <DepartmentProfile />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 pt-0 pb-8 w-full flex flex-col justify-start">
          <Routes>
            <Route path="/overview" element={
              <div>
                {/* Analytics cards or overview content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-zinc-900 rounded-xl p-4 flex flex-col items-center shadow border border-zinc-800 min-w-[140px]">
                    <span className="text-zinc-400 mb-1 text-sm">Total Complaints</span>
                    <span className="text-2xl font-bold text-green-400">4</span>
                  </div>
                  <div className="bg-zinc-900 rounded-xl p-4 flex flex-col items-center shadow border border-zinc-800 min-w-[140px]">
                    <span className="text-zinc-400 mb-1 text-sm">Pending</span>
                    <span className="text-2xl font-bold text-amber-400">2</span>
                  </div>
                  <div className="bg-zinc-900 rounded-xl p-4 flex flex-col items-center shadow border border-zinc-800 min-w-[140px]">
                    <span className="text-zinc-400 mb-1 text-sm">In Progress</span>
                    <span className="text-2xl font-bold text-purple-400">0</span>
                  </div>
                  <div className="bg-zinc-900 rounded-xl p-4 flex flex-col items-center shadow border border-zinc-800 min-w-[140px]">
                    <span className="text-zinc-400 mb-1 text-sm">Resolved</span>
                    <span className="text-2xl font-bold text-emerald-400">2</span>
                  </div>
                </div>
                {/* Analytics section below cards */}
                <div className="bg-zinc-900 rounded-xl p-6 mt-4 border border-zinc-800 shadow flex flex-col">
                  <h3 className="text-xl font-semibold text-zinc-100 mb-4">Complaints by Category & Status</h3>
                  <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center" style={{ minHeight: 260 }}>
                    {/* Pie Chart */}
                    <div className="flex-1 min-w-[220px]">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={getCategoryPieData()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label
                          >
                            {getCategoryPieData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Bar Chart */}
                    <div className="flex-1 min-w-[220px]">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={getStatusBarData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={13} />
                          <YAxis stroke="#a1a1aa" fontSize={13} allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="Complaints" >
                            {getStatusBarData().map((entry, index) => (
                              <Cell key={`bar-cell-${index}`} fill={statusBarColors[entry.name] || '#8884d8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/complaints" element={<AssignedComplaints />} />
            <Route path="/notifications" element={<DepartmentNotifications />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default DepartmentDashboard;
