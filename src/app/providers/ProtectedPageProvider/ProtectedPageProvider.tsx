'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const ProtectedPageProvider = ({ children }: React.PropsWithChildren) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    // If not authenticated, redirect to the login page
    if (status === 'loading') return; // Do nothing while loading
    if (!isUser) redirect('/signin');
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>; // If authenticated, render the children components
  }

  // Optional: return a loading indicator or null while checking the session
  return <div>Loading...</div>;
};

export default ProtectedPageProvider;
