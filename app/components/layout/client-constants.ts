import { FC, SVGProps } from 'react';

import { AddPerson, Home, Info, LogIn, LogOut, Menu, Receipt } from '../icons';

export type PageType = {
  name: string;
  href: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
};

export type AuthPageType = {
  page: PageType;
  handleLogout?: () => void;
};

export const publicLinks: PageType[] = [
  { name: 'Home', href: '/', Icon: Home },
  { name: 'Menu', href: '/menu', Icon: Menu },
  { name: 'Order', href: '/order', Icon: Receipt },
  { name: 'About', href: '/about', Icon: Info },
];

export const authLinks: AuthPageType[] = [
  // {
  //   page: { name: 'Account', href: '/account', Icon: CircleUser },
  //   handleLogout: undefined,
  // },
  {
    page: { name: 'Log Out', href: '', Icon: LogOut },
    handleLogout: undefined, // for now
  },
];

export const unauthLinks: PageType[] = [
  { name: 'Log In', href: '/login', Icon: LogIn },
  { name: 'Sign Up', href: '/register', Icon: AddPerson },
];
