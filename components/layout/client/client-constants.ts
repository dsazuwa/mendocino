import { FC, SVGProps } from 'react';

import Account from '@/components/icons/account';
import AddPerson from '@/components/icons/add-person';
import CircleUser from '@/components/icons/circle-user';
import History from '@/components/icons/history';
import Home from '@/components/icons/home';
import ImportContacts from '@/components/icons/import-contacts';
import LogIn from '@/components/icons/log-in';
import Menu from '@/components/icons/menu';
import Payments from '@/components/icons/payments';

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
