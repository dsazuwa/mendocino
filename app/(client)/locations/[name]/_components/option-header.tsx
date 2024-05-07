import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';

type Props = {
  name: string;
  isRequired: boolean;
  isSelected?: boolean;
  maxSelection?: number;
};

export default function OptionHeader({
  name,
  isRequired,
  maxSelection,
  isSelected,
}: Props) {
  const Icon = isSelected ? CheckIcon : ExclamationTriangleIcon;

  return (
    <div className='mb-1.5 flex flex-col'>
      <div className='inline-flex w-full items-center justify-between'>
        <div className='text-xs font-semibold text-black sm:text-sm'>
          {name}
        </div>

        {isRequired ? (
          <div
            className={cn(
              'border-sm inline-flex items-center gap-1 px-1 py-1 sm:py-1.5',
              isSelected && 'bg-[#DCFAE6] fill-[#067647] text-[#067647]',
              !isSelected && 'bg-[#FEF0C7] fill-[#B54708] text-[#93370D]',
            )}
          >
            <Icon className='h-3 w-3' />

            <div className='text-xxs font-semibold'>Required</div>
          </div>
        ) : (
          <div className='py-1 text-xxs font-semibold sm:py-1.5'>
            (Optional)
          </div>
        )}
      </div>

      {maxSelection && (
        <div className='text-xxs sm:text-xs'>
          {maxSelection === 1 ? 'Select 1' : `Select up to ${maxSelection}`}
        </div>
      )}
    </div>
  );
}
