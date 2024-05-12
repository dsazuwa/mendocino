'use client';

import Cutlery from '@/components/icons/cutlery';
import Home from '@/components/icons/home';
import People from '@/components/icons/people';
import ShortReceipt from '@/components/icons/receipt-short';
import Settings from '@/components/icons/settings';
import Store from '@/components/icons/store';
import { cn } from '@/lib/utils';
import AdminLink from './admin-link';

export default function AdminLinks({ className }: { className?: string }) {
  return (
    <div className={cn('h-full pt-4', className)}>
      <AdminLink name='Home' href='/admin' Icon={Home} />
      <AdminLink name='Stores' href='/admin/stores' Icon={Store} />
      <AdminLink name='Menu' href='/admin/menu' Icon={Cutlery} />
      <AdminLink name='Orders' href='/admin/orders' Icon={ShortReceipt} />
      <AdminLink name='Users' href='/admin/users' Icon={People} />
      <AdminLink name='Settings' href='/admin/settings' Icon={Settings} />
    </div>
  );
}
