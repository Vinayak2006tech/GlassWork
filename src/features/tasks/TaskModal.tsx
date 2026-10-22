import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Task, TaskPriority, TaskStatus } from '../../types/models';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';
import { useUsers } from '../../hooks/useUsers';

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .min(3, 'Task title must be at least 3 characters'),
  description: z.string().optional().default(''),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'] as const),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'] as const),
  assigneeId: z.string().min(1, 'Please select an assignee'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date in YYYY-MM-DD format'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  projectId,
  taskToEdit,
}) => {
  const isEditing = Boolean(taskToEdit);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const { data: users } = useUsers();

  const userList = React.useMemo(() => users || [], [users]);
  const assigneeOptions = React.useMemo(
    () => [
      { value: '', label: 'Select team member...' },
      ...userList.map((u) => ({ value: u.id, label: `${u.name} (${u.role || 'Member'})` })),
    ],
    [userList]
  );

  const defaultDueDate = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeId: '',
      dueDate: defaultDueDate,
    },
  });

  // Populate form with task data when editing
  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        assigneeId: taskToEdit.assigneeId,
        dueDate: taskToEdit.dueDate,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: userList[0]?.id || '',
        dueDate: defaultDueDate,
      });
    }
  }, [taskToEdit, reset, isOpen, userList, defaultDueDate]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (isEditing && taskToEdit) {
        await updateTaskMutation.mutateAsync({
          id: taskToEdit.id,
          updates: {
            title: data.title,
            description: data.description,
            status: data.status as TaskStatus,
            priority: data.priority as TaskPriority,
            assigneeId: data.assigneeId,
            dueDate: data.dueDate,
          },
        });
      } else {
        await createTaskMutation.mutateAsync({
          projectId,
          title: data.title,
          description: data.description,
          status: data.status as TaskStatus,
          priority: data.priority as TaskPriority,
          assigneeId: data.assigneeId,
          dueDate: data.dueDate,
        });
      }
      onClose();
    } catch {
      // Handled in mutation toast
    }
  };

  const isPending = createTaskMutation.isPending || updateTaskMutation.isPending || isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      description={
        isEditing
          ? 'Update task properties, assignee, status, or deadline.'
          : 'Define a new actionable deliverable for this project.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Task Title"
          placeholder="e.g. Audit WCAG 2.1 AA color contrast"
          required
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="w-full">
          <label
            htmlFor="task-description-field"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Description
          </label>
          <textarea
            id="task-description-field"
            rows={2}
            placeholder="Details, acceptance criteria, or relevant links..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            required
            options={[
              { value: 'TODO', label: 'To Do' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'DONE', label: 'Done' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />

          <Select
            label="Priority"
            required
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
            ]}
            error={errors.priority?.message}
            {...register('priority')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assignee"
            required
            options={assigneeOptions}
            error={errors.assigneeId?.message}
            {...register('assigneeId')}
          />

          <Input
            label="Due Date"
            type="date"
            required
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
