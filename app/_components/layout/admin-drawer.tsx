'use client';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/_components/ui/sheet';
import useWindowWidth from '@/_hooks/useWindowWidth';
import { Button } from '../ui/button';
import AdminLinks from './admin-links';

export default function AdminDrawer() {
  const [open, setOpen] = useState(false);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (windowWidth && windowWidth >= 768) setOpen(false);
  }, [windowWidth]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='mr-4 md:hidden'>
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent
        side='left'
        className='flex max-h-screen w-60 flex-col bg-white'
      >
        <div className='h-12 border-b border-solid border-neutral-200' />

        <AdminLinks />
      </SheetContent>
    </Sheet>
  );
}
