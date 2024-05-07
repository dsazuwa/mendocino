import { ChevronRightIcon } from '@radix-ui/react-icons';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '@/lib/utils';
import { OptionNode } from '@/stores/order/types';

type Props = {
  index: number;
  option: OptionNode;
  isRadio?: boolean;
  handleCheckedChange?: () => void;
  onClick?: () => void;
};

export default function Option({
  index,
  option,
  isRadio,
  handleCheckedChange,
  onClick,
}: Props) {
  const Comp = isRadio ? RadioGroupItem : Checkbox;

  return (
    <div className='flex flex-row items-center gap-3 border-b border-neutral-200 py-2 text-xs font-medium'>
      <Comp
        value={index + ''}
        id={option.key}
        checked={option.isSelected}
        {...(isRadio ? {} : { onCheckedChange: handleCheckedChange })}
        onClick={onClick}
      />

      <Label
        htmlFor={option.key}
        className='inline-flex w-full items-center text-xxs sm:text-xs'
      >
        <div className='grow'>
          <div className='text-xs font-medium text-neutral-800 sm:text-sm'>
            {option.name}
          </div>

          {option.isSelected && !option.isValid && (
            <div className='mt-1 inline-block bg-[#FEF0C7] px-1 py-1.5 font-semibold text-[#93370D]'>
              More Selections Required
            </div>
          )}
        </div>

        {option.price > 0 && (
          <div className=''>{`+${formatPrice(option.price)}`}</div>
        )}

        {option.isNested && <ChevronRightIcon className='h-3 w-3' />}
      </Label>
    </div>
  );
}
