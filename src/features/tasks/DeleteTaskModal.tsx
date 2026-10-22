import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Task } from '../../types/models';
import { useDeleteTask } from '../../hooks/useTasks';
import { AlertTriangle } from 'lucide-react';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const deleteTaskMutation = useDeleteTask();

  if (!task) return null;

  const handleDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync(task.id);
      onClose();
    } catch {
      // Toast notification handled in useDeleteTask hook
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-rose-950">"{task.title}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={deleteTaskMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={deleteTaskMutation.isPending}
            onClick={handleDelete}
          >
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};
