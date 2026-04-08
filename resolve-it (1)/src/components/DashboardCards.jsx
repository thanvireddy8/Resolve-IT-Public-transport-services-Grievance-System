import React from 'react';
import { cn } from '../lib/utils.js';

const Card = ({ children, className }) => (
  <div className={cn("bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden", className)}>
    {children}
  </div>
);

export const StatCard = ({ label, value, icon, trend, color = "blue" }) => {
  const colorMap = {
    blue: "text-blue-500 bg-blue-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    red: "text-red-500 bg-red-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    neutral: "text-zinc-400 bg-zinc-700/10",
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-zinc-100">{value}</h3>
          {trend && (
            <p className="text-xs text-blue-500 mt-2 font-medium">
              {trend} <span className="text-zinc-500 font-normal">vs last month</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colorMap[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export { Card };
