/* v8 ignore start */
import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authConfig = {
  pages: {
    signIn: '/api/auth/signin',
    signOut: '/api/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      // If it's the first time the JWT is created (user object exists), add the user ID
      if (user?.id) {
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the user ID from the JWT to the session object
      if (token.uid) {
        // @ts-ignore
        session.user.id = token.uid;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      if (isLoggedIn) {
        return true;
        // Redirect unauthenticated users to login page
      } else {
        return Response.redirect(new URL('/api/auth/signin', nextUrl));
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string) ?? '',
      clientSecret: (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string) ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;

/* v8 ignore stop */
