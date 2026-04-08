import React from 'react';
import { StatCard } from '../../components/DashboardCards.jsx';
import { FileText, Clock, CheckCircle, AlertCircle, Users, MessageSquare, User } from 'lucide-react';
import { mockUsers, mockFeedbacks } from '../../data/mockData.js';
import { useComplaints } from '../../context/ComplaintContext.jsx';

export const AdminOverview = () => {
  const { complaints, getNotificationsByRole } = useComplaints();
  const adminNotifications = getNotificationsByRole('admin');
  
  const activities = [
    ...complaints.map(c => ({
      id: c.id,
      type: 'complaint',
      user: c.userName,
      subject: c.subject,
      date: c.date,
      status: c.status,
      timestamp: new Date(c.date).getTime()
    })),
    ...adminNotifications.map(n => ({
      id: n.id,
      type: 'notification',
      message: n.message,
      date: n.date,
      timestamp: new Date(n.date).getTime()
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    users: mockUsers.filter(u => u.role === 'user').length,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Complaints" value={stats.total} icon={<FileText />} color="blue" />
        <StatCard label="Pending" value={stats.pending} icon={<AlertCircle />} color="amber" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock />} color="purple" />
        <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-xl font-bold" style={{ color: '#22c55e' }}>Recent Activity</h3>
            <button className="text-emerald-500 text-sm hover:underline">View All</button>
          </div>
          <div className="p-6 space-y-6">
            {activities.map((activity, index) => (
              <div key={index} className="flex gap-4">
                <div className={`p-2 rounded-lg h-fit ${
                  activity.type === 'notification' 
                    ? 'bg-blue-500/10 text-blue-500' 
                    : activity.status === 'Resolved' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {activity.type === 'notification' ? <MessageSquare className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {activity.type === 'notification' ? (
                      <span className="text-zinc-200">{activity.message}</span>
                    ) : (
                      <>
                        <span className="text-emerald-500">{activity.user}</span> raised a complaint: "{activity.subject}"
                      </>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6" style={{ color: '#22c55e' }}>System Health</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Resolution Rate</span>
                <span className="text-emerald-500 font-bold">75%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[75%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Avg. Response Time</span>
                <span className="text-blue-500 font-bold">4.2 Hours</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[40%]"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <Users className="w-5 h-5 text-zinc-400 mb-2" />
                <p className="text-2xl font-bold">{stats.users}</p>
                <p className="text-xs text-zinc-500">Active Users</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <MessageSquare className="w-5 h-5 text-zinc-400 mb-2" />
                <p className="text-2xl font-bold">{mockFeedbacks.length}</p>
                <p className="text-xs text-zinc-500">New Feedbacks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Feedback Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6" style={{ color: '#22c55e' }}>User Feedbacks</h3>
          <ul className="space-y-4">
            {mockFeedbacks.slice(0, 6).map(fb => (
              <li key={fb.id} className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-zinc-200">{fb.userName}</span>
                  <span className="ml-2 text-xs text-zinc-400">{fb.date}</span>
                </div>
                <div className="text-zinc-300 mb-2">{fb.message}</div>
                <div className="text-xs text-blue-500">Rating: {fb.rating} / 5</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
