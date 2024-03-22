import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';

import { Toaster } from './_components/ui/toaster';
import './globals.css';
import StoreProvider from './store-provider';

const font = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
  preload: true,
});

export const metadata: Metadata = {
  title: 'Spoons',
  description: 'A food delivery app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={font.className}>
        <StoreProvider>{children}</StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
