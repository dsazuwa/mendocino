import { cookies } from 'next/headers';

import { User } from '@/_types/common-types';

export default async function useAuthentication() {
  const accessToken = cookies().get('access-token');

  if (!accessToken) return { isAuthenticated: false, user: undefined };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken.value}` },
    cache: 'force-cache',
  });

  const { user } = (await res.json()) as { user: User };

  return { isAuthenticated: res.status === 200, user };
}
