import { describe, it, expect } from 'vitest';
import { calculateTaskStats } from './taskStats';
import { Task } from '../types/models';

describe('calculateTaskStats utility', () => {
  it('handles empty task list gracefully', () => {
    const stats = calculateTaskStats([]);
    expect(stats).toEqual({
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      overdue: 0,
      dueSoon: 0,
      completionPercentage: 0,
    });
  });

  it('correctly tallies task statuses and completion percentage', () => {
    const tasks: Task[] = [
      {
        id: '1',
        projectId: 'p1',
        title: 'Task 1',
        description: '',
        status: 'DONE',
        priority: 'LOW',
        assigneeId: 'u1',
        dueDate: '2026-12-31',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        projectId: 'p1',
        title: 'Task 2',
        description: '',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assigneeId: 'u1',
        dueDate: '2026-12-31',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '3',
        projectId: 'p1',
        title: 'Task 3',
        description: '',
        status: 'TODO',
        priority: 'HIGH',
        assigneeId: 'u1',
        dueDate: '2026-12-31',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '4',
        projectId: 'p1',
        title: 'Task 4',
        description: '',
        status: 'DONE',
        priority: 'LOW',
        assigneeId: 'u1',
        dueDate: '2026-12-31',
        createdAt: '',
        updatedAt: '',
      },
    ];

    const stats = calculateTaskStats(tasks);
    expect(stats.total).toBe(4);
    expect(stats.done).toBe(2);
    expect(stats.inProgress).toBe(1);
    expect(stats.todo).toBe(1);
    expect(stats.completionPercentage).toBe(50);
  });
});
