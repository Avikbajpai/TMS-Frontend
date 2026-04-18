import { LayoutDashboard, Ticket, Users, ShieldCheck, UserCircle } from 'lucide-react';
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  currentUser: { id: string, name: string, role: UserRole };
  switchRole: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab, currentUser, switchRole }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets', label: 'All Tickets', icon: Ticket },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <nav className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-black text-white text-xs">
             N
          </div>
          <span className="text-sm font-extrabold text-slate-900 tracking-tight">TMS Core <span className="font-light opacity-40 italic">/ Architect</span></span>
        </div>

        <div className="flex items-center border-l border-slate-100 ml-4 pl-4 h-6 gap-1">
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

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Login Mode:</p>
          <div className="flex gap-1">
            <button onClick={() => switchRole(UserRole.CUSTOMER)} title="Customer" className={`p-1.5 rounded ${currentUser.role === UserRole.CUSTOMER ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100'}`}><UserCircle size={14} /></button>
            <button onClick={() => switchRole(UserRole.ENGINEER)} title="Engineer" className={`p-1.5 rounded ${currentUser.role === UserRole.ENGINEER ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100'}`}><Users size={14} /></button>
            <button onClick={() => switchRole(UserRole.ADMIN)} title="Admin" className={`p-1.5 rounded ${currentUser.role === UserRole.ADMIN ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100'}`}><ShieldCheck size={14} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700">{currentUser.name}</span>
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black border border-slate-300">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </nav>
  );
};

