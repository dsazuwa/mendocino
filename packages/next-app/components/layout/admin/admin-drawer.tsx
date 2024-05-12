'use client';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '../../ui/button';
import AdminLinks from './admin-links';

export default function AdminDrawer() {
  const [open, setOpen] = useState(false);
  const isMd = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (isMd) setOpen(false);
  }, [isMd]);

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
