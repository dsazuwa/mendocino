import { ReactNode } from 'react';

import ClientAppBar from './client-appbar';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ClientAppBar />
      {children}
    </>
  );
}
