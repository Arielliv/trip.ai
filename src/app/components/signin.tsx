'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function SignIn() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Typography variant="h6">Welcome, {session.user.email}</Typography>
        <Button variant="contained" color="secondary" onClick={() => signOut()}>
          Sign out
        </Button>
      </>
    );
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => signIn('google')}>
        Sign in with Google
      </Button>
    </>
  );
}
