import React, { useState } from 'react';
import { TicketStatus, TicketPriority } from '../types';
import { Plus, X, Loader2, Send } from 'lucide-react';

interface TicketFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TicketPriority.MEDIUM,
    category: 'General'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200 bg-slate-50">
           <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Generate Ticket</h2>
           <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded transition-colors">
              <X size={18} className="text-slate-400" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Issue Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded outline-none focus:border-blue-500 transition-all text-[13px] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Priority</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded outline-none focus:border-blue-500 transition-all text-[13px] font-bold"
                    >
                      <option value={TicketPriority.LOW}>Low</option>
                      <option value={TicketPriority.MEDIUM}>Medium</option>
                      <option value={TicketPriority.HIGH}>High</option>
                      <option value={TicketPriority.URGENT}>Urgent</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Category</label>
                    <input 
                      type="text" 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded outline-none focus:border-blue-500 transition-all text-[13px] font-bold"
                    />
                 </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded outline-none focus:border-blue-500 transition-all text-[13px] font-medium resize-none"
                />
              </div>
           </div>

           <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded border border-slate-200 transition-all"
              >
                 Cancel
              </button>
              <button 
                 disabled={isSubmitting}
                 type="submit"
                 className="flex-1 py-2.5 bg-blue-600 text-white rounded font-bold text-xs hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                 {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Create Ticket'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};
