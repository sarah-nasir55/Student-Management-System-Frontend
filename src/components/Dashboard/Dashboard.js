import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const Dashboard = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Students', icon: '👥' },
    { path: '/semesters', label: 'Semesters', icon: '📚' },
    { path: '/courses', label: 'Courses', icon: '📖' },
    { path: '/enrollments', label: 'Enrollments', icon: '✅' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-lg fixed h-screen overflow-y-auto">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            🎓 SMS
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            Student Management System
          </p>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-6 py-3.5 text-slate-300 transition-all duration-200 border-l-[3px] border-transparent",
                "hover:bg-white/5 hover:text-white",
                location.pathname === item.path && "bg-purple-500/20 text-white border-l-purple-500"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Dashboard;
