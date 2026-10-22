import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, CreateTaskDTO, UpdateTaskDTO } from '../services/taskService';
import { PROJECT_KEYS } from './useProjects';
import toast from 'react-hot-toast';

export { useUsers, useUser } from './useUsers';

export const TASK_KEYS = {
  all: ['tasks'] as const,
  byProject: (projectId?: string) => ['tasks', { projectId }] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
};

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: projectId ? TASK_KEYS.byProject(projectId) : TASK_KEYS.all,
    queryFn: () => taskService.getTasks(projectId),
  });
}

export function useTask(id?: string) {
  return useQuery({
    queryKey: id ? TASK_KEYS.detail(id) : ['tasks', 'unknown'],
    queryFn: () => {
      if (!id) throw new Error('Task ID is required');
      return taskService.getTaskById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTaskDTO) => taskService.createTask(dto),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.byProject(newTask.projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      toast.success(`Task "${newTask.title}" created successfully!`);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create task';
      toast.error(msg);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskDTO }) =>
      taskService.updateTask(id, updates),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.byProject(updatedTask.projectId) });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(updatedTask.id) });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      toast.success('Task updated successfully.');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update task';
      toast.error(msg);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      toast.success('Task deleted successfully.');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete task';
      toast.error(msg);
    },
  });
}
