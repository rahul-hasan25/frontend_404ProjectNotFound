'use client';

import React, { useState, useEffect } from 'react';
import { TaskProvider, useTasks } from '@/context/TaskContext';
import DateSelector from '@/components/DateSelector';
import Board from '@/components/Board';
import TaskModal from '@/components/TaskModal';
import { LayoutGrid, Loader2, User, Kanban, Image as ImageIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import api from '@/utils/api';

function KanbanControlTerminal() {
  const { loading, fetchTasks } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);
  
  const [userData, setUserData] = useState<{ full_name: string; profile_picture: string | null }>({
    full_name: '',
    profile_picture: null
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/auth/me/');
        setUserData({
          full_name: response.data.full_name,
          profile_picture: response.data.profile_picture 
        });
      } catch (error) {
        console.error('Failed to fetch user metadata', error);
        setUserData({
          full_name: '',
          profile_picture: null
        });
      }
    };
    fetchUserProfile();
  }, []);

  const initCreateNode = () => { setActiveTask(null); setModalOpen(true); };
  const initEditNode = (task: any) => { setActiveTask(task); setModalOpen(true); };

  return (
    <div className="h-screen w-screen bg-[#F4F7F6] text-slate-800 font-sans flex flex-col overflow-hidden relative">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="absolute inset-0 opacity-[0.25] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      <nav className="w-full bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 relative z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-600 text-white flex items-center justify-center rounded-lg shadow-md shadow-teal-600/20">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-700 block">
            404 Kanban Tasks Board
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex items-center gap-1 md:gap-2">
            <a href="/tasks" className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider rounded border border-teal-200/40 transition-all">
              <Kanban className="w-3 h-3" />
              <span className="hidden sm:inline">Tasks</span>
            </a>
            <a href="/annotate" className="flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded transition-all">
              <ImageIcon className="w-3 h-3" />
              <span className="hidden sm:inline">Annotate</span>
            </a>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2 pl-1">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-700 leading-none">
                {userData.full_name && userData.full_name.trim() !== '' ? userData.full_name : 'Hello User'}
              </p>
            </div>
            
            <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 overflow-hidden shadow-inner shrink-0">
              {userData.profile_picture ? (
                <img src={userData.profile_picture} alt={userData.full_name || 'User'} className="w-full h-full object-cover"/>
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full flex-1 mx-auto flex flex-col p-3 md:p-4 space-y-3 relative z-10 min-h-0">        
        <div className="shrink-0">
          <DateSelector onCreateTask={initCreateNode} onRefresh={fetchTasks} />
        </div>

        {loading ? (
          <div className="flex-1 border border-slate-200 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center text-slate-400 rounded-none">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600 mb-2" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading Clinical Studies Matrix...</span>
          </div>
        ) : (
          <Board onEditTask={initEditNode} />
        )}
      </div>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} taskToEdit={activeTask} />
    </div>
  );
}

export default function TasksPage() {
  return (
    <TaskProvider>
      <KanbanControlTerminal />
    </TaskProvider>
  );
}