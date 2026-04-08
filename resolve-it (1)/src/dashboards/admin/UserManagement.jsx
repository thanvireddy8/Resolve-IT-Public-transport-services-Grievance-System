import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, MoreVertical } from 'lucide-react';
import { mockUsers, mockComplaints } from '../../data/mockData.js';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/users/role?role=user');
      if (!response.ok) {
        // Use mock users for demo if backend fails
        // Attach complaints to users
        const usersWithComplaints = mockUsers.map(u => ({
          ...u,
          complaints: mockComplaints.filter(c => c.userId === u.id)
        }));
        setUsers(usersWithComplaints);
        setError(null);
        return;
      }
      const data = await response.json();
      setUsers(data.map(u => ({ ...u, status: u.status || 'active' })));
      setError(null);
    } catch (err) {
      // Use mock users for demo if backend fails
      const usersWithComplaints = mockUsers.map(u => ({
        ...u,
        complaints: mockComplaints.filter(c => c.userId === u.id)
      }));
      setUsers(usersWithComplaints);
      setError(null);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintsByUser = async (userId) => {
    setComplaintsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/complaints/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setComplaints([]);
    } finally {
      setComplaintsLoading(false);
    }
  };

  const handleStatusToggle = (userId) => {
    setUsers(users => users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
    // TODO: Persist status change to backend if needed
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && user.status === 'active';
    if (filter === 'blocked') return matchesSearch && user.status === 'blocked';
    if (filter === 'high') return matchesSearch && user.complaints && user.complaints.length > 5;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-center text-zinc-400">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h3 className="text-xl font-bold">User Management</h3>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm focus:outline-none"
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="high">High Complaints</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 text-zinc-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Complaints</th>
                <th className="px-6 py-4 font-medium">Pending</th>
                <th className="px-6 py-4 font-medium">Resolved</th>
                <th className="px-6 py-4 font-medium">Last Activity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers.map((user) => {
                // Demo complaint stats (replace with real data if available)
                const total = user.complaints ? user.complaints.length : Math.floor(Math.random()*10);
                const pending = user.complaints ? user.complaints.filter(c => c.status !== 'Resolved').length : Math.floor(Math.random()*total);
                const resolved = user.complaints ? user.complaints.filter(c => c.status === 'Resolved').length : total - pending;
                const lastActivity = user.lastActivity || '2026-03-18';
                return (
                  <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 cursor-pointer" onClick={() => { setSelectedUser(user); fetchComplaintsByUser(user.id); }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{total}</td>
                    <td className="px-6 py-4">{pending}</td>
                    <td className="px-6 py-4">{resolved}</td>
                    <td className="px-6 py-4">{lastActivity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {user.status === 'active' ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${user.status === 'active' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'} transition`}
                        onClick={() => handleStatusToggle(user.id)}
                      >
                        {user.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Complaint Timeline Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Complaints by {selectedUser.name}</h2>
            {complaintsLoading ? (
              <div className="text-zinc-400">Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="text-zinc-400">No complaints found.</div>
            ) : (
              <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {complaints.sort((a, b) => new Date(b.date) - new Date(a.date)).map((c, idx) => (
                  <li key={c.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-emerald-400">{c.subject}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-500`}>{c.status}</span>
                    </div>
                    <div className="text-zinc-300 text-sm mb-1">{c.description}</div>
                    <div className="text-xs text-zinc-400">Date: {c.date}</div>
                    {/* Timeline step indicator */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs text-zinc-400">Step {idx + 1}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
