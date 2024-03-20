import Link from 'next/link';
import { ReactNode } from 'react';

import Logo from '../logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className='mx-auto max-w-[500px]'>
      <div className='mt-[10vh] flex flex-col items-center gap-2 px-4'>
        <Link href='/'>
          <Logo />
        </Link>

        {children}
      </div>
    </div>
  );
}
