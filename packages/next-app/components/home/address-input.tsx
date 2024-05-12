import Autocomplete from '../address/autocomplete';

export default function AddressInput() {
  return (
    <>
      <div className='text-lg font-bold'>Order delivery near you!</div>

      <Autocomplete />
    </>
  );
}
