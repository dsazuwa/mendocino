import { User } from './common';

export type ProviderType = 'facebook' | 'google';

export type CustomerProfile = {
  firstName: string;
  lastName: string;
  phoneNumber?: { phone: string; isVerified: boolean };
  email: { address: string; isVerified: boolean };
  hasPassword: boolean;
  authProviders: ProviderType[];
  addresses: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
  }[];
};

export type Address = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

export type VerifyResponse = {
  user: User;
  message: string;
};

export type VerifyData = {
  code: string;
};
