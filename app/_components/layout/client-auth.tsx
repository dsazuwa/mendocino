'use client';

import { accountLink, logOutLink, unauthLinks } from './client-constants';
import ClientLink from './client-link';

export default function ClientAuthLinks() {
  const isAuth = false;

  return isAuth ? (
    <div className='hidden gap-4 md:flex'>
      <ClientLink href={accountLink.href} name={accountLink.name} />

      <button
        onClick={logOutLink.handleClick}
        className='text-xs font-semibold'
      >
        {logOutLink.name}
      </button>
    </div>
  ) : (
    <div className='hidden gap-4 md:flex'>
      {unauthLinks.map(({ name, href }) => (
        <ClientLink key={`${name}-link`} href={href} name={name} />
      ))}
    </div>
  );
}
