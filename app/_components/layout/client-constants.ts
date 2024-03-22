import { FC, SVGProps } from 'react';

import {
  AddPerson,
  CircleUser,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  Receipt,
} from '../icons';

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
  { name: 'Order', href: '/order', Icon: Receipt },
  { name: 'About', href: '/about', Icon: Info },
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

export const logOutLink: ClientButton = {
  name: 'Log Out',
  Icon: LogOut,
  handleClick: () => {},
};
