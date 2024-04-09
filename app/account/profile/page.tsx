import Link from 'next/link';

import { AccountLayout } from '@/components/layout/account';
import { ClientLayout } from '@/components/layout/client';
import ProfileForm from './_components/profile-form';

export default function Profile() {
  const { firstName, lastName, email, phoneNumber, receiveStatusByText } = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    receiveStatusByText: false,
  };

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

          <ProfileForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            phoneNumber={phoneNumber}
            receiveStatusByText={receiveStatusByText}
          />
        </div>
      </AccountLayout>
    </ClientLayout>
  );
}
