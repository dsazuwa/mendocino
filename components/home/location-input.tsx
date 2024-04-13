'use client';

import { ChangeEvent, useState } from 'react';

import Location from '../icons/location';
import { Input } from '../ui/input';

export default function LocationInput() {
  const [value, setValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const clearValue = () => setValue('');

  return (
    <div className='flex flex-row items-center rounded-md border border-neutral-200 px-2 py-1 shadow-sm has-[:focus-visible]:border-primary-700/30'>
      <Location className='w-8 p-2' />

      <label className='sr-only' htmlFor='delivery-address-input'>
        Enter pickup address
      </label>

      <Input
        id='delivery-address-input'
        placeholder='Enter pickup address'
        className='border-white py-0 pl-0 text-xs shadow-none focus-visible:ring-white'
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
