import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { useDebounce } from '../../hooks/useDebounce';
import { calculateTaskStats } from '../../utils/taskStats';
import { ProjectModal } from './ProjectModal';
import { GlassCard } from '../../components/ui/GlassCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Plus,
  Search,
  Users,
  CheckSquare,
  ArrowRight,
  FolderPlus,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    error: projectsError,
    refetch,
    isFetching,
  } = useProjects();

  const { data: allTasks } = useTasks();

  // Keep URL query params in sync with debounced input
  useEffect(() => {
    const currentParam = searchParams.get('search') || '';
    if (debouncedSearch !== currentParam) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (debouncedSearch) {
            next.set('search', debouncedSearch);
          } else {
            next.delete('search');
          }
          return next;
        },
        { replace: true }
      );
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  if (isProjectsLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading projects">
        <div className="flex justify-between items-center">
          <div className="w-48 h-8 bg-slate-200 rounded-lg" />
          <div className="w-32 h-10 bg-slate-200 rounded-lg" />
        </div>
        <div className="w-full max-w-sm h-10 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isProjectsError) {
    return (
      <ErrorMessage
        title="Failed to load projects"
        message={
          projectsError instanceof Error ? projectsError.message : 'Unable to retrieve projects.'
        }
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const projectList = projects || [];
  const tasks = allTasks || [];

  // Filter projects by search term
  const filteredProjects = projectList.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize workloads, team assignments, and delivery deadlines
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Project
        </Button>
      </div>

      {/* Controls: Search bar */}
      <div className="flex items-center gap-4 max-w-md">
        <Input
          type="search"
          placeholder="Search projects by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          aria-label="Search projects"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="text-xs shrink-0"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Empty State: Zero total projects */}
      {projectList.length === 0 && (
        <EmptyState
          icon={<FolderPlus className="w-8 h-8 text-indigo-500" />}
          title="No projects yet"
          description="Create your first team project to begin tracking tasks and sprints."
          actionLabel="Create Project"
          onAction={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Empty State: Search match failure */}
      {projectList.length > 0 && filteredProjects.length === 0 && (
        <EmptyState
          icon={<Search className="w-8 h-8 text-slate-400" />}
          title="No projects match your search"
          description={`No project names or descriptions matched "${debouncedSearch}".`}
          actionLabel="Clear search"
          onAction={() => setSearchTerm('')}
        />
      )}

      {/* Responsive Card Grid (1/2/3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const stats = calculateTaskStats(projectTasks);

          return (
            <GlassCard
              key={project.id}
              hoverEffect
              className="flex flex-col justify-between group h-full"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-base font-bold text-slate-900 group-hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
                  >
                    {project.name}
                  </Link>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4 pt-3 border-t border-white/60">
                {/* Progress bar */}
                <ProgressBar
                  value={stats.completionPercentage}
                  completed={stats.done}
                  total={stats.total}
                  size="sm"
                  label="Sprint Progress"
                />

                {/* Footer metrics: members, task count, and link */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1 font-medium"
                      title={`${project.memberIds.length} members`}
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>{project.memberIds.length}</span>
                    </span>
                    <span
                      className="inline-flex items-center gap-1 font-medium"
                      title={`${stats.total} total tasks`}
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>{stats.total} tasks</span>
                    </span>
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Create Project Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ProjectsPage;
