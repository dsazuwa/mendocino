import Link from 'next/link';

import AddressButton from '@/components/address/choose';
import Logo from '@/components/logo';
import getUser from '@/lib/data';
import { unauthLinks } from './client-constants';
import ClientAppBarDrawer from './client-drawer';
import LogoutButton from './logout-btn';

export default async function ClientAppBar() {
  const { user } = await getUser();

  return (
    <nav id='client-app-bar' className='fixed z-50 h-16 w-full bg-white'>
      <div className='mx-auto flex h-full w-full max-w-screen-2xl flex-row items-center gap-2 border-b border-solid border-neutral-100 px-2 sm:gap-4 sm:px-8'>
        <ClientAppBarDrawer isAuthenticated={!!user} />

        <Link href='/'>
          <Logo />
        </Link>

        <AddressButton />

        <div className='ml-auto hidden gap-4 sm:flex'>
          {user ? (
            <LogoutButton />
          ) : (
            unauthLinks.map(({ name, href }) => (
              <Link
                className='text-xxs font-semibold'
                key={`${name}-link`}
                href={href}
              >
                {name}
              </Link>
            ))
          )}
        </div>
      </div>
    </nav>
  );
}
