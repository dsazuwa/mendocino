'use client';

import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { accountLinks } from '../client/client-constants';

export default function NavLinks() {
  const pathName = usePathname();

  return (
    <>
      {accountLinks.map(({ name, href, Icon }, i) => (
        <Link
          key={`account-link-${i}`}
          href={href}
          className='flex flex-row items-center justify-between p-4 pr-2'
        >
          <span className='flex flex-row items-center text-xs'>
            <Icon className='mr-4 w-5 fill-neutral-500' />
            {name}
          </span>

          {pathName === href && (
            <ChevronRightIcon className='w-3 fill-neutral-500' />
          )}
        </Link>
      ))}
    </>
  );
}
