import Sandwich from '@/components/icons/sandwich';

export default function Logo() {
  return (
    <span className='flex flex-row items-center gap-2 text-primary'>
      <Sandwich className='w-5 fill-primary' />

      <span className='font-mono font-bold tracking-[0.15rem]'>spoons</span>
    </span>
  );
}
