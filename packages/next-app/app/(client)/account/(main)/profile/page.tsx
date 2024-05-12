import { cookies } from 'next/headers';

import { Profile as TProfile } from '@/types/customer';
import ProfileForm from './_components/profile-form';
import Link from '@/components/link';

async function getProfile() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/profile`,
    {
      headers: {
        Authorization: `Bearer ${cookies().get('access-token')?.value}`,
      },
      next: { tags: ['user', 'profile'], revalidate: false },
    },
  );

  if (!res.ok) throw new Error('Failed to fetch data');

  return res.json() as Promise<TProfile>;
}

export default async function Profile() {
  const profile = await getProfile();

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='inline-flex flex-wrap items-center gap-4 md:h-20'>
        <span className='flex-1 text-xl font-semibold'>Profile</span>

        <Link href='/account/password' noDecoration={true}>
          Change Password
        </Link>

        <Link href='/account/manage' noDecoration={true}>
          Manage Account
        </Link>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
