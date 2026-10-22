import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import { DashboardPage } from './DashboardPage';
import { initializeStorage, setSimulateErrorToggle } from '../../services/api';

describe('Dashboard Page Metrics & Error Resilience', () => {
  beforeEach(() => {
    localStorage.clear();
    setSimulateErrorToggle(false);
    initializeStorage();
  });

  afterEach(() => {
    setSimulateErrorToggle(false);
  });

  // Test 7: Loading state appears and then data renders
  it('renders loading skeleton and transitions to populated dashboard data', async () => {
    renderWithProviders(<DashboardPage />, { initialEntries: ['/'] });

    // Loading skeleton should initially be present
    expect(screen.getByLabelText(/loading dashboard/i)).toBeInTheDocument();

    // After simulated latency, data should render
    await waitFor(
      () => {
        expect(screen.getByText('Workspace Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Total Tasks')).toBeInTheDocument();
        expect(screen.getByText('Overall Workspace Completion')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  // Test 8: Service failure shows an error message with a Retry button
  it('displays an error message with a Retry button when service failure occurs', async () => {
    // Enable error simulation
    setSimulateErrorToggle(true);

    const user = userEvent.setup();
    renderWithProviders(<DashboardPage />, { initialEntries: ['/'] });

    // Wait for error state banner
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/failed to load dashboard metrics/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();

    // Disable simulated error and click Retry
    setSimulateErrorToggle(false);
    await user.click(retryBtn);

    // Should successfully reload dashboard
    await waitFor(
      () => {
        expect(screen.getByText('Workspace Dashboard')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
