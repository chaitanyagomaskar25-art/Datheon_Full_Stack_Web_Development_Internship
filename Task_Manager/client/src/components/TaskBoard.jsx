import { useState } from 'react';
import {
  CircleDot,
  CheckCircle2,
  Flag,
  Inbox,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { TaskItem } from '@/components/TaskItem';

export function StatusKanbanBoard({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
  dragId,
  dropTargetId,
  onMoveToStatus,
}) {
  const [dragOverCol, setDragOverCol] = useState(null); // 'active' | 'completed' | null

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleDragOver = (e, col) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== col) {
      setDragOverCol(col);
    }
  };

  const handleDragLeave = (e, col) => {
    // Only clear if leaving the column boundary
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverCol === col) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, col) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain') || dragId;
    if (!taskId) return;
    const isCompleted = col === 'completed';
    onMoveToStatus(taskId, isCompleted);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {/* Active Tasks Column */}
      <div
        onDragOver={(e) => handleDragOver(e, 'active')}
        onDragLeave={(e) => handleDragLeave(e, 'active')}
        onDrop={(e) => handleDrop(e, 'active')}
        className={`card p-4 transition-all duration-200 min-h-[350px] flex flex-col justify-between ${
          dragOverCol === 'active'
            ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-glow-indigo'
            : ''
        }`}
      >
        <div>
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                <CircleDot size={15} aria-hidden />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                In Progress / Active
              </h3>
            </div>
            <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-extrabold text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              {activeTasks.length}
            </span>
          </div>

          {/* Drop visual feedback banner */}
          {dragOverCol === 'active' && (
            <div className="mt-3 rounded-xl border-2 border-dashed border-indigo-400 bg-indigo-50/70 p-3 text-center text-xs font-bold text-indigo-700 animate-slide-in dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300">
              Drop here to set task as Active
            </div>
          )}

          {/* Task cards list */}
          <div className="mt-3 space-y-2.5">
            {activeTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <Inbox size={24} className="opacity-40" />
                <p className="mt-2 text-xs font-semibold">No active tasks</p>
                <p className="text-[11px] text-slate-400">Drag a task here to activate</p>
              </div>
            ) : (
              activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={onDragStart}
                  onDragEnter={onDragEnter}
                  onDragEnd={onDragEnd}
                  isDragging={dragId === task.id}
                  isDragOver={dropTargetId === task.id}
                />
              ))
            )}
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 text-center text-[11px] text-slate-400 dark:border-slate-800">
          Drag cards here to mark as active
        </div>
      </div>

      {/* Completed Tasks Column */}
      <div
        onDragOver={(e) => handleDragOver(e, 'completed')}
        onDragLeave={(e) => handleDragLeave(e, 'completed')}
        onDrop={(e) => handleDrop(e, 'completed')}
        className={`card p-4 transition-all duration-200 min-h-[350px] flex flex-col justify-between ${
          dragOverCol === 'completed'
            ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-md'
            : ''
        }`}
      >
        <div>
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 size={15} aria-hidden />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Completed
              </h3>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-extrabold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              {completedTasks.length}
            </span>
          </div>

          {/* Drop visual feedback banner */}
          {dragOverCol === 'completed' && (
            <div className="mt-3 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/70 p-3 text-center text-xs font-bold text-emerald-700 animate-slide-in dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300">
              Drop here to mark task as Completed
            </div>
          )}

          {/* Task cards list */}
          <div className="mt-3 space-y-2.5">
            {completedTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <Inbox size={24} className="opacity-40" />
                <p className="mt-2 text-xs font-semibold">No completed tasks yet</p>
                <p className="text-[11px] text-slate-400">Drag a finished task here</p>
              </div>
            ) : (
              completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={onDragStart}
                  onDragEnter={onDragEnter}
                  onDragEnd={onDragEnd}
                  isDragging={dragId === task.id}
                  isDragOver={dropTargetId === task.id}
                />
              ))
            )}
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 text-center text-[11px] text-slate-400 dark:border-slate-800">
          Drag cards here to mark as completed
        </div>
      </div>
    </div>
  );
}

export function PriorityKanbanBoard({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
  dragId,
  dropTargetId,
  onMoveToPriority,
}) {
  const [dragOverCol, setDragOverCol] = useState(null); // 'High' | 'Medium' | 'Low' | null

  const highTasks = tasks.filter((t) => t.priority === 'High');
  const mediumTasks = tasks.filter((t) => t.priority === 'Medium');
  const lowTasks = tasks.filter((t) => t.priority === 'Low');

  const COLUMNS = [
    {
      id: 'High',
      label: 'High Priority',
      tasks: highTasks,
      color: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
      activeRing: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20',
      dashedBorder: 'border-rose-400 dark:border-rose-500 text-rose-700 dark:text-rose-300 bg-rose-50/60 dark:bg-rose-950/40',
      dotColor: 'bg-rose-500',
    },
    {
      id: 'Medium',
      label: 'Medium Priority',
      tasks: mediumTasks,
      color: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
      activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20 dark:bg-amber-950/20',
      dashedBorder: 'border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/40',
      dotColor: 'bg-amber-500',
    },
    {
      id: 'Low',
      label: 'Low Priority',
      tasks: lowTasks,
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20',
      dashedBorder: 'border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40',
      dotColor: 'bg-emerald-500',
    },
  ];

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain') || dragId;
    if (!taskId) return;
    onMoveToPriority(taskId, colId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          onDragOver={(e) => handleDragOver(e, col.id)}
          onDragLeave={(e) => handleDragLeave(e, col.id)}
          onDrop={(e) => handleDrop(e, col.id)}
          className={`card p-4 transition-all duration-200 min-h-[350px] flex flex-col justify-between ${
            dragOverCol === col.id ? col.activeRing : ''
          }`}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {col.label}
                </h3>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${col.badgeBg}`}>
                {col.tasks.length}
              </span>
            </div>

            {/* Drop feedback banner */}
            {dragOverCol === col.id && (
              <div
                className={`mt-3 rounded-xl border-2 border-dashed p-3 text-center text-xs font-bold animate-slide-in ${col.dashedBorder}`}
              >
                Drop here to set {col.id} priority
              </div>
            )}

            {/* Cards */}
            <div className="mt-3 space-y-2.5">
              {col.tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                  <Inbox size={22} className="opacity-40" />
                  <p className="mt-2 text-xs font-semibold">No {col.id} priority tasks</p>
                  <p className="text-[11px] text-slate-400">Drag tasks here to set {col.id}</p>
                </div>
              ) : (
                col.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDragStart={onDragStart}
                    onDragEnter={onDragEnter}
                    onDragEnd={onDragEnd}
                    isDragging={dragId === task.id}
                    isDragOver={dropTargetId === task.id}
                  />
                ))
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-center text-[11px] text-slate-400 dark:border-slate-800">
            Drag cards here to set {col.id} priority
          </div>
        </div>
      ))}
    </div>
  );
}
