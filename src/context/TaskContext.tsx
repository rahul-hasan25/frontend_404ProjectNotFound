'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';

export interface Task {
  id          : number;
  title       : string;
  description?: string;
  status      : 'todo' | 'in_progress' | 'done';
  priority    : 'low' | 'medium' | 'high';
  task_date   : string;
  due_date?   : string;
  tags?       : string[];
}

interface ColumnData {
  results     : Task[];
  total_pages : number;
  current_page: number;
  total_count : number;
}

interface TaskContextType {
  boardData      : { todo: ColumnData; in_progress: ColumnData; done: ColumnData } | null;
  loading        : boolean;
  selectedDate   : string;
  pages          : { todo: number; in_progress: number; done: number };
  setPage        : (column: 'todo' | 'in_progress' | 'done', page: number) => void;
  setSelectedDate: (date: string) => void;
  fetchTasks     : () => void;
  createTask     : (task: Omit<Task, 'id' | 'user'>) => Promise<void>;
  updateTask     : (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask     : (id: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [boardData, setBoardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [pages, setPages] = useState({ todo: 1, in_progress: 1, done: 1 });

  const setPage = (column: 'todo' | 'in_progress' | 'done', page: number) => {
    setPages(prev => ({ ...prev, [column]: page }));
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/tasks?date=${selectedDate}&todo_page=${pages.todo}&in_progress_page=${pages.in_progress}&done_page=${pages.done}`
      );
      setBoardData(response.data);
    } catch (error) {
      console.error('Handshake failed with DRF API', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate, pages.todo, pages.in_progress, pages.done]);

  const createTask = async (payload: any) => {
    await api.post('/tasks/', { ...payload, task_date: selectedDate });
    fetchTasks();
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    const cleanedUpdates: any = { ...updates };

    if (cleanedUpdates.task_date === '' || cleanedUpdates.task_date === null) {
      delete cleanedUpdates.task_date;
    }
    if (cleanedUpdates.due_date === '' || cleanedUpdates.due_date === null) {
      delete cleanedUpdates.due_date;
    }

    if (cleanedUpdates.tags && !Array.isArray(cleanedUpdates.tags)) {
      cleanedUpdates.tags = [cleanedUpdates.tags];
    }

    try {
      await api.patch(`/tasks/${id}/`, cleanedUpdates);
      fetchTasks();
    } catch (error: any) {
      console.error("Frontend Patch Error Context:", error.response?.data);
      throw error;
    }
  };

  const deleteTask = async (id: number) => {
    await api.delete(`/tasks/${id}/`);
    fetchTasks();
  };

  return (
    <TaskContext.Provider value={{ boardData, loading, selectedDate, pages, setPage, setSelectedDate, fetchTasks, createTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks context sequence error');
  return context;
};