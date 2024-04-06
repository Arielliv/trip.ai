import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import SideNav from '@/app/components/SideNav';
import theme from '../../theme';
import { NextAuthProvider } from './components/NextAuthProvider';
import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
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
              <SideNav>{children}</SideNav>
            </ThemeProvider>
          </NextAuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
