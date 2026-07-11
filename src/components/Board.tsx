'use client';

import React from 'react';
import { useTasks } from '@/context/TaskContext';
import Column from './Column';

interface BoardProps {
  onEditTask: (task: any) => void;
}

export default function Board({ onEditTask }: BoardProps) {
  const { boardData } = useTasks();

  if (!boardData) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden pb-4 lg:pb-0">
      <Column title="To Do" status="todo" columnData={boardData.todo} onEditTask={onEditTask} />
      <Column title="In Progress" status="in_progress" columnData={boardData.in_progress} onEditTask={onEditTask} />
      <Column title="Done" status="done" columnData={boardData.done} onEditTask={onEditTask} />
    </div>
  );
}