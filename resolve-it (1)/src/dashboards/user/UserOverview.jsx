import React from 'react';
import { StatCard } from '../../components/DashboardCards.jsx';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useComplaints } from '../../context/ComplaintContext.jsx';

export const UserOverview = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'Pending').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Complaints" value={stats.total} icon={<FileText />} color="blue" />
        <StatCard label="Pending" value={stats.pending} icon={<AlertCircle />} color="amber" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock />} color="purple" />
        <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle />} color="emerald" />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl font-bold text-white">All Complaint Details</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 text-zinc-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-emerald-500 font-mono">{complaint.id}</td>
                    <td className="px-6 py-4">{complaint.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{complaint.category}</td>
                    <td className="px-6 py-4">{complaint.subject}</td>
                    <td className="px-6 py-4">{complaint.description}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.status === 'Resolved'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : complaint.status === 'In Progress'
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{complaint.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-6 text-center text-zinc-400">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};