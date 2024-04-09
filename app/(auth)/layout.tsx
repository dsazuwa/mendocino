import Link from 'next/link';
import { ReactNode } from 'react';

import Logo from '@/components/logo';

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  return (
    <div className='mx-auto w-full max-w-screen-sm'>
      <div className='mt-[10vh] flex flex-col items-center gap-4 px-4'>
        <Link href='/'>
          <Logo />
        </Link>

        {children}
      </div>
    </div>
  );
}
