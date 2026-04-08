import React from 'react';
import { Bell, CheckCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useNavigate } from 'react-router-dom';

export const AdminNotifications = () => {
  const { getNotificationsByRole, markNotificationAsRead } = useComplaints();
  const notifications = getNotificationsByRole('admin');
  const navigate = useNavigate();

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    navigate('/admin/complaints', { state: { openComplaintId: notif.complaintId } });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Admin Notifications</h3>
        <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-500">
          {notifications.filter(n => !n.isRead).length} Unread
        </span>
      </div>
      
      {notifications.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center">
          <Bell className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No department reports yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => handleNotificationClick(notif)}
              className={`bg-zinc-900 border p-5 rounded-2xl flex gap-4 hover:border-emerald-500/50 transition-all group cursor-pointer ${
                notif.isRead ? 'border-zinc-800 opacity-60' : 'border-emerald-500/30 bg-emerald-500/5'
              }`}
            >
              <div className={`p-3 rounded-xl h-fit ${
                notif.message.includes('Resolved') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {notif.message.includes('Resolved') ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                    Department Report
                    {!notif.isRead && <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-bold">
                    {new Date(notif.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{notif.message}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  <MessageSquare className="w-3 h-3" />
                  Click to take action
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
