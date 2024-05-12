import Link from 'next/link';
import { ReactNode } from 'react';

import LogOut from '@/components/icons/log-out';
import Logo from '../../logo';
import { Button } from '../../ui/button';
import AdminDrawer from './admin-drawer';
import AdminLinks from './admin-links';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-full min-h-screen flex-col'>
      <nav className='h-12 border-b border-solid border-neutral-200'>
        <div className='mx-auto flex h-full max-w-screen-xl flex-row items-center px-4 md:px-8'>
          <AdminDrawer />

          <Link href='/admin'>
            <Logo />
          </Link>

          <Button
            variant='ghost'
            className='ml-auto inline-flex gap-1 rounded-full p-2 sm:hover:bg-white'
          >
            <LogOut className='h-4 w-4 fill-neutral-600 sm:hidden' />
            <span className='hidden text-xs font-semibold sm:inline'>
              Log out
            </span>
          </Button>
        </div>
      </nav>

      <div className='flex flex-grow flex-row'>
        <AdminLinks className='hidden min-w-56 md:flex md:flex-col' />
        {children}
      </div>
    </div>
  );
}
