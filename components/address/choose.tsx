'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Address } from '@/types/common';
import { Dialog } from '../ui/dialog';
import { Sheet, SheetContent } from '../ui/sheet';
import Content from './choose-content';
import Button from './choose-trigger';

type Props = { addresses: Address[] };

export default function AddressButton({ addresses }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (pathname === '/') return <></>;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Button isDialog={true} addresses={addresses} />

        <DialogContent className='flex max-w-lg flex-col'>
          <Content isDialog={true} addresses={addresses} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button isDialog={true} addresses={addresses} />

      <SheetContent className='flex h-screen w-full flex-col' side='right'>
        <Content isDialog={false} addresses={addresses} />
      </SheetContent>
    </Sheet>
  );
}
