import React, { useState } from 'react';

const statusOptions = ['Pending', 'In Progress', 'Resolved'];

const ComplaintStatusUpdate = ({ complaint, department }) => {
  const [status, setStatus] = useState(complaint.status);
  const [remark, setRemark] = useState(complaint.departmentResponse || '');
  const [resolutionDate, setResolutionDate] = useState(complaint.resolutionDate || '');

  const handleUpdate = () => {
    // TODO: Call API to update complaint status, remark, and resolution date
    // Example: updateComplaint({ id: complaint.id, status, remark, resolutionDate })
    alert('Status updated!');
  };

  return (
    <div>
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
