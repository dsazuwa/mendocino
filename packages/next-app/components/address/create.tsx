'use client';

import { ArrowLeftIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import ContentHeader from '../content-header';
import LinkButton from '../link-button';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import AddressForm from './address-form';

export default function CreateAddress() {
  const [open, setOpen] = useState(false);
  const isDialog = useMediaQuery('(min-width: 640px)');

  const handleClose = () => setOpen(false);

  const Modal = isDialog ? Dialog : Sheet;
  const Trigger = isDialog ? DialogTrigger : SheetTrigger;
  const Content = isDialog ? DialogContent : SheetContent;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <LinkButton className='sm:px-2'>Create Address</LinkButton>
      </Trigger>

      <Content
        className={cn({
          'flex max-w-lg flex-col': isDialog,
          'flex h-screen w-full flex-col': !isDialog,
        })}
        side='right'
      >
        <CreateContent isDialog={false} handleClose={handleClose} />
      </Content>
    </Modal>
  );
}

type ContentProps = {
  isDialog: boolean;
  handleClose: () => void;
  handleReturn?: () => void;
  routeHomeOnSuccess?: boolean;
};

export function CreateContent({
  isDialog,
  handleClose,
  handleReturn,
  routeHomeOnSuccess,
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

        <span className='flex-1 text-sm font-semibold'>Create Address</span>
      </ContentHeader>

      <AddressForm
        handleClose={handleClose}
        routeHomeOnSuccess={routeHomeOnSuccess}
      />
    </>
  );
}
