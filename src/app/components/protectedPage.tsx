'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedPage = ({ children }: React.PropsWithChildren) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  const router = useRouter();

  useEffect(() => {
    console.log(session);
    // If not authenticated, redirect to the login page
    if (status === 'loading') return; // Do nothing while loading
    if (!isUser) router.push('/signin');
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>; // If authenticated, render the children components
  }

  // Optional: return a loading indicator or null while checking the session
  return <div>Loading...</div>;
};

export default ProtectedPage;
