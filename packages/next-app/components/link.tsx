import NextLink from 'next/link';
import { AnchorHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

export default function Link({
  href,
  className,
  children,
  noDecoration,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  noDecoration?: boolean;
}) {
  return (
    <NextLink
      href={href}
      className={cn(
        buttonVariants({ variant: 'primaryLink', size: 'none' }),
        {
          'font-medium hover:underline': !noDecoration,
          'font-semibold': noDecoration,
        },
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
}
