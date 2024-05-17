'use client';

import { usePathname } from 'next/navigation';

import ChooseAddress, { ChooseAddressProps } from '@/components/address/choose';

export default function AddressButton({
  addresses,
  selectedAddress,
}: ChooseAddressProps) {
  const pathname = usePathname();

  if (pathname === '/') return <></>;
  return (
    <ChooseAddress addresses={addresses} selectedAddress={selectedAddress} />
  );
}
