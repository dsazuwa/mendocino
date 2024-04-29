import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  guestSession: string | undefined;
  selectedAddress: number | undefined;
}

const initialState: State = {
  guestSession: undefined,
  selectedAddress: undefined,
};

export const addressSlice = createSlice({
  name: 'addressSlice',
  initialState,
  reducers: {
    setGuestSession: (state, action: PayloadAction<string | undefined>) => {
      const newState = state;
      newState.guestSession = action.payload;
    },

    setSelected: (state, action: PayloadAction<number>) => {
      const newState = state;
      newState.selectedAddress = action.payload;
    },
  },
});

export const addressReducer = addressSlice.reducer;

export const { setGuestSession } = addressSlice.actions;
