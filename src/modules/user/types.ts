import { ProviderType } from './models';

export type JwtProviderType = ProviderType | 'email';

export type UserType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roles: string[];
};

export type AddressType = {
  placeId: string;
  suite?: string;
  name: string;
  address: string;
  zipCode: string;
  lat: string;
  lng: string;
};
