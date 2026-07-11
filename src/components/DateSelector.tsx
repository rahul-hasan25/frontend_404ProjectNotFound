'use client';

import React from 'react';
import { useTasks } from '@/context/TaskContext';
import { ChevronLeft, ChevronRight, Stethoscope, Plus, RefreshCw } from 'lucide-react';

interface DateSelectorProps {
  onCreateTask?: () => void;
  onRefresh?: () => void;
}

export default function DateSelector({ onCreateTask, onRefresh }: DateSelectorProps) {
  const { selectedDate, setSelectedDate } = useTasks();

  const shiftDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white border border-teal-100 p-3 md:p-4 rounded-none shadow-[0_4px_20px_rgba(13,148,136,0.03)]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-teal-50 border border-teal-200/60 text-teal-600 flex items-center justify-center rounded-none shrink-0">
          <Stethoscope className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Diagnostic Shift Allocation</p>
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wide">
            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex items-center border border-slate-200 bg-[#F8FAFA] h-9">
          <button onClick={() => shiftDate(-1)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50/50 border-r border-slate-200 transition-all cursor-pointer h-full flex items-center">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input type="date" value={selectedDate} onChange={(e) => e.target.value && setSelectedDate(e.target.value)} className="px-3 bg-transparent text-xs font-bold uppercase tracking-wider text-teal-700 focus:outline-none cursor-pointer border-none h-full outline-none"/>
          <button onClick={() => shiftDate(1)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50/50 border-l border-slate-200 transition-all cursor-pointer h-full flex items-center">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 h-9">
          {onRefresh && (
            <button onClick={onRefresh} className="p-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all cursor-pointer rounded-none h-full flex items-center justify-center" title="Refresh Matrix">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          {onCreateTask && (
            <button onClick={onCreateTask} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-black uppercase tracking-widest shadow-[0_4px_15px_rgba(13,148,136,0.15)] transition-all cursor-pointer rounded-none h-full">
              <Plus className="w-3.5 h-3.5" /> Create Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}