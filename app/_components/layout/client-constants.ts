import { FC, SVGProps } from 'react';

import { AddPerson, CircleUser, Home, LogIn, Menu } from '../icons';

export type ClientLink = {
  name: string;
  href: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
};

export type ClientButton = {
  name: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  handleClick: () => void;
};

export const publicLinks: ClientLink[] = [
  { name: 'Home', href: '/', Icon: Home },
  { name: 'Menu', href: '/menu', Icon: Menu },
];

export const unauthLinks: ClientLink[] = [
  { name: 'Log In', href: '/login', Icon: LogIn },
  { name: 'Sign Up', href: '/register', Icon: AddPerson },
];

export const accountLink = {
  name: 'Account',
  href: '/account',
  Icon: CircleUser,
};
