import Link from 'next/link';

import { ClientLink } from './client-constants';

export default function DrawerLink({ name, href, Icon }: ClientLink) {
  return (
    <Link
      href={href}
      className='inline-flex gap-4 p-4 transition-colors hover:bg-neutral-100'
    >
      <Icon className='w-4 shrink-0 fill-neutral-600' />

      <span className='text-xs font-medium text-neutral-600'>{name}</span>
    </Link>
  );
}
