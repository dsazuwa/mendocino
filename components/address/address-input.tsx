'use client';

import { ChangeEvent, useState } from 'react';

import { cn } from '@/lib/utils';
import Location from '../icons/location';
import Search from '../icons/search';
import { Input } from '../ui/input';

type Props = {
  className?: string;
  type?: 'search' | 'map';
};

export default function AddressInput({ className, type }: Props) {
  const [value, setValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const clearValue = () => setValue('');

  const Icon = type === 'search' ? Search : Location;
  const placeholder = type === 'search' ? 'Search' : 'Enter pickup address';

  return (
    <div
      className={cn(
        'flex w-full flex-row items-center rounded-lg border border-neutral-200 px-2 py-1 shadow-sm has-[:focus-visible]:border-primary-700/30',
        className,
      )}
    >
      <Icon className='w-8 fill-neutral-600 p-2' />

      <label className='sr-only' htmlFor='delivery-address-input'>
        {placeholder}
      </label>

      <Input
        id='delivery-address-input'
        placeholder={placeholder}
        className='border-white py-0 pl-0 text-xs shadow-none focus-visible:border-none'
        onChange={handleChange}
        value={value}
      />

      {value !== '' && (
        <button
          className='text-xs font-medium text-neutral-500'
          onClick={clearValue}
        >
          Clear
        </button>
      )}
    </div>
  );
}
