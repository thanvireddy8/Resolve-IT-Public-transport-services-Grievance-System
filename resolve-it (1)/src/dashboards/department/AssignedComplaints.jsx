
import React, { useState } from 'react';
import { mockComplaints } from '../../data/mockComplaints';
import { ClipboardList, AlertCircle, Settings, CheckCircle2, User, Calendar, Tag } from 'lucide-react';

const statusOptions = ['All Status', 'Pending', 'In Progress', 'Resolved'];
const priorityColors = {
  High: 'bg-red-500/20 text-red-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  Low: 'bg-green-500/20 text-green-400',
};

const AssignedComplaints = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [sort, setSort] = useState('Newest First');
  const complaints = mockComplaints;
  // Get unique departments from complaints
  const departments = Array.from(new Set(complaints.map(c => c.assignedDepartment).filter(Boolean)));
  const [selectedDept, setSelectedDept] = useState(departments[0] || '');
  // Stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };
  // Filtering (department, search, status, sort)
  let filtered = complaints
    .filter(c => !selectedDept || c.assignedDepartment === selectedDept)
    .filter(c =>
      (search === '' || c.subject.toLowerCase().includes(search.toLowerCase()) || c.userName.toLowerCase().includes(search.toLowerCase())) &&
      (status === 'All Status' || c.status === status)
    );
  if (sort === 'Newest First') filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort === 'Oldest First') filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="w-full">
      <div className="flex flex-row items-center gap-4 mb-6">
        <div className="text-lg font-bold text-emerald-400">Department: <span className="text-white"><select className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-emerald-400 font-bold" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>{departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}</select></span></div>
      </div>
      {/* Removed Complaint Management Dashboard heading as per user request */}
      {/* Stat cards row */}
      <div className="flex flex-row gap-6 mb-6">
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
      {/* Filters */}
      <div className="flex flex-row gap-3 items-center mb-4">
        <input
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100"
          placeholder="Search complaints..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100" value={status} onChange={e => setStatus(e.target.value)}>
          {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100" value={sort} onChange={e => setSort(e.target.value)}>
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg">Filter</button>
      </div>
      {/* Complaints Table */}
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 overflow-x-auto">
        <h3 className="text-xl font-bold text-white mb-2">Assigned Complaints</h3>
        <table className="min-w-full text-sm text-zinc-300">
          <thead>
            <tr className="bg-zinc-800 text-zinc-400">
              <th className="px-4 py-2">Complaint ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-zinc-800">
                <td className="px-4 py-2 font-bold text-emerald-400">{c.id}</td>
                <td className="px-4 py-2">{c.userName}</td>
                <td className="px-4 py-2">{c.category}</td>
                <td className="px-4 py-2">{c.subject}</td>
                <td className="px-4 py-2">{c.description}</td>
                <td className="px-4 py-2 flex items-center gap-2"><Calendar className="w-4 h-4" />{c.date}</td>
                <td className={`px-4 py-2 font-bold ${priorityColors[c.priority]}`}>{c.priority}</td>
                <td className="px-4 py-2 font-bold">
                  <span className={
                    c.status === 'Pending' ? 'bg-amber-900 text-amber-400 px-2 py-1 rounded-lg' :
                    c.status === 'In Progress' ? 'bg-blue-900 text-blue-400 px-2 py-1 rounded-lg' :
                    c.status === 'Resolved' ? 'bg-emerald-900 text-emerald-400 px-2 py-1 rounded-lg' : ''
                  }>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {c.status === 'Pending' && <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg">Start</button>}
                  {c.status === 'In Progress' && <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg">Resolve</button>}
                  {c.status === 'Resolved' && <span className="text-emerald-400">Done</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedComplaints;
