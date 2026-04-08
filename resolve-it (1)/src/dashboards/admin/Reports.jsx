

import React from 'react';
import { Card } from '../../components/DashboardCards.jsx';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useComplaints } from '../../context/ComplaintContext.jsx';
import { Download } from 'lucide-react';

const COLORS = ['#fbbf24', '#60a5fa', '#22c55e'];

export const Reports = () => {
  const { complaints } = useComplaints();

  // Stat calculations
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;

  // Pie chart data
  const statusData = [
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
    { name: 'Resolved', value: resolved },
  ];

  // Line chart data (trend by month, by category)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Get all categories present in complaints
  const allCategories = Array.from(new Set(complaints.map(c => c.category)));
  const trendData = months.map((m, idx) => {
    const monthComplaints = complaints.filter(c => {
      const d = new Date(c.date);
      return d.getMonth() === idx;
    });
    // Build object with category counts
    const data = { month: m };
    allCategories.forEach(cat => {
      data[cat] = monthComplaints.filter(c => c.category === cat).length;
    });
    return data;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Analytics Overview</h3>
        <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="text-zinc-400 text-xs mb-2">TOTAL CASES</div>
          <div className="text-3xl font-bold text-zinc-100">{total}</div>
        </Card>
        <Card className="p-6">
          <div className="text-amber-400 text-xs mb-2">PENDING</div>
          <div className="text-3xl font-bold text-amber-400">{pending}</div>
        </Card>
        <Card className="p-6">
          <div className="text-blue-400 text-xs mb-2">IN PROGRESS</div>
          <div className="text-3xl font-bold text-blue-400">{inProgress}</div>
        </Card>
        <Card className="p-6">
          <div className="text-emerald-400 text-xs mb-2">RESOLVED</div>
          <div className="text-3xl font-bold text-emerald-400">{resolved}</div>
        </Card>
        <Card className="p-6">
          <div className="text-pink-400 text-xs mb-2">RESOLUTION RATE</div>
          <div className="text-3xl font-bold text-pink-400">{resolutionRate}%</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="font-bold mb-4 text-zinc-100">Grievance Volume Trend (by Category)</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" allowDecimals={false} />
              <Tooltip />
              <Legend />
              {allCategories.map((cat, idx) => (
                <Line key={cat} type="monotone" dataKey={cat} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h4 className="font-bold mb-4 text-zinc-100">Status Split</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
