import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useLogoutUserMutation } from '@/_store';

export default function useLogout(shouldReturnHome: boolean) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [logout, { isLoading, isSuccess }] = useLogoutUserMutation();

  useEffect(() => {
    if (shouldReturnHome && isSuccess) router.push('/');
  }, [isSuccess, router, shouldReturnHome, dispatch]);

  return { handleLogout: logout, isLoading };
}
