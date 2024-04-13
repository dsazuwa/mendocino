import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cookies } from 'next/headers';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Address } from '@/lib/types/customer';
import UnauthenticatedHomePage from './unauth-home';

async function getData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/addresses`,
    {
      method: 'GET',
      headers: { cookie: cookies().toString() },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) throw new Error('Failed to fetch data');

  return response.json() as Promise<{ addresses: Address[] }>;
}

export default async function AuthenticatedHomePage() {
  const { addresses } = await getData();

  // const addresses: Address[] = [
  //   {
  //     addressLine1: '3A Olatunde Ayoola Avenue',
  //     city: 'Obanikoro',
  //     zipCode: '102216',
  //     state: 'Lagos',
  //     isDefault: true,
  //   },

  //   {
  //     addressLine1: '54 Olorunlogbon St',
  //     city: 'Anthony',
  //     zipCode: '105102',
  //     state: 'Lagos',
  //     isDefault: false,
  //   },
  // ];

  if (addresses.length === 0) return <UnauthenticatedHomePage />;

  return (
    <div className='flex flex-col items-center justify-center gap-2 md:flex-row'>
      <span className='text-lg font-medium sm:text-xl'>Delivering to</span>

      <Dialog>
        <DialogTrigger className='flex flex-row items-center gap-2'>
          <span className='text-lg font-bold sm:text-xl'>
            {addresses[0].addressLine1}
          </span>

          <ChevronDownIcon />
        </DialogTrigger>

        <DialogContent className='top-0 h-screen w-full max-w-none translate-y-0 sm:top-[10%] sm:h-auto sm:max-h-[75vh] sm:max-w-lg'></DialogContent>
      </Dialog>
    </div>
  );
}
