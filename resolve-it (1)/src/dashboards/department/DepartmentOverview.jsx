
import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Users, User, ClipboardList, Settings, CheckCircle2 } from 'lucide-react';
import { mockComplaints } from '../../data/mockComplaints';
import { StatCard } from '../../components/DashboardCards.jsx';

const getStats = (complaints) => ({
  total: complaints.length,
  pending: complaints.filter(c => c.status === 'Pending').length,
  inProgress: complaints.filter(c => c.status === 'In Progress').length,
  resolved: complaints.filter(c => c.status === 'Resolved').length,
});

const statusColors = {
  Pending: 'bg-amber-500/20 text-amber-400',
  'In Progress': 'bg-blue-500/20 text-blue-400',
  Resolved: 'bg-emerald-500/20 text-emerald-400',
};
const priorityColors = {
  High: 'bg-red-500/20 text-red-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  Low: 'bg-green-500/20 text-green-400',
};

export const DepartmentOverview = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All Status');
  const [sort, setSort] = useState('Newest First');
  const complaints = mockComplaints; // Show all complaints, no department filtering
  const stats = getStats(complaints);
  // Unique categories from ALL complaints
  const allCategories = Array.from(new Set(mockComplaints.map(c => c.category)));
  const categories = ['All', ...allCategories];
  // Filtering
  let filtered = complaints.filter(c =>
    (search === '' || c.subject.toLowerCase().includes(search.toLowerCase()) || c.userName.toLowerCase().includes(search.toLowerCase())) &&
    (category === 'All' || c.category === category) &&
    (status === 'All Status' || c.status === status)
  );
  if (sort === 'Newest First') filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort === 'Oldest First') filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  // Statuses for dropdown
  const statuses = ['All Status', 'Pending', 'In Progress', 'Resolved'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Complaint Management Dashboard</h2>
      </div>
      {/* Stat cards row */}
      <div className="flex flex-row gap-6 mb-2">
        <div className="flex-1 bg-zinc-900 rounded-xl p-6 flex flex-col justify-between min-w-[200px]">
          <ClipboardList className="w-8 h-8 text-emerald-400 mb-2" />
          <div className="text-zinc-400 text-base font-semibold">Total Assigned</div>
          <div className="text-4xl font-extrabold text-emerald-200 mt-1">{stats.total}</div>
        </div>
        <div className="flex-1 bg-zinc-900 rounded-xl p-6 flex flex-col justify-between min-w-[200px]">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
          <div className="text-zinc-400 text-base font-semibold">Pending</div>
          <div className="text-4xl font-extrabold text-amber-400 mt-1">{stats.pending}</div>
        </div>
        <div className="flex-1 bg-zinc-900 rounded-xl p-6 flex flex-col justify-between min-w-[200px]">
          <Settings className="w-8 h-8 text-blue-400 mb-2" />
          <div className="text-zinc-400 text-base font-semibold">In Progress</div>
          <div className="text-4xl font-extrabold text-blue-400 mt-1">{stats.inProgress}</div>
        </div>
        <div className="flex-1 bg-zinc-900 rounded-xl p-6 flex flex-col justify-between min-w-[200px]">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
          <div className="text-zinc-400 text-base font-semibold">Resolved</div>
          <div className="text-4xl font-extrabold text-emerald-400 mt-1">{stats.resolved}</div>
        </div>
      </div>
      {/* Department category selection above search/filter */}
      <div className="flex flex-row gap-3 items-center mb-2">
        <label className="text-zinc-100 font-semibold mr-2">Category:</label>
        <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>
      {/* Search and filter controls */}
      <div className="flex flex-row gap-3 items-center mb-2">
        <input
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 w-64"
          placeholder="Search complaints..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100" value={status} onChange={e => setStatus(e.target.value)}>
          {statuses.map(st => <option key={st}>{st}</option>)}
        </select>
        <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100" value={sort} onChange={e => setSort(e.target.value)}>
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">Filter</button>
      </div>
      {/* Assigned Complaints Table */}
      <div className="bg-zinc-900 rounded-xl overflow-x-auto">
        <div className="p-4 pb-2 text-xl font-bold text-white">Assigned Complaints</div>
        <table className="min-w-full text-base">
          <thead>
            <tr className="text-zinc-400 border-b border-zinc-800">
              <th className="py-2 px-3 font-semibold text-left">Complaint ID</th>
              <th className="py-2 px-3 font-semibold text-left">User</th>
              <th className="py-2 px-3 font-semibold text-left">Category</th>
              <th className="py-2 px-3 font-semibold text-left">Description</th>
              <th className="py-2 px-3 font-semibold text-left">Date</th>
              <th className="py-2 px-3 font-semibold text-left">Priority</th>
              <th className="py-2 px-3 font-semibold text-left">Status</th>
              <th className="py-2 px-3 font-semibold text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-zinc-500 text-center py-8">No complaints found.</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="border-b border-zinc-800 hover:bg-zinc-800/40 transition">
                {/* Complaint ID */}
                <td className="py-2 px-3 font-mono font-extrabold text-green-400">CPL-{c.id}</td>
                {/* User */}
                <td className="py-2 px-3"><span className="inline-flex items-center gap-2"><User className="w-5 h-5 text-zinc-400" /> <span className="font-semibold">{c.userName}</span></span></td>
                {/* Category */}
                <td className="py-2 px-3"><span className="inline-flex items-center gap-2"><ClipboardList className="w-5 h-5 text-green-400" /> <span className="font-semibold">{c.category}</span></span></td>
                {/* Description */}
                <td className="py-2 px-3 text-zinc-200">{c.description}</td>
                {/* Date */}
                <td className="py-2 px-3 text-zinc-400">{c.date}</td>
                {/* Priority */}
                <td className="py-2 px-3"><span className={`px-3 py-1 rounded-lg font-bold ${priorityColors[c.priority] || ''}`}>{c.priority}</span></td>
                {/* Status */}
                <td className="py-2 px-3"><span className={`px-3 py-1 rounded-lg font-bold ${statusColors[c.status] || ''}`}>{c.status}</span></td>
                {/* Action: Show Start for Pending, Update for In Progress/Resolved */}
                <td className="py-2 px-3">
                  {c.status === 'Pending' && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg font-bold">Start</button>
                  )}
                  {(c.status === 'In Progress' || c.status === 'Resolved') && (
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-1 rounded-lg font-bold">Update</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
