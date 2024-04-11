/* v8 ignore start */
import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authConfig = {
  pages: {
    signIn: '/signin',
    signOut: '/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      if (isLoggedIn) {
        return true;
        // Redirect unauthenticated users to login page
      } else {
        return Response.redirect(new URL('/signin', nextUrl));
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID as string) ?? '',
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string) ?? '',
    }),
  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;

/* v8 ignore stop */
