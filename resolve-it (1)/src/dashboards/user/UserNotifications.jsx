import React from 'react';
import { Bell, Info, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const UserNotifications = () => {
  const { user } = useAuth();
  const { getNotificationsByUser, markNotificationAsRead } = useComplaints();
  const notifications = getNotificationsByUser(user?.id || '');

  const getIcon = (message) => {
    if (message.includes('Resolved')) return CheckCircle;
    if (message.includes('In Progress')) return Clock;
    if (message.includes('assigned')) return Bell;
    if (message.includes('Update from')) return MessageSquare;
    return Info;
  };

  const getType = (message) => {
    if (message.includes('Resolved')) return 'success';
    if (message.includes('In Progress')) return 'info';
    if (message.includes('assigned')) return 'warning';
    return 'info';
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold" style={{ color: '#22c55e' }}>Notifications</h3>
        <span className="text-xs text-zinc-500">{notifications.length} Total</span>
      </div>
      
      {notifications.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center">
          <Bell className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No notifications yet.</p>
        </div>
      ) : (
        notifications.map((notif) => {
          const Icon = getIcon(notif.message);
          const type = getType(notif.message);
          
          return (
            <div 
              key={notif.id} 
              onClick={() => markNotificationAsRead(notif.id)}
              className={`bg-zinc-900 border p-5 rounded-2xl flex gap-4 hover:border-zinc-700 transition-all group cursor-pointer ${
                notif.isRead ? 'border-zinc-800 opacity-60' : 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
              }`}
            >
              <div className={`p-3 rounded-xl h-fit ${
                type === 'success' ? 'bg-green-500/10 text-green-500' : 
                type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                'bg-blue-500/10 text-blue-500'
              }`} style={type === 'success' ? { color: '#22c55e', backgroundColor: '#22c55e33' } : {}}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-zinc-100">
                    {notif.message.split(':')[0]}
                    {!notif.isRead && <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>}
                  </h4>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">
                    {(() => {
                      // Try various date fields from backend
                      const dateStr = notif.createdAt || notif.created_at;
                      if (dateStr) {
                        const d = new Date(dateStr);
                        if (!isNaN(d)) return d.toLocaleDateString();
                      }
                      // fallback to today
                      return new Date().toLocaleDateString();
                    })()}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {notif.message.includes(':') ? notif.message.split(':').slice(1).join(':').trim() : notif.message}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
