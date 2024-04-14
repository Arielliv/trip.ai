// vitestSetup.ts
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { useSession } from 'next-auth/react';

export class baseDriver {
  givenSession(session: any) {
    // @ts-ignore
    vi.mocked(useSession).mockReturnValue(Promise.resolve(session));
  }
}

const driver = new baseDriver();
const mockData = {
  update: {},
  data: { user: { name: 'John Doe', email: 'john@example.com' } },
  status: 'authenticated',
};

beforeAll(() => {
  vi.mock('@/lib/data');
  vi.mock('next-auth/react', () => ({
    useSession: vi.fn(() => {
      return mockData;
    }),
  }));
  vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
    ...require('next-router-mock'),
  }));
  vi.mock('@react-google-maps/api', () => ({
    GoogleMap: vi.fn(({ children }) => <div data-testid="google-map">{children}</div>),
    Marker: vi.fn(() => <div data-testid="marker"></div>),
    LoadScript: vi.fn(({ children }) => <div data-testid="load-script">{children}</div>),
    Autocomplete: vi.fn(() => <div data-testid="autocomplete"></div>),
    useJsApiLoader: vi.fn(() => ({ isLoaded: true })),
  }));
});

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
