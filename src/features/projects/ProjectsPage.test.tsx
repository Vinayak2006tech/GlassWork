import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import { ProjectsPage } from './ProjectsPage';
import { initializeStorage } from '../../services/api';

describe('Projects Page & Search', () => {
  beforeEach(() => {
    localStorage.clear();
    initializeStorage();
  });

  // Test 4: Project search filters the list
  it('filters the project list by search term', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectsPage />, { initialEntries: ['/projects'] });

    // Initial list renders
    expect(await screen.findByText('Core Design System')).toBeInTheDocument();
    expect(screen.getByText('Realtime Activity Stream')).toBeInTheDocument();

    // Type in search bar
    const searchInput = screen.getByPlaceholderText(/search projects/i);
    await user.type(searchInput, 'Design');

    // Wait for debounced search to filter
    await waitFor(
      () => {
        expect(screen.getByText('Core Design System')).toBeInTheDocument();
        expect(screen.queryByText('Realtime Activity Stream')).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  // Test 5: Project search with no match shows the empty state
  it('displays empty state when search query matches no projects', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectsPage />, { initialEntries: ['/projects'] });

    expect(await screen.findByText('Core Design System')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search projects/i);
    await user.type(searchInput, 'XYZNonExistentProject123');

    await waitFor(
      () => {
        expect(screen.getByText(/no projects match your search/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
