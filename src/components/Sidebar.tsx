import { LayoutDashboard, Ticket, Users, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  currentUser: { id: string, name: string, role: UserRole };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab, currentUser }) => {

  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tickets', label: 'All Tickets' },
    { id: 'users', label: 'Users' },
  ];

  return (
    <>
      {/* TOP NAV */}
      <nav className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 fixed top-0 left-0 right-0 z-50">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* MOBILE MENU BUTTON */}
          <button 
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-black text-white text-xs">
              N
            </div>
            <span className="text-sm font-extrabold text-slate-900 tracking-tight hidden sm:block">
              TMS Core <span className="font-light opacity-40 italic">/ Architect</span>
            </span>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center border-l border-slate-100 ml-4 pl-4 h-6 gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50/50' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* ROLE (hide on small) */}
          <span className="hidden sm:block text-xs font-semibold text-slate-500">
            ROLE: <span className="text-blue-600 font-bold">{currentUser.role}</span>
          </span>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition"
          >
            Logout
          </button>

          {/* USER */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs font-semibold text-slate-700">
              {currentUser.name}
            </span>
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black border border-slate-300">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">

          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* DRAWER */}
          <div className="relative bg-white w-64 h-full shadow-lg p-5 space-y-4 animate-slide-in">

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-sm">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded text-sm font-semibold ${
                  currentTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};