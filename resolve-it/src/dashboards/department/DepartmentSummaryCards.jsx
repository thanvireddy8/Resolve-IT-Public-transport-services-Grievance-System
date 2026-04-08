import React, { useEffect, useState } from 'react';

const DepartmentSummaryCards = ({ department }) => {
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    // TODO: Fetch summary stats for department
    // setSummary(fetchedSummary)
  }, [department]);

  return (
    <div style={{ display: 'flex', gap: 16, margin: '2rem 0' }}>
      <div style={{ flex: 1, background: '#e3f2fd', padding: 16, borderRadius: 8 }}>
        <h3>Total Assigned</h3>
        <p style={{ fontSize: 24 }}>{summary.total}</p>
      </div>
      <div style={{ flex: 1, background: '#fffde7', padding: 16, borderRadius: 8 }}>
        <h3>Pending</h3>
        <p style={{ fontSize: 24 }}>{summary.pending}</p>
      </div>
      <div style={{ flex: 1, background: '#fff3e0', padding: 16, borderRadius: 8 }}>
        <h3>In Progress</h3>
        <p style={{ fontSize: 24 }}>{summary.inProgress}</p>
      </div>
      <div style={{ flex: 1, background: '#e8f5e9', padding: 16, borderRadius: 8 }}>
        <h3>Resolved</h3>
        <p style={{ fontSize: 24 }}>{summary.resolved}</p>
      </div>
    </div>
  );
};

export default DepartmentSummaryCards;
