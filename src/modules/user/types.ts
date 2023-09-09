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
