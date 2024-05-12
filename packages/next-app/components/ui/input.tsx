import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 outline-none file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'focus-visible:border-primary-700/30 border border-neutral-200 bg-transparent',
        ghost:
          'border-neutral-100 bg-neutral-100 hover:bg-neutral-200/50 focus-visible:outline-primary-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
