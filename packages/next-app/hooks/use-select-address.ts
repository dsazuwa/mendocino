import { setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

import { Address } from '@/types/address';

export default function useSelectAddress(
  defaultAddress: Address | undefined,
  handleClose: () => void,
) {
  const [selectedId, setSelectedId] = useState(defaultAddress?.id);

  useEffect(() => {
    if (defaultAddress) {
      setSelectedId(defaultAddress.id);
      setCookie('selected-address', defaultAddress.id);
    }
  }, [defaultAddress]);

  const selectAddress = (id: number) => {
    setCookie('selected-address', id);
    setSelectedId(id);
    handleClose();
  };

  return { selectedId, selectAddress };
}
