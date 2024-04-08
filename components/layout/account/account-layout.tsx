import { ChevronRightIcon } from '@radix-ui/react-icons';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import useAuthentication from '@/hooks/useAuthentication';
import { accountLinks } from '../client/client-constants';

type Props = { children: ReactNode };

export default async function AccountLayout({ children }: Props) {
  const { user } = await useAuthentication();

  if (!user) redirect('/');

  const { firstName, lastName, email } = user;

  const headersList = headers();
  const pathName = headersList.get('x-pathname');

  return (
    <div className='mx-auto flex w-full max-w-screen-xl flex-1 p-4 md:p-8'>
      <div className='grid flex-1 grid-cols-12 gap-6'>
        <div className='col-span-4 hidden md:inline lg:col-span-3'>
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
            {accountLinks.map(({ name, href, Icon }, i) => (
              <Link
                key={`account-link-${i}`}
                href={href}
                className='flex flex-row items-center justify-between p-4'
              >
                <span className='flex flex-row items-center text-xs'>
                  <Icon className='mr-4 w-5 fill-neutral-500' />
                  {name}
                </span>

                {href === pathName && (
                  <ChevronRightIcon className='w-3 fill-neutral-500' />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className='col-span-12 md:col-span-8 lg:col-span-9'>
          {children}
        </div>
      </div>
    </div>
  );
}
