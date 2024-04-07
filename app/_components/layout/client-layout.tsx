import { ReactNode } from 'react';

import ClientAppBar from './client-appbar';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-1 flex-col'>
      <ClientAppBar />

      <div className='h-12' />

      {children}
    </div>
  );
}
