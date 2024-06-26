'use client';

import { ArrowLeftIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import Edit from '@/components/icons/edit';
import Location from '@/components/icons/location';
import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { Address } from '@/types/address';
import ContentHeader from '../content-header';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import AddressForm from './address-form';
import DeleteAddress from './delete';

type Props = {
  address: Address;
  handleReturn?: () => void;
};

export default function EditAddess({ address, handleReturn }: Props) {
  const [open, setOpen] = useState(false);
  const isDialog = useMediaQuery('(min-width: 640px)');

  const handleClose = () => setOpen(false);

  const Modal = isDialog ? Dialog : Sheet;
  const Trigger = isDialog ? DialogTrigger : SheetTrigger;
  const Content = isDialog ? DialogContent : SheetContent;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <button className='inline-flex items-center gap-2 rounded-lg p-4 px-0 transition-colors duration-100 hover:bg-neutral-50 sm:gap-4 sm:px-2'>
          <Location className='max-w-4 fill-neutral-600' />

          <span className='flex flex-col items-start'>
            <span className='text-xs font-semibold'>{address.name}</span>

            <span className='text-[0.65rem]'>
              {[address.address, address.zipCode].join(', ')}
            </span>
          </span>

          <Edit className='ml-auto max-w-4 fill-neutral-600' />
        </button>
      </Trigger>

      <Content
        className={cn({
          'flex max-w-lg flex-col': isDialog,
          'flex h-screen w-full flex-col': !isDialog,
        })}
        side='left'
      >
        <EditContent
          isDialog={true}
          address={address}
          handleReturn={handleReturn}
          handleClose={handleClose}
        />
      </Content>
    </Modal>
  );
}

type ContentProps = {
  isDialog: boolean;
  address: Address;
  handleReturn?: () => void;
  handleClose: () => void;
};

export function EditContent({
  isDialog,
  address,
  handleReturn,
  handleClose,
}: ContentProps) {
  const Comp = isDialog ? DialogClose : SheetClose;

  return (
    <>
      <ContentHeader>
        {handleReturn === undefined ? (
          <Comp asChild>
            <Button variant='ghost' size='icon'>
              <Cross2Icon className='h-4 w-4 fill-neutral-500' />

              <span className='sr-only'>Close</span>
            </Button>
          </Comp>
        ) : (
          <Button variant='ghost' size='icon' onClick={handleReturn}>
            <ArrowLeftIcon className='h-4 w-4 fill-neutral-500' />

            <span className='sr-only'>Return to address selector</span>
          </Button>
        )}

        <span className='flex-1 text-sm font-semibold'>Edit Address</span>

        <DeleteAddress id={address.id} handleSuccess={handleClose} />
      </ContentHeader>

      <AddressForm defaultAddress={address} handleClose={handleClose} />
    </>
  );
}
