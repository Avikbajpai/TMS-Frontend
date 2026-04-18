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

const API_BASE = '/api';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [tickets, setTickets] = useState<TicketResponseDTO[]>([]);
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponseDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: 'u1', name: 'Alice Customer', role: UserRole.CUSTOMER });
  const [engineers, setEngineers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);
      const headers = { 'x-user-id': currentUser.id, 'x-user-role': currentUser.role };
      
      const [ticketsRes, statsRes, engRes] = await Promise.all([
        fetch(`${API_BASE}/tickets`, { headers }),
        fetch(`${API_BASE}/tickets/stats`, { headers }),
        fetch(`${API_BASE}/tickets/engineers`, { headers })
      ]);

      const [ticketsData, statsData, engData] = await Promise.all([
        ticketsRes.json(),
        statsRes.json(),
        engRes.json()
      ]);

      setTickets(ticketsData);
      setStats(statsData);
      setEngineers(engData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [currentUser]);

  const handleCreateTicket = async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id, 'x-user-role': currentUser.role },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setIsFormOpen(false);
        fetchAll();
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateStatus = async (id: string, status: TicketStatus) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id, 'x-user-role': currentUser.role },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTicket(updated);
        fetchAll();
      }
    } catch (e) { console.error(e); }
  };

  const handleAssign = async (id: string, engineerId: string) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id, 'x-user-role': currentUser.role },
        body: JSON.stringify({ engineerId })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTicket(updated);
        fetchAll();
      }
    } catch (e) { console.error(e); }
  };

  const switchRole = (role: UserRole) => {
    if (role === UserRole.CUSTOMER) setCurrentUser({ id: 'u1', name: 'Alice Customer', role });
    if (role === UserRole.ENGINEER) setCurrentUser({ id: 'u2', name: 'Bob Engineer', role });
    if (role === UserRole.ADMIN) setCurrentUser({ id: 'u3', name: 'Charlie Admin', role });
    fetchAll();
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pt-[60px]">
      <Sidebar 
        currentTab={tab} 
        setTab={setTab} 
        currentUser={currentUser} 
        switchRole={switchRole}
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
            ) : (
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
            )}
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
    </div>
  );
}
