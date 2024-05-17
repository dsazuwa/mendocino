import { cookies } from 'next/headers';
import Link from 'next/link';

import CartDrawer from '@/components/cart/drawer';
import { getSelectedAddress } from '@/components/home/location-selector';
import Logo from '@/components/logo';
import getUser, { getAddresses } from '@/lib/data';
import AddressButton from './address-button';
import { unauthLinks } from './client-constants';
import ClientAppBarDrawer from './client-drawer';
import { AppBarLogout } from './logout-btn';

export default async function ClientAppBar() {
  const { user } = await getUser();
  const { addresses } = await getAddresses();
  const restaurant = cookies().get('restaurant')?.value;

  const selectedId = getSelectedAddress(addresses);
  const selectedAddress =
    addresses.find((address) => address.id === selectedId) ||
    (addresses.length > 0 ? addresses[0] : undefined);

  return (
    <nav id='client-app-bar' className='fixed z-50 h-16 w-full bg-white'>
      <div className='mx-auto flex h-full w-full max-w-screen-2xl flex-row items-center gap-2 border-b border-solid border-neutral-100 px-2 sm:gap-4 sm:px-8'>
        <ClientAppBarDrawer isAuthenticated={!!user} />

        <Link href='/'>
          <Logo />
        </Link>

        <AddressButton
          addresses={addresses}
          selectedAddress={selectedAddress}
        />

        <div className='inline-flex gap-2 sm:ml-auto'>
          {addresses.length > 0 && <CartDrawer restaurant={restaurant} />}

          <div className='space-x-4 max-sm:hidden'>
            {user ? (
              <AppBarLogout />
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
      </div>
    </nav>
  );
}
