import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import NavLinks from '@/components/layout/account/nav-links';
import useAuthentication from '@/hooks/use-auth';

type Props = { children: ReactNode };

export default function AccountLayout({ children }: Props) {
  const { isAuthenticated } = useAuthentication();

  if (!isAuthenticated) redirect('/');

  const headerList = headers();
  const username = headerList.get('x-username');
  const email = headerList.get('x-email');

  return (
    <div className='mx-auto flex w-full max-w-screen-xl flex-1 p-4 sm:p-8 md:px-4 md:pr-8'>
      <div className='flex flex-1 gap-6 md:grid md:grid-cols-12'>
        <div className='hidden md:col-span-4 md:inline lg:col-span-3'>
          <div className='mx-4 h-20 border-b border-solid border-neutral-200 p-4 text-center'>
            <div className='space-x-1 truncate font-semibold text-primary-900'>
              {username}
            </div>

            <div className='truncate text-xs font-medium'>{email}</div>
          </div>

          <div className='flex flex-col'>
            <NavLinks />
          </div>
        </div>

        <div className='w-full md:col-span-8 lg:col-span-9'>{children}</div>
      </div>
    </div>
  );
}
