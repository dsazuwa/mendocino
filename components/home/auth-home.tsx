import { getAddresses } from '@/lib/data';
import UnauthenticatedHomePage from './unauth-home';
import AddressModal from './address-modal';

export default async function AuthenticatedHomePage() {
  const { addresses } = await getAddresses();
  const hasAddress = addresses.length > 0;

  if (!hasAddress) return <UnauthenticatedHomePage />;

  return (
    <div className='flex flex-col items-center justify-center gap-2 md:flex-row'>
      <span className='text-lg font-medium sm:text-xl'>Delivering to</span>

      <AddressModal addresses={addresses} />
    </div>
  );
}
