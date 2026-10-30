import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import { ProjectDetailsPage } from './ProjectDetailsPage';
import { Routes, Route } from 'react-router-dom';
import { initializeStorage } from '../../services/api';

describe('Task Management Flow & Modal Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
    initializeStorage();
  });

  // Test 6: Creating a task through the modal adds it to the table
  it('creates a new task through the modal and adds it to the table', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
      </Routes>,
      { initialEntries: ['/projects/proj-1'] }
    );

    // Wait for project details to load
    expect(await screen.findByText('Core Design System')).toBeInTheDocument();

    // Click "Add Task"
    const addTaskBtn = screen.getByRole('button', { name: /add task/i });
    await user.click(addTaskBtn);

    // Modal opens
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Create New Task')).toBeInTheDocument();

    // Fill form
    const titleInput = screen.getByLabelText(/task title/i);
    await user.type(titleInput, 'New Accessibility Audit Sprint');

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    // Wait for modal to close and new task to appear in table
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByText('New Accessibility Audit Sprint')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  // Test 9: Escape closes the modal and focus returns to the trigger
  it('closes the modal on Escape key press and restores focus to trigger button', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
      </Routes>,
      { initialEntries: ['/projects/proj-1'] }
    );

    expect(await screen.findByText('Core Design System')).toBeInTheDocument();

    const addTaskBtn = screen.getByRole('button', { name: /add task/i });
    addTaskBtn.focus();
    expect(addTaskBtn).toHaveFocus();

    // Open modal
    await user.click(addTaskBtn);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    // Press Escape
    await user.keyboard('{Escape}');

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Focus returns to trigger button
    await waitFor(() => {
      expect(addTaskBtn).toHaveFocus();
    });
  });

  // Test: Rejects invalid calendar dates like 2026-13-45
  it('rejects task creation and displays an error when an invalid calendar date is entered', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
      </Routes>,
      { initialEntries: ['/projects/proj-1'] }
    );

    expect(await screen.findByText('Core Design System')).toBeInTheDocument();

    const addTaskBtn = screen.getByRole('button', { name: /add task/i });
    await user.click(addTaskBtn);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    // Type valid title
    const titleInput = screen.getByLabelText(/task title/i);
    await user.type(titleInput, 'Task With Invalid Date');

    // Set invalid calendar date: 2026-13-45
    const dateInput = screen.getByLabelText(/due date/i);
    await user.clear(dateInput);
    await user.type(dateInput, '2026-13-45');

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    // Form should reject submission and show validation error
    await waitFor(() => {
      expect(
        screen.getByText(/Due date is required|Please enter a valid calendar date/i)
      ).toBeInTheDocument();
    });

    // Modal stays open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
