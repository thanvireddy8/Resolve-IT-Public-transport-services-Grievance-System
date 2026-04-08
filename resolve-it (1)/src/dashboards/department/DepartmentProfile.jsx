import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export const DepartmentProfile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!user) {
    return (
      <div className="p-8 bg-zinc-900 rounded-2xl">
        <p className="text-zinc-400">No user data available.</p>
      </div>
    );
  }

  const handleSave = () => {
    // TODO: Implement save logic (API call)
    setEditMode(false);
  };

  return (
    <div className="w-[420px] sm:w-[520px] md:w-[600px] lg:w-[700px]">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Profile Details</h3>
          {!editMode && (
            <button
              className="text-green-400 hover:text-green-300 text-sm font-semibold border border-green-400 rounded px-3 py-1"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-zinc-400">Name</p>
            {editMode ? (
              <input
                className="w-full p-2 rounded bg-zinc-800 text-zinc-100 border border-zinc-700"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            ) : (
              <p className="text-base font-medium text-zinc-100">{user.name}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-zinc-400">Email</p>
            {editMode ? (
              <input
                className="w-full p-2 rounded bg-zinc-800 text-zinc-100 border border-zinc-700"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            ) : (
              <p className="text-base font-medium text-zinc-100">{user.email}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-zinc-400">Role</p>
            <p className="text-base font-medium text-zinc-100 capitalize">{user.role}</p>
          </div>
        </div>
        {editMode && (
          <div className="flex justify-end gap-2 mt-8">
            <button
              className="px-4 py-2 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
