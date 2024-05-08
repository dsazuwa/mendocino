'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import CartIcon from '../icons/cart';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export default function CartDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isGreaterThan1200 = useMediaQuery('(min-width: 1200px)');

  const handleOpen = () => {
    if (isGreaterThan1200 && pathname.startsWith('/locations')) {
      setOpen(false);
    } else {
      setOpen(!open);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' onClick={handleOpen}>
          <CartIcon className='w-3.5 fill-neutral-600' />
        </Button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className='flex max-h-screen w-80 flex-col bg-white'
      ></SheetContent>
    </Sheet>
  );
}
