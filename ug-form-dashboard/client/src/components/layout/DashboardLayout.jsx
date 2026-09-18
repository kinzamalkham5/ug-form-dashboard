import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const DashboardLayout = ({ navItems, title, children }) => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName =
    user?.role === 'admin' ? user?.admin?.name : `${user?.student?.firstName || ''} ${user?.student?.lastName || ''}`;

  const handleLogout = () => {
    logout();
    navigate(user?.role === 'admin' ? '/admin/login' : '/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent navItems={navItems} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="font-bold text-brand-700">Menu</span>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <SidebarContent navItems={navItems} onNavigate={() => setOpen(false)} />
          </div>
          <div className="flex-1 bg-slate-900/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{displayName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navItems, onNavigate }) => (
  <>
    <div className="flex items-center gap-2 px-5 py-5">
      <div className="rounded-xl bg-brand-600 p-2 text-white">
        <GraduationCap size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800 leading-tight">UOF Dashboard</p>
        <p className="text-xs text-slate-400">U/G Form Submission</p>
      </div>
    </div>
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
            }`
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  </>
);

export default DashboardLayout;
