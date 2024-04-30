import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  selectedAddress: number | undefined;
}

const initialState: State = {
  selectedAddress: undefined,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<number>) => {
      const newState = state;
      newState.selectedAddress = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;

export const { setSelected } = userSlice.actions;
