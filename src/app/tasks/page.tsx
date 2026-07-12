'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TaskProvider, useTasks } from '@/context/TaskContext';
import DateSelector from '@/components/DateSelector';
import Board from '@/components/Board';
import TaskModal from '@/components/TaskModal';
import { LayoutGrid, Loader2, User, Kanban, Image as ImageIcon, LogOut, ChevronDown } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from '@/utils/api';
import Cookies from 'js-cookie';

function KanbanControlTerminal() {
  const { loading, fetchTasks } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [userData, setUserData] = useState<{ full_name: string; profile_picture: string | null }>({
    full_name: '',
    profile_picture: null
  });

  useEffect(() => {
    const cookieToken = Cookies.get('access_token');
    const localToken = localStorage.getItem('access_token');
    const localRefresh = localStorage.getItem('refresh_token');

    if (!cookieToken && localToken) {
      Cookies.set('access_token', localToken, { expires: 1 / 24, secure: true, sameSite: 'lax' });
      if (localRefresh) {
        Cookies.set('refresh_token', localRefresh, { expires: 7, secure: true, sameSite: 'lax' });
      }
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    try {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.clear();
      sessionStorage.clear();

      toast.success('Logged out successfully!');

      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = window.location.origin;
        }
      }, 500);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout.');
    }
  };

  const initCreateNode = () => { setActiveTask(null); setModalOpen(true); };
  const initEditNode = (task: any) => { setActiveTask(task); setModalOpen(true); };

  return (
    <div className="h-screen w-screen bg-[#F4F7F6] text-slate-800 font-sans flex flex-col overflow-hidden relative">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="absolute inset-0 opacity-[0.25] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      
      <nav className="w-full bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between shrink-0 relative z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-linear-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center rounded-md shadow-sm">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
            404 Kanban Tasks Board
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <a href="/tasks" className="flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-[9px] font-bold uppercase tracking-wider rounded transition-all hover:bg-teal-100/60">
              <Kanban className="w-3 h-3" />
              <span className="hidden sm:inline">Tasks</span>
            </a>
            <a href="/annotate" className="flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-[9px] font-bold uppercase tracking-wider rounded transition-all">
              <ImageIcon className="w-3 h-3" />
              <span className="hidden sm:inline">Annotate</span>
            </a>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-0.5 rounded-md hover:bg-slate-50/80 transition-all text-left group">
              <div className="text-right hidden sm:flex flex-col justify-center">
                <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Welcome,
                </span>
                <span className="text-[10px] font-bold text-slate-700 leading-none truncate max-w-25">
                  {userData.full_name && userData.full_name.trim() !== '' ? userData.full_name : 'User'}
                </span>
              </div>
              
              <div className="w-6 h-6 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 overflow-hidden shadow-inner shrink-0">
                {userData.profile_picture ? (
                  <img src={userData.profile_picture} alt={userData.full_name || 'User'} className="w-full h-full object-cover"/>
                ) : (
                  <User className="w-3 h-3" />
                )}
              </div>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180 text-teal-600' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-xs">
                <div className="px-3 py-1 border-b border-slate-100 sm:hidden">
                  <p className="text-[9px] font-medium text-slate-400 uppercase">Welcome</p>
                  <p className="font-bold text-slate-700 truncate">{userData.full_name || 'User'}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-1.5 text-left font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-all">
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
            )}
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