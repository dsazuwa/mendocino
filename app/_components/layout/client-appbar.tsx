import Link from 'next/link';

import Logo from '../logo';
import ClientAuthLinks from './client-auth';
import { publicLinks } from './client-constants';
import ClientAppBarDrawer from './client-drawer';
import ClientLink from './client-link';

export default function ClientAppBar() {
  return (
    <nav className='bg-primary-foreground h-12 w-full'>
      <div className='mx-auto flex h-full w-full max-w-screen-xl flex-row items-center border-b border-solid border-neutral-100 px-4 md:px-8'>
        <ClientAppBarDrawer />

        <Link href='/' className='mr-8'>
          <Logo />
        </Link>

        <div className='hidden flex-grow gap-4 md:flex'>
          {publicLinks.map(({ name, href }) => (
            <ClientLink key={`${name}-link`} href={href} name={name} />
          ))}
        </div>

        <ClientAuthLinks />
      </div>
    </nav>
  );
}
