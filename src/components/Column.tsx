'use client';

import React, { useState } from 'react';
import { Task, useTasks } from '@/context/TaskContext';
import TaskCard from './TaskCard';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface ColumnProps {
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  columnData: { results: Task[]; total_pages: number; current_page: number; total_count: number };
  onEditTask: (task: Task) => void;
}

export default function Column({ title, status, columnData, onEditTask }: ColumnProps) {
  const { updateTask, setPage } = useTasks();
  const [dragOver, setDragOver] = useState(false);

  const { results = [], total_pages = 1, current_page = 1, total_count = 0 } = columnData || {};

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const idStr = e.dataTransfer.getData('text/plain');
    if (idStr) {
      const id = parseInt(idStr, 10);
      try {
        await updateTask(id, { status });
      } catch {
        toast.error('Something went wrong.');
      }
    }
  };

  return (
    <div onDragOver={(e) => e.preventDefault()} onDragEnter={() => setDragOver(true)} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={`flex flex-col h-full p-2.5 transition-all border rounded-none ${ dragOver ? 'bg-teal-50/40 border-teal-500 border-dashed shadow-inner' : 'bg-[#F9FAFA] border-slate-200'}`}>
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 ${status === 'done' ? 'bg-emerald-500' : status === 'in_progress' ? 'bg-orange-400' : 'bg-teal-600'}`} />
          <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">{title}</h3>
        </div>
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700">
          {total_count}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 min-h-0 scrollbar-none">
        {results.length === 0 ? (
          <div className="h-full border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-300 bg-white/40">
            <Activity className="w-3.5 h-3.5 text-slate-200 mb-1" />
            <span className="text-[8px] uppercase font-bold tracking-widest text-slate-300">No active tasks</span>
          </div>
        ) : (
          results.map((task) => <TaskCard key={task.id} task={task} onEdit={onEditTask} />)
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between shrink-0">
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
          P. {current_page} / {total_pages}
        </span>
        
        <div className="flex items-center gap-1">
          <button disabled={current_page === 1} onClick={() => setPage(status, current_page - 1)} className="p-0.5 bg-white border border-slate-200 text-slate-500 hover:text-teal-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-all">
            <ChevronLeft className="w-3 h-3" />
          </button>
          
          <div className="flex gap-0.5">
            {Array.from({ length: total_pages }, (_, i) => i + 1).map((pageNum) => (
              <button key={pageNum} onClick={() => setPage(status, pageNum)} className={`w-4 h-4 text-[8px] font-black transition-all ${ current_page === pageNum ? 'bg-teal-600 text-white'  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {pageNum}
              </button>
            ))}
          </div>

          <button disabled={current_page === total_pages} onClick={() => setPage(status, current_page + 1)} className="p-0.5 bg-white border border-slate-200 text-slate-500 hover:text-teal-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-all">
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}