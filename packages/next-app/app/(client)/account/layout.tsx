import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import getUser from '@/lib/data';

type Props = { children: ReactNode };

export default async function Layout({ children }: Props) {
  const { user } = await getUser();

  if (!user) {
    redirect('/');
  }

  return <>{children}</>;
}
