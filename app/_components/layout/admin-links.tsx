'use client';

import {
  Cutlery,
  Home,
  People,
  Settings,
  ShortReceipt,
  Store,
} from '@/_components/icons';
import { cn } from '@/_lib/utils';
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
