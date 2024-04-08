import { FC, SVGProps } from 'react';

import {
  Account,
  AddPerson,
  CircleUser,
  History,
  Home,
  ImportContacts,
  LogIn,
  Menu,
  Payments,
} from '../../icons';

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

export const profileLink = {
  name: 'Account',
  href: '/account/profile',
  Icon: CircleUser,
};

export const accountLinks: ClientLink[] = [
  { name: 'Profile', href: '/account/profile', Icon: Account },
  { name: 'Addresses', href: '/account/addresses', Icon: ImportContacts },
  { name: 'Payment Methods', href: '/account/wallet', Icon: Payments },
  { name: 'Order History', href: '/account/orders', Icon: History },
];
