import { ArrowLeftIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Address } from '@/types/common';
import ContentHeader from '../content-header';
import { Button } from '../ui/button';
import { DialogClose } from '../ui/dialog';
import { SheetClose } from '../ui/sheet';
import AddressInput from './address-input';
import AddressSelector from './address-selector';
import CreateForm from './create-form';

type Props = { isDialog: boolean; addresses: Address[] };

export default function ChooseContent({ isDialog, addresses }: Props) {
  const hasAddress = addresses.length > 0;

  return hasAddress ? (
    <AddressSelectorContent isDialog={isDialog} addresses={addresses} />
  ) : (
    <AddressInputContent isDialog={isDialog} />
  );
}

export function AddressSelectorContent({ isDialog, addresses }: Props) {
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

export function AddressInputContent({ isDialog }: { isDialog: boolean }) {
  const Close = isDialog ? DialogClose : SheetClose;

  return (
    <>
      <ContentHeader>
        <span className='flex-1 font-semibold text-neutral-800'>
          Enter delivery address
        </span>

        <Close asChild>
          <Button variant='ghost' size='icon'>
            <Cross2Icon className='h-4 w-4' />

            <span className='sr-only'>Close</span>
          </Button>
        </Close>
      </ContentHeader>

      <AddressInput type='search' />
    </>
  );
}
