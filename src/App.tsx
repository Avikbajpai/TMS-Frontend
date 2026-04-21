import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TicketCard } from './components/TicketCard';
import { TicketModal } from './components/TicketModal';
import { TicketForm } from './components/TicketForm';
import { Badge } from './components/Badge';
import { UserRole, TicketStatus } from './types';
import { TicketResponseDTO, DashboardStatsDTO } from './api/dtos';
import { Plus, Search, Filter, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginModal } from './components/LoginModal';

const API_BASE = 'https://tms-nexus-api.onrender.com/api';


export default function App() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [tickets, setTickets] = useState<TicketResponseDTO[]>([]);
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponseDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);
      const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem("token")}`};
      console.log(headers);
      console.log(localStorage.getItem("token"));
      const [ticketsRes, statsRes, engRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/tickets`, { headers }),
        fetch(`${API_BASE}/dashboard/stats`, { headers }),
        fetch(`${API_BASE}/engineers`, { headers }),
        fetch(`${API_BASE}/users`, { headers }) 
      ]);

      const [ticketsData, statsData, engData, usersData] = await Promise.all([
        ticketsRes.json(),
        statsRes.json(),
        engRes.json(),
        usersRes.json()
      ]);

      setTickets(ticketsData.data);
      setStats(statsData.data);
      setEngineers(engData.data);
      setUsers(usersData.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  const user = localStorage.getItem("user");
  if (user) {
    setCurrentUser(JSON.parse(user));
  }
}, []);

  useEffect(() => {
    fetchAll();
  }, [currentUser]);

  const handleCreateTicket = async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers : {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setIsFormOpen(false);
        setShowSuccess(true);
        fetchAll();
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateStatus = async (id: string, status: TicketStatus) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/status`, {
        method: 'PUT',
        headers: {
  'Content-Type': 'application/json',
   'Authorization': `Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTicket(updated.data);
        fetchAll();
      }
    } catch (e) { console.error(e); }
  };

  const handleAssign = async (id: string, engineerId: string) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/assign`, {
        method: 'PUT',
        headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify({ engineerId })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTicket(updated.data);
        fetchAll();
      }
    } catch (e) { console.error(e); }
  };


  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
 
if (!currentUser) {
  return (
    <LoginModal
      onLogin={(data: any) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        setCurrentUser(data.data);
      }}
    />
  );
}

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pt-[60px]">
      <Sidebar 
        currentTab={tab} 
        setTab={setTab} 
        currentUser={currentUser}
      />

      <div className="flex-1 p-5 lg:grid lg:grid-cols-4 lg:gap-5 max-w-[1400px] mx-auto w-full">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-5">
           <AnimatePresence mode="wait">
            {tab === 'dashboard' ? (
              <motion.div 
                 key="dash"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
              >
                <Dashboard stats={stats} />
              </motion.div>
            ) : tab === 'tickets' ? (
              <motion.div 
                 key="tickets"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="space-y-5"
              >
                 <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                       <input 
                         className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded border border-slate-200 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                         placeholder="Filter queue..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                       />
                    </div>
                    <select 
                      className="px-3 py-2 bg-slate-50 rounded border border-slate-200 outline-none text-xs font-bold text-slate-600 appearance-none focus:border-blue-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                       <option value="">All Statuses</option>
                       <option value={TicketStatus.OPEN}>Open</option>
                       <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                       <option value={TicketStatus.RESOLVED}>Resolved</option>
                       <option value={TicketStatus.CLOSED}>Closed</option>
                    </select>
                 </div>

                 <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                       <h3 className="text-sm font-bold text-slate-900">Active Queue</h3>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{filteredTickets.length} Tickets Found</span>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {filteredTickets.map(ticket => (
                                <tr 
                                  key={ticket.id} 
                                  onClick={() => setSelectedTicket(ticket)}
                                  className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                                >
                                   <td className="px-4 py-3 text-xs font-mono text-slate-400">#{ticket.id}</td>
                                   <td className="px-4 py-3">
                                      <p className="text-xs font-bold text-slate-900">{ticket.title}</p>
                                      <p className="text-[10px] text-slate-500">{ticket.category}</p>
                                   </td>
                                   <td className="px-4 py-3">
                                      <Badge variant={ticket.status === 'RESOLVED' ? 'success' : 'warning'}>{ticket.status}</Badge>
                                   </td>
                                   <td className="px-4 py-3 font-bold text-[10px] text-slate-700">
                                      {ticket.priority}
                                   </td>
                                   <td className="px-4 py-3 text-[10px] text-slate-400">
                                      {new Date(ticket.createdAt).toLocaleDateString()}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </motion.div>
            ): tab === 'users' ? (
              <motion.div
  key="users"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="space-y-5"
>
  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
      <h3 className="text-sm font-bold text-slate-900">Users</h3>
      <span className="text-[10px] font-bold text-slate-400 uppercase">
        {users.length} Users
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase">ID</th>
            <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase">Name</th>
            <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase">Role</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-blue-50/30 transition">
              <td className="px-4 py-3 text-xs font-mono text-slate-400">
                #{user.id}
              </td>
              <td className="px-4 py-3 text-xs font-bold text-slate-900">
                {user.name}
              </td>
              <td className="px-4 py-3">
                <Badge variant="neutral">{user.role}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</motion.div>
            ): null
          }
          </AnimatePresence>
        </div>

        {/* Sidebar Actions Column */}
        <aside className="space-y-5">
           <div className="bg-white p-5 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                 <button 
                   onClick={() => setIsFormOpen(true)}
                   className="w-full flex items-center justify-center gap-2 bg-blue-600 px-4 py-2.5 rounded text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-sm"
                 >
                   <Plus size={16} /> New Ticket
                 </button>
                 <button 
                   onClick={fetchAll}
                   className="w-full flex items-center justify-center gap-2 bg-slate-100 px-4 py-2.5 rounded text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all border border-slate-200"
                 >
                   <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Sync
                 </button>
              </div>
           </div>

           <div className="bg-white p-5 rounded-lg border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">System Health</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Database</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                       Connected
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">API Gateway</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                       Active
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Auth Service</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                       Healthy
                    </span>
                 </div>
              </div>
           </div>
        </aside>
      </div>

      {selectedTicket && (
        <TicketModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)}
          currentUser={currentUser}
          onUpdateStatus={handleUpdateStatus}
          onAssign={handleAssign}
          engineers={engineers}
        />
      )}

      {isFormOpen && (
        <TicketForm 
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateTicket}
          isSubmitting={false}
        />
      )}

      {showSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-[320px] text-center animate-fade-in">
      
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 text-xl">✓</span>
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-1">
        Ticket Created!
      </h2>

      <p className="text-xs text-slate-500 mb-5">
        Your ticket has been successfully created.
      </p>

      <button
        onClick={() => {
          setShowSuccess(false);
          setTab('tickets'); // ✅ redirect
        }}
        className="w-full bg-blue-600 text-white py-2 rounded-md text-xs font-bold hover:bg-blue-700 transition"
      >
        Go to All Tickets
      </button>
    </div>
  </div>
)}
    </div>
  );
}
