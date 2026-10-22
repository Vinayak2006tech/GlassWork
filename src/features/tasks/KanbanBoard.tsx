import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Task, TaskStatus, User } from '../../types/models';
import { Badge } from '../../components/ui/Badge';
import { formatDate, isOverdue } from '../../utils/dates';
import { useUpdateTask } from '../../hooks/useTasks';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  User as UserIcon,
  Plus,
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onAddTask?: (status: TaskStatus) => void;
}

interface ColumnConfig {
  status: TaskStatus;
  title: string;
  icon: React.ReactNode;
  headerBg: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  users,
  onEditTask,
  onDeleteTask,
  onAddTask,
}) => {
  const updateTaskMutation = useUpdateTask();
  const userMap = new Map(users.map((u) => [u.id, u]));

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    updateTaskMutation.mutate({
      id: task.id,
      updates: { status: newStatus },
    });
  };

  const columns: ColumnConfig[] = [
    {
      status: 'TODO',
      title: 'To Do',
      icon: <Circle className="w-4 h-4 text-slate-400" aria-hidden="true" />,
      headerBg: 'bg-slate-100/70',
      badgeBg: 'bg-slate-200/80',
      badgeText: 'text-slate-700',
      borderColor: 'border-slate-200/80',
    },
    {
      status: 'IN_PROGRESS',
      title: 'In Progress',
      icon: <Clock className="w-4 h-4 text-amber-500" aria-hidden="true" />,
      headerBg: 'bg-amber-50/70',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      borderColor: 'border-amber-200/60',
    },
    {
      status: 'DONE',
      title: 'Done',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />,
      headerBg: 'bg-emerald-50/70',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      borderColor: 'border-emerald-200/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="flex flex-col rounded-2xl glass-card overflow-hidden border border-white/80 shadow-xs"
          >
            {/* Column Header */}
            <div
              className={`px-4 py-3 border-b border-white/60 flex items-center justify-between ${col.headerBg} backdrop-blur-md`}
            >
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="font-bold text-sm text-slate-800">{col.title}</h3>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.badgeBg} ${col.badgeText}`}
                >
                  {colTasks.length}
                </span>
              </div>

              {onAddTask && (
                <button
                  type="button"
                  onClick={() => onAddTask(col.status)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                  aria-label={`Add task to ${col.title}`}
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tasks Container */}
            <div className="p-3 space-y-3 min-h-[350px] max-h-[calc(100vh-280px)] overflow-y-auto">
              {colTasks.length === 0 ? (
                <div className="h-36 flex flex-col items-center justify-center border-2 border-dashed border-slate-200/80 rounded-xl text-center p-4">
                  <p className="text-xs font-medium text-slate-400">No tasks in {col.title}</p>
                </div>
              ) : (
                colTasks.map((task) => {
                  const assignee = userMap.get(task.assigneeId);
                  const overdue = isOverdue(task.dueDate, task.status);

                  return (
                    <div
                      key={task.id}
                      className="group p-4 rounded-xl bg-white/70 hover:bg-white/95 border border-white/80 shadow-xs hover:shadow-md transition-all space-y-3"
                    >
                      {/* Top Row: Priority Badge & Menu */}
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="priority" priority={task.priority} size="sm" />

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEditTask(task)}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`Edit ${task.title}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteTask(task)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`Delete ${task.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Move to menu */}
                          <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                              aria-label={`Status options for ${task.title}`}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 mt-1 w-44 origin-top-right rounded-xl glass-panel-opaque p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-30">
                                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Move to status
                                </div>
                                {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((st) => (
                                  <Menu.Item key={st}>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handleStatusChange(task, st)}
                                        disabled={task.status === st}
                                        className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg transition-colors ${
                                          task.status === st
                                            ? 'text-slate-400 font-semibold cursor-default'
                                            : active
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-slate-700'
                                        }`}
                                      >
                                        <span>
                                          {st === 'TODO'
                                            ? 'To Do'
                                            : st === 'IN_PROGRESS'
                                            ? 'In Progress'
                                            : 'Done'}
                                        </span>
                                        {task.status === st && (
                                          <span className="text-[10px] text-indigo-600 font-bold">
                                            ✓ Current
                                          </span>
                                        )}
                                      </button>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Footer: Due date, Assignee & Quick Status Advance */}
                      <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500">
                        {/* Due Date */}
                        <div
                          className={`flex items-center gap-1 ${
                            overdue ? 'text-rose-600 font-semibold' : ''
                          }`}
                          title={`Due ${task.dueDate}`}
                        >
                          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="text-[11px]">{formatDate(task.dueDate)}</span>
                        </div>

                        {/* Assignee */}
                        <div className="flex items-center gap-1.5" title={assignee?.name || 'Unassigned'}>
                          {assignee?.avatarUrl ? (
                            <img
                              src={assignee.avatarUrl}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                              {assignee?.name ? assignee.name.charAt(0) : <UserIcon className="w-3 h-3" />}
                            </div>
                          )}
                          <span className="text-[11px] font-medium text-slate-700 max-w-[80px] truncate">
                            {assignee?.name || 'Unassigned'}
                          </span>
                        </div>
                      </div>

                      {/* 1-Click Status Quick Advance Bar */}
                      <div className="pt-2 flex items-center gap-2">
                        {col.status === 'TODO' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(task, 'IN_PROGRESS')}
                            className="w-full flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200/50"
                          >
                            <span>Start Work</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {col.status === 'IN_PROGRESS' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(task, 'TODO')}
                              className="flex-1 flex items-center justify-center gap-1 py-1 px-2 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              title="Move back to To Do"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>To Do</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(task, 'DONE')}
                              className="flex-1 flex items-center justify-center gap-1 py-1 px-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/50"
                              title="Mark as Done"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Done</span>
                            </button>
                          </>
                        )}
                        {col.status === 'DONE' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(task, 'IN_PROGRESS')}
                            className="w-full flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reopen Task</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
