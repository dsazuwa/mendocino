'use client';

import useAuthentication from '@/_hooks/useAuthentication';
import { accountLink, unauthLinks } from './client-constants';
import ClientLink from './client-link';
import LogoutButton from './logout-btn';

export default function ClientAuthLinks() {
  const { authReady, isAuthenticated } = useAuthentication();

  if (!authReady) return <></>;

  return isAuthenticated ? (
    <div className='hidden gap-4 md:flex'>
      <ClientLink href={accountLink.href} name={accountLink.name} />

      <LogoutButton />
    </div>
  ) : (
    <div className='hidden gap-4 md:flex'>
      {unauthLinks.map(({ name, href }) => (
        <ClientLink key={`${name}-link`} href={href} name={name} />
      ))}
    </div>
  );
}
