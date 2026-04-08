
import React, { useState, useEffect } from "react";
import { HiClipboardList, HiClock, HiRefresh, HiCheckCircle, HiUser, HiUserCircle, HiChevronDown, HiLogout, HiSearch, HiPencilAlt } from "react-icons/hi";
import { useAuth } from '../../../../resolve-it (1)/src/context/AuthContext';
import { Sidebar } from '../../../../resolve-it (1)/src/components/Sidebar.jsx';
import { useNavigate } from 'react-router-dom';

const summaryData = [
  {
    title: "Total Assigned",
    count: 269,
    icon: <HiClipboardList className="text-3xl text-green-400" />,
    gradient: "from-green-500/30 via-green-600/20 to-black",
  },
  {
    title: "Pending",
    count: 16,
    icon: <HiClock className="text-3xl text-yellow-400" />,
    gradient: "from-yellow-400/30 via-yellow-500/20 to-black",
  },
  {
    title: "In Progress",
    count: 12,
    icon: <HiRefresh className="text-3xl text-blue-400 animate-spin-slow" />,
    gradient: "from-blue-400/30 via-blue-500/20 to-black",
  },
  {
    title: "Resolved",
    count: 12,
    icon: <HiCheckCircle className="text-3xl text-green-400" />,
    gradient: "from-green-500/30 via-green-600/20 to-black",
  },
];

const notifications = [
  { id: 1, message: "Complaint CPL-1035 marked as Resolved.", date: "24 Apr" },
  { id: 2, message: "New complaint assigned: CPL-1029.", date: "23 Apr" },
  { id: 3, message: "Status updated for CPL-1023.", date: "21 Apr" },
];


// Backend API base URL
const API_BASE_URL = "http://localhost:8080/api/complaints";

const statusColors = {
  Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-400",
  "In Progress": "bg-blue-500/20 text-blue-300 border-blue-400",
  Resolved: "bg-green-500/20 text-green-400 border-green-500",
};

const priorityColors = {
  High: "bg-red-500/20 text-red-400 border-red-400",
  Medium: "bg-yellow-500/20 text-yellow-300 border-yellow-400",
  Low: "bg-green-500/20 text-green-400 border-green-500",
};


