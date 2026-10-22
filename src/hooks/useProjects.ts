import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, CreateProjectDTO } from '../services/projectService';
import { Project } from '../types/models';
import toast from 'react-hot-toast';

export const PROJECT_KEYS = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', id] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: PROJECT_KEYS.all,
    queryFn: () => projectService.getProjects(),
  });
}

export function useProject(id?: string) {
  return useQuery({
    queryKey: id ? PROJECT_KEYS.detail(id) : ['projects', 'unknown'],
    queryFn: () => {
      if (!id) throw new Error('Project ID is required');
      return projectService.getProjectById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProjectDTO) => projectService.createProject(dto),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      toast.success(`Project "${newProject.name}" created successfully!`);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create project';
      toast.error(msg);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) =>
      projectService.updateProject(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(updated.id) });
      toast.success(`Project "${updated.name}" updated successfully!`);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update project';
      toast.error(msg);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      toast.success('Project deleted successfully.');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete project';
      toast.error(msg);
    },
  });
}
