import React from 'react';
import { TicketResponseDTO } from '../api/dtos';
import { X, Clock, User, AlertCircle, CheckCircle, Play, Tag, ChevronRight } from 'lucide-react';
import { Badge } from './Badge';
import { UserRole, TicketStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TicketModalProps {
  ticket: TicketResponseDTO;
  onClose: () => void;
  currentUser: { id: string, role: UserRole };
  onUpdateStatus: (id: string, status: TicketStatus) => void;
  onAssign: (id: string, engineerId: string) => void;
  engineers: any[];
}

export const TicketModal: React.FC<TicketModalProps> = ({ 
  ticket, 
  onClose, 
  currentUser, 
  onUpdateStatus, 
  onAssign,
  engineers 
}) => {
  const isCreator = ticket.createdBy.id === currentUser.id;
  const isEngineer = currentUser.role === UserRole.ENGINEER;
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isAssignedToMe = ticket.assignedTo?.id === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">ID: {ticket.id}</span>
              <Badge variant={ticket.priority === 'URGENT' ? 'urgent' : 'neutral'}>{ticket.priority}</Badge>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{ticket.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</h3>
              <div className="text-[13px] text-slate-700 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100 italic">
                 {ticket.description}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
               <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Event Log</h3>
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                     <p className="text-[11px] font-bold text-slate-900 truncate flex-1">Origin Created</p>
                     <p className="text-[10px] text-slate-400 font-mono">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                  </div>
                  {ticket.updatedAt !== ticket.createdAt && (
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                       <p className="text-[11px] font-bold text-slate-900 truncate flex-1">State Modification</p>
                       <p className="text-[10px] text-slate-400 font-mono">{new Date(ticket.updatedAt).toLocaleTimeString()}</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          <div className="space-y-4 mt-6 lg:mt-0">
             <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Context Info</h4>
                
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500">Status</span>
                      <Badge variant={ticket.status === 'RESOLVED' ? 'success' : 'warning'}>{ticket.status}</Badge>
                   </div>
                   
                   <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500">Reporter</span>
                      <span className="text-[11px] font-bold text-slate-900">{ticket.createdBy.name}</span>
                   </div>

                   <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500">Assignee</span>
                      <span className="text-[11px] font-bold text-slate-900">{ticket.assignedTo?.name || '--'}</span>
                   </div>
                </div>

                <div className="mt-6 space-y-2">
                   {isAdmin && ticket.status !== TicketStatus.CLOSED && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Dispatch To</p>
                        <select 
                          className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 transition-all font-bold text-slate-700"
                          value={ticket.assignedTo?.id || ""}
                          onChange={(e) => onAssign(ticket.id, e.target.value)}
                        >
                           <option value="" disabled>Select User</option>
                           {engineers.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                      </div>
                   )}

                   <div className="flex flex-col gap-2 pt-2">
                      {isAdmin && ticket.status === TicketStatus.RESOLVED && (
                         <button 
                           onClick={() => onUpdateStatus(ticket.id, TicketStatus.CLOSED)}
                           className="w-full py-2.5 bg-slate-900 text-white rounded font-bold text-xs hover:bg-slate-800 transition-all shadow-sm"
                         >
                            Archive Ticket
                         </button>
                      )}

                      {(isEngineer || isAdmin) && ticket.status === TicketStatus.OPEN && (
                         <button 
                           onClick={() => onUpdateStatus(ticket.id, TicketStatus.IN_PROGRESS)}
                           className="w-full py-2.5 bg-blue-600 text-white rounded font-bold text-xs hover:bg-blue-700 transition-all shadow-sm"
                         >
                            Authorize Pickup
                         </button>
                      )}

                      {(isAssignedToMe || isAdmin) && ticket.status === TicketStatus.IN_PROGRESS && (
                         <button 
                           onClick={() => onUpdateStatus(ticket.id, TicketStatus.RESOLVED)}
                           className="w-full py-2.5 bg-green-600 text-white rounded font-bold text-xs hover:bg-green-700 transition-all shadow-sm"
                         >
                            Confirm Resolution
                         </button>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