export default function DepartmentDashboard() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const officerName = user?.name || "Officer";
  const officerCategory = user?.role || "Department";
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [editRow, setEditRow] = useState(null);
  const [response, setResponse] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const sidebarItems = [
    { to: '/department/overview', icon: HiClipboardList, label: 'Overview' },
    { to: '/department/complaints', icon: HiClipboardList, label: 'Complaints' },
    { to: '/department/notifications', icon: HiCheckCircle, label: 'Notifications' },
    { to: '/department/profile', icon: HiUser, label: 'Profile' },
  ];
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch complaints for department and users 'sri' and 'akku'
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user || !user.role) return;
      setLoading(true);
      setError(null);
      try {
        // Use department from user.role or user.department
        const department = user.role || user.department;
        // Only fetch for 'sri' and 'akku'
        const users = ['sri', 'akku'];
        const url = `${API_BASE_URL}/department/${encodeURIComponent(department)}/users?userNames=${users.join(',')}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch complaints');
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
    // Only run on mount or when user changes
  }, [user]);

  // Filter logic
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      (c.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.userName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" || c.status === status;
    const matchesCategory = category === "All" || c.category === category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Status update logic
  const handleStatusUpdate = (id) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.status === "Pending") return { ...c, status: "In Progress" };
        if (c.status === "In Progress") return { ...c, status: "Resolved", resolutionDate: new Date().toLocaleDateString() };
        return c;
      })
    );
  };

  // Response edit logic
  const handleEdit = (id, currentResponse) => {
    setEditRow(id);
    setResponse(currentResponse || "");
  };
  const handleSave = (id) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, departmentResponse: response } : c))
    );
    setEditRow(null);
    setResponse("");
  };

  // Pagination (dummy, 5 per page)
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Unique categories for dropdown
  const categories = ["All", ...new Set(complaints.map((c) => c.category))];

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* Sidebar */}
      <Sidebar 
        title="Resolve-It Dept" 
        items={sidebarItems} 
        onLogout={handleLogout} 
      />
      {/* Main Content */}
      <div className="flex-1 px-2 py-6 ml-64">
      {loading && (
        <div className="text-green-400 text-center font-bold mb-4">Loading complaints...</div>
      )}
      {error && (
        <div className="text-red-400 text-center font-bold mb-4">{error}</div>
      )}
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <div className="text-2xl font-bold text-green-400">{officerName}</div>
          <div className="text-green-300 text-sm font-semibold">{officerCategory}</div>
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black border border-green-500 text-green-400 hover:bg-green-900/30 transition-all"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <HiUserCircle className="text-3xl" />
            <span className="hidden sm:inline font-semibold">Profile</span>
            <HiChevronDown className="text-lg" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black border border-green-500 rounded-xl shadow-lg z-50">
              <button className="flex items-center w-full px-4 py-2 text-green-400 hover:bg-green-900/40 gap-2" onClick={() => { setProfileModalOpen(true); setProfileOpen(false); setEditMode(false); setEditName(user?.name || ""); setCurrentPassword(""); setNewPassword(""); setProfileMsg(""); }}>
                <HiUser /> Profile
              </button>
              <button className="flex items-center w-full px-4 py-2 text-green-400 hover:bg-green-900/40 gap-2" onClick={logout}>
                <HiLogout /> Logout
              </button>
            </div>
          )}
          {/* Profile Modal */}
          {profileModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-zinc-900 border border-green-500 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                <h2 className="text-xl font-bold text-green-400 mb-4">Profile</h2>
                {!editMode ? (
                  <>
                    <div className="mb-4">
                      <div className="text-green-300 font-semibold mb-2">Name:</div>
                      <div className="text-white mb-2">{user?.name}</div>
                      <div className="text-green-300 font-semibold mb-2">Email:</div>
                      <div className="text-white mb-2">{user?.email}</div>
                      <div className="text-green-300 font-semibold mb-2">Role:</div>
                      <div className="text-white mb-2">{user?.role}</div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button
                        className="bg-neon text-black px-4 py-2 rounded font-bold"
                        onClick={() => { setEditMode(true); setEditName(user?.name || ""); setCurrentPassword(""); setNewPassword(""); setProfileMsg(""); }}
                      >Edit</button>
                      <button
                        className="bg-black border border-green-400 text-green-400 px-4 py-2 rounded font-bold"
                        onClick={() => setProfileModalOpen(false)}
                      >Close</button>
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block mb-2 text-green-300">Name</label>
                    <input
                      className="w-full mb-4 px-3 py-2 rounded bg-black border border-green-400 text-green-200"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Enter new name"
                    />
                    <label className="block mb-2 text-green-300">Current Password</label>
                    <input
                      className="w-full mb-4 px-3 py-2 rounded bg-black border border-green-400 text-green-200"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      type="password"
                      placeholder="Enter current password"
                    />
                    <label className="block mb-2 text-green-300">New Password</label>
                    <input
                      className="w-full mb-4 px-3 py-2 rounded bg-black border border-green-400 text-green-200"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      type="password"
                      placeholder="Enter new password"
                    />
                    {profileMsg && <div className="mb-2 text-green-400 font-semibold">{profileMsg}</div>}
                    <div className="flex gap-4 mt-4">
                      <button
                        className="bg-neon text-black px-4 py-2 rounded font-bold"
                        onClick={async () => {
                          setProfileMsg("");
                          try {
                            const res = await fetch(`http://localhost:8080/api/users/update`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                id: user?.id,
                                name: editName,
                                currentPassword,
                                newPassword
                              })
                            });
                            if (!res.ok) throw new Error('Update failed');
                            setProfileMsg('Profile updated!');
                            setTimeout(() => { setEditMode(false); setProfileModalOpen(false); }, 1200);
                            user.name = editName;
                            setCurrentPassword("");
                            setNewPassword("");
                          } catch (err) {
                            setProfileMsg(err.message);
                          }
                        }}
                      >Save</button>
                      <button
                        className="bg-black border border-green-400 text-green-400 px-4 py-2 rounded font-bold"
                        onClick={() => { setEditMode(false); setProfileMsg(""); setCurrentPassword(""); setNewPassword(""); setEditName(user?.name || ""); }}
                      >Cancel</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryData.map((card, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 flex items-center gap-4 bg-gradient-to-br ${card.gradient} shadow-lg border border-green-500/30 relative overflow-hidden`}
            style={{
              boxShadow: "0 0 24px 2px #22c55e88, 0 2px 16px #000a",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="text-green-400 drop-shadow-glow">{card.icon}</div>
            <div>
              <div className="uppercase text-xs tracking-widest text-green-300/80 font-semibold">{card.title}</div>
              <div className="text-3xl font-bold text-white drop-shadow-glow">{card.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}

      {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6 bg-white/5 rounded-xl p-4 border border-green-400/10 shadow-inner">
          <div className="flex items-center bg-black/60 rounded-lg px-3 py-2 border border-green-400/20">
            <HiSearch className="text-green-400 mr-2" />
            <input
              className="bg-transparent outline-none text-white placeholder:text-green-300/50"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="bg-black/80 border border-green-400/30 rounded-lg px-3 py-2 text-green-300 focus:ring-2 focus:ring-green-400"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending" style={{ color: '#FFD700', backgroundColor: '#222' }}>Pending</option>
              <option value="In Progress" style={{ color: '#00BFFF', backgroundColor: '#222' }}>In Progress</option>
              <option value="Resolved" style={{ color: '#39FF14', backgroundColor: '#222' }}>Resolved</option>
            </select>
            <HiChevronDown className="absolute right-2 top-3 text-green-400 pointer-events-none" />
          </div>
          {/* Only one dropdown for category remains */}
        </div>

      {/* Complaints Table */}
      <div className="overflow-x-auto rounded-2xl bg-white/5 border border-green-400/10 shadow-lg backdrop-blur-md">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-green-300 uppercase text-xs">
              <th className="p-3">Complaint ID</th>
              <th className="p-3">User Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Department Response</th>
              <th className="p-3">Resolution Date</th>
              <th className="p-3">Actions</th>
                <th className="p-3">Assigned By Admin</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c, idx) => (
              <tr
                key={c.id}
                className="hover:bg-green-400/10 transition-all group"
                style={{
                  boxShadow: idx % 2 === 0 ? "0 1px 0 #39ff1433" : undefined,
                }}
              >
                <td className="p-3 font-mono">{c.id}</td>
                <td className="p-3">{c.userName}</td>
                <td className="p-3">{c.category}</td>
                <td className="p-3">{c.subject}</td>
                <td className="p-3">{c.description}</td>
                <td className="p-3">{c.date}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-lg border font-bold ${priorityColors[c.priority] || ""}`}
                  >
                    {c.priority}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-lg border font-bold ${statusColors[c.status] || ""}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3">
                  {editRow === c.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="bg-black/60 border border-green-400/30 rounded px-2 py-1 text-green-200"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="bg-neon text-black px-2 py-1 rounded font-bold"
                        onClick={() => handleSave(c.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{c.departmentResponse}</span>
                      <button
                        className="text-green-400 hover:text-neon"
                        onClick={() => handleEdit(c.id, c.departmentResponse)}
                        title="Edit"
                      >
                        <HiPencilAlt />
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-3">{c.resolutionDate}</td>
                <td className="p-3 flex flex-col gap-2">
                  <button
                    className="bg-neon text-black px-3 py-1 rounded-lg font-bold shadow-green-400/40 shadow-md border border-green-400 hover:scale-105 transition-all"
                    onClick={() => handleStatusUpdate(c.id)}
                  >
                    {c.status === "Pending"
                      ? "Start Progress"
                      : c.status === "In Progress"
                      ? "Mark Resolved"
                      : "Resolved"}
                  </button>
                </td>
                  <td className="p-3">{c.assignedByAdmin || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            className="px-3 py-1 rounded bg-black/40 border border-green-400/30 text-green-300 hover:bg-green-400/10"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            &lt;
          </button>
          <span className="text-green-300 font-bold">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-black/40 border border-green-400/30 text-green-300 hover:bg-green-400/10"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Neon accent for focus */}
      <style>
        {`
          .drop-shadow-glow { filter: drop-shadow(0 0 8px #22c55ecc); }
          .shadow-neon { box-shadow: 0 0 16px #22c55ecc; }
          .animate-spin-slow { animation: spin 2.5s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  </div>
  );
}
