import { configureStore } from '@reduxjs/toolkit';

import { addressApi } from './api/address';
import { authApi } from './api/auth';
import { modifierApi } from './api/modifier';
import { userApi } from './api/user';
import { orderReducer } from './slices/order';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [addressApi.reducerPath]: addressApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [modifierApi.reducerPath]: modifierApi.reducer,

      orderState: orderReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).concat([
        authApi.middleware,
        addressApi.middleware,
        userApi.middleware,
        modifierApi.middleware,
      ]),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
