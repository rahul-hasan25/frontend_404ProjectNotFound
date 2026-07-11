'use client';

import React, { useState, useEffect } from 'react';
import { Task, useTasks } from '@/context/TaskContext';
import { X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskModalProps {
  isOpen     : boolean;
  onClose    : () => void;
  taskToEdit?: Task | null;
}

export default function TaskModal({ isOpen, onClose, taskToEdit }: TaskModalProps) {
  const { createTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.due_date || '');
      setTags(taskToEdit.tags || []);
    } else {
      setTitle(''); setDescription(''); setStatus('todo'); setPriority('medium'); setDueDate(''); setTags([]);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, description, status, priority, due_date: dueDate || undefined, tags, task_date: '' };
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, payload);
        toast.success('Task Updated Successfully!.');
      } else {
        await createTask(payload);
        toast.success('New Task Added successfully!');
      }
      onClose();
    } catch {
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-110 bg-white border border-teal-100 shadow-2xl relative p-6 rounded-none">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-800">
            {taskToEdit ? 'Update Task Information' : 'Create a New Task'}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-0.5">Task Title</label>
            <input type="text" required placeholder="e.g. PATIENT-XYZ (MRI Brain)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500 rounded-none"/>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-0.5">Task Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500 rounded-none resize-none"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-0.5">Status</label>
              <select value={status} onChange={(e: any) => setStatus(e.target.value)} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-teal-500 rounded-none">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-0.5">Priority</label>
              <select value={priority} onChange={(e: any) => setPriority(e.target.value)} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-teal-500 rounded-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-0.5">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500 rounded-none"/>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-0.5">Add Tags</label>
            <div className="flex border border-slate-200 bg-slate-50">
              <input type="text" placeholder="HEALTH, MEDICINE, WALK" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="w-full px-3 py-1.5 text-xs text-slate-800 bg-transparent focus:outline-none rounded-none"/>
              <button type="button" onClick={handleAddTag} className="bg-white border-l border-slate-200 px-3 text-slate-500 hover:text-slate-900 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex flex-wrap gap-1 pt-1.5">
              {tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5">
                  {tag.toUpperCase()}
                  <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-orange-600 ml-0.5 cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer rounded-none mt-2 shadow-[0_4px_14px_rgba(13,148,136,0.2)]">
            {taskToEdit ? 'Update Task' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
}