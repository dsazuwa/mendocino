'use client';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useWindowWidth from '@/hooks/useWindowWidth';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { publicLinks } from './client-constants';

export default function ClientAppBarDrawer() {
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
        className={cn('flex max-h-screen w-60 flex-col bg-white')}
      >
        <div className='h-12 border-b border-solid border-gray-200' />

        <div>
          {publicLinks.map(({ name, Icon, href }, i) => (
            <Link
              key={`public-link-${i}`}
              href={href}
              className='flex flex-row gap-4 p-4'
            >
              <Icon className='w-4 fill-gray-600' />

              <span className='text-xs font-medium'>{name}</span>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
