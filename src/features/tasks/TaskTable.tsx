import React, { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Task, TaskStatus, User } from '../../types/models';
import { Badge } from '../../components/ui/Badge';
import { formatDate, isOverdue } from '../../utils/dates';
import { useUpdateTask, useBatchUpdateTasks, useBatchDeleteTasks } from '../../hooks/useTasks';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Circle,
  Clock,
  CheckCircle2,
  User as UserIcon,
  X,
  CheckSquare,
} from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  users: User[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  users,
  onEditTask,
  onDeleteTask,
}) => {
  const updateTaskMutation = useUpdateTask();
  const batchUpdateMutation = useBatchUpdateTasks();
  const batchDeleteMutation = useBatchDeleteTasks();

  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const userMap = new Map(users.map((u) => [u.id, u]));

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    updateTaskMutation.mutate({
      id: task.id,
      updates: { status: newStatus },
    });
  };

  // Toggle single task selection
  const toggleSelectTask = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  // Select all or clear all
  const isAllSelected = tasks.length > 0 && tasks.every((t) => selectedTaskIds.has(t.id));
  const isPartiallySelected =
    tasks.some((t) => selectedTaskIds.has(t.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(tasks.map((t) => t.id)));
    }
  };

  // Batch actions
  const handleBatchMarkDone = () => {
    const ids = Array.from(selectedTaskIds);
    if (ids.length === 0) return;
    batchUpdateMutation.mutate({ ids, status: 'DONE' });
    setSelectedTaskIds(new Set());
  };

  const handleBatchDelete = () => {
    const ids = Array.from(selectedTaskIds);
    if (ids.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${ids.length} selected tasks?`)) {
      batchDeleteMutation.mutate(ids);
      setSelectedTaskIds(new Set());
    }
  };

  return (
    <div className="w-full relative">
      <div className="w-full overflow-hidden rounded-2xl glass-card shadow-xs">
        {/* Scrollable table container ensuring horizontal body scroll NEVER occurs */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <caption className="sr-only">Project tasks list and management table</caption>
            <thead>
              <tr className="border-b border-white/60 bg-white/40 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {/* Select All Checkbox */}
                <th scope="col" className="py-3 pl-4 pr-2 w-10 text-center">
                  <span className="sr-only">Select All</span>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={toggleSelectAll}
                    aria-label="Select all tasks in view"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th scope="col" className="py-3 pl-2 pr-3 sm:pl-4">
                  Title & Description
                </th>
                <th scope="col" className="px-3 py-3">
                  Status
                </th>
                <th scope="col" className="px-3 py-3">
                  Priority
                </th>
                <th scope="col" className="px-3 py-3">
                  Due Date
                </th>
                <th scope="col" className="px-3 py-3">
                  Assignee
                </th>
                <th scope="col" className="py-3 pl-3 pr-4 sm:pr-6 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40 text-sm">
              {tasks.map((task) => {
                const assignee = userMap.get(task.assigneeId);
                const overdue = isOverdue(task.dueDate, task.status);
                const isSelected = selectedTaskIds.has(task.id);

                return (
                  <tr
                    key={task.id}
                    className={`transition-colors group ${
                      isSelected ? 'bg-indigo-50/70' : 'hover:bg-white/60'
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td className="py-3.5 pl-4 pr-2 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectTask(task.id)}
                        aria-label={`Select task ${task.title}`}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* Title & Description */}
                    <td className="py-3.5 pl-2 pr-3 sm:pl-4 max-w-xs sm:max-w-sm">
                      <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {task.description}
                        </div>
                      )}
                    </td>

                    {/* Status & Quick "Move to..." Menu */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button
                          className="inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full"
                          aria-label={`Change status for "${task.title}", currently ${task.status}`}
                        >
                          <Badge variant="status" status={task.status} size="sm" />
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
                          <Menu.Items className="absolute left-0 mt-1 w-40 origin-top-left rounded-2xl glass-panel-opaque p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-20 text-xs">
                            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Move to...
                            </div>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(task, 'TODO')}
                                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 ${
                                    active ? 'bg-slate-100' : ''
                                  } ${task.status === 'TODO' ? 'font-semibold text-indigo-600' : ''}`}
                                >
                                  <Circle className="w-3.5 h-3.5 text-slate-500" />
                                  <span>To Do</span>
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(task, 'IN_PROGRESS')}
                                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 ${
                                    active ? 'bg-slate-100' : ''
                                  } ${task.status === 'IN_PROGRESS' ? 'font-semibold text-amber-600' : ''}`}
                                >
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>In Progress</span>
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(task, 'DONE')}
                                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 ${
                                    active ? 'bg-slate-100' : ''
                                  } ${task.status === 'DONE' ? 'font-semibold text-emerald-600' : ''}`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Done</span>
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </td>

                    {/* Priority */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <Badge variant="priority" priority={task.priority} size="sm" />
                    </td>

                    {/* Due Date */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs ${
                            overdue ? 'text-rose-600 font-semibold' : 'text-slate-600'
                          }`}
                        >
                          {formatDate(task.dueDate)}
                        </span>
                        {overdue && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                            Overdue
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Assignee */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {assignee?.avatarUrl ? (
                          <img
                            src={assignee.avatarUrl}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                            <UserIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="text-xs text-slate-700 font-medium">
                          {assignee ? assignee.name : 'Unassigned'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pl-3 pr-4 sm:pr-6 whitespace-nowrap text-right">
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          aria-label={`Actions for task "${task.title}"`}
                        >
                          <MoreVertical className="w-4 h-4" aria-hidden="true" />
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
                          <Menu.Items className="absolute right-0 mt-1 w-36 origin-top-right rounded-2xl glass-panel-opaque p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-20 text-xs">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => onEditTask(task)}
                                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-700 ${
                                    active ? 'bg-white/70 text-slate-900' : ''
                                  }`}
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit details</span>
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => onDeleteTask(task)}
                                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 ${
                                    active ? 'bg-rose-50 text-rose-700' : ''
                                  }`}
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Delete task</span>
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Batch Actions Bar */}
      {selectedTaskIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[90%] sm:w-auto">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-panel-opaque border border-white/80 shadow-2xl bg-white/90 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-2 pr-3 border-r border-slate-200/80">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                {selectedTaskIds.size} {selectedTaskIds.size === 1 ? 'task' : 'tasks'} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBatchMarkDone}
                disabled={batchUpdateMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Done</span>
              </button>

              <button
                type="button"
                onClick={handleBatchDelete}
                disabled={batchDeleteMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTaskIds(new Set())}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Clear task selection"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
