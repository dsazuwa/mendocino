import { ArrowLeftIcon } from '@radix-ui/react-icons';

import Link from '@/components/link';
import RecoveryFlow from './_components/recovery-flow';

export default function Recover() {
  return (
    <>
      <RecoveryFlow />

      <Link href='/login' className='gap-1'>
        <ArrowLeftIcon className='w-3 text-primary-800' />
        Back to Login
      </Link>
    </>
  );
}
