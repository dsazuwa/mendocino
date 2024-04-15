'use client';

import { useState } from 'react';

import { DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Address } from '@/lib/types/customer';
import { Dialog } from '../ui/dialog';
import { Sheet, SheetContent } from '../ui/sheet';
import Content from './edit-content';
import Button from './edit-trigger';

export default function EditAddess({ address }: { address: Address }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Button isDialog={true} address={address} />

        <DialogContent className='flex max-w-lg flex-col'>
          <Content isDialog={true} address={address} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button isDialog={false} address={address} />

      <SheetContent className='flex h-screen w-full flex-col' side='left'>
        <Content isDialog={false} address={address} />
      </SheetContent>
    </Sheet>
  );
}
