import React, { useState } from 'react';

const statusOptions = ['Pending', 'In Progress', 'Resolved'];

const ComplaintStatusUpdate = ({ complaint, department }) => {
  const [status, setStatus] = useState(complaint.status);
  const [remark, setRemark] = useState(complaint.departmentResponse || '');
  const [resolutionDate, setResolutionDate] = useState(complaint.resolutionDate || '');
  const departments = [
    'Bus Operations',
    'Metro Maintenance',
    'Security & Safety',
    'Customer Service',
    'Infrastructure',
    'Cleanliness'
  ];

  const handleUpdate = () => {
    // TODO: Call API to update complaint status, remark, and resolution date
    // Example: updateComplaint({ id: complaint.id, status, remark, resolutionDate })
    alert('Status updated!');
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ marginRight: 8 }}>Assign to Department:</label>
        {departments.map(dep => (
          <button
            key={dep}
            style={{
              marginRight: 8,
              padding: '4px 12px',
              borderRadius: 6,
              border: department === dep ? '2px solid #10b981' : '1px solid #444',
              background: department === dep ? '#10b981' : '#222',
              color: department === dep ? '#fff' : '#ccc',
              fontWeight: department === dep ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            // TODO: Implement department assignment logic
          >
            {dep}
          </button>
        ))}
      </div>
      <select value={status} onChange={e => setStatus(e.target.value)}>
        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <input
        type="text"
        placeholder="Department Response"
        value={remark}
        onChange={e => setRemark(e.target.value)}
        style={{ marginLeft: 8 }}
      />
      {status === 'Resolved' && (
        <input
          type="date"
          value={resolutionDate}
          onChange={e => setResolutionDate(e.target.value)}
          style={{ marginLeft: 8 }}
        />
      )}
      <button onClick={handleUpdate} style={{ marginLeft: 8 }}>Update</button>
    </div>
  );
};

export default ComplaintStatusUpdate;
