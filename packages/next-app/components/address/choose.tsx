'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import Location from '@/components/icons/location';
import { DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import useSelectAddress from '@/hooks/use-select-address';
import { cn } from '@/lib/utils';
import { Address } from '@/types/address';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import ChooseToggler from './choose-toggler';
import { CreateContent } from './create';

export type ChooseAddressProps = {
  addresses: Address[];
  selectedAddress: Address | undefined;
};

export default function ChooseAddress({
  addresses,
  selectedAddress,
}: ChooseAddressProps) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { selectedId, selectAddress } = useSelectAddress(
    selectedAddress,
    handleClose,
  );

  const address = addresses.find((address) => address.id === selectedId);

  const isDialog = useMediaQuery('(min-width: 640px)');
  const Modal = isDialog ? Dialog : Sheet;
  const Trigger = isDialog ? DialogTrigger : SheetTrigger;
  const Content = isDialog ? DialogContent : SheetContent;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='ml-auto gap-1 p-1 transition-colors hover:bg-neutral-100 sm:ml-0 sm:mr-0 sm:h-auto sm:w-auto'
        >
          <Location
            className={cn('w-3.5 fill-neutral-600', { 'sm:hidden': !!address })}
          />

          <span
            className={cn(
              'hidden text-xs font-medium sm:inline sm:text-[0.7rem]/[0.75rem]',
              { 'font-semibold': !!address },
            )}
          >
            {address ? address.name : 'Enter delivery address'}
          </span>

          <ChevronDownIcon className='ml-auto hidden w-3 sm:inline' />
        </Button>
      </Trigger>

      <Content
        className={cn({
          'flex max-w-lg flex-col': isDialog,
          'flex h-screen w-full flex-col': !isDialog,
        })}
        side='right'
      >
        {address ? (
          <ChooseToggler
            isDialog={isDialog}
            addresses={addresses}
            address={address}
            handleClose={handleClose}
            handleSelect={selectAddress}
          />
        ) : (
          <CreateContent
            isDialog={isDialog}
            handleClose={handleClose}
            routeHomeOnSuccess
          />
        )}
      </Content>
    </Modal>
  );
}
