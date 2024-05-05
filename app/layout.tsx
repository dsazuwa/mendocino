import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';

import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';

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

type Props = Readonly<{ children: ReactNode }>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang='en'>
      <body
        className={cn(
          font.className,
          'flex min-h-screen flex-col text-neutral-600',
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
