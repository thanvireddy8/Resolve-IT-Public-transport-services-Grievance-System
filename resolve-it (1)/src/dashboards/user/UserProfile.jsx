import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState({ name: user?.name || '', email: user?.email || '' });
  const [settings, setSettings] = React.useState({ notifications: true });

  if (!user) {
    return (
      <div className="p-8 bg-zinc-900 rounded-2xl">
        <p className="text-zinc-400">No user data available.</p>
      </div>
    );
  }

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({ name: user.name, email: user.email });
  };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    updateUser && updateUser(form);
    setEditMode(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-4">Your Profile</h3>
        {!editMode ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-400">Name</p>
              <p className="text-base font-medium text-zinc-100">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Email</p>
              <p className="text-base font-medium text-zinc-100">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Role</p>
              <p className="text-base font-medium text-zinc-100 capitalize">{user.role}</p>
            </div>
            <button
              className="mt-6 px-4 py-2 bg-emerald-500 text-zinc-900 rounded-lg font-semibold hover:bg-emerald-600 transition"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-emerald-500 text-zinc-900 rounded-lg font-semibold hover:bg-emerald-600 transition"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-zinc-700 text-zinc-100 rounded-lg font-semibold hover:bg-zinc-800 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-2 text-zinc-400">Settings</h4>
          <div className="flex items-center gap-3">
            <label className="text-sm text-zinc-300">Notifications</label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => setSettings(s => ({ ...s, notifications: !s.notifications }))}
              className="accent-emerald-500 w-4 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
