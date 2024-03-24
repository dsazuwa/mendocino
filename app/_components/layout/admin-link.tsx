'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, SVGProps } from 'react';

import { cn } from '@/_lib/utils';

type Props = {
  name: string;
  href: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
};

export default function AdminLink({ name, href, Icon }: Props) {
  const pathname = usePathname();
  const isSelected = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-row items-center gap-2 p-4 pl-8 transition-colors hover:bg-neutral-50',
        { 'border-l-4 border-solid border-primary-600 pl-7': isSelected },
      )}
    >
      <Icon
        className={cn('w-[18px] fill-neutral-500', {
          'fill-primary-600': isSelected,
        })}
      />
      <span
        className={cn('text-xs font-medium', {
          'font-semibold text-primary-600': isSelected,
        })}
      >
        {name}
      </span>
    </Link>
  );
}
