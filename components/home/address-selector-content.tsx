import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Address } from '@/types/address';
import ContentHeader from '../content-header';
import { Button } from '../ui/button';
import AddressSelector from '../address/address-selector';
import CreateForm from '../address/create-form';

type Props = { isDialog: boolean; addresses: Address[] };

export default function AddressSelectorContent({ isDialog, addresses }: Props) {
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
        <>
          <ContentHeader>
            <Button variant='ghost' size='icon' onClick={handleReturn}>
              <ArrowLeftIcon className='h-4 w-4 fill-neutral-500' />

              <span className='sr-only'>Return to address selector</span>
            </Button>

            <span className='flex-1 text-sm font-semibold text-neutral-800'>
              Create Address
            </span>
          </ContentHeader>

          <CreateForm />
        </>
      )}
    </>
  );
}
