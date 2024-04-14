import { cookies } from 'next/headers';

import { Address } from '@/lib/types/customer';

export async function getAddresses(): Promise<{ addresses: Address[] }> {
  const accessToken = cookies().get('access-token')?.value;

  if (accessToken === '') return { addresses: [] as Address[] };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/addresses`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) throw new Error('Failed to fetch addresses');

  // return response.json() as Promise<{ addresses: Address[] }>;

  return new Promise((resolve) => {
    resolve({
      addresses: [
        {
          addressLine1: '3A Olatunde Ayoola Avenue',
          city: 'Obanikoro',
          zipCode: '102216',
          state: 'Lagos',
          isDefault: true,
        },
        {
          addressLine1: '54 Olorunlogbon St',
          city: 'Anthony',
          zipCode: '105102',
          state: 'Lagos',
          isDefault: false,
        },
      ],
    });
  });
}
