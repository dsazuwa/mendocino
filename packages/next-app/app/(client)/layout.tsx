import { ReactNode } from 'react';

import ClientAppBar from '@/components/layout/client/client-app-bar';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-1 flex-col'>
      <ClientAppBar />

      <div className='h-16' />

      {children}
    </div>
  );
}
