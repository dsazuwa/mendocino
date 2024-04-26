'use client';

import { ArrowLeftIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import ContentHeader from '../content-header';
import LinkButton from '../link-button';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import AddressForm from './address-form';

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

type ContentProps = { isDialog: boolean; handleReturn?: () => void };

export function CreateContent({ isDialog, handleReturn }: ContentProps) {
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

        <span className='flex-1 text-sm font-semibold'>Create Address</span>
      </ContentHeader>

      <AddressForm />
    </>
  );
}
