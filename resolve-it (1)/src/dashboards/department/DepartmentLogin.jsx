import React, { useState } from 'react';

const departments = [
  'Maintenance Department',
  'Operations Department',
  'Cleanliness Department',
  'Safety Department',
  'Customer Support Department',
];

const DepartmentLogin = ({ onLogin }) => {
  const [selected, setSelected] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (selected) onLogin(selected);
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Department Login</h2>
      <select value={selected} onChange={e => setSelected(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 16 }}>
        <option value="">Select Department</option>
        {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
      </select>
      <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Login</button>
    </form>
  );
};

export default DepartmentLogin;
