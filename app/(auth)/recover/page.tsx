import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RecoveryFlow from './_components/recovery-flow';

export default function Recover() {
  return (
    <>
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
    </>
  );
}
