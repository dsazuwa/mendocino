import { useOrderStore } from '@/app/providers/order-provider';
import { RadioGroup } from '@/components/ui/radio-group';
import { getModifier, getOption } from '@/stores/order/node-selectors';
import Option from './option';
import OptionHeader from './option-header';

export default function OptionGroup({ modifier }: { modifier: string }) {
  const map = useOrderStore((state) => state.map);

  const singleSelectOption = useOrderStore((state) => state.singleSelectOption);

  const { key, name, maxSelection, children, isRequired, isValid } =
    getModifier(map, modifier);

  const handleSingleSelect = (index: number) => {
    singleSelectOption(key, index);
  };

  const multiSelectOption = useOrderStore((state) => state.multiSelectOption);

  const handleMultiSelect = (index: number) => {
    multiSelectOption(key, index);
  };

  return (
    <div>
      <OptionHeader
        name={name}
        isRequired={isRequired}
        maxSelection={maxSelection}
        isSelected={isValid}
      />

      {maxSelection === 1 && (
        <RadioGroup className='gap-0'>
          {children.map((key, index) => (
            <Option
              key={key}
              index={index}
              isRadio
              option={getOption(map, key)}
              onClick={() => handleSingleSelect(index)}
            />
          ))}
        </RadioGroup>
      )}

      {maxSelection > 1 && (
        <div>
          {children.map((key, index) => (
            <Option
              key={key}
              index={index}
              option={getOption(map, key)}
              handleCheckedChange={() => handleMultiSelect(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
