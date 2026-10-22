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
  Circle,
  Clock,
  CheckCircle2,
  User as UserIcon,
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
  const userMap = new Map(users.map((u) => [u.id, u]));

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    updateTaskMutation.mutate({
      id: task.id,
      updates: { status: newStatus },
    });
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl glass-card shadow-xs">
      {/* Scrollable table container ensuring horizontal body scroll NEVER occurs */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <caption className="sr-only">Project tasks list and management table</caption>
          <thead>
            <tr className="border-b border-white/60 bg-white/40 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3 pl-4 pr-3 sm:pl-6">
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

              return (
                <tr
                  key={task.id}
                  className="hover:bg-white/60 transition-colors group"
                >
                  {/* Title & Description */}
                  <td className="py-3.5 pl-4 pr-3 sm:pl-6 max-w-xs sm:max-w-sm">
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
  );
};
