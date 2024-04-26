import Autocomplete from '../address/autocomplete';

type Props = { sessionId?: string };

export default function AddressInput({ sessionId }: Props) {
  return (
    <>
      <div className='text-lg font-bold'>Order delivery near you!</div>

      <Autocomplete sessionId={sessionId} />
    </>
  );
}
