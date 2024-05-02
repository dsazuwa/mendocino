import { cookies } from 'next/headers';

import { Address } from '@/types/address';
import { User } from '@/types/common';
import { LocationType } from '@/types/location';

const { NEXT_PUBLIC_API_URL } = process.env;

export default async function getUser() {
  const accessToken = cookies().get('access-token')?.value;

  if (!accessToken) return { user: undefined };

  const res = await fetch(`${NEXT_PUBLIC_API_URL}/users/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { tags: ['user'], revalidate: 600 },
  });

  const { user } = (await res.json()) as { user: User };

  return { user: res.status === 200 ? user : undefined };
}

export async function getClosestLocations(placeId: string) {
  const res = await fetch(
    `${NEXT_PUBLIC_API_URL}/locations/distance/${placeId}`,
  );

  if (res.status !== 200) throw new Error('Failed to retrieve locations');

  const { locations } = (await res.json()) as { locations: LocationType[] };

  return locations;
}

export async function getAddresses() {
  const accessToken = cookies().get('access-token')?.value;
  const userType = accessToken ? 'customer' : 'user';

  const res = await fetch(`${NEXT_PUBLIC_API_URL}/${userType}/me/addresses`, {
    method: 'GET',
    headers: { cookie: cookies().toString() },
    next: { tags: ['address'] },
  });

  const { addresses } = (await res.json()) as { addresses: Address[] };

  return { addresses: res.status === 200 ? addresses : [] };
}
