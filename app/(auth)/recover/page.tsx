import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { AuthLayout } from '@/_components/layout';
import { buttonVariants } from '@/_components/ui/button';
import { cn } from '@/_lib/utils';
import RecoveryFlow from './_components/recovery-flow';

export default function Recover() {
  return (
    <AuthLayout>
      <RecoveryFlow />

      <Link
        href='/login'
        className={cn(
          buttonVariants({
            variant: 'primaryLink',
            size: 'none',
            className: 'text-xs',
          }),
          'gap-1',
        )}
      >
        <ArrowLeftIcon className='w-3 text-primary-800' />
        Back to Login
      </Link>
    </AuthLayout>
  );
}
