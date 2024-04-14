'use client';

import { ChevronDownIcon, Cross2Icon } from '@radix-ui/react-icons';
import { usePathname } from 'next/navigation';

import Location from '@/components/icons/location';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function LocationButton() {
  const pathname = usePathname();

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

          <span className='hidden text-xs font-medium text-neutral-600 sm:inline sm:text-[0.7rem]/[0.75rem]'>
            Enter delivery address
          </span>

          <ChevronDownIcon className='ml-auto hidden w-3 sm:inline' />
        </Button>
      </DialogTrigger>

      <DialogContent className='left-[50%] top-0 h-screen w-full max-w-none translate-x-[-50%] translate-y-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[10%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[10%] sm:top-[10%] sm:h-auto sm:max-h-[75vh] sm:max-w-lg'>
        <div className='flex h-12 flex-row items-center justify-between'>
          <span className='font-semibold text-neutral-600'>
            Enter delivery address
          </span>

          <DialogClose className='rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400'>
            <Cross2Icon className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
