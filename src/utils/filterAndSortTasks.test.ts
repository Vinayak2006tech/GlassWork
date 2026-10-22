import { describe, it, expect } from 'vitest';
import { filterAndSortTasks } from './filterAndSortTasks';
import { Task } from '../types/models';

const mockTasks: Task[] = [
  {
    id: 't-1',
    projectId: 'p-1',
    title: 'Alpha task',
    description: 'Documentation for UI',
    status: 'TODO',
    priority: 'LOW',
    assigneeId: 'u-1',
    dueDate: '2026-03-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 't-2',
    projectId: 'p-1',
    title: 'Beta task',
    description: 'Fix contrast issues',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assigneeId: 'u-2',
    dueDate: '2026-02-15',
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 't-3',
    projectId: 'p-1',
    title: 'Gamma task',
    description: 'Completed refactor',
    status: 'DONE',
    priority: 'MEDIUM',
    assigneeId: 'u-1',
    dueDate: '2026-02-10',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
];

describe('filterAndSortTasks utility', () => {
  it('returns all tasks when default filters are supplied', () => {
    const result = filterAndSortTasks(mockTasks, {});
    expect(result).toHaveLength(3);
  });

  it('filters tasks by text search in title or description', () => {
    const byTitle = filterAndSortTasks(mockTasks, { search: 'beta' });
    expect(byTitle).toHaveLength(1);
    expect(byTitle[0].id).toBe('t-2');

    const byDesc = filterAndSortTasks(mockTasks, { search: 'contrast' });
    expect(byDesc).toHaveLength(1);
    expect(byDesc[0].id).toBe('t-2');
  });

  it('filters tasks by status', () => {
    const todos = filterAndSortTasks(mockTasks, { status: 'TODO' });
    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBe('t-1');
  });

  it('filters tasks by priority', () => {
    const high = filterAndSortTasks(mockTasks, { priority: 'HIGH' });
    expect(high).toHaveLength(1);
    expect(high[0].id).toBe('t-2');
  });

  it('filters tasks by assignee', () => {
    const user1Tasks = filterAndSortTasks(mockTasks, { assigneeId: 'u-1' });
    expect(user1Tasks).toHaveLength(2);
  });

  it('sorts tasks by dueDate ascending and descending', () => {
    const asc = filterAndSortTasks(mockTasks, { sortBy: 'dueDate', sortOrder: 'asc' });
    expect(asc.map((t) => t.id)).toEqual(['t-3', 't-2', 't-1']);

    const desc = filterAndSortTasks(mockTasks, { sortBy: 'dueDate', sortOrder: 'desc' });
    expect(desc.map((t) => t.id)).toEqual(['t-1', 't-2', 't-3']);
  });

  it('sorts tasks by title ascending and descending', () => {
    const asc = filterAndSortTasks(mockTasks, { sortBy: 'title', sortOrder: 'asc' });
    expect(asc.map((t) => t.title)).toEqual(['Alpha task', 'Beta task', 'Gamma task']);

    const desc = filterAndSortTasks(mockTasks, { sortBy: 'title', sortOrder: 'desc' });
    expect(desc.map((t) => t.title)).toEqual(['Gamma task', 'Beta task', 'Alpha task']);
  });
});
