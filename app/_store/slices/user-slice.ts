/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/_types/common-types';

type UserState = {
  user: User | undefined;
  home: string;
};

const initialState: UserState = {
  user: undefined,
  home: '/',
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    logout: (state) => initialState,
    setUser: (state, action: PayloadAction<User>) => {
      const newState = state;
      newState.user = action.payload;
      newState.home = newState.user.roles[0] === 'customer' ? '/' : '/admin';
    },
  },
});

export const userReducer = userSlice.reducer;

export const { logout, setUser } = userSlice.actions;
