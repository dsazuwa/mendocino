import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  selectedAddress: number | undefined;
}

const initialState: State = {
  selectedAddress: undefined,
};

export const addressSlice = createSlice({
  name: 'addressSlice',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<number>) => {
      const newState = state;
      newState.selectedAddress = action.payload;
    },
  },
});

export const addressReducer = addressSlice.reducer;

export const { setSelected } = addressSlice.actions;
