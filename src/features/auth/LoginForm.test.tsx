import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DEMO_CREDENTIALS } from '../../services/authService';

describe('Authentication Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Test 1: Sign-in shows validation errors for empty/invalid fields
  it('shows validation errors for empty and invalid fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });

    const submitBtn = screen.getByRole('button', { name: /sign in to workspace/i });
    await user.click(submitBtn);

    // Validation messages
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();

    // Invalid email check
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'notanemail');
    await user.click(submitBtn);

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  // Test 2: Successful sign-in redirects to the dashboard
  it('redirects to the dashboard upon successful sign-in with demo credentials', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Dashboard Home View</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { initialEntries: ['/login'] }
    );

    const emailInput = screen.getByLabelText(/email address/i, { selector: 'input' });
    const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
    const submitBtn = screen.getByRole('button', { name: /sign in to workspace/i });

    await user.type(emailInput, DEMO_CREDENTIALS.email);
    await user.type(passwordInput, DEMO_CREDENTIALS.password);
    await user.click(submitBtn);

    await waitFor(
      () => {
        expect(screen.getByText(/dashboard home view/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  // Test 3: Unauthenticated user is redirected to /login
  it('redirects unauthenticated user to /login when attempting to access protected route', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page Form</div>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Protected Workspace Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { initialEntries: ['/'] }
    );

    // Should redirect to login screen
    expect(await screen.findByText(/login page form/i)).toBeInTheDocument();
    expect(screen.queryByText(/protected workspace content/i)).not.toBeInTheDocument();
  });
});
