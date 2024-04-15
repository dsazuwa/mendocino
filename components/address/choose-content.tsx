import { Cross2Icon } from '@radix-ui/react-icons';

import { Address } from '@/types/customer';
import ContentHeader from '../content-header';
import { Button } from '../ui/button';
import { DialogClose } from '../ui/dialog';
import { SheetClose } from '../ui/sheet';
import AddressInput from './address-input';
import AddressSelector from './address-selector';

type Props = { isDialog: boolean; addresses: Address[] };

export default function ChooseContent({ isDialog, addresses }: Props) {
  const hasAddress = addresses.length > 0;

  const Close = isDialog ? DialogClose : SheetClose;

  return (
    <>
      <ContentHeader>
        <span className='flex-1 font-semibold text-neutral-800'>
          {hasAddress ? 'Choose a delivery address' : 'Enter delivery address'}
        </span>

        <Close asChild>
          <Button variant='ghost' size='icon'>
            <Cross2Icon className='h-4 w-4' />

            <span className='sr-only'>Close</span>
          </Button>
        </Close>
      </ContentHeader>

      {hasAddress ? (
        <AddressSelector addresses={addresses} />
      ) : (
        <AddressInput type='search' />
      )}
    </>
  );
}
