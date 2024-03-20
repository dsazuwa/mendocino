'use client';

import Link from 'next/link';

import { accountLink, logoutLink, unauthLinks } from './client-constants';

export default function ClientAuthLinks() {
  const isAuth = true;

  return !isAuth ? (
    <div className='hidden gap-4 md:flex'>
      {unauthLinks.map(({ name, href }) => (
        <Link
          key={`${name}-link`}
          href={href}
          className='text-xs font-semibold'
        >
          {name}
        </Link>
      ))}
    </div>
  ) : (
    <div className='hidden gap-4 md:flex'>
      <Link href={accountLink.href} className='text-xs font-semibold'>
        {accountLink.name}
      </Link>

      <button
        onClick={logoutLink.handleLogout}
        className='text-xs font-semibold'
      >
        {logoutLink.name}
      </button>
    </div>
  );
}
