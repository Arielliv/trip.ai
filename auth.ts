/* v8 ignore start */
import NextAuth from 'next-auth';
import clientPromise from '@/lib/mongoClient';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { authConfig } from './auth.config';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  ...authConfig,
});

/* v8 ignore stop */
