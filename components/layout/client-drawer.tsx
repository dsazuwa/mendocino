'use client';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useWindowWidth from '@/hooks/useWindowWidth';
import { Button } from '../ui/button';
import { accountLinks, publicLinks, unauthLinks } from './client-constants';
import DrawerLink from './client-drawer-link';
import LogoutButton from './logout-btn';

type Props = {
  isAuthenticated: boolean;
};

export default function ClientAppBarDrawer({ isAuthenticated }: Props) {
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

        <div className='flex flex-grow flex-col'>
          {publicLinks.map(({ name, href, Icon }, i) => (
            <DrawerLink
              key={`public-link-${i}`}
              name={name}
              href={href}
              Icon={Icon}
            />
          ))}

          {accountLinks.map(({ name, href, Icon }, i) => (
            <DrawerLink
              key={`public-link-${i}`}
              name={name}
              href={href}
              Icon={Icon}
            />
          ))}
        </div>

        <div className='flex flex-col'>
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <>
              {unauthLinks.map(({ name, href, Icon }, i) => (
                <DrawerLink
                  key={`auth-link-${i}`}
                  href={href}
                  name={name}
                  Icon={Icon}
                />
              ))}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
