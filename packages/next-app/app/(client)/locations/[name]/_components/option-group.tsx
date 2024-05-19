import { RadioGroup } from '@/components/ui/radio-group';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getModifier,
  getOption,
  multiSelectOption,
  singleSelectOption,
} from '@/redux/slices/order';
import Option from './option';
import OptionHeader from './option-header';

export default function OptionGroup({ modifier }: { modifier: string }) {
  const dispatch = useAppDispatch();
  const map = useAppSelector((state) => state.orderState.map);

  const { key, name, maxSelection, children, isRequired, isValid } =
    getModifier(map, modifier);

  const handleSingleSelect = (index: number) => {
    dispatch(singleSelectOption({ key, index }));
  };

  const handleMultiSelect = (index: number) => {
    dispatch(multiSelectOption({ key, index }));
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
