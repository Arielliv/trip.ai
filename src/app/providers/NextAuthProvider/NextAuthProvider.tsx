'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from '@auth/core/types';

type Props = {
  session?: Session | null;
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children, session }: Props) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
