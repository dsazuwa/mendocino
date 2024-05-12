'use client';

import { CheckIcon } from '@radix-ui/react-icons';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from './label';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 shrink-0 rounded-full border border-neutral-400 text-sm text-neutral-600 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-900 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600 data-[state=checked]:text-white',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn('flex items-center justify-center')}
      >
        <CheckIcon className='h-4 w-4' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const RadioLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, children, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(
        'w-full border-b border-neutral-200 py-3 text-xs font-normal',
        className,
      )}
      {...props}
    >
      {children}
    </Label>
  );
});
RadioLabel.displayName = Label.displayName;

export { RadioGroup, RadioGroupItem, RadioLabel };
