'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import ContentHeader from '../content-header';
import CartIcon from '../icons/cart';
import { Button } from '../ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import CartContent from './content';

export default function CartDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isLarge = useMediaQuery('(min-width: 1024px)');

  const handleOpen = () => {
    if (isLarge && pathname.startsWith('/locations')) {
      setOpen(false);
    } else {
      setOpen(!open);
    }
  };

  useEffect(() => {
    if (isLarge && pathname.startsWith('/locations')) {
      setOpen(false);
    }
  }, [isLarge]);

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' onClick={handleOpen}>
          <CartIcon className='w-3.5 fill-neutral-600' />
        </Button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className='flex max-h-screen max-w-80 flex-col bg-white'
      >
        <ContentHeader className='border-none'>
          <SheetClose asChild>
            <Button variant='ghost' size='icon' className='ml-[-8px]'>
              <Cross2Icon className='h-4 w-4 fill-neutral-500' />

              <span className='sr-only'>Close</span>
            </Button>
          </SheetClose>
        </ContentHeader>

        <CartContent className='px-4' />
      </SheetContent>
    </Sheet>
  );
}
