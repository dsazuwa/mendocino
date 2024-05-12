'use client';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  ClientLink,
  accountLinks,
  publicLinks,
  unauthLinks,
} from './client-constants';
import { DrawerLogout } from './logout-btn';

type Props = { isAuthenticated: boolean };

export default function ClientAppBarDrawer({ isAuthenticated }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon'>
          <HamburgerMenuIcon className='w-3.5' />
        </Button>
      </SheetTrigger>

      <SheetContent
        side='left'
        className='flex max-h-screen w-60 flex-col bg-white'
      >
        <div className='flex flex-grow flex-col'>
          <div className='h-12 border-b border-solid border-neutral-200' />

          {publicLinks.map(({ name, href, Icon }, i) => (
            <DrawerLink
              key={`public-link-${i}`}
              name={name}
              href={href}
              Icon={Icon}
            />
          ))}

          {isAuthenticated &&
            accountLinks.map(({ name, href, Icon }, i) => (
              <DrawerLink
                key={`public-link-${i}`}
                name={name}
                href={href}
                Icon={Icon}
              />
            ))}
        </div>

        <div className='flex flex-col sm:hidden'>
          {isAuthenticated ? (
            <DrawerLogout onClick={() => setOpen(false)} />
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

function DrawerLink({ name, href, Icon }: ClientLink) {
  return (
    <Link
      href={href}
      className='inline-flex gap-4 p-4 transition-colors hover:bg-neutral-100'
    >
      <Icon className='w-4 shrink-0 fill-neutral-600' />

      <span className='text-xs font-medium'>{name}</span>
    </Link>
  );
}
