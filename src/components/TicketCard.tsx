import React from 'react';
import { TicketResponseDTO } from '../api/dtos';
import { Badge } from './Badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TicketCardProps {
  ticket: TicketResponseDTO;
  onClick: (ticket: TicketResponseDTO) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'OPEN': return 'info';
      case 'CLOSED': return 'neutral';
      default: return 'neutral';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'urgent';
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(ticket)}
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-mono text-slate-400">#{ticket.id}</span>
        <div className="flex gap-2">
          <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
          <Badge variant={getStatusVariant(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
        </div>
      </div>
      
      <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
        {ticket.title}
      </h3>
      
      <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
        {ticket.description}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <User size={14} />
            <span>{ticket.createdBy.name}</span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
              <AlertCircle size={14} />
              <span>Assigned</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Clock size={12} />
          <span>{formatDistanceToNow(new Date(ticket.createdAt))} ago</span>
        </div>
      </div>
    </motion.div>
  );
};
