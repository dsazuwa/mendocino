'use client';

import { useState } from 'react';

import { DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import LinkButton from '../link-button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import CreateContent from './create-content';

export default function CreateAddressModal() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Trigger isDialog={true} />

        <DialogContent className='flex max-w-lg flex-col'>
          <CreateContent isDialog={false} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Trigger isDialog={true} />

      <SheetContent className='flex h-screen w-full flex-col' side='right'>
        <CreateContent isDialog={false} />
      </SheetContent>
    </Sheet>
  );
}

type TriggerProps = { isDialog: boolean };

export function Trigger({ isDialog }: TriggerProps) {
  const Comp = isDialog ? DialogTrigger : SheetTrigger;

  return (
    <Comp asChild>
      <LinkButton className='sm:px-2'>Create Address</LinkButton>
    </Comp>
  );
}
