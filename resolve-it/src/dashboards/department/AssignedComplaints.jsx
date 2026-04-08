import React, { useEffect, useState } from 'react';
import ComplaintStatusUpdate from './ComplaintStatusUpdate';

const statusOptions = ['Pending', 'In Progress', 'Resolved'];

const AssignedComplaints = ({ department }) => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // TODO: Replace with API call to fetch complaints assigned to department
    // setComplaints(fetchedComplaints);
  }, [department]);

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Assigned Complaints</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Filter by Status: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>User Name</th>
            <th>Category</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Department Response</th>
            <th>Resolution Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(complaint => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.userName}</td>
              <td>{complaint.category}</td>
              <td>{complaint.subject}</td>
              <td>{complaint.description}</td>
              <td>{complaint.date}</td>
              <td>{complaint.priority}</td>
              <td>{complaint.status}</td>
              <td>{complaint.departmentResponse || ''}</td>
              <td>{complaint.resolutionDate || ''}</td>
              <td><ComplaintStatusUpdate complaint={complaint} department={department} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedComplaints;
