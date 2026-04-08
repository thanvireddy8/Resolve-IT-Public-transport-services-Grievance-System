import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useComplaints } from "../../context/ComplaintContext.jsx";

export default function MyComplaints() {
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const handleView = (complaint) => {
      setSelectedComplaint(complaint);
    };

    const handleCloseModal = () => {
      setSelectedComplaint(null);
    };

  const { user } = useAuth();
  const { complaints } = useComplaints() || {};

  // Fallbacks to prevent blank page
  if (!user) {
    return <div className="text-red-500 p-8">Error: User not logged in.</div>;
  }
  if (!Array.isArray(complaints)) {
    return <div className="text-red-500 p-8">Error: Complaints data is invalid or not loaded.</div>;
  }

  // Match complaints by userId or userName for mock data compatibility
  const userComplaints = complaints.filter(
    (c) => c.userId === user?.id || c.userName === user?.name
  );


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold" style={{ color: '#22c55e' }}>My Complaints</h2>
        <span className="text-sm text-zinc-400">
          {user?.name ? `Logged in as ${user.name}` : 'Not logged in'}
        </span>
      </div>


      {/* Complaint History Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Removed Complaint History heading */}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 text-zinc-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Subject</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {userComplaints.length > 0 ? (
                userComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 text-emerald-500 font-mono align-middle">#{complaint.id}</td>
                    <td className="px-4 py-3 font-semibold text-white align-middle">{complaint.subject}</td>
                    <td className="px-4 py-3 align-middle">
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-bold ${
                          complaint.status === 'Resolved'
                            ? 'bg-green-500/20 text-green-600'
                            : complaint.status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-600'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                        style={{ display: 'inline-block', minWidth: '90px', textAlign: 'center' }}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 font-semibold align-middle">{complaint.date}</td>
                    <td className="px-4 py-3 align-middle">
                      <button
                        className="bg-emerald-500/10 text-emerald-500 px-4 py-1 rounded-full font-bold hover:bg-emerald-500/20 transition"
                        style={{ minWidth: '60px', borderRadius: '999px', fontSize: '0.95rem' }}
                        onClick={() => handleView(complaint)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-zinc-400">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
                {/* Modal for complaint details */}
                {selectedComplaint && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(10, 20, 40, 0.35)', backdropFilter: 'blur(6px)' }}>
                    <div className="relative w-full max-w-2xl p-0">
                      <div className="rounded-3xl shadow-2xl border border-zinc-700/40 bg-zinc-900/90 p-8" style={{ backgroundColor: 'rgba(20, 20, 30, 0.96)' }}>
                        <button
                          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-2xl font-bold"
                          onClick={handleCloseModal}
                          style={{ zIndex: 2 }}
                        >
                          &times;
                        </button>
                        <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
                          Complaint ID #{selectedComplaint.id}
                        </h2>
                        <div className="mb-2">
                          <span className="font-semibold text-zinc-300">Subject:</span> <span className="text-white">{selectedComplaint.subject}</span>
                        </div>
                        <div className="mb-2 flex items-center">
                          <span className="font-semibold text-zinc-300 mr-2">Status:</span>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                              selectedComplaint.status === 'Resolved'
                                ? 'bg-green-500/20 text-green-600'
                                : selectedComplaint.status === 'In Progress'
                                ? 'bg-blue-500/20 text-blue-600'
                                : 'bg-amber-500/10 text-amber-500'
                            }`}
                            style={{ display: 'inline-block', minWidth: '110px', textAlign: 'center' }}
                          >
                            {selectedComplaint.status}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-zinc-300">Date Filed:</span> <span className="text-white">{selectedComplaint.date}</span>
                        </div>
                        <div className="mb-4">
                          <span className="font-semibold text-zinc-300">Description:</span>
                          <div className="mt-1 text-zinc-200 bg-zinc-800/60 rounded-xl p-4 text-base shadow-inner">
                            {selectedComplaint.description || 'No description provided.'}
                          </div>
                          {selectedComplaint.attachmentUrl && (
                            <div className="mt-3">
                              <span className="font-semibold text-zinc-300">Attachment:</span> <a href={selectedComplaint.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">File submitted</a>
                            </div>
                          )}
                        </div>
                        {/* Progress steps with icons and color */}
                        <div className="mb-2">
                          <span className="font-semibold text-zinc-300">Progress:</span>
                          <ul className="mt-2 ml-4 text-zinc-200 font-semibold space-y-2">
                            <li className="flex items-center">
                              <span className="mr-2 text-green-400">✔</span> <span>Submitted</span>
                            </li>
                            <li className="flex items-center">
                              <span className={selectedComplaint.assignedDepartment ? 'mr-2 text-green-400' : 'mr-2 text-blue-400'}>{selectedComplaint.assignedDepartment ? '✔' : '●'}</span>
                              <span>Assigned to Dept</span>
                            </li>
                            <li className="flex items-center">
                              <span className={selectedComplaint.status === 'In Progress' ? 'mr-2 text-blue-400' : selectedComplaint.status === 'Resolved' ? 'mr-2 text-green-400' : 'mr-2 text-zinc-400'}>
                                {selectedComplaint.status === 'In Progress' ? '●' : selectedComplaint.status === 'Resolved' ? '✔' : '○'}
                              </span>
                              <span>Investigation</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
          </table>
        </div>
      </div>
    </div>
  );
}