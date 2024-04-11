import { ControllerRenderProps } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { ProfileFormSchema } from './profile-form';

type Props = {
  field: ControllerRenderProps<ProfileFormSchema, 'phoneNumber'>;
};

export default function NumericalTextfield({
  field: { onChange, ...rest },
}: Props) {
  const allowOnlyOneNumber = (value: string) => value.replace(/[^0-9]/, '');

  return (
    <Input
      {...rest}
      onChange={(e) => {
        const val = allowOnlyOneNumber(e.target.value);
        onChange(val);
      }}
      className='w-full text-xs'
    />
  );
}
