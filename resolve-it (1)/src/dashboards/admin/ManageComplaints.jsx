import React, { useState, useEffect } from 'react';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { Eye, X, CheckCircle, Clock, AlertCircle, Building2, Send, MessageSquare, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const ManageComplaints = () => {
  const { complaints, updateComplaintStatus, assignDepartment, sendDepartmentMessage, fetchComplaints } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [deptMsg, setDeptMsg] = useState('');
  const [deptResStatus, setDeptResStatus] = useState('Not Resolved');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state?.openComplaintId) {
      const complaint = complaints.find(c => c.id === state.openComplaintId);
      if (complaint) {
        setSelectedComplaint(complaint);
      }
    }
  }, [location.state, complaints]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      if (selectedComplaint?.id === id) {
        setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      }
    } catch (err) {
      alert("Failed to update complaint status: " + err.message);
    }
  };

  const handleAssignDept = async (id, dept) => {
    try {
      await assignDepartment(id, dept);
      if (selectedComplaint?.id === id) {
        setSelectedComplaint({ ...selectedComplaint, assignedDepartment: dept });
      }
    } catch (err) {
      alert("Failed to assign department: " + err.message);
    }
  };

  const handleSendMsg = async (id) => {
    if (!deptMsg.trim()) return;
    try {
      await sendDepartmentMessage(id, deptMsg, deptResStatus);
      if (selectedComplaint?.id === id) {
        setSelectedComplaint({ 
          ...selectedComplaint, 
          departmentMessage: deptMsg, 
          departmentResolutionStatus: deptResStatus 
        });
      }
      setDeptMsg('');
      setDeptResStatus('Not Resolved');
    } catch (err) {
      alert("Failed to send department message: " + err.message);
    }
  };

  const navigateComplaint = (direction) => {
    if (!selectedComplaint) return;
    const currentIndex = complaints.findIndex(c => c.id === selectedComplaint.id);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedComplaint(complaints[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < complaints.length - 1) {
      setSelectedComplaint(complaints[currentIndex + 1]);
    }
  };

  const departments = ['Bus Operations', 'Metro Maintenance', 'Security & Safety', 'Customer Service', 'Infrastructure', 'Cleanliness'];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">All User Complaints</h3>
            <p className="text-sm text-zinc-400 mt-1">This page shows every complaint submitted by users.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-300 focus:outline-none"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Bus Service</option>
              <option>Metro Service</option>
              <option>Infrastructure</option>
              <option>Staff Behavior</option>
              <option>Cleanliness</option>
              <option>Network</option>
            </select>
            <button
              type="button"
              onClick={fetchComplaints}
              className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition"
            >
              <Send className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 text-zinc-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {complaints
                .filter(complaint => selectedCategory === 'All Categories' || complaint.category === selectedCategory)
                .map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-emerald-500">{complaint.id}</td>
                    <td className="px-6 py-4 font-medium">{complaint.userName}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{complaint.category}</td>
                    <td className="px-6 py-4">{complaint.subject}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-emerald-500/10 text-emerald-500">
                          {complaint.status}
                        </span>
                        {complaint.assignedDepartment && !complaint.departmentResolutionStatus && (
                          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                            <Clock className="w-2 h-2" />
                            Waiting for Dept
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">{complaint.date}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedComplaint(complaint)}
                        className="p-2 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-500 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative my-8">
            <button 
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-6 right-6 p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{selectedComplaint.category}</span>
                <h2 className="text-2xl font-bold mt-1">{selectedComplaint.subject}</h2>
              </div>
              <div className="flex gap-2 mr-10">
                <button 
                  onClick={() => navigateComplaint('prev')}
                  disabled={complaints.findIndex(c => c.id === selectedComplaint.id) === 0}
                  className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigateComplaint('next')}
                  disabled={complaints.findIndex(c => c.id === selectedComplaint.id) === complaints.length - 1}
                  className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-sm text-zinc-400">User: <span className="text-zinc-100 font-medium">{selectedComplaint.userName}</span></div>
              <div className="text-sm text-zinc-400">ID: <span className="text-zinc-100 font-mono">{selectedComplaint.id}</span></div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedComplaint.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                selectedComplaint.status === 'In Progress' ? 'bg-purple-500/10 text-purple-500' :
                'bg-amber-500/10 text-amber-500'
              }`}>
                {selectedComplaint.status}
              </span>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-sm">
                    {selectedComplaint.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Assignment Info</h3>
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Assigned Department</p>
                      {selectedComplaint.assignedDepartment ? (
                        <div className="flex items-center gap-2 text-emerald-500 font-medium text-sm">
                          <Building2 className="w-4 h-4" />
                          {selectedComplaint.assignedDepartment}
                        </div>
                      ) : (
                        <p className="text-zinc-500 italic text-sm">Not Assigned</p>
                      )}
                    </div>
                    {selectedComplaint.departmentMessage && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Latest Update</p>
                        <p className="text-zinc-300 text-sm italic">"{selectedComplaint.departmentMessage}"</p>
                        {selectedComplaint.departmentResolutionStatus && (
                          <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block ${
                            selectedComplaint.departmentResolutionStatus === 'Resolved' 
                              ? 'bg-emerald-500/20 text-emerald-500' 
                              : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            Dept Suggests: {selectedComplaint.departmentResolutionStatus}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-2xl">
                <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Assign to Respective Department
                </h3>
                <div className="flex flex-wrap gap-2">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => handleAssignDept(selectedComplaint.id, dept)}
                      className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all"
                    >
                      {dept}
                    </button>
                  ))}
                </div>
                {selectedComplaint.assignedDepartment && (
                  <div className="mt-4 text-xs text-zinc-400">
                    Currently assigned: <span className="text-emerald-500 font-medium">{selectedComplaint.assignedDepartment}</span>
                  </div>
                )}
              </div>

              {selectedComplaint.assignedDepartment && (
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <h3 className="text-sm font-bold text-emerald-500 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Department Communication (Simulation)
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={deptMsg}
                          onChange={(e) => setDeptMsg(e.target.value)}
                          placeholder="Type a message from the department..."
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <button 
                          onClick={() => handleSendMsg(selectedComplaint.id)}
                          className="bg-emerald-500 text-zinc-950 p-2 rounded-xl hover:bg-emerald-600 transition-all"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-400">Resolution Status:</span>
                        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                          <button 
                            onClick={() => setDeptResStatus('Not Resolved')}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                              deptResStatus === 'Not Resolved' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            NOT RESOLVED
                          </button>
                          <button 
                            onClick={() => setDeptResStatus('Resolved')}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                              deptResStatus === 'Resolved' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            RESOLVED
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 italic">
                      * In a real system, the department would send this message and status report.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  Update Final Status (Admin Action)
                </h3>
                {selectedComplaint.departmentResolutionStatus === 'Resolved' && selectedComplaint.status !== 'Resolved' && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <p className="text-xs text-emerald-500 font-medium">
                      The department has reported this as <span className="font-bold underline">RESOLVED</span>. You can now close this complaint.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleStatusUpdate(selectedComplaint.id, 'Pending')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      selectedComplaint.status === 'Pending' 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    Pending
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedComplaint.id, 'In Progress')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      selectedComplaint.status === 'In Progress' 
                        ? 'bg-purple-500/10 border-purple-500 text-purple-500' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    In Progress
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedComplaint.id, 'Resolved')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      selectedComplaint.status === 'Resolved' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resolved
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
