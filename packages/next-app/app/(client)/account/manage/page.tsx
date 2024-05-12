import Link from 'next/link';

import ArchiveButton from './_components/archive-btn';
import DeleteButton from './_components/delete-btn';

export default function ManageAccount() {
  return (
    <div className='w-full flex-1 bg-neutral-50'>
      <div className='mx-auto mt-2 w-full max-w-sm space-y-4 rounded-md bg-white px-4 py-8'>
        <h1 className='text-xl font-bold'>Manage Account</h1>

        <div className='space-y-4 border-b border-solid border-neutral-200 pb-4 pt-2'>
          <h2 className='text-sm font-bold'>Account Data</h2>

          <p className='text-xs leading-5'>
            You can request an archive of your personal information. We&apos;`ll
            notify when it&apos;`s ready to download.
          </p>

          <ArchiveButton />
        </div>

        <div className='space-y-4 pt-2'>
          <h2 className='text-sm font-bold'>Delete Account</h2>

          <p className='text-xs leading-5'>
            You can request to have your account deleted and personal
            information removed. Any credits and gift card balances will be
            forfeited.
          </p>

          <p className='space-x-1 text-[0.65rem] leading-3'>
            <span>
              For more information on how we collect and use customer data,
              visit our
            </span>

            <Link
              href='/'
              className='font-semibold text-primary-500 transition-colors hover:text-primary-700'
            >
              Privacy Policy
            </Link>
          </p>

          <DeleteButton />
        </div>
      </div>
    </div>
  );
}
