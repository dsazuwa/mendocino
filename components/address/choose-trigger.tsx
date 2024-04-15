import { ChevronDownIcon } from '@radix-ui/react-icons';

import Location from '@/components/icons/location';
import { cn } from '@/lib/utils';
import { Address } from '@/types/customer';
import { Button } from '../ui/button';
import { DialogTrigger } from '../ui/dialog';
import { SheetTrigger } from '../ui/sheet';

type Props = { isDialog: boolean; addresses: Address[] };

export default function ChooseTrigger({ isDialog, addresses }: Props) {
  const hasAddress = addresses.length > 0;

  const Comp = isDialog ? DialogTrigger : SheetTrigger;

  return (
    <Comp asChild>
      <Button
        variant='ghost'
        size='icon'
        className='ml-auto gap-1 p-1 transition-colors hover:bg-neutral-100 sm:ml-0 sm:mr-0 sm:h-auto sm:w-auto'
      >
        <Location
          className={cn('w-4 fill-neutral-600', { 'sm:hidden': hasAddress })}
        />

        <span
          className={cn(
            'hidden text-xs font-medium text-neutral-600 sm:inline sm:text-[0.7rem]/[0.75rem]',
            { 'font-semibold': hasAddress },
          )}
        >
          {hasAddress ? addresses[0].addressLine1 : 'Enter delivery address'}
        </span>

        <ChevronDownIcon className='ml-auto hidden w-3 sm:inline' />
      </Button>
    </Comp>
  );
}
