import { configureStore } from '@reduxjs/toolkit';

import { addressApi } from './api/address';
import { addressReducer } from './slices/address';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [addressApi.reducerPath]: addressApi.reducer,
      addressState: addressReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).concat([addressApi.middleware]),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
