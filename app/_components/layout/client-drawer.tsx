'use client';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/_components/ui/sheet';
import useAuthentication from '@/_hooks/useAuthentication';
import useLogout from '@/_hooks/useLogout';
import useWindowWidth from '@/_hooks/useWindowWidth';
import { LogOut } from '../icons';
import { Button } from '../ui/button';
import { accountLink, publicLinks, unauthLinks } from './client-constants';
import DrawerButton from './client-drawer-btn';
import DrawerLink from './client-drawer-link';

export default function ClientAppBarDrawer() {
  const { authReady, isAuthenticated } = useAuthentication();
  const { handleLogout } = useLogout(false);

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
        </div>

        {authReady && (
          <div className='flex flex-col border-t border-solid border-neutral-200'>
            {isAuthenticated ? (
              <>
                <DrawerLink
                  name={accountLink.name}
                  href={accountLink.href}
                  Icon={accountLink.Icon}
                />

                <DrawerButton
                  key='logout-btn'
                  name='Log Out'
                  Icon={LogOut}
                  handleClick={handleLogout}
                />
              </>
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
        )}
      </SheetContent>
    </Sheet>
  );
}
