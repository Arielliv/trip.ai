import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import SideNav from '@/app/components/SideNav/SideNav';
import theme from '../../theme';
import { NextAuthProvider } from '@/app/providers/NextAuthProvider/NextAuthProvider';
import { auth } from '@/auth';
import NoSsrProvider from '@/app/providers/NoSsrProvider/NoSsrProvider';
import ReactQueryProvider from '@/app/providers/ReactQueryProvider/ReactQueryProvider';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Trip.AI',
  description: 'The place to plan your next trip',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <NextAuthProvider session={session}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <NoSsrProvider>
                <ReactQueryProvider>
                  <SideNav>{children}</SideNav>
                </ReactQueryProvider>
              </NoSsrProvider>
            </ThemeProvider>
          </NextAuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
