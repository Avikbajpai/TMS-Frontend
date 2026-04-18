import React from 'react';
import { DashboardStatsDTO } from '../api/dtos';
import { Ticket, Clock, CheckCircle, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  stats: DashboardStatsDTO | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  if (!stats) return <div className="animate-pulse space-y-5">
     <div className="grid grid-cols-4 gap-5">
        {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white border border-slate-200 rounded-lg"></div>)}
     </div>
     <div className="h-64 bg-white border border-slate-200 rounded-lg"></div>
  </div>;

  const statCards = [
    { label: 'Total Tickets', value: stats.total.toLocaleString(), color: 'text-slate-900' },
    { label: 'Open Tickets', value: stats.open.toLocaleString(), color: 'text-red-600' },
    { label: 'In Progress', value: stats.inProgress.toLocaleString(), color: 'text-orange-600' },
    { label: 'Resolved Today', value: stats.resolved.toLocaleString(), color: 'text-green-600' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
          >
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">{card.label}</p>
            <p className={`text-2xl font-extrabold tracking-tight ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
         <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50">
               <h3 className="text-sm font-bold text-slate-900">Priority Distribution</h3>
            </div>
            
            <div className="p-6 space-y-5">
               {Object.entries(stats.byPriority).map(([priority, count]) => {
                  const val = count as number;
                  const percentage = Math.round((val / stats.total) * 100) || 0;
                  const colors: any = {
                    URGENT: 'bg-red-600',
                    HIGH: 'bg-orange-600',
                    MEDIUM: 'bg-blue-600',
                    LOW: 'bg-slate-400'
                  };
                  return (
                    <div key={priority}>
                       <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{priority}</span>
                          <span className="text-[10px] font-bold text-slate-900">{val} ({percentage}%)</span>
                       </div>
                       <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className={`${colors[priority]} h-full rounded-full`}
                          ></motion.div>
                       </div>
                    </div>
                  );
               })}
            </div>
         </div>

         <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-2">System Load</h3>
            <p className="text-slate-500 text-xs mb-6 font-medium">Weekly activity projection</p>
            
            <div className="mt-auto">
               <div className="flex items-end gap-1.5 h-32 mb-4">
                  {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                     <div key={i} className="flex-1 bg-slate-100 rounded-sm relative group/bar h-full">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="absolute bottom-0 w-full bg-blue-600 rounded-sm opacity-80"
                        ></motion.div>
                     </div>
                  ))}
               </div>
               <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 pr-1">
                  <span>Mon</span>
                  <span>Sun</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
