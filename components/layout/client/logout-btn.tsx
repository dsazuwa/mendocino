'use client';

import { logout } from '@/app/action';
import LogOut from '@/components/icons/log-out';

export default function LogoutButton({ onClick }: { onClick?: () => void }) {
  const handleClick = () => {
    if (onClick) onClick();

    void logout();
  };

  return (
    <button
      onClick={() => handleClick()}
      className='flex flex-row gap-4 p-4 sm:p-0'
    >
      <LogOut className='w-4 fill-red-500 sm:hidden sm:fill-neutral-600' />

      <span className='text-xs font-medium text-red-500 sm:font-semibold sm:text-black'>
        Log Out
      </span>
    </button>
  );
}
