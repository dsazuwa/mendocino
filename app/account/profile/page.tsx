import { cookies } from 'next/headers';
import Link from 'next/link';

import { AccountLayout } from '@/components/layout/account';
import { ClientLayout } from '@/components/layout/client';
import { Profile as TProfile } from '@/lib/types/customer';
import ProfileForm from './_components/profile-form';

async function getProfile() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/profile`,
    {
      headers: {
        Authorization: `Bearer ${cookies().get('access-token')?.value}`,
      },
      next: { tags: ['user', 'profile'] },
    },
  );

  if (!res.ok) throw new Error('Failed to fetch data');

  return res.json() as Promise<TProfile>;
}

export default async function Profile() {
  const profile = await getProfile();

  return (
    <ClientLayout>
      <AccountLayout>
        <div className='flex h-full flex-col'>
          <div className='flex flex-row flex-wrap items-center gap-4 py-4 md:h-20'>
            <span className='flex-1 text-xl font-semibold'>Profile</span>

            <Link
              href='/account/password'
              className='text-xs font-semibold text-primary-500 transition-colors hover:text-primary-700'
            >
              Change Password
            </Link>

            <Link
              href='/account/manage'
              className='text-xs font-semibold text-primary-500 transition-colors hover:text-primary-700'
            >
              Manage Account
            </Link>
          </div>

          <ProfileForm profile={profile} />
        </div>
      </AccountLayout>
    </ClientLayout>
  );
}
