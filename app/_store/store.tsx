import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './api/auth-api';
import { userApi } from './api/user-api';
import { userReducer } from './slices/user-slice';

export const makeStore = () =>
  configureStore({
    devTools: process.env.NODE_ENV === 'development',

    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      userState: userReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).concat([authApi.middleware, userApi.middleware]),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
