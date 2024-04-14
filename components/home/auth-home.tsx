import { ChevronDownIcon, Cross2Icon } from '@radix-ui/react-icons';
import { cookies } from 'next/headers';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
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

        <DialogContent className='left-[50%] top-0 h-screen w-full max-w-none translate-x-[-50%] translate-y-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[10%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[10%] sm:top-[10%] sm:h-auto sm:max-h-[75vh] sm:max-w-lg'>
          <div className='flex h-12 flex-row items-center justify-between'>
            <span className='font-semibold text-neutral-600'>
              Choose a delivery address
            </span>

            <DialogClose className='rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400'>
              <Cross2Icon className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
