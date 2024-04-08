'use client';

import { logout } from '@/app/action';
import { LogOut } from '../icons';

export default function LogoutButton() {
  return (
    <button
      onClick={() => void logout()}
      className='flex flex-row gap-4 p-4 md:p-0'
    >
      <LogOut className='w-4 fill-red-500 md:hidden md:fill-neutral-600' />

      <span className='text-xs font-medium text-red-500 md:font-semibold md:text-black'>
        Log Out
      </span>
    </button>
  );
}
