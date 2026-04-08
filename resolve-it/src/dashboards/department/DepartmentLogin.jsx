
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
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <form
        onSubmit={handleLogin}
        className="bg-[#181e2a] w-full max-w-md p-8 rounded-xl shadow-lg flex flex-col gap-6 border border-[#232a3a]"
      >
        <h2 className="text-2xl font-semibold text-white mb-2 text-center">Department Login</h2>
        <div>
          <label htmlFor="department" className="block text-sm text-gray-300 mb-2">Select Department</label>
          <select
            id="department"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-600 bg-[#232a3a] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            <option value="" className="text-gray-400">Select Department</option>
            {departments.map(dep => (
              <option key={dep} value={dep} className="text-gray-900">{dep}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default DepartmentLogin;
