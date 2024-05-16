import { useState } from 'react';

import { Address } from '@/types/address';
import { CreateContent } from './create';
import { EditContent } from './edit';
import AddressSelector from './selector';

type Props = {
  isDialog: boolean;
  addresses: Address[];
  address: Address;
  handleClose: () => void;
  handleSelect: (id: number) => void;
};

export default function ChooseToggler({
  isDialog,
  addresses,
  address,
  handleClose,
  handleSelect,
}: Props) {
  const [contentType, setContentType] = useState<'choose' | 'create' | 'edit'>(
    'choose',
  );
  const [index, setIndex] = useState<number>(0);

  const handleCreate = () => {
    setContentType('create');
  };

  const handleEdit = (i: number) => {
    setIndex(i);
    setContentType('edit');
  };

  const handleReturn = () => setContentType('choose');

  return (
    <>
      {contentType === 'choose' && (
        <AddressSelector
          isDialog={isDialog}
          addresses={addresses}
          handleCreate={handleCreate}
          handleEdit={handleEdit}
          selectedAddress={address}
          handleSelect={handleSelect}
        />
      )}

      {contentType === 'create' && (
        <CreateContent
          isDialog={isDialog}
          handleReturn={handleReturn}
          handleClose={handleClose}
          routeHomeOnSuccess
        />
      )}

      {contentType === 'edit' && (
        <EditContent
          isDialog={isDialog}
          address={addresses[index]}
          handleReturn={handleReturn}
          handleClose={handleClose}
        />
      )}
    </>
  );
}
