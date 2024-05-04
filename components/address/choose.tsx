'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import Location from '@/components/icons/location';
import { DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { Address } from '@/types/address';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import ChooseToggler from './choose-toggler';
import { CreateContent } from './create';

type Props = { addresses: Address[] };

export default function AddressButton({ addresses }: Props) {
  const pathname = usePathname();

  if (pathname === '/') return <></>;
  return <ChooseAddress addresses={addresses} />;
}

function ChooseAddress({ addresses }: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const handleClose = () => setOpen(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Trigger isDialog={true} addresses={addresses} />

        <DialogContent className='flex max-w-lg flex-col'>
          <Content
            isDialog={true}
            addresses={addresses}
            handleClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Trigger isDialog={true} addresses={addresses} />

      <SheetContent className='flex h-screen w-full flex-col' side='right'>
        <Content
          isDialog={false}
          addresses={addresses}
          handleClose={handleClose}
        />
      </SheetContent>
    </Sheet>
  );
}

type ContentProps = { isDialog: boolean; addresses: Address[] };

function Trigger({ isDialog, addresses }: ContentProps) {
  const hasAddress = addresses.length > 0;

  const Comp = isDialog ? DialogTrigger : SheetTrigger;

  return (
    <Comp asChild>
      <Button
        variant='ghost'
        size='icon'
        className='ml-auto gap-1 p-1 transition-colors hover:bg-neutral-100 sm:ml-0 sm:mr-0 sm:h-auto sm:w-auto'
      >
        <Location
          className={cn('w-3.5 fill-neutral-600', { 'sm:hidden': hasAddress })}
        />

        <span
          className={cn(
            'hidden text-xs font-medium sm:inline sm:text-[0.7rem]/[0.75rem]',
            { 'font-semibold': hasAddress },
          )}
        >
          {hasAddress ? addresses[0].name : 'Enter delivery address'}
        </span>

        <ChevronDownIcon className='ml-auto hidden w-3 sm:inline' />
      </Button>
    </Comp>
  );
}

function Content({
  isDialog,
  addresses,
  handleClose,
}: ContentProps & {
  handleClose: () => void;
}) {
  const hasAddress = addresses.length > 0;

  return hasAddress ? (
    <ChooseToggler
      isDialog={isDialog}
      addresses={addresses}
      handleClose={handleClose}
    />
  ) : (
    <CreateContent isDialog={isDialog} handleClose={handleClose} />
  );
}
