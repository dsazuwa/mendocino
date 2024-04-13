import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import NavLinks from '@/components/layout/account/nav-links';
import { User } from '@/lib/types/common';

type Props = { children: ReactNode };

async function getUser() {
  const accessToken = cookies().get('access-token');

  if (!accessToken || accessToken.value === '') return { user: undefined };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken.value}` },
    next: { tags: ['user'], revalidate: 600 },
  });

  const { user } = (await res.json()) as { user: User };

  return { user: res.status === 200 ? user : undefined };
}

export default async function AccountLayout({ children }: Props) {
  const { user } = await getUser();

  if (!user) redirect('/');

  const { firstName, lastName, email } = user;

  return (
    <div className='mx-auto flex w-full max-w-screen-xl flex-1 p-4 md:p-8'>
      <div className='flex flex-1 gap-6 md:grid md:grid-cols-12'>
        <div className='hidden md:col-span-4 md:inline lg:col-span-3'>
          <div className='h-20 border-b border-solid border-neutral-200 p-4 text-center'>
            <div className='space-x-1 truncate font-semibold text-primary-900'>
              <span>{firstName}</span>
              <span>{lastName}</span>
            </div>

            <div className='truncate text-xs font-medium text-neutral-500'>
              {email}
            </div>
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
