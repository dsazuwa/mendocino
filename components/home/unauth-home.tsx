import Autocomplete from './autocomplete';

export default function UnauthenticatedHomePage() {
  return (
    <>
      <div className='text-lg font-bold sm:text-xl'>
        Order delivery near you!
      </div>

      <Autocomplete />
    </>
  );
}
