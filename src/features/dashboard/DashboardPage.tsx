import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { calculateTaskStats } from '../../utils/taskStats';
import { isOverdue, isDueSoon, formatDate } from '../../utils/dates';
import { StatCard } from '../../components/ui/StatCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { HeroScene } from '../../components/three/HeroScene';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertTriangle,
  Calendar,
  FolderKanban,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: tasks, isLoading, isError, error, refetch, isFetching } = useTasks();
  const { data: projects } = useProjects();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading dashboard">
        {/* Top Hero Strip Skeleton */}
        <div className="w-full h-24 rounded-2xl bg-slate-200" />

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-200" />
          ))}
        </div>

        {/* Progress Bar Skeleton */}
        <div className="h-20 rounded-xl bg-slate-200" />

        {/* Task lists Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-xl bg-slate-200" />
          <div className="h-64 rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <ErrorMessage
          title="Failed to load dashboard metrics"
          message={error instanceof Error ? error.message : 'Unknown data loading error.'}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  const allTasks = tasks || [];
  const projectMap = new Map((projects || []).map((p) => [p.id, p]));
  const stats = calculateTaskStats(allTasks);

  if (allTasks.length === 0) {
    return (
      <div className="space-y-6">
        <HeroScene variant="dashboard" className="w-full h-24 rounded-2xl shadow-sm" />
        <EmptyState
          icon={<FolderKanban className="w-8 h-8 text-indigo-500" />}
          title="No tasks in workspace"
          description="Your workspace currently has zero tasks. Create your first project or add tasks to view dashboard analytics."
          actionLabel="Go to Projects"
          onAction={() => (window.location.href = '/projects')}
        />
      </div>
    );
  }

  const overdueTasks = allTasks.filter((t) => isOverdue(t.dueDate, t.status));
  const dueSoonTasks = allTasks.filter((t) => isDueSoon(t.dueDate, t.status, 7));

  return (
    <div className="space-y-6">
      {/* Slim 3D Hero Strip (Decorative only) */}
      <div className="w-full h-24 rounded-2xl overflow-hidden shadow-sm border border-indigo-900/10">
        <HeroScene variant="dashboard" className="w-full h-full" />
      </div>

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Workspace Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time project overview, throughput, and deadline risks
          </p>
        </div>
        <Link to="/projects">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Manage Projects
          </Button>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<ListTodo className="w-5 h-5" />}
          subtitle="Across all team projects"
          iconBgColor="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="To Do"
          value={stats.todo}
          icon={<Clock className="w-5 h-5" />}
          subtitle="Awaiting start"
          iconBgColor="bg-slate-100 text-slate-700"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Active development"
          iconBgColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Done"
          value={stats.done}
          icon={<CheckCircle2 className="w-5 h-5" />}
          subtitle={`${stats.completionPercentage}% of total completed`}
          iconBgColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Overall Progress Bar */}
      <GlassCard className="p-6">
        <ProgressBar
          value={stats.completionPercentage}
          total={stats.total}
          completed={stats.done}
          label="Overall Workspace Completion"
          size="lg"
        />
      </GlassCard>

      {/* 2 Lists: Overdue Tasks & Due in Next 7 Days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Tasks */}
        <GlassCard className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 border-b border-white/60 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Overdue Tasks</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {overdueTasks.length} {overdueTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {overdueTasks.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">
              No overdue tasks. All projects are on track!
            </p>
          ) : (
            <ul className="divide-y divide-white/40 flex-1 overflow-y-auto max-h-80">
              {overdueTasks.map((task) => {
                const project = projectMap.get(task.projectId);
                return (
                  <li key={task.id} className="py-2.5 flex items-start justify-between gap-3 group">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/projects/${task.projectId}`}
                        className="text-xs font-medium text-slate-900 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded block truncate"
                      >
                        {task.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>{project ? project.name : 'Unknown project'}</span>
                        <span aria-hidden="true">•</span>
                        <span className="text-rose-600 font-medium">
                          Due {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      <Badge variant="priority" priority={task.priority} size="sm" />
                      <Badge variant="overdue" size="sm" />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </GlassCard>

        {/* Due in Next 7 Days */}
        <GlassCard className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 border-b border-white/60 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Calendar className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Due in the Next 7 Days</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {dueSoonTasks.length} {dueSoonTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {dueSoonTasks.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">
              No tasks due in the upcoming week.
            </p>
          ) : (
            <ul className="divide-y divide-white/40 flex-1 overflow-y-auto max-h-80">
              {dueSoonTasks.map((task) => {
                const project = projectMap.get(task.projectId);
                return (
                  <li key={task.id} className="py-2.5 flex items-start justify-between gap-3 group">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/projects/${task.projectId}`}
                        className="text-xs font-medium text-slate-900 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded block truncate"
                      >
                        {task.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>{project ? project.name : 'Unknown project'}</span>
                        <span aria-hidden="true">•</span>
                        <span className="text-amber-700 font-medium">
                          Due {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      <Badge variant="status" status={task.status} size="sm" />
                      <Badge variant="priority" priority={task.priority} size="sm" />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardPage;
