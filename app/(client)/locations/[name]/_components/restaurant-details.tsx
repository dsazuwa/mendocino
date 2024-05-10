'use client';

import {
  ArrowTopRightIcon,
  ChevronDownIcon,
  CopyIcon,
} from '@radix-ui/react-icons';
import {
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
  useState,
} from 'react';

import Clock from '@/components/icons/clock';
import Info from '@/components/icons/info';
import Location from '@/components/icons/location';
import Phone from '@/components/icons/phone';
import { cn, getMapURL } from '@/lib/utils';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import ItemImage from './item-image';
import { useMediaQuery } from '@/hooks/use-media-query';

type Props = {
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
};

export default function RestaurantDetails({
  name,
  phoneNumber,
  address,
  city,
  state,
  lat,
  lng,
}: Props) {
  const [open, setOpen] = useState(false);
  const sm = useMediaQuery('(max-width: 640px)');

  if (sm)
    return (
      <div
        className={cn(
          'border border-neutral-200',
          open && 'rounded-t-lg',
          !open && 'rounded-lg',
        )}
      >
        <Detail
          primaryLabel='More Store Info'
          secondaryLabel='Address, Hours, Contact'
          PrimaryIcon={Info}
          SecondaryIcon={ChevronDownIcon}
          open={open}
          onClick={() => setOpen(!open)}
        />

        {open && (
          <Details
            name={name}
            address={address}
            city={city}
            state={state}
            lat={lat}
            lng={lng}
            phoneNumber={phoneNumber}
          />
        )}
      </div>
    );

  return (
    <div className='rounded-lg border border-neutral-200'>
      <Details
        name={name}
        address={address}
        city={city}
        state={state}
        lat={lat}
        lng={lng}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}

function Details({ name, phoneNumber, address, city, state, lat, lng }: Props) {
  return (
    <>
      <div className='aspect-video'>
        <ItemImage
          src={getMapURL(lat, lng)}
          alt={name + ' Map'}
          className='rounded-t-md'
        />
      </div>

      <Detail
        primaryLabel={address}
        secondaryLabel={`${city}, ${state}`}
        PrimaryIcon={Location}
        SecondaryIcon={CopyIcon}
      />

      <Detail
        primaryLabel={formatPhoneNumber(phoneNumber)}
        secondaryLabel={`${city}, ${state}`}
        PrimaryIcon={Phone}
        SecondaryIcon={ArrowTopRightIcon}
      />

      <Detail
        primaryLabel='Unavailable'
        secondaryLabel='Open at 9:45 AM'
        PrimaryIcon={Clock}
        SecondaryIcon={ChevronDownIcon}
      />
    </>
  );
}

type IconType =
  | ((props: SVGProps<SVGSVGElement>) => JSX.Element)
  | ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

function Detail({
  primaryLabel,
  secondaryLabel,
  PrimaryIcon,
  SecondaryIcon,
  border,
  open,
  onClick,
}: {
  primaryLabel: string;
  secondaryLabel?: string;
  PrimaryIcon: IconType;
  SecondaryIcon: IconType;
  border?: boolean;
  onClick?: () => void;
  open?: boolean;
  secondaryIconClassName?: string;
}) {
  return (
    <button className='inline-flex w-full items-center' onClick={onClick}>
      <span className='px-4'>
        <PrimaryIcon className='w-3.5 shrink-0 fill-neutral-500' />
      </span>

      <span
        className={cn(
          'inline-flex w-full items-center justify-between pr-4',
          border && 'border-b border-neutral-100',
        )}
      >
        <span className='flex flex-col items-start gap-1 py-3 text-xs'>
          <span className='font-medium text-black'>{primaryLabel}</span>
          {secondaryLabel && <span>{secondaryLabel}</span>}
        </span>

        <div
          className={cn(
            'transition-transform ease-in-out',
            'rotate-180' && !open,
          )}
        >
          <SecondaryIcon className={'w-3.5 shrink-0 stroke-neutral-500'} />
        </div>
      </span>
    </button>
  );
}

function formatPhoneNumber(phoneNumber: string) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (!match) return phoneNumber;

  return '(' + match[1] + ') ' + match[2] + '-' + match[3];
}
