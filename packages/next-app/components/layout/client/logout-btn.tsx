'use client';

import { logout } from '@/app/actions/auth';
import LogOut from '@/components/icons/log-out';

function AppBarLogout() {
  return (
    <button onClick={() => void logout()} className='text-xxs font-semibold'>
      Log Out
    </button>
  );
}

function DrawerLogout({ onClick }: { onClick: () => void }) {
  const handleLogout = () => {
    onClick();

    void logout();
  };

  return (
    <button onClick={handleLogout} className='inline-flex gap-4 p-4'>
      <LogOut className='w-4 fill-red-500' />

      <span className='text-xs font-medium text-red-500'>Log Out</span>
    </button>
  );
}

export { AppBarLogout, DrawerLogout };
