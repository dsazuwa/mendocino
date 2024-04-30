import { configureStore } from '@reduxjs/toolkit';

import { addressApi } from './api/address';
import { userReducer } from './slices/user';
import { authApi } from './api/auth';
import { userApi } from './api/user';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [addressApi.reducerPath]: addressApi.reducer,
      [userApi.reducerPath]: userApi.reducer,

      userState: userReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).concat([
        authApi.middleware,
        addressApi.middleware,
        userApi.middleware,
      ]),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
