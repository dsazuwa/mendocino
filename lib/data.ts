import { cookies } from 'next/headers';

import { User } from '@/types/common';

export default async function getUser() {
  const accessToken = cookies().get('access-token');

  if (!accessToken || accessToken.value === '') return { user: undefined };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken.value}` },
    next: { tags: ['user'], revalidate: 600 },
  });

  const { user } = (await res.json()) as { user: User };

  return { user: res.status === 200 ? user : undefined };
}
