'use client';
import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; // Ensure you have this icon available

export default function SignIn() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      console.error('Error signing in', error);
    }
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out', error);
    }
    setIsLoading(false);
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ minWidth: 275, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, marginBottom: 2 }}>
            {session ? `Welcome, ${session?.user?.email}` : 'Sign In'}
          </Typography>
          {session ? (
            <Button
              startIcon={<GoogleIcon />}
              variant="contained"
              color="secondary"
              onClick={handleSignOut}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Signing out...' : 'Sign out'}
            </Button>
          ) : (
            <Button
              startIcon={<GoogleIcon />}
              variant="contained"
              color="primary"
              onClick={handleSignIn}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign in with Google'}
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
