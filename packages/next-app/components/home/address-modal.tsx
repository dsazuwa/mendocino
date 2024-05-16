'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import useSelectAddress from '@/hooks/use-select-address';
import { cn } from '@/lib/utils';
import { Address } from '@/types/address';
import ChooseToggler from '../address/choose-toggler';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

type Props = { addresses: Address[]; defaultAddress: Address };

export default function AddressModal({ addresses, defaultAddress }: Props) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { address, selectAddress } = useSelectAddress(
    addresses,
    defaultAddress,
    handleClose,
  );

  const isDialog = useMediaQuery('(min-width: 640px)');
  const Modal = isDialog ? Dialog : Sheet;
  const Trigger = isDialog ? DialogTrigger : SheetTrigger;
  const Content = isDialog ? DialogContent : SheetContent;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Trigger className='inline-flex items-center gap-2'>
        <span className='text-lg font-bold'>{address.name}</span>

        <ChevronDownIcon />
      </Trigger>

      <Content
        className={cn({
          'flex max-w-lg flex-col': isDialog,
          'flex h-screen w-full flex-col': !isDialog,
        })}
        side='right'
      >
        <ChooseToggler
          isDialog={isDialog}
          addresses={addresses}
          address={address}
          handleClose={handleClose}
          handleSelect={selectAddress}
        />
      </Content>
    </Modal>
  );
}
