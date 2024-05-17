'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';

import { AppStore, makeStore } from '@/redux';

type Props = { children: React.ReactNode };

export default function ReduxProvider({ children }: Props) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
