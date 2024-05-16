import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Address } from '@/types/address';

export default function useSelectAddress(
  addresses: Address[],
  defaultAddress: Address,
  handleClose?: () => void,
) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(defaultAddress.id);

  const selectAddress = (id: number) => {
    setCookie('selected-address', id);
    setSelectedId(id);
    router.push('/');
    router.refresh();
    if (handleClose) handleClose();
  };

  return {
    address:
      addresses.find((address) => address.id === selectedId) || addresses[0],
    selectAddress,
  };
}
