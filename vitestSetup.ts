// vitestSetup.ts
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
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
