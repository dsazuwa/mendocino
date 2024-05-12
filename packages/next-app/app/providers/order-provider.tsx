'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore, type StoreApi } from 'zustand';

import { createOrderStore, type OrderStore } from '@/stores/order';

export const OrderStoreContext = createContext<StoreApi<OrderStore> | null>(
  null,
);

export type Props = { children: ReactNode };

export default function OrderStoreProvider({ children }: Props) {
  const storeRef = useRef<StoreApi<OrderStore>>();
  if (!storeRef.current) {
    storeRef.current = createOrderStore();
  }

  return (
    <OrderStoreContext.Provider value={storeRef.current}>
      {children}
    </OrderStoreContext.Provider>
  );
}

export const useOrderStore = <T,>(selector: (store: OrderStore) => T): T => {
  const orderStoreContext = useContext(OrderStoreContext);

  if (!orderStoreContext) {
    throw new Error(`useOrderStore must be used within OrderStoreProvider`);
  }

  return useStore(orderStoreContext, selector);
};
