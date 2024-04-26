import { useState } from 'react';

import { Address } from '@/types/address';
import { CreateContent } from './create';
import AddressSelector from './selector';

type Props = { isDialog: boolean; addresses: Address[] };

export default function ChooseToggler({ isDialog, addresses }: Props) {
  const [contentType, setContentType] = useState<1 | 2>(1);

  const handleAddAddress = () => setContentType(2);

  const handleReturn = () => setContentType(1);

  return (
    <>
      {contentType === 1 && (
        <AddressSelector
          isDialog={isDialog}
          addresses={addresses}
          handleAddAddress={handleAddAddress}
        />
      )}

      {contentType === 2 && (
        <CreateContent isDialog={isDialog} handleReturn={handleReturn} />
      )}
    </>
  );
}
