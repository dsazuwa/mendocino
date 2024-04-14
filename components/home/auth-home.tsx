import { ChevronDownIcon } from '@radix-ui/react-icons';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { getAddresses } from '@/lib/data';
import ChooseAddressContent from '../location/dialog-content';
import UnauthenticatedHomePage from './unauth-home';

export default async function AuthenticatedHomePage() {
  const { addresses } = await getAddresses();
  const hasAddress = addresses.length > 0;

  if (!hasAddress) return <UnauthenticatedHomePage />;

  return (
    <div className='flex flex-col items-center justify-center gap-2 md:flex-row'>
      <span className='text-lg font-medium sm:text-xl'>Delivering to</span>

      <Dialog>
        <DialogTrigger className='flex flex-row items-center gap-2'>
          <span className='text-lg font-bold sm:text-xl'>
            {addresses[0].addressLine1}
          </span>

          <ChevronDownIcon />
        </DialogTrigger>

        <ChooseAddressContent addresses={addresses} />
      </Dialog>
    </div>
  );
}
