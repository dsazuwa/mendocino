'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import Edit from '@/components/icons/edit';
import Location from '@/components/icons/location';
import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AddressData } from '@/types/address';
import ContentHeader from '../content-header';
import Delete from '../icons/delete';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import AddressForm from './address-form';

export default function EditAddess({ address }: { address: AddressData }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Trigger isDialog={true} address={address} />

        <DialogContent className='flex max-w-lg flex-col'>
          <Content isDialog={true} address={address} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Trigger isDialog={false} address={address} />

      <SheetContent className='flex h-screen w-full flex-col' side='left'>
        <Content isDialog={false} address={address} />
      </SheetContent>
    </Sheet>
  );
}

type Props = { isDialog: boolean; address: AddressData };

function Trigger({ isDialog, address: addressProp }: Props) {
  const { name, address, zipCode } = addressProp;

  const Comp = isDialog ? DialogTrigger : SheetTrigger;

  return (
    <Comp asChild>
      <button className='inline-flex items-center gap-2 rounded-lg p-4 px-0 transition-colors duration-100 hover:bg-neutral-50 sm:gap-4 sm:px-2'>
        <Location className='max-w-4 fill-neutral-600' />

        <span className='flex flex-col items-start'>
          <span className='text-xs font-semibold'>{name}</span>

          <span className='text-[0.65rem]'>
            {[address, zipCode].join(', ')}
          </span>
        </span>

        <Edit className='ml-auto max-w-4 fill-neutral-600' />
      </button>
    </Comp>
  );
}

function Content({ isDialog, address }: Props) {
  const Comp = isDialog ? DialogClose : SheetClose;

  return (
    <>
      <ContentHeader>
        <Comp asChild>
          <Button variant='ghost' size='icon'>
            <Cross2Icon className='h-4 w-4 fill-neutral-500' />

            <span className='sr-only'>Close</span>
          </Button>
        </Comp>

        <span className='flex-1 text-sm font-semibold'>Edit Address</span>

        <Button variant='ghost' size='icon'>
          <Delete className='h-4 w-4 fill-neutral-500' />
        </Button>
      </ContentHeader>

      <AddressForm defaultAddress={address} />
    </>
  );
}
