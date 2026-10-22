import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../features/auth/AuthContext';
import { vi } from 'vitest';

// Mock HeroScene so Three.js canvas doesn't attempt WebGL initialization in JSDOM
vi.mock('../components/three/HeroScene', () => ({
  HeroScene: ({ variant }: { variant: string }) => (
    <div data-testid={`mock-hero-scene-${variant}`} aria-hidden="true">
      Mock Hero Scene ({variant})
    </div>
  ),
  default: ({ variant }: { variant: string }) => (
    <div data-testid={`mock-hero-scene-${variant}`} aria-hidden="true">
      Mock Hero Scene ({variant})
    </div>
  ),
}));

export interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  initialEntries?: MemoryRouterProps['initialEntries'];
  queryClient?: QueryClient;
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: ExtendedRenderOptions = {}
) {
  const {
    initialEntries = ['/'],
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}
