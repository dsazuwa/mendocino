'use client';

import useLogout from '@/_hooks/useLogout';
import { LogOut } from '../icons';

export default function LogoutButton() {
  const { handleLogout } = useLogout(false);

  return (
    <button
      onClick={() => void handleLogout()}
      className='flex flex-row gap-4 p-4 md:p-0'
    >
      <LogOut className='w-4 fill-neutral-600 md:hidden' />

      <span className='text-xs font-medium md:font-semibold'>Log Out</span>
    </button>
  );
}
