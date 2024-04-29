import { cookies } from 'next/headers';

export default function useAuthentication() {
  const accessToken = cookies().get('access-token')?.value;
  const guestSession = cookies().get('guest-session')?.value;

  return accessToken
    ? { isAuthenticated: true, guestSession: undefined, accessToken }
    : { isAuthenticated: false, guestSession, accessToken: undefined };
}
