import { Sandwich } from './icons';

export default function Logo() {
  return (
    <span className='flex flex-row items-center gap-2 text-primary'>
      <Sandwich className='w-5 fill-primary' />

      <span className='font-mono text-lg font-bold tracking-[0.25rem]'>
        spoons
      </span>
    </span>
  );
}
