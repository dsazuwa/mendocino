import { cookies } from 'next/headers';

export default async function useAuthentication() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: 'GET',
    headers: { cookie: cookies().toString() },
    next: { tags: ['user'] },
    cache: 'force-cache',
  });

  return { isAuthenticated: res.status === 200, response: res };
}
