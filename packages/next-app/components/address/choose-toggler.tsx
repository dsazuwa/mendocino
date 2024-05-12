import { useState } from 'react';

import { Address } from '@/types/address';
import { CreateContent } from './create';
import AddressSelector from './selector';
import { EditContent } from './edit';

type Props = {
  isDialog: boolean;
  addresses: Address[];
  handleClose: () => void;
};

export default function ChooseToggler({
  isDialog,
  addresses,
  handleClose,
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
        />
      )}

      {contentType === 'create' && (
        <CreateContent
          isDialog={isDialog}
          handleReturn={handleReturn}
          handleClose={handleClose}
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
