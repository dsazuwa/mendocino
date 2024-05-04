'use client';

import LogOut from '@/components/icons/log-out';
import useLogout from '@/hooks/use-logout';

function AppBarLogout() {
  const { handleLogout } = useLogout();

  return (
    <button onClick={() => handleLogout()} className='text-xxs font-semibold'>
      Log Out
    </button>
  );
}

function DrawerLogout({ onClick }: { onClick: () => void }) {
  const { handleLogout } = useLogout(onClick);

  return (
    <button onClick={() => handleLogout()} className='inline-flex gap-4 p-4'>
      <LogOut className='w-4 fill-red-500' />

      <span className='text-xs font-medium text-red-500'>Log Out</span>
    </button>
  );
}

export { AppBarLogout, DrawerLogout };
