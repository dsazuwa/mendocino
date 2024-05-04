'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import LogOut from '@/components/icons/log-out';
import useAuthContext from '@/hooks/use-auth-context';
import { useLogoutMutation } from '@/store/api/auth';

export default function LogoutButton({ onClick }: { onClick?: () => void }) {
  const [logout, { data, isSuccess }] = useLogoutMutation();

  const router = useRouter();
  const { setGuestSession } = useAuthContext();

  const handleClick = () => {
    if (onClick) onClick();

    void logout();
  };

  useEffect(() => {
    if (isSuccess && data) {
      setGuestSession(data.guestSession);

      router.push('/');
      router.refresh();
    }
  }, [isSuccess, data, router, setGuestSession]);

  return (
    <button
      onClick={() => handleClick()}
      className='inline-flex gap-4 p-4 sm:p-0'
    >
      <LogOut className='w-4 fill-red-500 sm:hidden sm:fill-neutral-600' />

      <span className='text-xs font-medium max-sm:text-red-500 sm:text-xxs sm:font-semibold'>
        Log Out
      </span>
    </button>
  );
}
