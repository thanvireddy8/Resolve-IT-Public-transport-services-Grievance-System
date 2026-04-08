import React, { useEffect, useState } from 'react';

const DepartmentNotifications = ({ department }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // TODO: Fetch notifications for department
    // setNotifications(fetchedNotifications)
  }, [department]);

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Department Notifications</h3>
      <ul>
        {notifications.map((notif, idx) => (
          <li key={idx}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentNotifications;
