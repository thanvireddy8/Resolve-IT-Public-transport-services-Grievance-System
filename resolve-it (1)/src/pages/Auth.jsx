import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Shield, User, Briefcase } from 'lucide-react';
const departments = [
  'Bus Service Department',
  'Metro Service Department',
  'Cleanliness Department',
  'Staff Behaviour Department',
  'Infrastructure Department',
];
import { ParticleBackground } from '../components/ParticleBackground.jsx';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [department, setDepartment] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, role, department);
      setSuccess('Successfully logged in!');
      setTimeout(() => {
        if (role === 'admin') navigate('/admin');
        else if (role === 'department') navigate('/department/overview');
        else navigate('/user');
      }, 1200);
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">Resolve-It</h1>
          <p className="text-zinc-400">Smart Grievance Management System</p>
        </div>
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 text-green-500 rounded-xl text-sm font-medium">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Role</label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => { setRole('user'); setDepartment(''); }}
                  className={`role-btn flex items-center justify-center gap-2 py-3 rounded-xl border border-white border-2 text-white bg-transparent transition-all ${role === 'user' ? 'ring-2 ring-white font-bold' : ''}`}
                >
                  <User className="w-4 h-4" />
                  User
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('admin'); setDepartment(''); }}
                  className={`role-btn flex items-center justify-center gap-2 py-3 rounded-xl border border-white border-2 text-white bg-transparent transition-all ${role === 'admin' ? 'ring-2 ring-white font-bold' : ''}`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('department')}
                  className={`role-btn flex items-center justify-center gap-2 py-3 rounded-xl border border-white border-2 text-white bg-transparent transition-all ${role === 'department' ? 'ring-2 ring-white font-bold' : ''}`}
                >
                  <Briefcase className="w-4 h-4" />
                  Department
                </button>
              </div>
              {role === 'department' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 transition-all"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md border border-green-700"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-zinc-200 hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Normal Signup component with form
export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // TODO: Implement signup logic
    setError('');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white relative overflow-hidden">
      <ParticleBackground />
      <div className="bg-zinc-900/80 p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-green-500">Sign Up</h2>
        {error && <div className="mb-4 p-2 bg-red-500/10 border border-red-500/50 text-red-500 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => { setRole('user'); setDepartment(''); }}
                className={`role-btn flex items-center justify-center gap-2 py-3 rounded-xl border border-white border-2 text-white bg-transparent transition-all ${role === 'user' ? 'ring-2 ring-white font-bold' : ''}`}
              >
                <User className="w-4 h-4" />
                User
              </button>
              <button
                type="button"
                onClick={() => { setRole('admin'); setDepartment(''); }}
                className={`role-btn flex items-center justify-center gap-2 py-3 rounded-xl border border-white border-2 text-white bg-transparent transition-all ${role === 'admin' ? 'ring-2 ring-white font-bold' : ''}`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole('department')}
                className={`role-btn flex items-center justify-center gap-2 py-3 rounded-xl border border-white border-2 text-white bg-transparent transition-all ${role === 'department' ? 'ring-2 ring-white font-bold' : ''}`}
              >
                <Briefcase className="w-4 h-4" />
                Department
              </button>
            </div>
            {role === 'department' && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 transition-all"
                >
                  <option value="">Select Department</option>
                  {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/50 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
