import { Task, TaskStats } from '../types/models';
import { isDueSoon, isOverdue } from './dates';

/**
 * Calculates aggregate task statistics for dashboard and progress meters.
 */
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const total = tasks.length;
  let todo = 0;
  let inProgress = 0;
  let done = 0;
  let overdue = 0;
  let dueSoon = 0;

  for (const task of tasks) {
    if (task.status === 'TODO') {
      todo++;
    } else if (task.status === 'IN_PROGRESS') {
      inProgress++;
    } else if (task.status === 'DONE') {
      done++;
    }

    if (isOverdue(task.dueDate, task.status)) {
      overdue++;
    } else if (isDueSoon(task.dueDate, task.status, 7)) {
      dueSoon++;
    }
  }

  const completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    total,
    todo,
    inProgress,
    done,
    overdue,
    dueSoon,
    completionPercentage,
  };
};
