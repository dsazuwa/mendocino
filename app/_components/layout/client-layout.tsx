import { ReactNode } from 'react';

import ClientAppBar from './client-appbar';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ClientAppBar />

      <div className='mt-12' />
      {children}
    </>
  );
}
