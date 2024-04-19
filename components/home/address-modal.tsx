'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Address } from '@/types/common';
import Content from '../address/choose-content';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

type Props = { addresses: Address[] };

export default function AddressModal({ addresses }: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <AddressTrigger isDialog={true} addresses={addresses} />

        <DialogContent className='flex max-w-lg flex-col'>
          <Content isDialog={true} addresses={addresses} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <AddressTrigger isDialog={true} addresses={addresses} />

      <SheetContent className='flex h-screen w-full flex-col' side='right'>
        <Content isDialog={false} addresses={addresses} />
      </SheetContent>
    </Sheet>
  );
}

type TriggerProps = { isDialog: boolean; addresses: Address[] };

export function AddressTrigger({ isDialog, addresses }: TriggerProps) {
  const Comp = isDialog ? DialogTrigger : SheetTrigger;

  return (
    <Comp className='inline-flex items-center gap-2'>
      <span className='text-lg font-bold sm:text-xl'>{addresses[0].name}</span>

      <ChevronDownIcon />
    </Comp>
  );
}
