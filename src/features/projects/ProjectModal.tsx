import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCreateProject } from '../../hooks/useProjects';

const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .min(3, 'Project name must be at least 3 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description cannot exceed 200 characters'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {
  const createProjectMutation = useCreateProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProjectMutation.mutateAsync({
        name: data.name,
        description: data.description,
      });
      reset();
      onClose();
    } catch {
      // Error handled in useCreateProject mutation toast
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Project"
      description="Initialize a collaborative project workspace for your team."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Project Name"
          placeholder="e.g. Design System V2"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="w-full">
          <label
            htmlFor="project-description-input"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Description <span className="text-rose-500" aria-hidden="true">*</span>
          </label>
          <textarea
            id="project-description-input"
            rows={3}
            placeholder="Brief overview of project goals, team scope, and deliverables..."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'project-desc-error' : undefined}
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 ${
              errors.description
                ? 'border-rose-400 focus-visible:ring-rose-500'
                : 'border-slate-300 hover:border-slate-400'
            }`}
            {...register('description')}
          />
          {errors.description && (
            <p id="project-desc-error" role="alert" className="mt-1 text-xs text-rose-600 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={createProjectMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createProjectMutation.isPending}
          >
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
