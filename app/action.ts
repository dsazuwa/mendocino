'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function logout(shouldReturnHome: boolean) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: 'POST',
    headers: { cookie: cookies().toString() },
  });

  cookies().delete('access-token');
  cookies().delete('refresh-token');

  revalidateTag('user');

  if (shouldReturnHome) redirect('/');
}
