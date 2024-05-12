import { ButtonHTMLAttributes, forwardRef } from 'react';

import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';

type LinkButtonProps = ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant='primaryLink'
        size='none'
        className={cn('font-semibold', className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

LinkButton.displayName = 'LinkButton';

export default LinkButton;
