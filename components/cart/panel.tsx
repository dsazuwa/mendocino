import { cookies } from 'next/headers';

import CartContent from '@/components/cart/content';
import { getAddresses } from '@/lib/data';

export default async function CartPanel() {
  const { addresses } = await getAddresses();
  const restaurant = cookies().get('restaurant')?.value;

  return addresses.length > 0 ? (
    <>
      <div className='w-80 shrink-0 max-lg:hidden' />

      <div
        className='fixed right-0 h-full w-80 overflow-y-auto border-l border-neutral-100 bg-white p-4 max-lg:hidden'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <CartContent restaurant={restaurant} />
      </div>
    </>
  ) : (
    <></>
  );
}
