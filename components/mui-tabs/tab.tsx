'use client';

// TODO: handle linting errors

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as React from 'react';

import { cn } from '@/lib/utils';

export type TabProps = {
  disabled?: boolean;
  icon?: React.ReactElement & { props: { className?: string } };
  iconPosition?: 'bottom' | 'end' | 'start' | 'top';
  fullWidth?: boolean;
  label: React.ReactNode;
  value?: any;
  selected?: boolean;
  selectionFollowsFocus?: boolean;
  indicator?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onChange?: (e: React.SyntheticEvent, value: any) => void;
};

// TODO: styled disabled | selected icon and label
const Tab = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & TabProps
>(function Tabs(props, ref) {
  const {
    className,
    disabled = false,
    fullWidth,
    icon: iconProp,
    iconPosition = 'top',
    indicator,
    label,
    onChange,
    onClick,
    onFocus,
    selected,
    selectionFollowsFocus,
    value,
    children,
    ...other
  } = props;

  const ownerState = { icon: !!iconProp, label: !!label };

  const icon =
    iconProp && label && React.isValidElement(iconProp)
      ? React.cloneElement(iconProp, {
          className: cn(
            {
              'mb-[6px]': iconPosition === 'top',
              'mt-[6px]': iconPosition === 'bottom',
              'mr-[4px]': iconPosition === 'start',
              'ml-[4px]': iconPosition === 'end',
            },
            iconProp.props.className,
          ),
        })
      : iconProp;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!selected && onChange) onChange(event, value);

    if (onClick) onClick(event);
  };

  const handleFocus = (event: React.FocusEvent<HTMLButtonElement, Element>) => {
    if (selectionFollowsFocus && !selected && onChange) onChange(event, value);

    if (onFocus) onFocus(event);
  };

  return (
    <button
      ref={ref}
      role='tab'
      aria-selected={selected}
      disabled={disabled}
      onClick={handleClick}
      onFocus={handleFocus}
      tabIndex={selected ? 0 : -1}
      {...other}
      className={cn(
        'relative flex min-h-[48px] min-w-[90px] max-w-[360px] shrink-0 flex-wrap items-center overflow-hidden whitespace-normal px-3 py-4 text-center font-medium leading-[1.25]',
        {
          'max-w-none shrink grow basis-0': fullWidth,
          'flex-col':
            label && (iconPosition === 'top' || iconPosition === 'bottom'),
          'flex-row':
            ownerState.label &&
            iconPosition !== 'top' &&
            iconPosition !== 'bottom',
          'font-semibold text-primary-600': selected,
        },
        className,
      )}
    >
      {iconPosition === 'top' || iconPosition === 'start' ? (
        <>
          {icon}
          {label}
        </>
      ) : (
        <>
          {label}
          {icon}
        </>
      )}
    </button>
  );
});

export default Tab;
