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
          className='inline-flex items-center justify-between p-4 transition-colors hover:bg-neutral-100'
        >
          <span className='inline-flex items-center text-xs'>
            <Icon className='mr-4 w-5 shrink-0 fill-neutral-500' />
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
