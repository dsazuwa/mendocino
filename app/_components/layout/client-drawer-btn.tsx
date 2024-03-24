import { ClientButton } from './client-constants';

export default function DrawerButton({
  name,
  Icon,
  handleClick,
}: ClientButton) {
  return (
    <button onClick={handleClick} className='flex flex-row gap-4 p-4'>
      <Icon className='w-4 fill-neutral-600' />

      <span className='text-xs font-medium'>{name}</span>
    </button>
  );
}
