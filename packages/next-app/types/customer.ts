import { User } from './common';

export type ProviderType = 'facebook' | 'google';

export type Profile = {
  firstName: string;
  lastName: string;
  phone?: { number: string; isVerified: boolean };
  email: { address: string; isVerified: boolean };
  hasPassword: boolean;
  authProviders: ProviderType[];
};

export type ProfileInput = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  receiveStatusByText: boolean;
}>;

export type VerifyResponse = {
  user: User;
  message: string;
};

export type VerifyInput = {
  code: string;
};

export type PasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
