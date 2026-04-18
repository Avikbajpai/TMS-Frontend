import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'urgent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    error: 'bg-red-100 text-red-700 border-red-200 uppercase font-extrabold tracking-tighter',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    neutral: 'bg-slate-200 text-slate-600 border-slate-300',
    urgent: 'bg-red-600 text-white border-red-700 font-black uppercase tracking-widest',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wide border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
