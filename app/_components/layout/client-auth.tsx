'use client';

import useAuthentication from '@/_hooks/useAuthentication';
import useLogout from '@/_hooks/useLogout';
import { accountLink, unauthLinks } from './client-constants';
import ClientLink from './client-link';

export default function ClientAuthLinks() {
  const { authReady, isAuthenticated } = useAuthentication();
  const { handleLogout } = useLogout(false);

  return authReady ? (
    isAuthenticated ? (
      <div className='hidden gap-4 md:flex'>
        <ClientLink href={accountLink.href} name={accountLink.name} />

        <button
          onClick={() => handleLogout()}
          className='text-xs font-semibold'
        >
          Log Out
        </button>
      </div>
    ) : (
      <div className='hidden gap-4 md:flex'>
        {unauthLinks.map(({ name, href }) => (
          <ClientLink key={`${name}-link`} href={href} name={name} />
        ))}
      </div>
    )
  ) : (
    <></>
  );
}
