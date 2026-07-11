'use client';

import React, { useState } from 'react';
import { Task, useTasks } from '@/context/TaskContext';
import { Trash2, ShieldAlert, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { deleteTask } = useTasks();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const priorityMeta = {
    high: { style: 'border-orange-200 bg-orange-50/60 text-orange-700', label: 'HIGH' },
    medium: { style: 'border-teal-200 bg-teal-50/40 text-teal-700', label: 'MEDIUM' },
    low: { style: 'border-slate-200 bg-slate-50 text-slate-500', label: 'LOW' },
  };

  const handleOpenDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handlePurgeConfirm = async () => {
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully!', {
        style: { background: '#ffffff', color: '#0f172a', border: '1px solid #ccfbf1', borderRadius: '0px', fontSize: '12px', fontWeight: 'bold' }
      });
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id.toString())} onClick={() => onEdit(task)} className="group relative bg-white border border-slate-200 p-3.5 rounded-none hover:border-teal-500/60 hover:shadow-[0_6px_24px_rgba(13,148,136,0.05)] transition-all duration-200 cursor-grab active:cursor-grabbing">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[8px] font-black tracking-widest border px-2 py-0.5 rounded-none ${priorityMeta[task.priority].style}`}>
            {priorityMeta[task.priority].label}
          </span>
          <button onClick={handleOpenDeleteModal} className="text-slate-300 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-0.5">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase group-hover:text-teal-600 transition-colors line-clamp-1">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-medium">
            {task.description}
          </p>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {task.tags.map((tag, idx) => (
              <span key={idx} className="text-[9px] font-bold text-teal-600 bg-teal-50/50 px-2 py-0.5 border border-teal-100/60 rounded-none">
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {task.due_date && (
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 text-[9px] font-bold text-slate-400 tracking-wider uppercase">
            <ShieldAlert className="w-3 h-3 text-teal-500/70" />
            <span>DUE DATE: {task.due_date}</span>
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}/>
          <div className="relative w-full max-w-sm bg-white border border-slate-200 shadow-2xl p-5 transition-all transform animate-in fade-in zoom-in-95 duration-150 rounded-none z-10">
            <button onClick={() => setIsDeleteModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-orange-50 border border-orange-100 text-orange-600 shrink-0 rounded-none">
                <AlertTriangle className="w-4 h-4" />
              </div>
              
              <div className="space-y-1 flex-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-orange-600 block">
                  System Action Required
                </span>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Confirm Task Delete
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Are you sure you want to delete this task <strong className="text-slate-700">"{task.title}"</strong>?
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3.5">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest transition-colors rounded-none cursor-pointer">
                Cancel
              </button>
              <button onClick={handlePurgeConfirm} className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[9px] font-black uppercase tracking-widest shadow-[0_4px_12px_rgba(234,88,12,0.15)] transition-colors rounded-none cursor-pointer">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}