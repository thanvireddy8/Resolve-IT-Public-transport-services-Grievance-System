import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

const DepartmentNotifications = ({ department }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // TODO: Fetch notifications for department
    // setNotifications(fetchedNotifications)
  }, [department]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Department Notifications</h2>
        <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm font-semibold">{notifications.length} Unread</span>
      </div>
      <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 flex flex-col items-center justify-center min-h-[180px]">
        {notifications.length === 0 ? (
          <>
            <Bell className="w-12 h-12 text-zinc-600 mb-4" />
            <div className="text-zinc-400 text-lg">No department notifications yet.</div>
          </>
        ) : (
          <ul className="w-full">
            {notifications.map((notif, idx) => (
              <li key={idx} className="bg-zinc-800 rounded-lg p-4 mb-2 text-zinc-200 shadow border border-zinc-700">
                {notif.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DepartmentNotifications;
