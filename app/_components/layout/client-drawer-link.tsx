import Link from 'next/link';

import { PageType } from './client-constants';

export default function DrawerLink({ name, href, Icon }: PageType) {
  return (
    <Link href={href} className='flex flex-row gap-4 p-4'>
      <Icon className='w-4 fill-gray-600' />

      <span className='text-xs font-medium'>{name}</span>
    </Link>
  );
}
