import {
  ArrowTopRightIcon,
  ChevronDownIcon,
  CopyIcon,
} from '@radix-ui/react-icons';

import Clock from '@/components/icons/clock';
import Location from '@/components/icons/location';
import Phone from '@/components/icons/phone';
import { getMapURL } from '@/lib/utils';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import ItemImage from './item-image';

export default function RestaurantDetails({
  name,
  phoneNumber,
  address,
  city,
  state,
  lat,
  lng,
}: {
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}) {
  return (
    <div className='rounded-lg border border-neutral-200'>
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
    </div>
  );
}

function Detail({
  primaryLabel,
  secondaryLabel,
  PrimaryIcon,
  SecondaryIcon,
}: {
  primaryLabel: string;
  secondaryLabel?: string;
  PrimaryIcon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  SecondaryIcon: ForwardRefExoticComponent<
    IconProps & RefAttributes<SVGSVGElement>
  >;
}) {
  return (
    <button className='inline-flex w-full items-center'>
      <span className='px-4'>
        <PrimaryIcon className='w-3.5 shrink-0 fill-neutral-500' />
      </span>

      <span className='inline-flex w-full items-center justify-between border-b border-neutral-100 pr-4'>
        <span className='flex flex-col items-start gap-1 py-3 text-xs'>
          <span className='font-medium text-black'>{primaryLabel}</span>
          {secondaryLabel && <span>{secondaryLabel}</span>}
        </span>

        <SecondaryIcon className='w-3.5 shrink-0 fill-neutral-500' />
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
