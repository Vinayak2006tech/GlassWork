import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useProject } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { useUsers } from '../../hooks/useUsers';
import { calculateTaskStats } from '../../utils/taskStats';
import { filterAndSortTasks } from '../../utils/filterAndSortTasks';
import { Task, TaskPriority, TaskSortField, TaskStatus, SortOrder } from '../../types/models';
import { TaskTable } from './TaskTable';
import { TaskModal } from './TaskModal';
import { DeleteTaskModal } from './DeleteTaskModal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Calendar,
  X,
  ListTodo,
} from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Queries
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
    refetch: refetchProject,
  } = useProject(projectId);

  const {
    data: projectTasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
    refetch: refetchTasks,
    isFetching,
  } = useTasks(projectId);

  const { data: users } = useUsers();

  // URL search params state bindings
  const search = searchParams.get('search') || '';
  const status = (searchParams.get('status') as TaskStatus | 'ALL') || 'ALL';
  const priority = (searchParams.get('priority') as TaskPriority | 'ALL') || 'ALL';
  const assigneeId = searchParams.get('assigneeId') || 'ALL';
  const sortBy = (searchParams.get('sortBy') as TaskSortField) || 'dueDate';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc';

  // Helper to update URL params
  const updateFilter = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== 'ALL') {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true }
    );
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const hasActiveFilters =
    Boolean(search) ||
    status !== 'ALL' ||
    priority !== 'ALL' ||
    assigneeId !== 'ALL' ||
    sortBy !== 'dueDate' ||
    sortOrder !== 'asc';

  if (isProjectLoading || isTasksLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading project">
        <div className="w-32 h-6 bg-slate-200 rounded" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-12 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (isProjectError || !project) {
    return (
      <div className="space-y-4">
        <Link to="/projects">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Projects
          </Button>
        </Link>
        <ErrorMessage
          title="Project not found"
          message={
            projectError instanceof Error
              ? projectError.message
              : 'Could not load the requested project.'
          }
          onRetry={() => refetchProject()}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  if (isTasksError) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          title="Failed to load project tasks"
          message={tasksError instanceof Error ? tasksError.message : 'Error fetching tasks.'}
          onRetry={() => refetchTasks()}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  const tasks = projectTasks || [];
  const userList = users || [];
  const userMap = new Map(userList.map((u) => [u.id, u]));

  // Calculate project statistics
  const stats = calculateTaskStats(tasks);

  // Filter and sort tasks through ONE pure function
  const filteredTasks = filterAndSortTasks(tasks, {
    search,
    status,
    priority,
    assigneeId,
    sortBy,
    sortOrder,
  });

  // Assignee options for filter dropdown
  const assigneeFilterOptions = [
    { value: 'ALL', label: 'All Assignees' },
    ...project.memberIds.map((memberId) => {
      const user = userMap.get(memberId);
      return {
        value: memberId,
        label: user ? user.name : memberId,
      };
    }),
  ];

  return (
    <div className="space-y-6">
      {/* Top navigation breadcrumb */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Project Header Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Active Project
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Created {project.createdAt}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {project.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {project.description}
            </p>

            {/* Team Members List */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                {project.memberIds.map((memberId) => {
                  const member = userMap.get(memberId);
                  return member?.avatarUrl ? (
                    <img
                      key={memberId}
                      src={member.avatarUrl}
                      alt={member.name}
                      title={member.name}
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                    />
                  ) : (
                    <div
                      key={memberId}
                      className="inline-flex h-7 w-7 rounded-full bg-indigo-100 text-indigo-600 items-center justify-center font-bold text-xs ring-2 ring-white"
                      title={member?.name || memberId}
                    >
                      {member?.name ? member.name.charAt(0) : 'U'}
                    </div>
                  );
                })}
              </div>
              <span className="text-xs text-slate-500 font-medium ml-1">
                {project.memberIds.length} team {project.memberIds.length === 1 ? 'member' : 'members'}
              </span>
            </div>
          </div>

          {/* Progress & Add Task Button */}
          <div className="w-full lg:w-80 flex flex-col justify-between p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/70 shadow-xs">
            <div className="mb-4">
              <ProgressBar
                value={stats.completionPercentage}
                total={stats.total}
                completed={stats.done}
                label="Sprint Completion"
                size="md"
              />
              <div className="grid grid-cols-3 text-center mt-3 pt-3 border-t border-slate-200/60 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">To Do</div>
                  <div className="font-semibold text-slate-700">{stats.todo}</div>
                </div>
                <div>
                  <div className="text-amber-500 text-[11px]">In Progress</div>
                  <div className="font-semibold text-amber-700">{stats.inProgress}</div>
                </div>
                <div>
                  <div className="text-emerald-500 text-[11px]">Done</div>
                  <div className="font-semibold text-emerald-700">{stats.done}</div>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
            >
              Add Task
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Controls & Filters Bar */}
      <div className="p-5 rounded-2xl glass-card space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <span>Filter & Sort Tasks</span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Form controls with visible labels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Title search */}
          <div className="lg:col-span-2">
            <Input
              label="Search Title"
              type="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          {/* Status filter */}
          <div>
            <Select
              label="Status"
              value={status}
              onChange={(e) => updateFilter('status', e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'TODO', label: 'To Do' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'DONE', label: 'Done' },
              ]}
            />
          </div>

          {/* Priority filter */}
          <div>
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => updateFilter('priority', e.target.value)}
              options={[
                { value: 'ALL', label: 'All Priorities' },
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
              ]}
            />
          </div>

          {/* Assignee filter */}
          <div>
            <Select
              label="Assignee"
              value={assigneeId}
              onChange={(e) => updateFilter('assigneeId', e.target.value)}
              options={assigneeFilterOptions}
            />
          </div>

          {/* Sort field & order */}
          <div>
            <Select
              label="Sort By"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                updateFilter('sortBy', newSortBy);
                updateFilter('sortOrder', newSortOrder);
              }}
              options={[
                { value: 'dueDate-asc', label: 'Due Date (Earliest)' },
                { value: 'dueDate-desc', label: 'Due Date (Latest)' },
                { value: 'createdAt-desc', label: 'Created (Newest)' },
                { value: 'createdAt-asc', label: 'Created (Oldest)' },
                { value: 'title-asc', label: 'Title (A-Z)' },
                { value: 'title-desc', label: 'Title (Z-A)' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Task View States */}
      {/* 1. Zero total tasks in project (empty state demo) */}
      {tasks.length === 0 && (
        <EmptyState
          icon={<ListTodo className="w-8 h-8 text-indigo-500" />}
          title="No tasks in this project"
          description="This project doesn't have any tasks yet. Click 'Add Task' above to start tracking deliverables."
          actionLabel="Add First Task"
          onAction={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
        />
      )}

      {/* 2. Search/filter returns zero matches */}
      {tasks.length > 0 && filteredTasks.length === 0 && (
        <EmptyState
          icon={<Search className="w-8 h-8 text-slate-400" />}
          title="No matching tasks found"
          description="There are no tasks that match your current filter and search criteria."
          actionLabel="Reset Filters"
          onAction={handleClearFilters}
        />
      )}

      {/* 3. Render Table */}
      {filteredTasks.length > 0 && (
        <TaskTable
          tasks={filteredTasks}
          users={userList}
          onEditTask={(task) => {
            setTaskToEdit(task);
            setIsTaskModalOpen(true);
          }}
          onDeleteTask={(task) => {
            setTaskToDelete(task);
          }}
        />
      )}

      {/* Add / Edit Task Modal */}
      {projectId && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setTaskToEdit(null);
          }}
          projectId={projectId}
          taskToEdit={taskToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteTaskModal
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        task={taskToDelete}
      />
    </div>
  );
};

export default ProjectDetailsPage;
