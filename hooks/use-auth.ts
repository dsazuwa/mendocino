import { cookies } from 'next/headers';

export default function useAuthentication() {
  const accessToken = cookies().get('access-token');

  return !accessToken || accessToken.value === ''
    ? { isAuthenticated: false }
    : { isAuthenticated: true };
}
