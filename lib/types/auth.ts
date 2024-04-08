import { User } from './common';

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
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
  accessToken: string;
  refreshToken: string;
  message: string;
};
