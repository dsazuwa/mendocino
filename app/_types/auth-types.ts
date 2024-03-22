import { User } from './common-types';

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: User;
  message: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  message: string;
  accessToken: string | null;
};

export type RequestRecoverData = {
  email: string;
};

export type VerifyRecoverData = {
  email: string;
  code: string;
};

export type RecoverData = {
  code: string;
  email: string;
  password: string;
};

export type RecoverResponse = {
  user: User;
  message: string;
};
