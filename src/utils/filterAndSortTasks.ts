import { Task, TaskFilters } from '../types/models';

/**
 * Pure function that filters and sorts tasks according to provided criteria.
 */
export const filterAndSortTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  const {
    search = '',
    status = 'ALL',
    priority = 'ALL',
    assigneeId = 'ALL',
    sortBy = 'dueDate',
    sortOrder = 'asc',
  } = filters;

  const normalizedSearch = search.trim().toLowerCase();

  // 1. Filter
  const filtered = tasks.filter((task) => {
    // Search match on title or description
    if (normalizedSearch) {
      const matchTitle = task.title.toLowerCase().includes(normalizedSearch);
      const matchDesc = task.description.toLowerCase().includes(normalizedSearch);
      if (!matchTitle && !matchDesc) {
        return false;
      }
    }

    // Status filter
    if (status !== 'ALL' && task.status !== status) {
      return false;
    }

    // Priority filter
    if (priority !== 'ALL' && task.priority !== priority) {
      return false;
    }

    // Assignee filter
    if (assigneeId !== 'ALL' && task.assigneeId !== assigneeId) {
      return false;
    }

    return true;
  });

  // 2. Sort
  return [...filtered].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'dueDate') {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      comparison = dateA - dateB;
    } else if (sortBy === 'createdAt') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      comparison = dateA - dateB;
    } else if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
};
