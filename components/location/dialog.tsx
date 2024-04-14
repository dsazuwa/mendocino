'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { usePathname } from 'next/navigation';

import Location from '@/components/icons/location';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Address } from '@/lib/types/customer';
import { cn } from '@/lib/utils';
import ChooseAddressContent from './dialog-content';

type Props = { addresses: Address[] };

export default function LocationDialog({ addresses }: Props) {
  const pathname = usePathname();

  const hasAddress = addresses.length > 0;

  return pathname === '/' ? (
    <></>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='ml-auto mr-[-8px] gap-1 p-1 transition-colors hover:bg-neutral-100 sm:ml-0 sm:mr-0 sm:h-auto sm:w-auto'
        >
          <Location className='w-4 fill-neutral-600' />

          <span
            className={cn(
              'hidden text-xs font-medium text-neutral-600 sm:inline sm:text-[0.7rem]/[0.75rem]',
              { 'font-semibold': hasAddress },
            )}
          >
            {hasAddress ? addresses[0].addressLine1 : 'Enter delivery address'}
          </span>

          <ChevronDownIcon className='ml-auto hidden w-3 sm:inline' />
        </Button>
      </DialogTrigger>

      <ChooseAddressContent addresses={addresses} />
    </Dialog>
  );
}
