import Link from 'next/link';

import useAuthentication from '@/hooks/useAuthentication';
import Logo from '../../logo';
import ClientAuthLinks from './client-auth-links';
import { publicLinks } from './client-constants';
import ClientAppBarDrawer from './client-drawer';
import ClientLink from './client-link';

export default async function ClientAppBar() {
  const { isAuthenticated } = await useAuthentication();

  return (
    <nav id='client-app-bar' className='fixed z-50 h-12 w-full bg-white'>
      <div className='mx-auto flex h-full w-full max-w-screen-xl flex-row items-center border-b border-solid border-neutral-100 px-4 md:px-8'>
        <ClientAppBarDrawer isAuthenticated={isAuthenticated} />

        <Link href='/' className='mr-8'>
          <Logo />
        </Link>

        <div className='hidden flex-grow gap-4 md:flex'>
          {publicLinks.map(({ name, href }) => (
            <ClientLink key={`${name}-link`} href={href} name={name} />
          ))}
        </div>

        <ClientAuthLinks isAuthenticated={isAuthenticated} />
      </div>
    </nav>
  );
}
