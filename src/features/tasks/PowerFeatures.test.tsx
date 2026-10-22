import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import { KanbanBoard } from './KanbanBoard';
import { TaskTable } from './TaskTable';
import { Task, User } from '../../types/models';

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alex Rivera', email: 'alex@axionix.dev', role: 'Tech Lead' },
  { id: 'user-2', name: 'Sophia Chen', email: 'sophia@axionix.dev', role: 'Frontend Engineer' },
];

const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Audit WCAG AA Compliance',
    description: 'Run automated and manual checks',
    status: 'TODO',
    priority: 'HIGH',
    assigneeId: 'user-1',
    dueDate: '2026-11-01',
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Implement Dark Mode Glassmorphism',
    description: 'Refine Tailwind backdrop-blur',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assigneeId: 'user-2',
    dueDate: '2026-11-15',
    createdAt: '2026-10-02T00:00:00.000Z',
    updatedAt: '2026-10-02T00:00:00.000Z',
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Deploy Production Bundle',
    description: 'Verify dist outputs',
    status: 'DONE',
    priority: 'LOW',
    assigneeId: 'user-1',
    dueDate: '2026-10-20',
    createdAt: '2026-10-03T00:00:00.000Z',
    updatedAt: '2026-10-03T00:00:00.000Z',
  },
];

describe('Power Features: KanbanBoard & Batch Multi-Select', () => {
  it('renders all three Kanban columns and correctly groups tasks by status', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    renderWithProviders(
      <KanbanBoard
        tasks={mockTasks}
        users={mockUsers}
        onEditTask={handleEdit}
        onDeleteTask={handleDelete}
      />
    );

    // Columns present
    expect(screen.getByRole('heading', { name: /to do/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /in progress/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /done/i })).toBeInTheDocument();

    // Tasks grouped in board
    expect(screen.getByText('Audit WCAG AA Compliance')).toBeInTheDocument();
    expect(screen.getByText('Implement Dark Mode Glassmorphism')).toBeInTheDocument();
    expect(screen.getByText('Deploy Production Bundle')).toBeInTheDocument();

    // 1-click status advancement button in To Do column
    expect(screen.getByRole('button', { name: /start work/i })).toBeInTheDocument();
  });

  it('selects multiple tasks and displays the floating batch action bar', async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    renderWithProviders(
      <TaskTable
        tasks={mockTasks}
        users={mockUsers}
        onEditTask={handleEdit}
        onDeleteTask={handleDelete}
      />
    );

    // Initially no batch bar
    expect(screen.queryByText(/tasks selected/i)).not.toBeInTheDocument();

    // Select first task checkbox
    const selectFirstCheckbox = screen.getByLabelText(/select task audit wcag aa compliance/i);
    await user.click(selectFirstCheckbox);

    // Floating batch bar appears
    expect(await screen.findByText('1 task selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark as done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();

    // Select all tasks via header checkbox
    const selectAllCheckbox = screen.getByLabelText(/select all tasks in view/i);
    await user.click(selectAllCheckbox);

    expect(screen.getByText('3 tasks selected')).toBeInTheDocument();

    // Dismiss batch selection
    const clearBtn = screen.getByLabelText(/clear task selection/i);
    await user.click(clearBtn);

    await waitFor(() => {
      expect(screen.queryByText(/tasks selected/i)).not.toBeInTheDocument();
    });
  });
});
