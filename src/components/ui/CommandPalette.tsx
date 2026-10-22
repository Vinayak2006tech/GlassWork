import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  CheckCircle2,
  Clock,
  Circle,
  AlertTriangle,
  RotateCcw,
  LogOut,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import { getSimulateErrorToggle, setSimulateErrorToggle, resetStorageToSeed } from '../../services/api';
import toast from 'react-hot-toast';


interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Projects' | 'Tasks' | 'Actions';
  subtitle?: string;
  icon: React.ReactNode;
  onSelect: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: projects = [] } = useProjects();
  const { data: allTasks = [] } = useTasks();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset selected index when query changes or dialog opens
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, isOpen]);

  // Handle keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger handled by parent or state
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = useMemo<PaletteItem[]>(() => {
    const cleanQuery = query.trim().toLowerCase();
    const result: PaletteItem[] = [];

    // Static Navigation
    result.push({
      id: 'nav-dashboard',
      title: 'Dashboard',
      subtitle: 'Overview, team stats & due tasks',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-indigo-500" />,
      onSelect: () => {
        navigate('/');
        onClose();
      },
    });

    result.push({
      id: 'nav-projects',
      title: 'Projects Directory',
      subtitle: 'Browse all team projects',
      category: 'Navigation',
      icon: <FolderKanban className="w-4 h-4 text-indigo-500" />,
      onSelect: () => {
        navigate('/projects');
        onClose();
      },
    });

    // Dynamic Projects
    projects.forEach((p) => {
      result.push({
        id: `project-${p.id}`,
        title: p.name,
        subtitle: p.description,
        category: 'Projects',
        icon: <FolderKanban className="w-4 h-4 text-sky-500" />,
        onSelect: () => {
          navigate(`/projects/${p.id}`);
          onClose();
        },
      });
    });

    // Actions
    const isErrorCurrentlyActive = getSimulateErrorToggle();
    result.push({
      id: 'action-toggle-error',
      title: isErrorCurrentlyActive ? 'Disable Error Simulation' : 'Simulate API Network Failure',
      subtitle: isErrorCurrentlyActive ? 'Currently active (forces errors)' : 'Force 500 error on next request',
      category: 'Actions',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      badge: isErrorCurrentlyActive ? 'Active' : undefined,
      onSelect: () => {
        const next = !getSimulateErrorToggle();
        setSimulateErrorToggle(next);
        toast(next ? 'Simulated API errors enabled' : 'Simulated API errors disabled', {
          icon: next ? '⚠️' : '✅',
        });
        onClose();
      },
    });

    result.push({
      id: 'action-reset-data',
      title: 'Reset Demo Seed Data',
      subtitle: 'Restore default projects and tasks',
      category: 'Actions',
      icon: <RotateCcw className="w-4 h-4 text-emerald-500" />,
      onSelect: () => {
        resetStorageToSeed();
        toast.success('Demo data restored! Refreshing...');
        setTimeout(() => window.location.reload(), 400);
        onClose();
      },
    });


    result.push({
      id: 'action-signout',
      title: 'Sign Out',
      subtitle: 'End current demo session',
      category: 'Actions',
      icon: <LogOut className="w-4 h-4 text-rose-500" />,
      onSelect: async () => {
        await logout();
        navigate('/login');
        onClose();
      },
    });

    // Tasks search (matching title or description)
    if (cleanQuery) {
      const matchingTasks = allTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(cleanQuery) ||
          t.description.toLowerCase().includes(cleanQuery)
      );

      matchingTasks.slice(0, 8).forEach((task) => {
        const project = projects.find((p) => p.id === task.projectId);
        const statusIcon =
          task.status === 'DONE' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : task.status === 'IN_PROGRESS' ? (
            <Clock className="w-4 h-4 text-amber-500" />
          ) : (
            <Circle className="w-4 h-4 text-slate-400" />
          );

        result.push({
          id: `task-${task.id}`,
          title: task.title,
          subtitle: `${project ? project.name + ' • ' : ''}${task.description || task.status}`,
          category: 'Tasks',
          icon: statusIcon,
          badge: task.priority,
          onSelect: () => {
            navigate(`/projects/${task.projectId}?search=${encodeURIComponent(task.title)}`);
            onClose();
          },
        });
      });
    }

    // Filter items based on query
    if (!cleanQuery) {
      return result;
    }

    return result.filter(
      (item) =>
        item.title.toLowerCase().includes(cleanQuery) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(cleanQuery)) ||
        item.category.toLowerCase().includes(cleanQuery)
    );
  }, [query, projects, allTasks, navigate, logout, onClose]);

  // Keyboard navigation for items
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, items.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].onSelect();
      }
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={inputRef} onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel className="w-full max-w-xl transform rounded-2xl glass-panel-opaque border border-white/80 shadow-2xl transition-all overflow-hidden">
              {/* Search input header */}
              <div className="relative border-b border-slate-200/80 px-4 py-3.5 flex items-center gap-3 bg-white/70">
                <Search className="w-5 h-5 text-indigo-600 shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search tasks & projects..."
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100/80 rounded border border-slate-200">
                  ESC
                </kbd>
              </div>


              {/* Items List */}
              <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100/60">
                {items.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    No matching commands, tasks, or projects found for &quot;{query}&quot;.
                  </div>
                ) : (
                  <div className="space-y-1 py-1">
                    {items.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={item.onSelect}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                              : 'text-slate-700 hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-1.5 rounded-lg ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.icon}
                            </div>
                            <div className="min-w-0 flex flex-col">
                              <span
                                className={`text-sm font-semibold truncate ${
                                  isSelected ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {item.title}
                              </span>
                              {item.subtitle && (
                                <span
                                  className={`text-xs truncate ${
                                    isSelected ? 'text-indigo-100' : 'text-slate-500'
                                  }`}
                                >
                                  {item.subtitle}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            {item.badge && (
                              <span
                                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <span
                              className={`text-[10px] uppercase tracking-wider font-semibold ${
                                isSelected ? 'text-indigo-200' : 'text-slate-400'
                              }`}
                            >
                              {item.category}
                            </span>
                            <ArrowRight
                              className={`w-3.5 h-3.5 ${
                                isSelected ? 'text-white translate-x-0.5' : 'text-slate-300'
                              } transition-transform`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="bg-slate-50/80 px-4 py-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span>
                    Use <kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 font-semibold">↑</kbd>{' '}
                    <kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 font-semibold">↓</kbd> to navigate
                  </span>
                  <span>
                    <kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 font-semibold">↵</kbd> to select
                  </span>
                </div>
                <span className="flex items-center gap-1 text-indigo-600 font-medium">
                  <ExternalLink className="w-3 h-3" /> Quick Switcher
                </span>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
