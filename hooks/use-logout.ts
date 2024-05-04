import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import useAuthContext from '@/hooks/use-auth-context';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLogoutMutation } from '@/store/api/auth';

export default function useLogout(onClick?: () => void) {
  const [logout, { data, isSuccess }] = useLogoutMutation();

  const sm = useMediaQuery('(min-width: 640px)');

  const router = useRouter();
  const { setGuestSession } = useAuthContext();

  const handleLogout = () => {
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

  return { sm, handleLogout };
}
