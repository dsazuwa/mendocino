import { cookies } from 'next/headers';

import { Address } from '@/types/address';

export async function getAddresses() {
  return cookies().get('access-token')?.value
    ? getCustomerAddresses()
    : getGuestAddresses();
}

export async function getCustomerAddresses() {
  const accessToken = cookies().get('access-token')?.value;

  if (!accessToken) return { addresses: [] };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/addresses`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { tags: ['Address'] },
    },
  );

  if (!response.ok) throw new Error('Failed to fetch addresses');

  return response.json() as Promise<{ addresses: Address[] }>;
}

export async function getGuestAddresses() {
  const sessionId = cookies().get('guest-session')?.value;

  if (!sessionId) throw new Error('No guest session');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/guests/${sessionId}/addresses`,
    { next: { tags: ['Address'] } },
  );

  if (!response.ok) throw new Error('Failed to fetch addresses');

  const { addresses } = (await response.json()) as {
    addresses: Address[];
  };

  return { sessionId, addresses };
}
