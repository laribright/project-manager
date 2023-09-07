import type { Metadata } from 'next';

import './globals.css';
import Sidenav from '@/components/Sidenav/Sidenav';
import Header from '@/components/Header/Header';
import { NextAuthProvider } from '@/components/NextAuthProvider/NextAuthProvider';
import Toast from '@/components/Toast/Toast';

export const metadata: Metadata = {
  title: 'Project Manager',
  description: 'Manage your project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <NextAuthProvider>
          <main className='ml-64 py-20 px-6'>
            <Toast />
            <Sidenav />
            <Header />
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
